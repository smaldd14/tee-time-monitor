import { AIChatAgent, type OnChatMessageOptions } from "@cloudflare/ai-chat";
import { createWorkersAI } from "workers-ai-provider";
import {
  streamText,
  type StreamTextOnFinishCallback,
  type ToolSet,
  createUIMessageStream,
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
} from "ai";
import { createTools } from "./tools";
import { cleanupMessages } from "./utils";

const SYSTEM_PROMPT = `You are a helpful golf tee time assistant. Your job is to help users find and monitor golf tee times.

Follow this conversational flow:
1. **Gather criteria**: Ask the user for their ZIP code, desired date, and any preferences (time of day, number of players, price range, 9 or 18 holes).
2. **Search facilities**: Once you have at least a ZIP code and date, use the searchFacilities tool to find nearby courses.
3. **Present results**: Show the user the available facilities and help them pick priority courses.
4. **Create monitor**: When the user is ready, use the createMonitor tool with their criteria and selected priority courses. This returns a Stripe checkout URL to activate monitoring.

Tips:
- Default to 25 mile radius if not specified.
- Default to 2 players if not specified.
- Default to any time (5-21) if not specified.
- Default to both 9 and 18 holes (holes=3) if not specified.
- Format dates as "Mon DD YYYY" (e.g., "Oct 11 2025") for the API.
- Be concise and friendly.
- When presenting facilities, mention the facility name, distance, and number of available tee times.`;

export class Chat extends AIChatAgent<Env, null> {
  initialState = null;

  async onChatMessage(
    onFinish: StreamTextOnFinishCallback<ToolSet>,
    options?: OnChatMessageOptions
  ) {
    const allTools = createTools(this.env);
    const workersAI = createWorkersAI({ binding: this.env.AI });

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const cleanedMessages = cleanupMessages(this.messages);

        const result = streamText({
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(cleanedMessages),
          model: workersAI("@cf/meta/llama-4-scout-17b-16e-instruct"),
          tools: allTools,
          abortSignal: options?.abortSignal,
          onFinish: onFinish as unknown as StreamTextOnFinishCallback<
            typeof allTools
          >,
          onStepFinish: (step) => {
            for (const toolResult of step.toolResults ?? []) {
              if (toolResult.toolName === "searchFacilities") {
                const output = toolResult.output as {
                  facilities?: unknown;
                  ui?: unknown;
                };
                const ui = output?.ui;
                if (ui && typeof ui === "object") {
                  writer.write({
                    type: "data-ui",
                    id: `ui-${toolResult.toolCallId}`,
                    data: ui,
                  });
                }
              }
            }
          },
          stopWhen: stepCountIs(10),
        });

        writer.merge(result.toUIMessageStream());
      },
    });

    return createUIMessageStreamResponse({ stream });
  }
}

import { Hono } from "hono";
import { cors } from "hono/cors";
import { routeAgentRequest } from "agents";
// import authRoutes from "./middleware/auth";
import userRoutes from "./routes/users";
import teeTimeRoutes from "./routes/tee-time";
import monitorRoutes from "./routes/monitor";
import { connectRoutes, billingRoutes } from "./routes/connect";

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"]
}));

// Health check
app.get("/api/", (c) => c.json({ name: "Tee Time Monitor API", status: "healthy" }));

// Routes
// app.route("/api/auth", authRoutes);
app.route("/api/users", userRoutes);
app.route("/api/monitor", monitorRoutes);
app.route("/api/connect", connectRoutes);
app.route("/api/billing-portal", billingRoutes);
app.route("/api", teeTimeRoutes);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const agentResponse = await routeAgentRequest(request, env);
    if (agentResponse) {
      return agentResponse;
    }
    return app.fetch(request, env, ctx);
  },
};

export { Chat } from "./agents/chat";

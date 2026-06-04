import { useState } from 'react';
import { Monitor, Terminal, Smartphone } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import SnippetBlock from './SnippetBlock';

type ClientTabsProps = {
  mcpUrl: string;
  token: string;
};

const ClientTabs = ({ mcpUrl, token }: ClientTabsProps) => {
  const [active, setActive] = useState(0);

  const tabs = [
    {
      label: 'Claude Desktop',
      icon: Monitor,
      description:
        'Add this to your Claude Desktop MCP config, or run it in a terminal to test the connection.',
      command: `npx mcp-remote ${mcpUrl}/mcp --header "Authorization: Bearer ${token}"`,
    },
    {
      label: 'Claude Code',
      icon: Terminal,
      description: 'Run this once in your terminal to register the server.',
      command: `claude mcp add --transport http tee-time ${mcpUrl}/mcp --header "Authorization: Bearer ${token}"`,
    },
    {
      label: 'Claude Mobile / Web',
      icon: Smartphone,
      description: 'In Claude, add a custom connector and paste this URL. No terminal needed.',
      command: `${mcpUrl}/mcp?token=${token}`,
    },
  ];

  const current = tabs[active];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2">
        {tabs.map((tab, i) => (
          <Button
            key={tab.label}
            type="button"
            variant={i === active ? 'default' : 'outline'}
            size="sm"
            className="h-auto flex-col gap-1.5 py-3 text-xs sm:text-sm"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            <tab.icon className="size-5" />
            {tab.label}
          </Button>
        ))}
      </div>

      <SnippetBlock description={current.description} command={current.command} />
    </div>
  );
};

export default ClientTabs;

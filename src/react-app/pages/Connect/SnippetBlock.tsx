import CopyButton from './CopyButton';

type SnippetBlockProps = {
  description: string;
  command: string;
};

const SnippetBlock = ({ description, command }: SnippetBlockProps) => (
  <div className="space-y-3">
    <p className="text-sm text-muted-foreground">{description}</p>
    <div className="relative">
      <pre className="overflow-x-auto rounded-md bg-muted/50 border p-4 pr-24 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
        <code>{command}</code>
      </pre>
      <CopyButton value={command} className="absolute top-2 right-2" />
    </div>
  </div>
);

export default SnippetBlock;

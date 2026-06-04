import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

const CopyButton = ({ value, label = 'Copy', className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      aria-label={copied ? 'Copied' : label}
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
      }}
    >
      {copied ? <Check className="text-green-500" /> : <Copy />}
      {copied ? 'Copied' : label}
    </Button>
  );
};

export default CopyButton;

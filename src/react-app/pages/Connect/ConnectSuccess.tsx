import { useState } from 'react';
import { CheckCircle2, ShieldAlert, Eye, EyeOff, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import CopyButton from './CopyButton';
import ClientTabs from './ClientTabs';

type ConnectSuccessProps = {
  token: string;
  mcpUrl: string;
  sessionId: string;
};

const openBillingPortal = async (sessionId: string) => {
  const res = await fetch('/api/billing-portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId }),
  });
  const { url } = (await res.json()) as { url?: string };
  if (url) window.location.href = url;
};

const ConnectSuccess = ({ token, mcpUrl, sessionId }: ConnectSuccessProps) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">You're subscribed</h1>
        <p className="text-muted-foreground">
          Connect Lets Go Golfing to your AI assistant in one step below.
        </p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Your personal access token</CardTitle>
          <CardDescription>Shown only once. Copy it now and keep it somewhere safe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-md bg-muted/50 border px-3 py-2 text-sm font-mono break-all">
              {revealed ? token : '•'.repeat(Math.min(token.length, 40))}
            </code>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={revealed ? 'Hide token' : 'Show token'}
              onClick={() => setRevealed((v) => !v)}
            >
              {revealed ? <EyeOff /> : <Eye />}
            </Button>
            <CopyButton value={token} />
          </div>

          <div className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 p-3 text-sm">
            <ShieldAlert className="size-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-muted-foreground">Keep this token secret; it identifies your account.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Connect your client</CardTitle>
          <CardDescription>Pick where you use Claude, then copy the snippet.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientTabs mcpUrl={mcpUrl} token={token} />
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            void openBillingPortal(sessionId);
          }}
        >
          <CreditCard />
          Manage subscription
        </Button>
      </div>
    </div>
  );
};

export default ConnectSuccess;

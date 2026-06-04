import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MailQuestion, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';

const resend = async (email: string) => {
  await fetch('/api/connect/resend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
};

const RecoverCard = () => {
  const [email, setEmail] = useState('');
  const { mutate, isPending, isSuccess } = useMutation({ mutationFn: resend });

  if (isSuccess) {
    return (
      <Card className="border-2">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-muted-foreground max-w-sm">
            If you have an active subscription, we've emailed your setup link.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex justify-center pb-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <MailQuestion className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl">Lost your setup link?</CardTitle>
        <CardDescription className="text-center">
          Enter the email you subscribed with and we'll send your setup link again.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutate(email);
          }}
        >
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Sending…' : 'Email me my setup link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RecoverCard;

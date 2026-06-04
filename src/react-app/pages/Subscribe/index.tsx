import { Sparkles, Bot, Bell, RefreshCw } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card } from '@/react-app/components/ui/card';

// Stripe-hosted Payment Link for the recurring subscription. Set VITE_SUBSCRIPTION_URL in your
// environment (.env / Cloudflare Pages build vars). The link encapsulates the recurring price.
const SUBSCRIPTION_URL = import.meta.env.VITE_SUBSCRIPTION_URL ?? '';

const SubscribePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Monitor tee times from your AI assistant
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Subscribe to connect Lets Go Golfing to Claude or any AI agent. Just say
            "monitor tee times this Saturday near Preakness" and we handle the rest.
          </p>

          <div className="pt-2">
            <Button
              size="lg"
              className="text-base sm:text-lg px-10 py-6 h-auto"
              disabled={!SUBSCRIPTION_URL}
              onClick={() => {
                window.location.href = SUBSCRIPTION_URL;
              }}
            >
              Subscribe
            </Button>
            {!SUBSCRIPTION_URL && (
              <p className="text-xs text-destructive pt-3">
                Subscription link not configured (set VITE_SUBSCRIPTION_URL).
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            After subscribing, we email you a personal access token to connect your AI client.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3 border-2">
            <Bot className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-semibold">Natural language</h3>
            <p className="text-muted-foreground leading-relaxed">
              Set up monitors by chatting with your AI agent. No forms, no clicking through steps.
            </p>
          </Card>
          <Card className="p-6 space-y-3 border-2">
            <Bell className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-semibold">Instant alerts</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get an email with a direct booking link the moment a matching tee time opens up.
            </p>
          </Card>
          <Card className="p-6 space-y-3 border-2">
            <RefreshCw className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-semibold">Cancel anytime</h3>
            <p className="text-muted-foreground leading-relaxed">
              Manage or cancel your monitor right from your AI assistant whenever you like.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SubscribePage;

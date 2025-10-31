import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
            <CheckCircle2 className="w-24 h-24 text-green-500 relative" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Payment Successful!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your tee time monitor is being set up
          </p>
        </div>

        {/* What's Next */}
        <div className="space-y-4 text-left bg-muted/30 rounded-lg p-6">
          <h2 className="font-semibold text-lg">What happens next?</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>We're activating your monitor right now</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>You'll receive an email confirmation shortly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>We'll notify you when matching tee times become available</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Each notification includes direct booking links</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate('/')}
          className="w-full"
          size="lg"
        >
          Return Home
        </Button>

        <p className="text-xs text-muted-foreground">
          Questions? Contact us at devin@hooswhere.tv
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;

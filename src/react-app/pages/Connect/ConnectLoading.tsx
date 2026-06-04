import { Loader2 } from 'lucide-react';

const ConnectLoading = () => (
  <div className="text-center space-y-6 py-12">
    <div className="flex justify-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    </div>
    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
      Setting up your connection
    </h1>
    <p className="text-muted-foreground">Fetching your personal access token…</p>
  </div>
);

export default ConnectLoading;

import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ConnectLoading from './ConnectLoading';
import ConnectSuccess from './ConnectSuccess';
import RecoverCard from './RecoverCard';

type ConnectResponse = { token: string; mcpUrl: string };

const fetchConnect = async (sessionId: string): Promise<ConnectResponse> => {
  const res = await fetch(`/api/connect?session_id=${encodeURIComponent(sessionId)}`);
  if (!res.ok) throw new Error('connect_failed');
  return res.json();
};

const ConnectPage = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') ?? '';

  const { data, isPending, isError } = useQuery({
    queryKey: ['connect', sessionId],
    queryFn: () => fetchConnect(sessionId),
    enabled: sessionId.length > 0,
    retry: false,
    staleTime: Infinity, // token is one-shot; never refetch
  });

  const renderState = () => {
    if (!sessionId) return <RecoverCard />;
    if (isPending) return <ConnectLoading />;
    if (isError || !data?.token) return <RecoverCard />;
    return <ConnectSuccess token={data.token} mcpUrl={data.mcpUrl} sessionId={sessionId} />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">{renderState()}</div>
      </section>
    </div>
  );
};

export default ConnectPage;

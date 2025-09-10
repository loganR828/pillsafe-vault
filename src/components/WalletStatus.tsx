import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { projectId } from '@/lib/wallet';

export const WalletStatus = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  const isDemoMode = projectId === 'demo-project-id';

  if (isDemoMode) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-4 h-4" />
            Demo Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700 mb-3">
            Using demo WalletConnect project ID. Some features may be limited.
          </p>
          <div className="text-xs text-amber-600 space-y-1">
            <p>To enable full functionality:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Visit <a href="https://cloud.walletconnect.com" target="_blank" rel="noopener noreferrer" className="underline">cloud.walletconnect.com</a></li>
              <li>Create a new project</li>
              <li>Set NEXT_PUBLIC_PROJECT_ID environment variable</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isConnected) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-green-800">
            <CheckCircle className="w-4 h-4" />
            Wallet Connected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700">Address:</span>
              <Badge variant="secondary" className="text-xs">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700">Network:</span>
              <Badge variant="outline" className="text-xs">
                {chain?.name || 'Unknown'}
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => disconnect()}
              className="w-full mt-3"
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {connectors && Array.isArray(connectors) ? connectors.map((connector) => (
            <Button
              key={connector.id}
              variant="outline"
              size="sm"
              onClick={() => connect({ connector })}
              disabled={!connector.ready}
              className="w-full justify-start"
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
            </Button>
          )) : null}
          {error && (
            <div className="text-xs text-red-600 mt-2">
              {error.message}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

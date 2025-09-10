import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Key, Shield, Plus, RefreshCw, Info, Activity } from "lucide-react";
import { toast } from "sonner";
import { useAccount, useBalance } from 'wagmi';
import { CONTRACT_ADDRESSES, PILLSAFE_VAULT_ABI } from '@/lib/wallet';

interface WalletKey {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface WalletComponentProps {
  keys?: WalletKey[];
  onGenerateKey?: () => void;
  onRotateKeys?: () => void;
}

export const WalletComponent = ({ 
  keys = [],
  onGenerateKey,
  onRotateKeys 
}: WalletComponentProps) => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-medical-blue" />
          Wallet & Encryption
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Wallet Status */}
        <div className="bg-gradient-security rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Wallet Status</span>
            <Badge className="bg-white/20 text-white">
              <Activity className="w-3 h-3 mr-1" />
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          {isConnected && balance && (
            <>
              <div className="text-2xl font-bold mb-1">
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </div>
              <div className="text-sm opacity-90">Balance</div>
            </>
          )}
          {!isConnected && (
            <>
              <div className="text-2xl font-bold mb-1">--</div>
              <div className="text-sm opacity-90">Connect Wallet</div>
            </>
          )}
        </div>

        {/* Encryption Keys */}
        <div className="bg-gradient-medical rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Active Keys</span>
            <Badge className="bg-white/20 text-white">
              <Shield className="w-3 h-3 mr-1" />
              FHE Secure
            </Badge>
          </div>
          <div className="text-2xl font-bold mb-1">{keys ? keys.length : 0}</div>
          <div className="text-sm opacity-90">Encryption Keys</div>
        </div>

        {/* Key Rotation Info */}
        <div className="bg-medical-blue/10 border border-medical-blue/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-medical-blue mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-medical-blue mb-1">Key Rotation</p>
              <p className="text-muted-foreground">
                Regularly rotating encryption keys enhances security by limiting exposure time and preventing long-term key compromise.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {keys && keys.length > 0 ? keys.map((key, index) => (
            <div key={key.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className={`w-4 h-4 ${
                  key.status === "Active" ? "text-medical-blue" :
                  key.status === "Standby" ? "text-security-green" :
                  key.status === "Rotating" ? "text-warning-amber animate-spin" :
                  "text-muted-foreground"
                }`} />
                <div>
                  <p className="font-medium text-sm">{key.name}</p>
                  <p className="text-xs text-muted-foreground">{key.type}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {key.status}
              </Badge>
            </div>
          )) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No encryption keys available</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={onGenerateKey}
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={onRotateKeys}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Rotate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
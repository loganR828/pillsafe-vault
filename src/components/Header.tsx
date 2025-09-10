import { Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import pillIcon from "@/assets/pill-icon.png";

export const Header = () => {
  return (
    <header className="bg-gradient-medical shadow-medical border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <img 
                src={pillIcon} 
                alt="Prescription pill icon" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">
                PillSafe Vault
              </h1>
              <p className="text-sm text-primary-foreground/80">
                Privacy-Preserving Prescription Management
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <Shield className="w-5 h-5 text-security-green" />
              <span className="text-sm font-medium text-primary-foreground">
                FHE Encrypted
              </span>
            </div>
            
            <ConnectButton 
              chainStatus="icon"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
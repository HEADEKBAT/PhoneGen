'use client';

import { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

interface AddressDisplayProps {
  address: string;
  label?: string;
  privateKey?: string;
  publicKey?: string;
  derivationPath?: string;
  mnemonic?: string;
}

export default function AddressDisplay({
  address,
  label,
  privateKey,
  publicKey,
  derivationPath,
  mnemonic,
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      )}

      {/* Address */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border">
        <code className="flex-1 text-xs font-mono break-all text-foreground">
          {address}
        </code>
        <button
          onClick={() => copyToClipboard(address)}
          className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          title="Copy address"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Private key (toggleable) */}
      {privateKey && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <code className={`flex-1 text-[10px] font-mono break-all ${showPrivateKey ? '' : 'blur-sm select-none'}`}>
            {privateKey}
          </code>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              title={showPrivateKey ? 'Hide' : 'Show'}
            >
              {showPrivateKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
            {showPrivateKey && (
              <button
                onClick={() => copyToClipboard(privateKey)}
                className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                title="Copy private key"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Public key */}
      {publicKey && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/20 border border-border">
          <code className="flex-1 text-[10px] font-mono break-all text-muted-foreground">
            {publicKey}
          </code>
          <button
            onClick={() => copyToClipboard(publicKey)}
            className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            title="Copy public key"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
      )}

      {/* Derivation path */}
      {derivationPath && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">{derivationPath}</span>
        </div>
      )}

      {/* Mnemonic */}
      {mnemonic && (
        <div className="p-2.5 rounded-xl bg-muted/20 border border-border">
          <p className="text-[10px] font-mono text-muted-foreground break-all">{mnemonic}</p>
        </div>
      )}
    </div>
  );
}

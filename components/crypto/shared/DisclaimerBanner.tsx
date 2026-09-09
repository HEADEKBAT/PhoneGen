'use client';

import { AlertTriangle } from 'lucide-react';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export default function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  if (compact) {
    return (
      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-amber-600 dark:text-amber-400">
          For development, testing and educational purposes only. Never use generated data for real funds.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
          ⚠️ Educational & Testing Tool Only
        </p>
        <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
          This tool is intended for development, testing and educational purposes only. Generated wallets, mnemonics and
          private keys should never be used to store real funds. No generated data is stored or transmitted.
        </p>
      </div>
    </div>
  );
}

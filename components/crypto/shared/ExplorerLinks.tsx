'use client';

import { ExternalLink } from 'lucide-react';
import { getAllExplorerLinks } from '@/lib/crypto';
import type { NetworkId } from '@/lib/crypto';

interface ExplorerLinksProps {
  network: NetworkId;
  address: string;
}

export default function ExplorerLinks({ network, address }: ExplorerLinksProps) {
  const links = getAllExplorerLinks(network, address);

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Explorer Links</p>
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}

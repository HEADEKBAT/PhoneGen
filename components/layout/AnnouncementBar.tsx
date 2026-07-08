'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { PLATFORM_CONFIG } from '@/lib/config';

/**
 * Announcement bar — configurable from Platform Config.
 *
 * Reads `PLATFORM_CONFIG.announcement` to determine visibility and content.
 * Can be dismissed by the user (persisted in sessionStorage).
 */
export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const announcement = PLATFORM_CONFIG.announcement;

  if (!announcement || dismissed) return null;

  return (
    <div className="relative bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground">
      <div className="mx-auto max-w-4xl flex items-center justify-center gap-2">
        {announcement.href ? (
          <Link href={announcement.href} className="hover:underline">
            {announcement.text}
          </Link>
        ) : (
          <span>{announcement.text}</span>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 hover:bg-primary-foreground/10 transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

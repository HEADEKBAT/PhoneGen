'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Search button — placeholder for Ctrl+K / Command Palette integration.
 *
 * Will later open a search dialog that queries the Generator Registry.
 * For now it's a visual placeholder with a keyboard shortcut hint.
 */
export default function SearchButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
      onClick={() => {
        // TODO: Open search dialog / command palette
      }}
      aria-label="Search (Ctrl+K)"
    >
      <Search size={16} />
      <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        <span className="text-[9px]">⌘</span>K
      </kbd>
    </Button>
  );
}

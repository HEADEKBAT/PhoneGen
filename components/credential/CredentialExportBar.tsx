'use client';

import { useCallback } from 'react';
import { Download } from 'lucide-react';

interface CredentialExportBarProps {
  results: string[];
}

export default function CredentialExportBar({ results }: CredentialExportBarProps) {
  const handleExport = useCallback(
    (format: 'json' | 'csv' | 'txt') => {
      if (results.length === 0) return;

      let content: string;
      let mime: string;
      let ext: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(results, null, 2);
          mime = 'application/json';
          ext = 'json';
          break;
        case 'csv':
          content = 'value\n' + results.map((r) => `"${r.replace(/"/g, '""')}"`).join('\n');
          mime = 'text/csv';
          ext = 'csv';
          break;
        case 'txt':
          content = results.map((r, i) => `[${i + 1}] ${r}`).join('\n');
          mime = 'text/plain';
          ext = 'txt';
          break;
      }

      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `credentials.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [results],
  );

  if (results.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Export:</span>
      {(['json', 'csv', 'txt'] as const).map((fmt) => (
        <button
          key={fmt}
          onClick={() => handleExport(fmt)}
          className="h-8 px-3 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
        >
          <Download size={12} />
          {fmt.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

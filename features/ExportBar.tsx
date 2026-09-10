'use client';

import { useCallback } from 'react';
import { Download } from 'lucide-react';

interface ExportBarProps<T extends object> {
  /** Any array of objects. Column names are read off the first item. */
  data: readonly T[];
  filename?: string;
}

/**
 * Shared export component — JSON / CSV / TXT download.
 * Works with any array of objects by auto-detecting keys from the first item.
 */
export default function ExportBar<T extends object>({
  data,
  filename = 'export',
}: ExportBarProps<T>) {
  /*
   * The component is deliberately structure-agnostic: it reads whatever keys
   * the first item has. TypeScript will not index an `object`, so the widening
   * happens once, here, instead of the `any[]` prop that used to let every
   * caller in unchecked — callers keep their own result types.
   */
  const records = data as readonly Record<string, unknown>[];
  const handleExport = useCallback(
    (format: 'json' | 'csv' | 'txt') => {
      if (data.length === 0) return;

      let content: string;
      let mime: string;
      let ext: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(data, null, 2);
          mime = 'application/json';
          ext = 'json';
          break;

        case 'csv': {
          const headers = Object.keys(records[0]);
          const rows = records.map((item) =>
            headers
              .map((h) => {
                const val = String(item[h] ?? '');
                return `"${val.replace(/"/g, '""')}"`;
              })
              .join(','),
          );
          content = [headers.join(','), ...rows].join('\n');
          mime = 'text/csv';
          ext = 'csv';
          break;
        }

        case 'txt':
          content = records
            .map(
              (item, i) =>
                `[${i + 1}]\n` +
                Object.entries(item)
                  .map(([key, val]) => `  ${key}: ${String(val)}`)
                  .join('\n'),
            )
            .join('\n\n');
          mime = 'text/plain';
          ext = 'txt';
          break;
      }

      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [data, filename],
  );

  if (data.length === 0) return null;

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

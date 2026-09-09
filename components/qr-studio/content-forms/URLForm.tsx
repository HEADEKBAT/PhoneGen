'use client';

import { Input } from '@/components/ui/input';

interface URLFormProps {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export default function URLForm({ data, onChange }: URLFormProps) {
  const update = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">URL</label>
        <Input
          type="url"
          placeholder="https://example.com"
          value={data.url || ''}
          onChange={(e) => update('url', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Title (optional)</label>
        <Input
          type="text"
          placeholder="Page title"
          value={data.title || ''}
          onChange={(e) => update('title', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Description (optional)</label>
        <textarea
          className="w-full h-20 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          placeholder="Short description"
          value={data.description || ''}
          onChange={(e) => update('description', e.target.value)}
        />
      </div>
    </div>
  );
}

'use client';

import { Input } from '@/components/ui/input';

interface EmailFormProps {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export default function EmailForm({ data, onChange }: EmailFormProps) {
  const update = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Email Address</label>
        <Input
          type="email"
          placeholder="user@example.com"
          value={data.email || ''}
          onChange={(e) => update('email', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Subject</label>
        <Input
          placeholder="Email subject"
          value={data.subject || ''}
          onChange={(e) => update('subject', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Body</label>
        <textarea
          className="w-full h-20 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          placeholder="Email body"
          value={data.body || ''}
          onChange={(e) => update('body', e.target.value)}
        />
      </div>
    </div>
  );
}

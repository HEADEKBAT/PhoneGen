'use client';

import { Input } from '@/components/ui/input';

interface SMSFormProps {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export default function SMSForm({ data, onChange }: SMSFormProps) {
  const update = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Phone Number</label>
        <Input
          type="tel"
          placeholder="+1234567890"
          value={data.phone || ''}
          onChange={(e) => update('phone', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Message</label>
        <textarea
          className="w-full h-20 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          placeholder="SMS text"
          value={data.message || ''}
          onChange={(e) => update('message', e.target.value)}
        />
      </div>
    </div>
  );
}

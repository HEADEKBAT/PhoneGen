'use client';

import { Input } from '@/components/ui/input';

interface PhoneFormProps {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export default function PhoneForm({ data, onChange }: PhoneFormProps) {
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
        <p className="text-[11px] text-muted-foreground mt-1 ml-1">
          Format: +[country code][number]. Example: +1234567890
        </p>
      </div>
    </div>
  );
}

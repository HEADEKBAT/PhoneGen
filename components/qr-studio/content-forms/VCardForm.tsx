'use client';

import { Input } from '@/components/ui/input';

interface VCardFormProps {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export default function VCardForm({ data, onChange }: VCardFormProps) {
  const update = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">First Name</label>
          <Input
            placeholder="John"
            value={data.firstName || ''}
            onChange={(e) => update('firstName', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Last Name</label>
          <Input
            placeholder="Doe"
            value={data.lastName || ''}
            onChange={(e) => update('lastName', e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Company</label>
        <Input
          placeholder="Company name"
          value={data.company || ''}
          onChange={(e) => update('company', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Phone</label>
        <Input
          type="tel"
          placeholder="+1234567890"
          value={data.phone || ''}
          onChange={(e) => update('phone', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Email</label>
        <Input
          type="email"
          placeholder="john@example.com"
          value={data.email || ''}
          onChange={(e) => update('email', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Website</label>
        <Input
          type="url"
          placeholder="https://example.com"
          value={data.website || ''}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Address</label>
        <Input
          placeholder="123 Street, City"
          value={data.address || ''}
          onChange={(e) => update('address', e.target.value)}
        />
      </div>
    </div>
  );
}

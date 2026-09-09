'use client';

import { Input } from '@/components/ui/input';

interface WiFiFormProps {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export default function WiFiForm({ data, onChange }: WiFiFormProps) {
  const update = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">SSID (Network Name)</label>
        <Input
          type="text"
          placeholder="My Wi-Fi Network"
          value={data.ssid || ''}
          onChange={(e) => update('ssid', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Password</label>
        <Input
          type="text"
          placeholder="Wi-Fi password"
          value={data.password || ''}
          onChange={(e) => update('password', e.target.value)}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Encryption</label>
        <select
          className="w-full h-8 rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          value={data.encryption || 'WPA'}
          onChange={(e) => update('encryption', e.target.value)}
        >
          <option value="WPA">WPA2-PSK</option>
          <option value="WPA2-EAP">WPA2-Enterprise</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None (Open)</option>
        </select>
      </div>
      <label className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background cursor-pointer hover:bg-muted/30 transition-colors">
        <input
          type="checkbox"
          className="rounded border-border accent-primary"
          checked={data.hidden === 'true'}
          onChange={(e) => update('hidden', e.target.checked ? 'true' : 'false')}
        />
        <span className="text-xs text-muted-foreground">Hidden Network</span>
      </label>
    </div>
  );
}

'use client';

interface TextFormProps {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export default function TextForm({ data, onChange }: TextFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Text</label>
        <textarea
          className="w-full h-28 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          placeholder="Enter text to encode in QR code"
          value={data.text || ''}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
        />
      </div>
    </div>
  );
}

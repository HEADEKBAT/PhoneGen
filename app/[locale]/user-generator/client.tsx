'use client';

import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Copy,
  Check,
  Download,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
  ChevronDown,
  Mail,
  Phone,
  Building,
  Key,
  MapPin,
  Fingerprint,
  User,
  Hash,
  Sparkles,
  Users,
} from 'lucide-react';
import { generateUsers } from '@/lib/userGenerator';
import { SUPPORTED_COUNTRY_CODES, COUNTRY_NAMES } from '@/lib/userGenerator/countryLocaleMap';
import { useUserGeneratorStore } from '@/lib/store';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { GeneratedUser } from '@/lib/userGenerator/types';

/* ── Constants ────────────────────────────────────────────────────────── */

const QUANTITY_OPTIONS = [1, 5, 10, 25, 50, 100] as const;
const AGES = Array.from({ length: 82 }, (_, i) => i + 18); // 18–99

/* ── Component ────────────────────────────────────────────────────────── */

export default function UserGenClient() {
  const searchParams = useSearchParams();

  /* ── Store ──────────────────────────────────────────────────────────── */
  const store = useUserGeneratorStore();
  const {
    users, selectedCountry, quantity, gender, ageMin, ageMax,
    setUsers, setSelectedCountry, setQuantity, setGender, setAgeRange,
    filterQuery, setFilterQuery, clearUsers,
  } = store;

  /* ── Loading state ──────────────────────────────────────────────────── */
  const [loading, setLoading] = useState(false);

  /* ── Read country from URL param on first load ──────────────────────── */
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const urlCountry = searchParams.get('country');
    if (urlCountry && SUPPORTED_COUNTRY_CODES.includes(urlCountry)) {
      setSelectedCountry(urlCountry);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Generate ───────────────────────────────────────────────────────── */
  const handleGenerate = useCallback(() => {
    setLoading(true);
    /* yield to React so skeleton renders first */
    requestAnimationFrame(() => {
      const result = generateUsers({
        country: selectedCountry,
        quantity,
        gender,
        ageMin,
        ageMax,
      });
      setUsers(result);
      setLoading(false);
    });
  }, [selectedCountry, quantity, gender, ageMin, ageMax, setUsers]);

  /* ── Filter / search ────────────────────────────────────────────────── */
  const filteredUsers = useMemo(() => {
    let list = users;

    /* Free-text search */
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      list = list.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.toLowerCase().includes(q) ||
          u.company.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q),
      );
    }

    /* Gender filter */
    if (gender !== 'any') {
      list = list.filter((u) => u.gender === gender);
    }

    /* Age range */
    list = list.filter((u) => u.age >= ageMin && u.age <= ageMax);

    return list;
  }, [users, filterQuery, gender, ageMin, ageMax]);

  /* ── Export ─────────────────────────────────────────────────────────── */
  const handleExport = useCallback(
    (format: 'json' | 'csv' | 'txt') => {
      const data = filteredUsers.length > 0 ? filteredUsers : users;
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
          const headers = Object.keys(data[0]).join(',');
          const rows = data.map((u) =>
            Object.values(u)
              .map((v) => `"${String(v).replace(/"/g, '""')}"`)
              .join(','),
          );
          content = [headers, ...rows].join('\n');
          mime = 'text/csv';
          ext = 'csv';
          break;
        }
        case 'txt':
          content = data
            .map(
              (u) =>
                `Name: ${u.fullName}\nEmail: ${u.email}\nPhone: ${u.phone}\nAddress: ${u.fullAddress}\nCompany: ${u.company}\nUsername: ${u.username}\nPassword: ${u.password}\n---`,
            )
            .join('\n');
          mime = 'text/plain';
          ext = 'txt';
          break;
      }

      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usergen-users.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [filteredUsers, users],
  );

  /* ── Empty state ────────────────────────────────────────────────────── */
  const showEmpty = !loading && users.length === 0;
  const showResults = !loading && users.length > 0;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          {/* ── Hero ──────────────────────────────────────────────────── */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              User<span className="text-primary">Gen</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
              Generate realistic test users — names, emails, phones, addresses, companies, and more.
              One click, no sign-up, no API.
            </p>
          </div>

          {/* ── Generator Panel ───────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Country */}
              <FieldGroup label="Country">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {SUPPORTED_COUNTRY_CODES.map((code) => (
                    <option key={code} value={code}>
                      {code} — {COUNTRY_NAMES[code]}
                    </option>
                  ))}
                </select>
              </FieldGroup>

              {/* Quantity */}
              <FieldGroup label="Quantity">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {QUANTITY_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </FieldGroup>

              {/* Gender */}
              <FieldGroup label="Gender">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'any')}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </FieldGroup>

              {/* Age Min */}
              <FieldGroup label="Min Age">
                <select
                  value={ageMin}
                  onChange={(e) => setAgeRange(Number(e.target.value), ageMax)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {AGES.filter((a) => a <= ageMax).map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </FieldGroup>

              {/* Age Max */}
              <FieldGroup label="Max Age">
                <select
                  value={ageMax}
                  onChange={(e) => setAgeRange(ageMin, Number(e.target.value))}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {AGES.filter((a) => a >= ageMin).map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </FieldGroup>

              {/* Generate button */}
              <div className="flex items-end">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="h-10 w-full rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <UserPlus size={16} />
                  )}
                  {loading ? 'Generating…' : 'Generate'}
                </button>
              </div>
            </div>
          </div>

          {/* ── Search + Export bar ────────────────────────────────────── */}
          {showResults && (
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-50">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, company, username…"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {filteredUsers.length} / {users.length}
                </span>

                <ExportButton format="JSON" onClick={() => handleExport('json')} />
                <ExportButton format="CSV" onClick={() => handleExport('csv')} />
                <ExportButton format="TXT" onClick={() => handleExport('txt')} />

                <button
                  onClick={clearUsers}
                  className="h-9 px-3 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 text-xs font-medium transition-colors flex items-center gap-1"
                  title="Clear all"
                >
                  <Trash2 size={14} />
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* ── Results Grid ───────────────────────────────────────────── */}
          {loading && <SkeletonGrid count={quantity} />}

          {showEmpty && <EmptyState onGenerate={handleGenerate} />}

          {showResults && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}

          {/* ── FAQ ────────────────────────────────────────────────────── */}
          {showResults && (
            <section className="mt-12 border-t border-border pt-10">
              <h2 className="font-heading text-xl font-bold text-foreground mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="max-w-2xl mx-auto space-y-2">
                {FAQ_ITEMS.map(({ q, a }) => (
                  <details
                    key={q}
                    className="rounded-xl border border-border bg-card group [[open]]:bg-muted/30 transition-colors"
                  >
                    <summary className="flex items-center justify-between cursor-pointer px-5 py-4 list-none">
                      <span className="text-sm font-medium text-foreground pr-4">{q}</span>
                      <ChevronDown
                        size={14}
                        className="text-muted-foreground shrink-0 transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <div className="px-5 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── User Card ────────────────────────────────────────────────────────── */

const USER_FIELDS: Array<{
  key: keyof GeneratedUser;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  { key: 'fullName', label: 'Name', icon: User },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'phone', label: 'Phone', icon: Phone },
  { key: 'fullAddress', label: 'Address', icon: MapPin },
  { key: 'company', label: 'Company', icon: Building },
  { key: 'jobTitle', label: 'Job Title', icon: Building },
  { key: 'username', label: 'Username', icon: Fingerprint },
  { key: 'password', label: 'Password', icon: Key },
  { key: 'uuid', label: 'UUID', icon: Hash },
];

function UserCard({ user }: { user: GeneratedUser }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Avatar header */}
      <div className="bg-linear-to-br from-primary/10 via-background to-accent/5 p-5 flex items-center gap-4">
        <img
          src={user.avatar}
          alt={user.fullName}
          className="size-16 rounded-full bg-muted ring-2 ring-border"
          width={64}
          height={64}
        />
        <div className="min-w-0">
          <h3 className="font-heading font-semibold text-foreground text-base truncate">
            {user.fullName}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full capitalize">
              {user.gender}, {user.age}
            </span>
            <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {user.countryCode}
            </span>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="divide-y divide-border">
        {USER_FIELDS.map(({ key, label, icon: Icon }) => (
          <FieldRow key={key} label={label} icon={<Icon size={13} />} value={String(user[key])} />
        ))}
      </div>
    </div>
  );
}

function FieldRow({ label, icon, value }: { label: string; icon: React.ReactNode; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* fallback */ }
  }, [value]);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors group">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
      <span className="text-sm text-foreground truncate flex-1 min-w-0 font-mono text-[13px]">
        {value}
      </span>
      <button
        onClick={handleCopy}
        className="shrink-0 size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
        title={`Copy ${label}`}
      >
        {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────────────────── */

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ExportButton({ format, onClick }: { format: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
    >
      <Download size={14} />
      {format}
    </button>
  );
}

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
        <Users size={28} className="text-primary" />
      </div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-2">
        Generate your first test user
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Pick a country, choose settings, and generate realistic user profiles for development and testing.
      </p>
      <button
        onClick={onGenerate}
        className="h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <Sparkles size={16} />
        Generate Now
      </button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="p-5 flex items-center gap-4">
        <div className="size-16 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-3 w-24 rounded bg-muted" />
        </div>
      </div>
      <div className="divide-y divide-border">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="size-4 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-3 flex-1 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: 'Is generated data real?',
    a: 'No. All data is procedurally generated using Faker and custom generators. It follows realistic patterns — names, addresses, and phone numbers look authentic but belong to no real person.',
  },
  {
    q: 'Can I use generated users for testing?',
    a: 'Yes. Every field is self-consistent and formatted for real-world use. Use the data for frontend demos, backend testing, database seeding, or QA automation.',
  },
  {
    q: 'Are phone numbers valid?',
    a: 'Phone numbers are generated using the same engine as PhoneGen — they match each country\'s formatting patterns. They may not be assignable by carriers, but they pass format validation.',
  },
  {
    q: 'Can I export generated users?',
    a: 'Yes. Use the JSON, CSV, or TXT export buttons above the results grid. JSON preserves the full object structure, CSV works with spreadsheets, and TXT is human-readable.',
  },
  {
    q: 'How many users can I generate?',
    a: 'Up to 100 at once from the UI. Since everything runs locally, there is no hard limit — you can generate as many batches as you need.',
  },
];

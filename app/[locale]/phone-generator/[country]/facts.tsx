import { getCountryInfo } from '@/lib/countryRegistry';
import { getPhoneExample } from '@/lib/phone/examples';
import { getCountryDisplayName, getT } from '@/lib/i18n/server';

/**
 * The country's numbering plan, rendered on the server.
 *
 * What it replaces sat inside `InfoCard`, at the bottom of a client tree
 * loaded with `ssr: false`: the calling code, the digit count and one example
 * were in the page a visitor saw and in none of the HTML a crawler received.
 * These pages exist to answer "how long is a French mobile number" — shipping
 * that answer only to browsers that run JavaScript gave it away for nothing.
 *
 * The three formats are the same strings `lib/phone/examples` puts on the
 * landing, from libphonenumber's own metadata, so the example here and the
 * numbers the generator produces above cannot drift apart.
 */
export default function CountryFacts({
  locale,
  country,
}: {
  locale: string;
  country: string;
}) {
  const t = getT(locale);
  const info = getCountryInfo(country);
  const example = getPhoneExample(country);
  if (!info) return null;

  const name = getCountryDisplayName(locale, country);

  const lengths = [...new Set(info.possibleLengths)].sort((a, b) => a - b);
  const lengthLabel =
    lengths.length > 1
      ? `${lengths.join(', ')} ${t('infoCard.digits')}`
      : `${info.primaryLength} ${t('infoCard.digits')}`;

  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: t('infoCard.countryCode'), value: `+${info.countryCode}`, mono: true },
    {
      label: lengths.length > 1 ? t('phoneCountry.facts.possibleLengths') : t('infoCard.numberLength'),
      value: lengthLabel,
    },
  ];

  if (example) {
    rows.push(
      {
        label: t('productLanding.phone.formats.international.label'),
        value: example.international,
        mono: true,
      },
      {
        label: t('productLanding.phone.formats.national.label'),
        value: example.national,
        mono: true,
      },
      { label: t('productLanding.phone.formats.e164.label'), value: example.e164, mono: true },
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="relative mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2.5">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          {t('phoneCountry.facts.title', { country: name })}
        </h2>
        <p className="text-[0.8125rem] text-muted-foreground">{t('phoneCountry.facts.note')}</p>
        <span
          aria-hidden="true"
          className="absolute -bottom-px left-0 h-0.5 w-9 rounded-full bg-action"
        />
      </div>

      <dl className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2.5 last:border-b-0"
          >
            <dt className="text-[0.8125rem] text-muted-foreground">{row.label}</dt>
            <dd
              className={
                row.mono
                  ? 'm-0 text-right font-mono text-[0.875rem] break-all text-foreground tabular-nums'
                  : 'm-0 text-right text-[0.875rem] text-foreground tabular-nums'
              }
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

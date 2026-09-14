import { getCountryDisplayName, getT } from '@/lib/i18n/server';

/**
 * Server-rendered heading for a phone-generator country page.
 *
 * The whole page used to be `PhoneGeneratorLoader`, which is `ssr: false`, so
 * the HTML a crawler receives for all ~1470 country URLs contained no heading
 * and no text at all — the h1 «Генератор номеров США» only appeared after the
 * tool's chunk loaded and hydrated. Google renders JavaScript, but these are
 * the pages that carry the long-tail intent ("генератор номеров телефона США"),
 * and they were shipping an empty skeleton to every crawler that does not.
 *
 * Nothing here is new copy: these are the same `mainContent.*` strings the
 * client rendered, resolved on the server instead. MainContent no longer draws
 * them, so the page looks exactly as it did.
 */
export default function CountryPageHeader({
  locale,
  country,
}: {
  locale: string;
  country: string;
}) {
  const t = getT(locale);
  const name = getCountryDisplayName(locale, country);

  return (
    <section aria-labelledby="country-heading" className="mx-auto w-full max-w-4xl px-4 sm:px-6 pt-8">
      <div className="space-y-1">
        <h1
          id="country-heading"
          className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
        >
          {t('mainContent.heading', { country: name })}
        </h1>
        <p className="text-sm text-muted-foreground">
          {/* `code` is the ISO code, as MainContent rendered it: "US — США". */}
          {t('mainContent.subtitle', { code: country, country: name })}
        </p>
      </div>
    </section>
  );
}

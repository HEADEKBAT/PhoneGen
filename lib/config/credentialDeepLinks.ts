/**
 * Credential studio deep links — manifests for `createCredentialDeepLinkPage`.
 *
 * Three URLs that open the credential studio with a tab and mode already
 * chosen. The copy below is carried over verbatim from the three page files
 * this replaces; only the metadata plumbing around it changed.
 */

import type { CredentialDeepLinkManifest } from '@/core/credential-deep-link-factory';

const WIFI_PASSWORD_GENERATOR: CredentialDeepLinkManifest = {
  slug: 'wifi-password-generator',
  product: 'credential',
  parentLabel: 'Credential Generator',
  label: 'WiFi Password Generator',
  initialMode: { activeTab: 'passwords', passwordMode: 'random' },
  copy: {
    en: {
      title: 'WiFi Password Generator — Create Secure Router Passwords',
      description: 'Generate strong WiFi router passwords — 20 characters with all character classes, excluding ambiguous characters. Perfect for router admin and network security.',
    },
    ru: {
      title: 'Генератор паролей WiFi — Создавайте безопасные пароли роутера',
      description: 'Генерируйте надежные пароли WiFi — 20 символов со всеми классами, исключая неоднозначные символы.',
    },
    de: {
      title: 'WiFi-Passwort-Generator — Erstellen Sie sichere Router-Passwörter',
      description: 'Generieren Sie starke WiFi-Passwörter — 20 Zeichen mit allen Zeichenklassen, ohne mehrdeutige Zeichen.',
    },
    es: {
      title: 'Generador de contraseñas WiFi — Cree contraseñas de router seguras',
      description: 'Genere contraseñas WiFi seguras — 20 caracteres con todas las clases, excluyendo caracteres ambiguos.',
    },
    fr: {
      title: 'Générateur de mot de passe WiFi — Créez des mots de passe routeur sécurisés',
      description: 'Générez des mots de passe WiFi robustes — 20 caractères avec toutes les classes, sans caractères ambigus.',
    },
    pt: {
      title: 'Gerador de senhas WiFi — Crie senhas de roteador seguras',
      description: 'Gere senhas WiFi fortes — 20 caracteres com todas as classes, excluindo caracteres ambíguos.',
    },
  },
};

const HUMAN_PASSWORD_GENERATOR: CredentialDeepLinkManifest = {
  slug: 'human-password-generator',
  product: 'credential',
  parentLabel: 'Credential Generator',
  label: 'Human Password Generator',
  initialMode: { activeTab: 'passwords', passwordMode: 'human' },
  copy: {
    en: {
      title: 'Human Password Generator — Memorable & Secure Phrases',
      description: 'Create grammatically coherent, memorable passwords like "MyDogLikesPizza92!" — easy to remember, hard to crack.',
    },
    ru: {
      title: 'Генератор человеческих паролей — Запоминающиеся фразы',
      description: 'Создавайте грамматически связные запоминающиеся пароли вроде "MyDogLikesPizza92!" — легко запомнить, сложно взломать.',
    },
    de: {
      title: 'Menschenlesbarer Passwort-Generator — Einprägsame & sichere Phrasen',
      description: 'Erstellen Sie grammatikalisch kohärente, einprägsame Passwörter wie "MyDogLikesPizza92!" — leicht zu merken, schwer zu knacken.',
    },
    es: {
      title: 'Generador de contraseñas legibles — Frases memorables y seguras',
      description: 'Cree contraseñas gramaticalmente coherentes como "MyDogLikesPizza92!" — fáciles de recordar, difíciles de descifrar.',
    },
    fr: {
      title: 'Générateur de mots de passe lisibles — Phrases mémorables et sécurisées',
      description: 'Créez des mots de passe grammaticalement cohérents comme "MyDogLikesPizza92!" — faciles à retenir, difficiles à cracker.',
    },
    pt: {
      title: 'Gerador de senhas legíveis — Frases memoráveis e seguras',
      description: 'Crie senhas gramaticalmente coerentes como "MyDogLikesPizza92!" — fáceis de lembrar, difíceis de quebrar.',
    },
  },
};

const PIN_GENERATOR: CredentialDeepLinkManifest = {
  slug: 'pin-generator',
  product: 'credential',
  parentLabel: 'Credential Generator',
  label: 'PIN Generator',
  initialMode: { activeTab: 'pins-secrets' },
  copy: {
    en: {
      title: 'PIN Generator — Create Secure PIN Codes (4, 6, 8 Digit)',
      description: 'Generate secure PIN codes in 4, 6, or 8 digit lengths with optional no-consecutive-repeats constraint. Free client-side PIN generator.',
    },
    ru: {
      title: 'Генератор PIN-кодов — Создавайте безопасные PIN-коды',
      description: 'Генерируйте безопасные PIN-коды длиной 4, 6 или 8 цифр с опцией запрета последовательных повторов. Бесплатно.',
    },
    de: {
      title: 'PIN-Generator — Erstellen Sie sichere PIN-Codes',
      description: 'Generieren Sie sichere PIN-Codes in 4, 6 oder 8 Ziffern mit optionaler Vermeidung aufeinanderfolgender Wiederholungen. Kostenlos.',
    },
    es: {
      title: 'Generador de PIN — Cree códigos PIN seguros',
      description: 'Genere códigos PIN seguros de 4, 6 u 8 dígitos con opción sin repeticiones consecutivas. Generador gratuito.',
    },
    fr: {
      title: 'Générateur de code PIN — Créez des codes PIN sécurisés',
      description: 'Générez des codes PIN sécurisés en 4, 6 ou 8 chiffres avec option sans répétitions consécutives. Générateur gratuit côté client.',
    },
    pt: {
      title: 'Gerador de PIN — Crie códigos PIN seguros',
      description: 'Gere códigos PIN seguros de 4, 6 ou 8 dígitos com opção sem repetições consecutivas. Gerador gratuito.',
    },
  },
};

export const CREDENTIAL_DEEP_LINKS: Record<string, CredentialDeepLinkManifest> = {
  'wifi-password-generator': WIFI_PASSWORD_GENERATOR,
  'human-password-generator': HUMAN_PASSWORD_GENERATOR,
  'pin-generator': PIN_GENERATOR,
};

/** Look up a manifest by slug. Throws: a page cannot render without one. */
export function getCredentialDeepLink(slug: string): CredentialDeepLinkManifest {
  const page = CREDENTIAL_DEEP_LINKS[slug];
  if (!page) {
    throw new Error(
      `No credential deep-link manifest for "${slug}". Known slugs: ${Object.keys(CREDENTIAL_DEEP_LINKS).join(', ')}`,
    );
  }
  return page;
}

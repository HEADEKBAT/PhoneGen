/**
 * Studio tool pages — manifests for `createStudioToolPage`.
 *
 * One entry per /{product}/tool route. The six that had per-locale copy keep
 * it verbatim; the six that had none (address, company, credential, email,
 * user, username) get their title and description from the product record, so
 * they now have a canonical URL and an hreflang set where before they had
 * neither. Those six render the editor alone, as they did — no `heading`.
 *
 * Breadcrumb labels are gone from these entries: the factory builds the trail
 * from the product's translated name plus `breadcrumb.tool`.
 *
 * `lib/i18n` is not involved for the title/description copy below: it was
 * never in the translation files.
 * Moving it there is a separate change, and a larger one, because six locales
 * of two strings for thirteen pages is 156 keys.
 */

import {
  AddressGeneratorLoader,
  BarcodeStudioClientLoader,
  ColorStudioLoader,
  CompanyGeneratorLoader,
  CredentialClientLoader,
  CryptoPlaygroundLoader,
  EmailGeneratorLoader,
  ImageStudioLoader,
  MediaStudioLoader,
  QRStudioLoader,
  UserGenClientLoader,
  UsernameGeneratorLoader,
} from '@/components/dynamic';
import type { StudioToolPageManifest } from '@/core/studio-tool-factory';

const BARCODE_GENERATOR: StudioToolPageManifest = {
  product: 'barcode',
  heading: 'Barcode Studio',
  Tool: BarcodeStudioClientLoader,
  copy: {
    en: {
      title: 'Barcode Studio — Free Online Barcode Generator & Creator',
      description: 'Create, validate, and export professional barcodes — EAN-13, UPC, Code 128, ISBN, and more. Free online barcode studio with live preview, check digit calculator, and bulk generation.',
    },
    ru: {
      title: 'Barcode Studio — Бесплатный онлайн генератор штрихкодов',
      description: 'Создавайте, проверяйте и экспортируйте профессиональные штрихкоды — EAN-13, UPC, Code 128, ISBN. Бесплатная студия с предпросмотром.',
    },
    de: {
      title: 'Barcode Studio — Kostenloser Online-Barcode-Generator',
      description: 'Erstellen, validieren und exportieren Sie professionelle Barcodes — EAN-13, UPC, Code 128, ISBN. Kostenloses Studio mit Live-Vorschau.',
    },
    es: {
      title: 'Barcode Studio — Generador de códigos de barras gratuito',
      description: 'Cree, valide y exporte códigos de barras profesionales — EAN-13, UPC, Code 128, ISBN. Estudio gratuito con vista previa en vivo.',
    },
    fr: {
      title: 'Barcode Studio — Générateur de codes-barres gratuit en ligne',
      description: 'Créez, validez et exportez des codes-barres professionnels — EAN-13, UPC, Code 128, ISBN. Studio gratuit avec aperçu en direct.',
    },
    pt: {
      title: 'Barcode Studio — Gerador de códigos de barras gratuito',
      description: 'Crie, valide e exporte códigos de barras profissionais — EAN-13, UPC, Code 128, ISBN. Estúdio gratuito com pré-visualização.',
    },
  },
};

const COLOR_GENERATOR: StudioToolPageManifest = {
  product: 'color',
  heading: 'Color Studio',
  Tool: ColorStudioLoader,
  copy: {
    en: {
      title: 'Color Studio — Free Online Color Palette, Gradient & Converter Tool',
      description: 'Create, convert, and analyze colors — palettes, gradients, WCAG contrast checking, color harmonies, and developer-friendly exports. Free online color studio.',
    },
    ru: {
      title: 'Color Studio — Бесплатный онлайн инструмент для цветовых палитр, градиентов и конвертации',
      description: 'Создавайте, конвертируйте и анализируйте цвета — палитры, градиенты, проверка контраста WCAG. Бесплатная студия.',
    },
    de: {
      title: 'Color Studio — Kostenloses Online-Tool für Farbpaletten, Verläufe und Konverter',
      description: 'Farben erstellen, konvertieren und analysieren — Paletten, Verläufe, WCAG-Kontrastprüfung. Kostenloses Studio.',
    },
    es: {
      title: 'Color Studio — Herramienta gratuita de paletas, degradados y conversión de colores',
      description: 'Cree, convierta y analice colores — paletas, degradados, verificación de contraste WCAG. Estudio gratuito.',
    },
    fr: {
      title: 'Color Studio — Outil de palette de couleurs, dégradés et conversion gratuit',
      description: 'Créez, convertissez et analysez les couleurs — palettes, dégradés, vérification de contraste WCAG. Studio gratuit.',
    },
    pt: {
      title: 'Color Studio — Ferramenta gratuita de paletas, gradientes e conversão de cores',
      description: 'Crie, converta e analise cores — paletas, gradientes, verificação de contraste WCAG. Estúdio gratuito.',
    },
  },
};

const CRYPTO_WALLET_PLAYGROUND: StudioToolPageManifest = {
  product: 'cryptoWallet',
  heading: 'Crypto Wallet Playground',
  Tool: CryptoPlaygroundLoader,
  copy: {
    en: {
      title: 'Crypto Wallet Playground — Interactive Web3 Testing Toolkit',
      description: 'Generate wallet addresses, create BIP39 mnemonics, validate and analyze addresses, explore HD derivation trees, and more. All client-side.',
    },
    ru: {
      title: 'Crypto Wallet Playground — Интерактивный набор инструментов для Web3 тестирования',
      description: 'Генерируйте адреса кошельков, создавайте BIP39 мнемоники, проверяйте и анализируйте адреса, изучайте деревья деривации HD и многое другое. Всё на стороне клиента.',
    },
    de: {
      title: 'Crypto Wallet Playground — Interaktives Web3-Testkit',
      description: 'Generieren Sie Wallet-Adressen, erstellen Sie BIP39-Mnemoniken, validieren und analysieren Sie Adressen, erkunden Sie HD-Ableitungsbäume und mehr. Alles clientseitig.',
    },
    es: {
      title: 'Crypto Wallet Playground — Kit de pruebas Web3 interactivo',
      description: 'Genere direcciones de billetera, cree mnemónicos BIP39, valide y analice direcciones, explore árboles de derivación HD, y más. Todo del lado del cliente.',
    },
    fr: {
      title: 'Crypto Wallet Playground — Kit de test Web3 interactif',
      description: 'Générez des adresses de portefeuille, créez des mnémoniques BIP39, validez et analysez des adresses, explorez les arbres de dérivation HD, et plus. Tout côté client.',
    },
    pt: {
      title: 'Crypto Wallet Playground — Kit de teste Web3 interativo',
      description: 'Gere endereços de carteira, crie mnemônicos BIP39, valide e analise endereços, explore árvores de derivação HD, e mais. Tudo no navegador.',
    },
  },
};

const IMAGE_STUDIO: StudioToolPageManifest = {
  product: 'image',
  heading: 'Image Studio',
  Tool: ImageStudioLoader,
  copy: {
    en: {
      title: 'Image Studio — Free Online Image Tools: Background Remover, Upscaler & Editor',
      description: 'Professional image processing toolkit — remove backgrounds, upscale images, apply filters, and edit photos. Free online image studio with AI-powered tools.',
    },
    ru: {
      title: 'Image Studio — Бесплатные онлайн-инструменты для изображений: удаление фона, увеличение и редактирование',
      description: 'Профессиональный набор инструментов для обработки изображений — удаление фона, увеличение, фильтры и редактирование. Бесплатная онлайн-студия.',
    },
    de: {
      title: 'Image Studio — Kostenlose Online-Bildtools: Hintergrund entfernen, Hochskalieren und Bearbeiten',
      description: 'Professionelles Bildbearbeitungs-Toolkit — Hintergrund entfernen, hochskalieren, Filter anwenden und Fotos bearbeiten. Kostenloses Online-Studio.',
    },
    es: {
      title: 'Image Studio — Herramientas de imagen gratuitas en línea: eliminación de fondos, ampliación y edición',
      description: 'Kit de herramientas profesional de procesamiento de imágenes — eliminar fondos, ampliar, aplicar filtros y editar fotos. Estudio gratuito en línea.',
    },
    fr: {
      title: 'Studio d\'image — Outils d\'image gratuits en ligne : Suppression d\'arrière-plan, agrandissement et édition',
      description: 'Boîte à outils professionnelle de traitement d\'image — suppression d\'arrière-plan, agrandissement, filtres et édition. Studio gratuit en ligne avec outils IA.',
    },
    pt: {
      title: 'Image Studio — Ferramentas de imagem gratuitas online: remoção de fundo, upscaling e edição',
      description: 'Kit de ferramentas profissional de processamento de imagens — remover fundo, ampliar, aplicar filtros e editar fotos. Estúdio gratuito online.',
    },
  },
};

const MEDIA_STUDIO: StudioToolPageManifest = {
  product: 'media',
  heading: 'Media Studio — Video Converter',
  Tool: MediaStudioLoader,
  copy: {
    en: {
      title: 'Media Studio — Free Online Video Converter, Compressor & Editor',
      description: 'Professional video processing toolkit — convert, compress, resize, and edit video files. Free online media studio powered by FFmpeg.wasm — all in your browser.',
    },
    ru: {
      title: 'Media Studio — Бесплатный онлайн-конвертер, компрессор и редактор видео',
      description: 'Профессиональный набор инструментов для обработки видео — конвертация, сжатие, изменение размера и редактирование. Бесплатная онлайн-студия.',
    },
    de: {
      title: 'Media Studio — Kostenloser Online-Videokonverter, -kompressor und -editor',
      description: 'Professionelles Videobearbeitungs-Toolkit — konvertieren, komprimieren, skalieren und bearbeiten Sie Videos. Kostenloses Online-Studio.',
    },
    es: {
      title: 'Media Studio — Conversor, compresor y editor de vídeo gratuito en línea',
      description: 'Kit de herramientas profesional de procesamiento de vídeo — convertir, comprimir, redimensionar y editar vídeos. Estudio gratuito en línea.',
    },
    fr: {
      title: 'Media Studio — Convertisseur, compresseur et éditeur vidéo gratuit en ligne',
      description: 'Boîte à outils professionnelle de traitement vidéo — convertir, compresser, redimensionner et éditer des vidéos. Studio gratuit en ligne avec FFmpeg.wasm.',
    },
    pt: {
      title: 'Media Studio — Conversor, compressor e editor de vídeo gratuito online',
      description: 'Kit de ferramentas profissional de processamento de vídeo — converter, comprimir, redimensionar e editar vídeos. Estúdio gratuito online.',
    },
  },
};

const QR_GENERATOR: StudioToolPageManifest = {
  product: 'qr',
  heading: 'QR Studio',
  Tool: QRStudioLoader,
  copy: {
    en: {
      title: 'QR Studio — Free Online QR Code Generator & Designer',
      description: 'Create, customize, and export professional QR codes — URLs, Wi-Fi, vCard, email, SMS, social media, and 30+ content types. Free online QR studio with live preview, logo upload, and multiple export formats.',
    },
    ru: {
      title: 'QR Studio — Бесплатный онлайн генератор и дизайнер QR-кодов',
      description: 'Создавайте, настраивайте и экспортируйте профессиональные QR-коды — URL, Wi-Fi, vCard, email, SMS, соцсети и 30+ типов контента. Бесплатная студия с предпросмотром.',
    },
    de: {
      title: 'QR Studio — Kostenloser Online-QR-Code-Generator & Designer',
      description: 'Erstellen, anpassen und exportieren Sie professionelle QR-Codes — URLs, WLAN, vCard, E-Mail, SMS, soziale Medien und über 30 Inhaltstypen. Kostenloses Studio mit Live-Vorschau.',
    },
    es: {
      title: 'QR Studio — Generador y diseñador de códigos QR gratuito',
      description: 'Cree, personalice y exporte códigos QR profesionales — URL, Wi-Fi, vCard, email, SMS, redes sociales y más de 30 tipos de contenido. Estudio gratuito con vista previa en vivo.',
    },
    fr: {
      title: 'QR Studio — Générateur et designer de codes QR gratuit en ligne',
      description: 'Créez, personnalisez et exportez des codes QR professionnels — URL, Wi-Fi, vCard, email, SMS, réseaux sociaux et plus de 30 types de contenu. Studio gratuit avec aperçu en direct.',
    },
    pt: {
      title: 'QR Studio — Gerador e designer de códigos QR grátis',
      description: 'Crie, personalize e exporte códigos QR profissionais — URLs, Wi-Fi, vCard, email, SMS, redes sociais e mais de 30 tipos de conteúdo. Estúdio gratuito com pré-visualização.',
    },
  },
};

const ADDRESS_GENERATOR: StudioToolPageManifest = {
  product: 'address',
  Tool: AddressGeneratorLoader,
};

const COMPANY_GENERATOR: StudioToolPageManifest = {
  product: 'company',
  Tool: CompanyGeneratorLoader,
};

const CREDENTIAL_GENERATOR: StudioToolPageManifest = {
  product: 'credential',
  Tool: CredentialClientLoader,
};

const EMAIL_GENERATOR: StudioToolPageManifest = {
  product: 'email',
  Tool: EmailGeneratorLoader,
};

const USER_GENERATOR: StudioToolPageManifest = {
  product: 'user',
  Tool: UserGenClientLoader,
};

const USERNAME_GENERATOR: StudioToolPageManifest = {
  product: 'username',
  Tool: UsernameGeneratorLoader,
};

export const STUDIO_TOOL_PAGES: Record<string, StudioToolPageManifest> = {
  'barcode-generator': BARCODE_GENERATOR,
  'color-generator': COLOR_GENERATOR,
  'crypto-wallet-playground': CRYPTO_WALLET_PLAYGROUND,
  'image-studio': IMAGE_STUDIO,
  'media-studio': MEDIA_STUDIO,
  'qr-generator': QR_GENERATOR,
  'address-generator': ADDRESS_GENERATOR,
  'company-generator': COMPANY_GENERATOR,
  'credential-generator': CREDENTIAL_GENERATOR,
  'email-generator': EMAIL_GENERATOR,
  'user-generator': USER_GENERATOR,
  'username-generator': USERNAME_GENERATOR,
};

/** Look up a manifest by product slug. Throws: a page cannot render without one. */
export function getStudioToolPage(slug: string): StudioToolPageManifest {
  const page = STUDIO_TOOL_PAGES[slug];
  if (!page) {
    throw new Error(
      `No studio tool manifest for "${slug}". Known slugs: ${Object.keys(STUDIO_TOOL_PAGES).join(', ')}`,
    );
  }
  return page;
}

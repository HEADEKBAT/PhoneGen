'use client';

/**
 * Lazily-loaded studio and generator clients.
 *
 * Every entry below defers a heavy client component behind `next/dynamic` with
 * `ssr: false` — these tools draw on canvas, Web Crypto or ffmpeg.wasm and have
 * nothing to render on the server — and shows a matching skeleton meanwhile.
 *
 * This used to be fifteen near-identical files of about twenty-two lines each.
 * Each one re-declared the same `dynamic()` options and ended with
 * `as unknown as React.FC<Props>`, a cast that replaced the component's real
 * prop types with a hand-written guess; one of them had already drifted
 * (ImageStudioClient takes a mode union, the cast declared `string`).
 * `lazyStudio` infers props from the imported component instead, so the types
 * are the component's own.
 *
 * They live in one module rather than fifteen because the barrel that replaced
 * them was already pulling all of them: each file calls `dynamic()` at module
 * scope, which is a side effect a bundler will not shake out. Collapsing makes
 * that explicit rather than changing it. The `import()` calls themselves stay
 * lazy — only the skeletons are eager, and they are a few hundred bytes each.
 *
 * The `webpackChunkName` comments name the chunks in the bundle analyser; keep
 * them when adding an entry.
 */

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

import BarcodeSkeleton from '@/components/skeleton/BarcodeSkeleton';
import ColorStudioSkeleton from '@/components/skeleton/ColorStudioSkeleton';
import CredentialSkeleton from '@/components/skeleton/CredentialSkeleton';
import GeneratorToolSkeleton from '@/components/skeleton/GeneratorToolSkeleton';
import ImageStudioSkeleton from '@/components/skeleton/ImageStudioSkeleton';
import MediaStudioSkeleton from '@/components/skeleton/MediaStudioSkeleton';

/**
 * Defer a client component, showing `Skeleton` until its chunk arrives.
 *
 * The prop type is inferred from the component being loaded, so a caller
 * passing the wrong props is a compile error rather than a runtime surprise.
 */
function lazyStudio<P extends object>(
  load: () => Promise<{ default: ComponentType<P> }>,
  Skeleton: ComponentType,
): ComponentType<P> {
  return dynamic(load, {
    loading: () => <Skeleton />,
    ssr: false,
  }) as ComponentType<P>;
}

/* ── Studios ────────────────────────────────────────────────────────────────── */

export const BarcodeStudioClientLoader = lazyStudio(
  () => import(/* webpackChunkName: "barcode-studio" */ '@/components/barcode/BarcodeStudioClient'),
  BarcodeSkeleton,
);

export const ColorStudioLoader = lazyStudio(
  () => import(/* webpackChunkName: "color-studio" */ '@/components/color-studio/ColorStudioClient'),
  ColorStudioSkeleton,
);

export const ImageStudioLoader = lazyStudio(
  () => import(/* webpackChunkName: "image-studio" */ '@/components/image-studio/ImageStudioClient'),
  ImageStudioSkeleton,
);

export const MediaStudioLoader = lazyStudio(
  () => import(/* webpackChunkName: "media-studio" */ '@/components/media/MediaStudioClient'),
  MediaStudioSkeleton,
);

export const QRStudioLoader = lazyStudio(
  () => import(/* webpackChunkName: "qr-studio" */ '@/components/qr-studio/QRStudioClient'),
  GeneratorToolSkeleton,
);

export const PaymentStudioLoader = lazyStudio(
  () =>
    import(
      /* webpackChunkName: "payment-studio" */ '@/components/payment-studio/CreditCardStudioClient'
    ),
  GeneratorToolSkeleton,
);

export const CryptoPlaygroundLoader = lazyStudio(
  () => import(/* webpackChunkName: "crypto-playground" */ '@/components/crypto/CryptoPlaygroundClient'),
  GeneratorToolSkeleton,
);

/* ── Generators ─────────────────────────────────────────────────────────────── */

export const PhoneGeneratorLoader = lazyStudio(
  () => import(/* webpackChunkName: "phone-generator" */ '@/app/[locale]/phone-generator/client'),
  GeneratorToolSkeleton,
);

export const CredentialClientLoader = lazyStudio(
  () =>
    import(/* webpackChunkName: "credential-client" */ '@/app/[locale]/credential-generator/client'),
  CredentialSkeleton,
);

export const UserGenClientLoader = lazyStudio(
  () => import(/* webpackChunkName: "user-gen" */ '@/app/[locale]/user-generator/client'),
  GeneratorToolSkeleton,
);

/* These pull in @faker-js/faker, which is why they are deferred at all. */

export const AddressGeneratorLoader = lazyStudio(
  () => import(/* webpackChunkName: "address-gen" */ '@/features/address-generator/AddressGenerator'),
  GeneratorToolSkeleton,
);

export const CompanyGeneratorLoader = lazyStudio(
  () => import(/* webpackChunkName: "company-gen" */ '@/features/company-generator/CompanyGenerator'),
  GeneratorToolSkeleton,
);

export const EmailGeneratorLoader = lazyStudio(
  () => import(/* webpackChunkName: "email-gen" */ '@/features/email-generator/EmailGenerator'),
  GeneratorToolSkeleton,
);

export const UsernameGeneratorLoader = lazyStudio(
  () =>
    import(/* webpackChunkName: "username-gen" */ '@/features/username-generator/UsernameGenerator'),
  GeneratorToolSkeleton,
);

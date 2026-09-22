import {
  ShieldCheck,
  Grid3x3,
  Globe,
  Zap,
  Users,
  Download,
  MapPin,
  Building,
  Mail,
  User,
  Sparkles,
  Key,
  Briefcase,
  Palette,
  Layers,
  Droplets,
  Eye,
  Scan,
  BookOpen,
  CreditCard,
  Image,
  Lock,
  QrCode,
  Settings2,
  Smartphone,
  Video,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { Feature } from '@/lib/config/productLanding';
import type { LandingCard } from './LandingCards';

/**
 * `Feature.iconName` is a string in the config, so this is where a name
 * becomes a component. Kept as a lookup rather than a dynamic import because
 * the set is closed: a name with no entry simply renders no icon.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Grid3x3,
  Globe,
  Zap,
  Users,
  Download,
  MapPin,
  Building,
  Mail,
  User,
  Sparkles,
  Key,
  Briefcase,
  Palette,
  Layers,
  Droplets,
  Eye,
  Scan,
  BookOpen,
  CreditCard,
  Image,
  Lock,
  QrCode,
  Settings2,
  Smartphone,
  Video,
  Wallet,
};

/*
 * Nine names in the config had no entry here — BookOpen, CreditCard, Image,
 * Lock, QrCode, Settings2, Smartphone, Video, Wallet — so the crypto, media,
 * payment, image and QR feature cards rendered with a blank where the icon
 * belongs, next to siblings that had one.
 */

/** Turns the config's features into cards, with the copy already resolved. */
export function toFeatureCards(
  features: Feature[],
  t: (key: string) => string,
): LandingCard[] {
  return features.map((feature) => {
    const Icon = ICON_MAP[feature.iconName];

    return {
      id: feature.titleKey,
      icon: Icon ? <Icon size={15} aria-hidden="true" /> : undefined,
      title: t(feature.titleKey),
      desc: t(feature.descKey),
    };
  });
}

/**
 * Backward-compatible re-exports.
 *
 * Stores have been split into individual files under `lib/stores/`.
 * Import directly from `@/lib/stores/<name>` for tree-shaking.
 */
export {
  useCountryStore,
  useLanguageStore,
  useFavoritesStore,
  useRecentlyUsedStore,
  useUserGeneratorStore,
  useCredentialGeneratorStore,
} from './stores';
export type { CredentialGeneratorStore } from './stores';
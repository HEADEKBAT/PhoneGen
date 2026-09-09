/**
 * Crypto Wallet Playground — Barrel exports.
 */

export type {
  NetworkId,
  WalletFormat,
  ErrorCorrection,
  Network,
  HDNode,
  MnemonicConfig,
  MnemonicLanguage,
  ValidationResult,
  AnalysisResult,
  WalletResult,
  ConversionResult,
  ScanTestResult,
  HistoryEntry,
  CryptoURI,
  ExportTemplate,
} from './types';

export {
  NETWORKS,
  ALL_NETWORKS,
  getNetwork,
  getNetworkByCoinType,
  getNetworksByFormat,
  NETWORK_IDS,
  NETWORK_NAMES,
} from './networks';

export { generateWallet, generateWallets, generateWalletFromMnemonic } from './generator';
export type { GenerateOptions } from './generator';

export {
  generateMnemonicPhrase,
  generateMnemonicPhrases,
  validateMnemonicPhrase,
  mnemonicToSeed,
  getLanguageName,
  getAllLanguages,
} from './mnemonic';

export { buildDerivationTree, getDerivationPathParts, getHumanReadablePath } from './hdWallet';
export type { DerivationOptions } from './hdWallet';

export { validateAddress, validateMultiple } from './validation';

export { convertAddress, convertAddressFormats } from './conversion';

export { analyzeAddress } from './analysis';

export { buildCryptoURI, parseCryptoURI, getURISchemes } from './qrCodeGenerator';

export { getTestWalletsByNetwork, getTestWalletsByType, getAllTestWallets } from './testWallets';

export { exportWallet, SUPPORTED_LANGUAGES } from './playground';
export type { ExportOptions } from './playground';

export { getSecurityTopic, getAllSecurityTopics } from './security';
export type { SecurityTopic } from './security';

export { generateInvalidAddress, INVALID_ADDRESS_TEMPLATES, getNegativeTestCases, validateNegativeCases } from './negativeTesting';
export type { InvalidAddressTemplate } from './negativeTesting';

export { getAddressBreakdown, compareFormats, buildExplorerURI } from './interactive';
export type { InteractiveBreakdown, ByteSegment } from './interactive';

export { getHistory, addHistoryEntry, clearHistory, removeHistoryEntry, isHistoryEnabled } from './localHistory';

export { getExplorerUrl, getTestnetExplorerUrl, getAllExplorerLinks } from './explorers';
export type { ExplorerLink } from './explorers';

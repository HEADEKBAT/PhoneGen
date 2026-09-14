/**
 * Crypto Wallet Playground — SEO Landing Pages Config.
 *
 * Defines metadata, hero content, and FAQ for each SEO landing page.
 * Each page is a thin server component that reads its config from here.
 * Follows the same pattern as credentialSEOPages.ts and paymentSEOPages.ts.
 */

import type {
  StudioSEOConfig,
  StudioSEOFaq,
} from '@/components/seo-landing/StudioSEOPage';

export type SEOFaq = StudioSEOFaq;

/**
 * `StudioSEOConfig` carries the copy and its `locales` map; `id` is this
 * registry's own key. The shape used to be declared here, identically to the
 * media and payment registries, and identically again in the renderer.
 */
export type CryptoSEOPageConfig = StudioSEOConfig & { id: string };

/* ── Shared FAQ pools ────────────────────────────────────────────────────────── */

const WALLET_FAQS: SEOFaq[] = [
  { q: 'Are generated wallets real?', a: 'No. Generated wallets are structurally valid but should never be used for real funds. They are intended for development, testing, and educational purposes only.' },
  { q: 'Where is my data processed?', a: 'All generation happens entirely in your browser. No data is sent to any server. Generated private keys and mnemonics never leave your device.' },
  { q: 'How are wallet addresses generated?', a: 'We use the Web Crypto API for cryptographically secure random number generation, combined with elliptic curve cryptography (secp256k1) for public key derivation.' },
];

const WALLET_FAQS_RU: SEOFaq[] = [
  { q: 'Настоящие ли эти кошельки?', a: 'Нет. Кошельки структурно корректны, но их нельзя использовать для реальных средств. Они предназначены только для разработки, тестирования и обучения.' },
  { q: 'Где обрабатываются мои данные?', a: 'Вся генерация происходит целиком в вашем браузере. Никакие данные не уходят на сервер. Приватные ключи и мнемоники не покидают устройство.' },
  { q: 'Как генерируются адреса кошельков?', a: 'Мы используем Web Crypto API для криптографически стойкой генерации случайных чисел и эллиптическую криптографию (secp256k1) для вывода публичного ключа.' },
];

const WALLET_FAQS_DE: SEOFaq[] = [
  { q: 'Sind die erzeugten Wallets echt?', a: 'Nein. Sie sind strukturell gültig, dürfen aber niemals für echte Guthaben verwendet werden. Sie sind ausschließlich für Entwicklung, Tests und Lehre gedacht.' },
  { q: 'Wo werden meine Daten verarbeitet?', a: 'Die gesamte Erzeugung findet in Ihrem Browser statt. Es werden keine Daten an einen Server gesendet. Private Schlüssel und Mnemonics verlassen Ihr Gerät nie.' },
  { q: 'Wie werden die Adressen erzeugt?', a: 'Wir nutzen die Web Crypto API für kryptografisch sichere Zufallszahlen und elliptische Kurvenkryptografie (secp256k1) zur Ableitung des öffentlichen Schlüssels.' },
];

const WALLET_FAQS_ES: SEOFaq[] = [
  { q: '¿Son reales los monederos generados?', a: 'No. Son estructuralmente válidos, pero nunca deben usarse con fondos reales. Están pensados solo para desarrollo, pruebas y aprendizaje.' },
  { q: '¿Dónde se procesan mis datos?', a: 'Toda la generación ocurre íntegramente en su navegador. No se envía ningún dato a ningún servidor. Las claves privadas y las mnemónicas nunca salen de su dispositivo.' },
  { q: '¿Cómo se generan las direcciones?', a: 'Usamos la Web Crypto API para generar números aleatorios criptográficamente seguros, junto con criptografía de curva elíptica (secp256k1) para derivar la clave pública.' },
];

const WALLET_FAQS_FR: SEOFaq[] = [
  { q: 'Les portefeuilles générés sont-ils réels ?', a: 'Non. Ils sont structurellement valides mais ne doivent jamais servir à des fonds réels. Ils sont destinés au développement, aux tests et à l’apprentissage.' },
  { q: 'Où mes données sont-elles traitées ?', a: 'Toute la génération se fait entièrement dans votre navigateur. Aucune donnée n’est envoyée à un serveur. Les clés privées et les mnémoniques ne quittent jamais votre appareil.' },
  { q: 'Comment les adresses sont-elles générées ?', a: 'Nous utilisons la Web Crypto API pour un aléa cryptographiquement sûr, associée à la cryptographie sur courbe elliptique (secp256k1) pour dériver la clé publique.' },
];

const WALLET_FAQS_PT: SEOFaq[] = [
  { q: 'As carteiras geradas são reais?', a: 'Não. São estruturalmente válidas, mas nunca devem ser usadas com fundos reais. Destinam-se apenas a desenvolvimento, testes e aprendizado.' },
  { q: 'Onde os meus dados são processados?', a: 'Toda a geração acontece inteiramente no seu navegador. Nenhum dado é enviado para qualquer servidor. Chaves privadas e mnemônicas nunca saem do seu dispositivo.' },
  { q: 'Como os endereços são gerados?', a: 'Usamos a Web Crypto API para gerar números aleatórios criptograficamente seguros, junto com criptografia de curva elíptica (secp256k1) para derivar a chave pública.' },
];

const BITCOIN_FAQS: SEOFaq[] = [
  { q: 'What Bitcoin address formats are supported?', a: 'We support all four Bitcoin address formats: Legacy (P2PKH, starting with 1), SegWit (P2SH, starting with 3), Native SegWit (bech32, bc1), and Taproot (bech32m, bc1p).' },
  { q: 'Can I generate testnet Bitcoin addresses?', a: 'Yes. You can generate both mainnet and testnet Bitcoin addresses. Testnet addresses work with Bitcoin testnet faucets for development.' },
  { q: 'Are generated Bitcoin keys secure?', a: 'Keys are generated using the Web Crypto API\'s cryptographically secure random number generator. However, they are intended for testing — never use generated wallets for real Bitcoin.' },
];

const BITCOIN_FAQS_RU: SEOFaq[] = [
  { q: 'Какие форматы Bitcoin-адресов поддерживаются?', a: 'Все четыре: Legacy (P2PKH, начинается с 1), SegWit (P2SH, с 3), Native SegWit (bech32, bc1) и Taproot (bech32m, bc1p).' },
  { q: 'Можно ли генерировать адреса testnet?', a: 'Да. Доступны и mainnet, и testnet. Адреса testnet работают с публичными кранами Bitcoin для разработки.' },
  { q: 'Насколько безопасны сгенерированные ключи?', a: 'Ключи создаются генератором случайных чисел Web Crypto API. Но они предназначены для тестов — никогда не используйте их для реальных биткоинов.' },
];

const BITCOIN_FAQS_DE: SEOFaq[] = [
  { q: 'Welche Bitcoin-Adressformate werden unterstützt?', a: 'Alle vier: Legacy (P2PKH, beginnt mit 1), SegWit (P2SH, mit 3), Native SegWit (bech32, bc1) und Taproot (bech32m, bc1p).' },
  { q: 'Kann ich Testnet-Adressen erzeugen?', a: 'Ja. Mainnet und Testnet sind verfügbar. Testnet-Adressen funktionieren mit öffentlichen Bitcoin-Faucets für die Entwicklung.' },
  { q: 'Wie sicher sind die erzeugten Schlüssel?', a: 'Die Schlüssel entstehen mit dem kryptografisch sicheren Zufallsgenerator der Web Crypto API. Sie sind jedoch für Tests gedacht — nie für echte Bitcoin verwenden.' },
];

const BITCOIN_FAQS_ES: SEOFaq[] = [
  { q: '¿Qué formatos de dirección Bitcoin admite?', a: 'Los cuatro: Legacy (P2PKH, empieza por 1), SegWit (P2SH, por 3), Native SegWit (bech32, bc1) y Taproot (bech32m, bc1p).' },
  { q: '¿Puedo generar direcciones de testnet?', a: 'Sí. Puede generar tanto mainnet como testnet. Las direcciones de testnet funcionan con los faucets públicos de Bitcoin para desarrollo.' },
  { q: '¿Son seguras las claves generadas?', a: 'Las claves se generan con el generador de números aleatorios criptográficamente seguro de la Web Crypto API. Aun así, son para pruebas: nunca las use con bitcoin real.' },
];

const BITCOIN_FAQS_FR: SEOFaq[] = [
  { q: 'Quels formats d’adresse Bitcoin sont pris en charge ?', a: 'Les quatre : Legacy (P2PKH, commence par 1), SegWit (P2SH, par 3), Native SegWit (bech32, bc1) et Taproot (bech32m, bc1p).' },
  { q: 'Puis-je générer des adresses testnet ?', a: 'Oui. Mainnet et testnet sont disponibles. Les adresses testnet fonctionnent avec les faucets publics Bitcoin pour le développement.' },
  { q: 'Les clés générées sont-elles sûres ?', a: 'Les clés proviennent du générateur d’aléa cryptographiquement sûr de la Web Crypto API. Elles restent destinées aux tests : ne les utilisez jamais pour de vrais bitcoins.' },
];

const BITCOIN_FAQS_PT: SEOFaq[] = [
  { q: 'Quais formatos de endereço Bitcoin são suportados?', a: 'Os quatro: Legacy (P2PKH, começa com 1), SegWit (P2SH, com 3), Native SegWit (bech32, bc1) e Taproot (bech32m, bc1p).' },
  { q: 'Posso gerar endereços de testnet?', a: 'Sim. Estão disponíveis mainnet e testnet. Os endereços de testnet funcionam com os faucets públicos de Bitcoin para desenvolvimento.' },
  { q: 'As chaves geradas são seguras?', a: 'As chaves vêm do gerador de números aleatórios criptograficamente seguro da Web Crypto API. Ainda assim, são para testes: nunca as use com bitcoin real.' },
];

const ETHEREUM_FAQS: SEOFaq[] = [
  { q: 'What is an Ethereum address?', a: 'An Ethereum address is a 20-byte (40 hex character) identifier derived from the last 20 bytes of the Keccak-256 hash of the public key, prefixed with 0x.' },
  { q: 'What is EIP-55?', a: 'EIP-55 is a standard for mixed-case checksummed Ethereum addresses. It uses the Keccak-256 hash to determine which characters should be uppercase, providing error detection.' },
  { q: 'Can I generate testnet Ethereum addresses?', a: 'Yes. Generate addresses for Sepolia and Holesky testnets. These work with public faucets for development testing.' },
];

const ETHEREUM_FAQS_RU: SEOFaq[] = [
  { q: 'Что такое Ethereum-адрес?', a: 'Это идентификатор длиной 20 байт (40 шестнадцатеричных символов), полученный из последних 20 байт хеша Keccak-256 от публичного ключа, с префиксом 0x.' },
  { q: 'Что такое EIP-55?', a: 'Стандарт контрольной суммы для Ethereum-адресов через регистр букв. Хеш Keccak-256 определяет, какие символы писать заглавными, что позволяет находить опечатки.' },
  { q: 'Можно ли генерировать адреса тестовых сетей?', a: 'Да. Доступны Sepolia и Holesky. Такие адреса работают с публичными кранами для разработки.' },
];

const ETHEREUM_FAQS_DE: SEOFaq[] = [
  { q: 'Was ist eine Ethereum-Adresse?', a: 'Ein 20 Byte langer Bezeichner (40 Hex-Zeichen), abgeleitet aus den letzten 20 Byte des Keccak-256-Hashes des öffentlichen Schlüssels, mit dem Präfix 0x.' },
  { q: 'Was ist EIP-55?', a: 'Ein Prüfsummenstandard für Ethereum-Adressen über Groß- und Kleinschreibung. Der Keccak-256-Hash bestimmt, welche Zeichen groß geschrieben werden, und macht Tippfehler erkennbar.' },
  { q: 'Kann ich Testnetz-Adressen erzeugen?', a: 'Ja, für Sepolia und Holesky. Diese Adressen funktionieren mit öffentlichen Faucets für die Entwicklung.' },
];

const ETHEREUM_FAQS_ES: SEOFaq[] = [
  { q: '¿Qué es una dirección Ethereum?', a: 'Un identificador de 20 bytes (40 caracteres hexadecimales) derivado de los últimos 20 bytes del hash Keccak-256 de la clave pública, con el prefijo 0x.' },
  { q: '¿Qué es EIP-55?', a: 'Un estándar de suma de verificación para direcciones Ethereum basado en mayúsculas y minúsculas. El hash Keccak-256 decide qué caracteres van en mayúscula, lo que permite detectar errores.' },
  { q: '¿Puedo generar direcciones de redes de prueba?', a: 'Sí, para Sepolia y Holesky. Esas direcciones funcionan con los faucets públicos para desarrollo.' },
];

const ETHEREUM_FAQS_FR: SEOFaq[] = [
  { q: 'Qu’est-ce qu’une adresse Ethereum ?', a: 'Un identifiant de 20 octets (40 caractères hexadécimaux) dérivé des 20 derniers octets du hachage Keccak-256 de la clé publique, préfixé par 0x.' },
  { q: 'Qu’est-ce que l’EIP-55 ?', a: 'Une norme de somme de contrôle pour les adresses Ethereum fondée sur la casse. Le hachage Keccak-256 décide quels caractères sont en majuscules, ce qui révèle les fautes de frappe.' },
  { q: 'Puis-je générer des adresses de réseaux de test ?', a: 'Oui, pour Sepolia et Holesky. Ces adresses fonctionnent avec les faucets publics pour le développement.' },
];

const ETHEREUM_FAQS_PT: SEOFaq[] = [
  { q: 'O que é um endereço Ethereum?', a: 'Um identificador de 20 bytes (40 caracteres hexadecimais) derivado dos últimos 20 bytes do hash Keccak-256 da chave pública, com o prefixo 0x.' },
  { q: 'O que é o EIP-55?', a: 'Um padrão de checksum para endereços Ethereum baseado em maiúsculas e minúsculas. O hash Keccak-256 decide quais caracteres ficam maiúsculos, o que revela erros de digitação.' },
  { q: 'Posso gerar endereços de redes de teste?', a: 'Sim, para Sepolia e Holesky. Esses endereços funcionam com os faucets públicos para desenvolvimento.' },
];

const VALIDATOR_FAQS: SEOFaq[] = [
  { q: 'How does address validation work?', a: 'The validator checks multiple criteria: format detection (Base58, bech32, EIP-55), checksum verification, length validation, and network prefix matching.' },
  { q: 'What networks does the validator support?', a: 'All 22+ supported networks: Bitcoin, Ethereum, Litecoin, Dogecoin, Solana, Tron, Ripple, Cosmos, Cardano, and more.' },
  { q: 'Can I validate multiple addresses at once?', a: 'Yes. You can paste multiple addresses and validate them all at once, seeing results for each one.' },
];

const VALIDATOR_FAQS_RU: SEOFaq[] = [
  { q: 'Как работает проверка адреса?', a: 'Валидатор проверяет несколько признаков: определение формата (Base58, bech32, EIP-55), контрольную сумму, длину и префикс сети.' },
  { q: 'Какие сети поддерживает валидатор?', a: 'Все 22+ поддерживаемые сети: Bitcoin, Ethereum, Litecoin, Dogecoin, Solana, Tron, Ripple, Cosmos, Cardano и другие.' },
  { q: 'Можно ли проверить несколько адресов сразу?', a: 'Да. Вставьте список адресов — результат будет показан по каждому.' },
];

const VALIDATOR_FAQS_DE: SEOFaq[] = [
  { q: 'Wie funktioniert die Adressprüfung?', a: 'Der Validator prüft mehrere Merkmale: Formaterkennung (Base58, bech32, EIP-55), Prüfsumme, Länge und Netzwerkpräfix.' },
  { q: 'Welche Netzwerke unterstützt der Validator?', a: 'Alle 22+ unterstützten Netzwerke: Bitcoin, Ethereum, Litecoin, Dogecoin, Solana, Tron, Ripple, Cosmos, Cardano und weitere.' },
  { q: 'Kann ich mehrere Adressen auf einmal prüfen?', a: 'Ja. Fügen Sie eine Liste von Adressen ein — das Ergebnis erscheint für jede einzelne.' },
];

const VALIDATOR_FAQS_ES: SEOFaq[] = [
  { q: '¿Cómo funciona la validación?', a: 'El validador comprueba varios criterios: detección de formato (Base58, bech32, EIP-55), suma de verificación, longitud y prefijo de red.' },
  { q: '¿Qué redes admite el validador?', a: 'Las más de 22 redes compatibles: Bitcoin, Ethereum, Litecoin, Dogecoin, Solana, Tron, Ripple, Cosmos, Cardano y otras.' },
  { q: '¿Puedo validar varias direcciones a la vez?', a: 'Sí. Pegue una lista de direcciones y verá el resultado de cada una.' },
];

const VALIDATOR_FAQS_FR: SEOFaq[] = [
  { q: 'Comment fonctionne la validation ?', a: 'Le validateur contrôle plusieurs critères : détection du format (Base58, bech32, EIP-55), somme de contrôle, longueur et préfixe réseau.' },
  { q: 'Quels réseaux le validateur prend-il en charge ?', a: 'Les 22+ réseaux pris en charge : Bitcoin, Ethereum, Litecoin, Dogecoin, Solana, Tron, Ripple, Cosmos, Cardano et d’autres.' },
  { q: 'Puis-je valider plusieurs adresses à la fois ?', a: 'Oui. Collez une liste d’adresses et le résultat s’affiche pour chacune.' },
];

const VALIDATOR_FAQS_PT: SEOFaq[] = [
  { q: 'Como funciona a validação?', a: 'O validador verifica vários critérios: detecção de formato (Base58, bech32, EIP-55), checksum, comprimento e prefixo de rede.' },
  { q: 'Quais redes o validador suporta?', a: 'As mais de 22 redes compatíveis: Bitcoin, Ethereum, Litecoin, Dogecoin, Solana, Tron, Ripple, Cosmos, Cardano e outras.' },
  { q: 'Posso validar vários endereços de uma vez?', a: 'Sim. Cole uma lista de endereços e verá o resultado de cada um.' },
];

const MNEMONIC_FAQS: SEOFaq[] = [
  { q: 'What is a BIP39 mnemonic?', a: 'A BIP39 mnemonic is a sequence of words that encodes the entropy used to generate a wallet\'s master key. It\'s the standard for wallet backups across all major cryptocurrency wallets.' },
  { q: 'How many words should I use?', a: '12 words (128-bit security) is sufficient for most purposes. 24 words (256-bit security) provides extra security margin. We support 12, 15, 18, 21, and 24 words.' },
  { q: 'Are generated mnemonics secure?', a: 'Yes. They are generated using cryptographically secure randomness. However, they are intended for testing — never use generated mnemonics for real wallets.' },
];

const MNEMONIC_FAQS_RU: SEOFaq[] = [
  { q: 'Что такое мнемоника BIP39?', a: 'Последовательность слов, кодирующая энтропию, из которой выводится мастер-ключ кошелька. Это стандарт резервных копий во всех крупных криптокошельках.' },
  { q: 'Сколько слов выбрать?', a: '12 слов (128 бит) достаточно для большинства задач. 24 слова (256 бит) дают запас прочности. Доступны 12, 15, 18, 21 и 24 слова.' },
  { q: 'Безопасны ли сгенерированные мнемоники?', a: 'Да, они создаются криптографически стойким генератором. Но они предназначены для тестов — не используйте их для настоящих кошельков.' },
];

const MNEMONIC_FAQS_DE: SEOFaq[] = [
  { q: 'Was ist ein BIP39-Mnemonic?', a: 'Eine Wortfolge, die die Entropie kodiert, aus der der Hauptschlüssel eines Wallets abgeleitet wird. Sie ist der Standard für Backups in allen großen Krypto-Wallets.' },
  { q: 'Wie viele Wörter soll ich wählen?', a: '12 Wörter (128 Bit) genügen für die meisten Zwecke. 24 Wörter (256 Bit) bieten zusätzliche Sicherheit. Verfügbar sind 12, 15, 18, 21 und 24 Wörter.' },
  { q: 'Sind die erzeugten Mnemonics sicher?', a: 'Ja, sie entstehen mit kryptografisch sicherem Zufall. Sie sind jedoch für Tests gedacht — verwenden Sie sie nie für echte Wallets.' },
];

const MNEMONIC_FAQS_ES: SEOFaq[] = [
  { q: '¿Qué es una mnemónica BIP39?', a: 'Una secuencia de palabras que codifica la entropía de la que se deriva la clave maestra del monedero. Es el estándar de copia de seguridad en los principales monederos.' },
  { q: '¿Cuántas palabras conviene usar?', a: '12 palabras (128 bits) bastan para la mayoría de los casos. 24 palabras (256 bits) dan margen adicional. Están disponibles 12, 15, 18, 21 y 24.' },
  { q: '¿Son seguras las mnemónicas generadas?', a: 'Sí, se crean con aleatoriedad criptográficamente segura. Aun así son para pruebas: no las use en monederos reales.' },
];

const MNEMONIC_FAQS_FR: SEOFaq[] = [
  { q: 'Qu’est-ce qu’une mnémonique BIP39 ?', a: 'Une suite de mots qui encode l’entropie dont dérive la clé maîtresse du portefeuille. C’est la norme de sauvegarde dans tous les grands portefeuilles crypto.' },
  { q: 'Combien de mots choisir ?', a: '12 mots (128 bits) suffisent dans la plupart des cas. 24 mots (256 bits) offrent une marge supplémentaire. 12, 15, 18, 21 et 24 sont disponibles.' },
  { q: 'Les mnémoniques générées sont-elles sûres ?', a: 'Oui, elles sont produites avec un aléa cryptographiquement sûr. Elles restent destinées aux tests : ne les utilisez pas pour de vrais portefeuilles.' },
];

const MNEMONIC_FAQS_PT: SEOFaq[] = [
  { q: 'O que é uma mnemônica BIP39?', a: 'Uma sequência de palavras que codifica a entropia da qual deriva a chave mestra da carteira. É o padrão de backup nas principais carteiras cripto.' },
  { q: 'Quantas palavras devo usar?', a: '12 palavras (128 bits) bastam na maioria dos casos. 24 palavras (256 bits) dão margem extra. Estão disponíveis 12, 15, 18, 21 e 24.' },
  { q: 'As mnemônicas geradas são seguras?', a: 'Sim, são criadas com aleatoriedade criptograficamente segura. Ainda assim são para testes: não as use em carteiras reais.' },
];

const HD_FAQS: SEOFaq[] = [
  { q: 'What is an HD wallet?', a: 'A Hierarchical Deterministic (HD) wallet derives all keys from a single seed phrase using the BIP32 standard. This means you only need to back up one seed phrase.' },
  { q: 'What is BIP44?', a: 'BIP44 defines a standardized derivation path structure: m/purpose\'/coin_type\'/account\'/change/address_index. This ensures compatibility across different wallet software.' },
  { q: 'What is a derivation path?', a: 'A derivation path navigates the HD wallet tree to reach a specific key. For example, m/44\'/0\'/0\'/0/0 points to the first receiving address of the first Bitcoin account.' },
];

const HD_FAQS_RU: SEOFaq[] = [
  { q: 'Что такое HD-кошелёк?', a: 'Иерархический детерминированный кошелёк выводит все ключи из одной seed-фразы по стандарту BIP32. Достаточно сохранить только её.' },
  { q: 'Что такое BIP44?', a: 'BIP44 задаёт стандартную структуру пути деривации: m/purpose\\\'/coin_type\\\'/account\\\'/change/address_index. Это обеспечивает совместимость между разными кошельками.' },
  { q: 'Что такое путь деривации?', a: 'Путь указывает, как пройти по дереву HD-кошелька до нужного ключа. Например, m/44\\\'/0\\\'/0\\\'/0/0 — первый адрес получения первого Bitcoin-аккаунта.' },
];

const HD_FAQS_DE: SEOFaq[] = [
  { q: 'Was ist ein HD-Wallet?', a: 'Ein hierarchisch deterministisches Wallet leitet alle Schlüssel aus einer einzigen Seed-Phrase nach BIP32 ab. Nur diese eine Phrase muss gesichert werden.' },
  { q: 'Was ist BIP44?', a: 'BIP44 legt eine standardisierte Pfadstruktur fest: m/purpose\\\'/coin_type\\\'/account\\\'/change/address_index. Das sichert die Kompatibilität zwischen Wallet-Programmen.' },
  { q: 'Was ist ein Ableitungspfad?', a: 'Ein Pfad beschreibt den Weg durch den Baum des HD-Wallets zu einem bestimmten Schlüssel. m/44\\\'/0\\\'/0\\\'/0/0 ist etwa die erste Empfangsadresse des ersten Bitcoin-Kontos.' },
];

const HD_FAQS_ES: SEOFaq[] = [
  { q: '¿Qué es un monedero HD?', a: 'Un monedero determinista jerárquico deriva todas las claves de una sola frase semilla según BIP32. Basta con respaldar esa frase.' },
  { q: '¿Qué es BIP44?', a: 'BIP44 define una estructura de ruta estandarizada: m/purpose\\\'/coin_type\\\'/account\\\'/change/address_index. Eso garantiza compatibilidad entre programas de monedero.' },
  { q: '¿Qué es una ruta de derivación?', a: 'Una ruta indica cómo recorrer el árbol del monedero HD hasta una clave concreta. Por ejemplo, m/44\\\'/0\\\'/0\\\'/0/0 es la primera dirección de recepción de la primera cuenta Bitcoin.' },
];

const HD_FAQS_FR: SEOFaq[] = [
  { q: 'Qu’est-ce qu’un portefeuille HD ?', a: 'Un portefeuille déterministe hiérarchique dérive toutes ses clés d’une seule phrase de récupération, selon BIP32. Il suffit de sauvegarder cette phrase.' },
  { q: 'Qu’est-ce que BIP44 ?', a: 'BIP44 définit une structure de chemin normalisée : m/purpose\\\'/coin_type\\\'/account\\\'/change/address_index. Cela garantit la compatibilité entre les logiciels de portefeuille.' },
  { q: 'Qu’est-ce qu’un chemin de dérivation ?', a: 'Un chemin décrit le parcours dans l’arbre du portefeuille HD jusqu’à une clé donnée. Par exemple, m/44\\\'/0\\\'/0\\\'/0/0 est la première adresse de réception du premier compte Bitcoin.' },
];

const HD_FAQS_PT: SEOFaq[] = [
  { q: 'O que é uma carteira HD?', a: 'Uma carteira determinística hierárquica deriva todas as chaves de uma única frase semente, segundo o BIP32. Basta guardar essa frase.' },
  { q: 'O que é o BIP44?', a: 'O BIP44 define uma estrutura de caminho padronizada: m/purpose\\\'/coin_type\\\'/account\\\'/change/address_index. Isso garante compatibilidade entre programas de carteira.' },
  { q: 'O que é um caminho de derivação?', a: 'Um caminho descreve o percurso na árvore da carteira HD até uma chave específica. Por exemplo, m/44\\\'/0\\\'/0\\\'/0/0 é o primeiro endereço de recebimento da primeira conta Bitcoin.' },
];

const QR_FAQS: SEOFaq[] = [
  { q: 'What is a crypto payment URI?', a: 'A crypto payment URI encodes a payment request in a format like bitcoin:address?amount=0.01. It can be scanned by wallet apps to auto-fill payment details.' },
  { q: 'Which URI schemes are supported?', a: 'We support bitcoin:, ethereum:, litecoin:, dogecoin:, solana:, tron:, ripple:, monero:, polkadot:, cardano:, cosmos:, near:, and ton: URI schemes.' },
  { q: 'Can I scan the QR code?', a: 'Yes. The QR code can be scanned by any cryptocurrency wallet app that supports the respective URI scheme.' },
];

const QR_FAQS_RU: SEOFaq[] = [
  { q: 'Что такое платёжная ссылка криптовалюты?', a: 'Это запрос на оплату в виде ссылки, например bitcoin:адрес?amount=0.01. Кошельки сканируют её и подставляют реквизиты автоматически.' },
  { q: 'Какие схемы поддерживаются?', a: 'bitcoin:, ethereum:, litecoin:, dogecoin:, solana:, tron:, ripple:, monero:, polkadot:, cardano:, cosmos:, near: и ton:.' },
  { q: 'Можно ли отсканировать QR-код?', a: 'Да. Код читает любое приложение-кошелёк, поддерживающее соответствующую схему ссылки.' },
];

const QR_FAQS_DE: SEOFaq[] = [
  { q: 'Was ist eine Krypto-Zahlungs-URI?', a: 'Eine Zahlungsanforderung als Link, etwa bitcoin:adresse?amount=0.01. Wallet-Apps scannen sie und füllen die Zahlungsdaten automatisch aus.' },
  { q: 'Welche URI-Schemata werden unterstützt?', a: 'bitcoin:, ethereum:, litecoin:, dogecoin:, solana:, tron:, ripple:, monero:, polkadot:, cardano:, cosmos:, near: und ton:.' },
  { q: 'Kann ich den QR-Code scannen?', a: 'Ja. Jede Wallet-App, die das jeweilige URI-Schema unterstützt, kann ihn lesen.' },
];

const QR_FAQS_ES: SEOFaq[] = [
  { q: '¿Qué es una URI de pago cripto?', a: 'Una solicitud de pago en forma de enlace, por ejemplo bitcoin:dirección?amount=0.01. Las apps de monedero la escanean y rellenan los datos automáticamente.' },
  { q: '¿Qué esquemas de URI admite?', a: 'bitcoin:, ethereum:, litecoin:, dogecoin:, solana:, tron:, ripple:, monero:, polkadot:, cardano:, cosmos:, near: y ton:.' },
  { q: '¿Se puede escanear el código QR?', a: 'Sí. Lo lee cualquier aplicación de monedero compatible con el esquema de URI correspondiente.' },
];

const QR_FAQS_FR: SEOFaq[] = [
  { q: 'Qu’est-ce qu’une URI de paiement crypto ?', a: 'Une demande de paiement sous forme de lien, par exemple bitcoin:adresse?amount=0.01. Les applications de portefeuille la scannent et remplissent les champs automatiquement.' },
  { q: 'Quels schémas d’URI sont pris en charge ?', a: 'bitcoin:, ethereum:, litecoin:, dogecoin:, solana:, tron:, ripple:, monero:, polkadot:, cardano:, cosmos:, near: et ton:.' },
  { q: 'Peut-on scanner le QR code ?', a: 'Oui. Toute application de portefeuille compatible avec le schéma d’URI concerné peut le lire.' },
];

const QR_FAQS_PT: SEOFaq[] = [
  { q: 'O que é uma URI de pagamento cripto?', a: 'Um pedido de pagamento em forma de link, por exemplo bitcoin:endereço?amount=0.01. Os aplicativos de carteira a escaneiam e preenchem os dados automaticamente.' },
  { q: 'Quais esquemas de URI são suportados?', a: 'bitcoin:, ethereum:, litecoin:, dogecoin:, solana:, tron:, ripple:, monero:, polkadot:, cardano:, cosmos:, near: e ton:.' },
  { q: 'É possível escanear o QR code?', a: 'Sim. Qualquer aplicativo de carteira compatível com o esquema de URI correspondente consegue lê-lo.' },
];

const PLAYGROUND_FAQS: SEOFaq[] = [
  { q: 'What is the Crypto Wallet Playground?', a: 'An educational and professional tool for developers, QA engineers, and Web3 enthusiasts. It generates, validates, analyzes, and explores cryptocurrency wallet addresses for 22+ blockchains. It is NOT a real crypto wallet.' },
  { q: 'Is this tool safe?', a: 'Yes. All operations happen locally in your browser using the Web Crypto API. No data is ever sent to any server. The tool explicitly warns users not to use generated data for real funds.' },
  { q: 'What can I do with this tool?', a: 'Generate wallet addresses, create BIP39 mnemonics, validate and analyze addresses, convert between formats, explore HD wallet derivation trees, generate payment QR codes, and learn about blockchain security.' },
];

const PLAYGROUND_FAQS_RU: SEOFaq[] = [
  { q: 'Что такое Crypto Wallet Playground?', a: 'Учебный и рабочий инструмент для разработчиков, тестировщиков и энтузиастов Web3. Он генерирует, проверяет, анализирует и разбирает адреса кошельков для 22+ блокчейнов. Это НЕ настоящий криптокошелёк.' },
  { q: 'Безопасен ли этот инструмент?', a: 'Да. Все операции выполняются локально в браузере через Web Crypto API. Данные никуда не отправляются. Инструмент прямо предупреждает: не используйте полученные данные для реальных средств.' },
  { q: 'Что здесь можно сделать?', a: 'Генерировать адреса кошельков, создавать мнемоники BIP39, проверять и анализировать адреса, конвертировать форматы, изучать деревья деривации HD, делать платёжные QR-коды и разбираться в безопасности блокчейна.' },
];

const PLAYGROUND_FAQS_DE: SEOFaq[] = [
  { q: 'Was ist das Crypto Wallet Playground?', a: 'Ein Lern- und Arbeitswerkzeug für Entwickler, QA-Ingenieure und Web3-Interessierte. Es erzeugt, prüft, analysiert und erkundet Wallet-Adressen für 22+ Blockchains. Es ist KEIN echtes Krypto-Wallet.' },
  { q: 'Ist dieses Werkzeug sicher?', a: 'Ja. Alle Operationen laufen lokal im Browser über die Web Crypto API. Es werden keine Daten gesendet. Das Werkzeug warnt ausdrücklich davor, die Ergebnisse für echte Guthaben zu verwenden.' },
  { q: 'Was kann ich damit machen?', a: 'Wallet-Adressen erzeugen, BIP39-Mnemonics erstellen, Adressen prüfen und analysieren, Formate umwandeln, HD-Ableitungsbäume erkunden, Zahlungs-QR-Codes erzeugen und Blockchain-Sicherheit verstehen.' },
];

const PLAYGROUND_FAQS_ES: SEOFaq[] = [
  { q: '¿Qué es el Crypto Wallet Playground?', a: 'Una herramienta educativa y profesional para desarrolladores, ingenieros de QA y entusiastas de Web3. Genera, valida, analiza y explora direcciones de monedero de más de 22 blockchains. NO es un monedero real.' },
  { q: '¿Es segura esta herramienta?', a: 'Sí. Todas las operaciones se ejecutan localmente en el navegador mediante la Web Crypto API. No se envía ningún dato. La herramienta advierte explícitamente de no usar los datos generados con fondos reales.' },
  { q: '¿Qué puedo hacer con ella?', a: 'Generar direcciones, crear mnemónicas BIP39, validar y analizar direcciones, convertir formatos, explorar árboles de derivación HD, generar códigos QR de pago y aprender sobre seguridad en blockchain.' },
];

const PLAYGROUND_FAQS_FR: SEOFaq[] = [
  { q: 'Qu’est-ce que le Crypto Wallet Playground ?', a: 'Un outil pédagogique et professionnel pour les développeurs, les ingénieurs QA et les passionnés de Web3. Il génère, valide, analyse et explore des adresses de portefeuille sur 22+ blockchains. Ce n’est PAS un vrai portefeuille.' },
  { q: 'Cet outil est-il sûr ?', a: 'Oui. Toutes les opérations s’exécutent localement dans le navigateur via la Web Crypto API. Aucune donnée n’est envoyée. L’outil avertit explicitement de ne pas utiliser les données générées avec des fonds réels.' },
  { q: 'Que puis-je en faire ?', a: 'Générer des adresses, créer des mnémoniques BIP39, valider et analyser des adresses, convertir des formats, explorer les arbres de dérivation HD, produire des QR codes de paiement et comprendre la sécurité blockchain.' },
];

const PLAYGROUND_FAQS_PT: SEOFaq[] = [
  { q: 'O que é o Crypto Wallet Playground?', a: 'Uma ferramenta educativa e profissional para desenvolvedores, engenheiros de QA e entusiastas de Web3. Ela gera, valida, analisa e explora endereços de carteira de mais de 22 blockchains. NÃO é uma carteira real.' },
  { q: 'Esta ferramenta é segura?', a: 'Sim. Todas as operações são executadas localmente no navegador via Web Crypto API. Nenhum dado é enviado. A ferramenta avisa explicitamente para não usar os dados gerados com fundos reais.' },
  { q: 'O que posso fazer com ela?', a: 'Gerar endereços, criar mnemônicas BIP39, validar e analisar endereços, converter formatos, explorar árvores de derivação HD, gerar QR codes de pagamento e aprender sobre segurança em blockchain.' },
];

/* ── SEO Pages ───────────────────────────────────────────────────────────────── */

const WALLET_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'crypto-wallet-generator',
  slug: 'crypto-wallet-generator',
  title: 'Crypto Wallet Generator — 22+ Blockchains',
  description: 'Generate test cryptocurrency wallet addresses for Bitcoin, Ethereum, Solana and 20 more blockchains. Free, in your browser, for development and testing.',
  heroTitle: 'Crypto Wallet Address Generator',
  heroSubtitle: 'Generate test wallet addresses for 22+ blockchains. All formats, all networks — 100% client-side.',
  ctaLabel: 'Generate Wallets',
  faqs: WALLET_FAQS,
  locales: {
    ru: {
      faqs: WALLET_FAQS_RU,
      ctaLabel: 'Сгенерировать кошельки',
      title: 'Генератор криптокошельков — 22+ сети',
      description: 'Генерируйте тестовые адреса криптокошельков для Bitcoin, Ethereum, Solana и ещё 20 сетей. Бесплатно, прямо в браузере, для разработки и тестирования.',
      heroTitle: 'Генератор адресов криптокошельков',
      heroSubtitle: 'Тестовые адреса для 22+ блокчейнов. Все форматы, все сети — полностью в браузере.',
    },
    de: {
      faqs: WALLET_FAQS_DE,
      ctaLabel: 'Wallets erzeugen',
      title: 'Krypto-Wallet-Generator — 22+ Blockchains',
      description: 'Erzeugen Sie Test-Wallet-Adressen für Bitcoin, Ethereum, Solana und 20 weitere Blockchains. Kostenlos, direkt im Browser, für Entwicklung und Tests.',
      heroTitle: 'Krypto-Wallet-Adressgenerator',
      heroSubtitle: 'Test-Adressen für 22+ Blockchains. Alle Formate, alle Netze — vollständig im Browser.',
    },
    es: {
      faqs: WALLET_FAQS_ES,
      ctaLabel: 'Generar monederos',
      title: 'Generador de monederos cripto — 22+ redes',
      description: 'Genere direcciones de monedero de prueba para Bitcoin, Ethereum, Solana y 20 redes más. Gratis, en el navegador, para desarrollo y pruebas.',
      heroTitle: 'Generador de direcciones de monedero cripto',
      heroSubtitle: 'Direcciones de prueba para más de 22 blockchains. Todos los formatos y redes — todo en el navegador.',
    },
    fr: {
      faqs: WALLET_FAQS_FR,
      ctaLabel: 'Générer des portefeuilles',
      title: 'Générateur de portefeuilles crypto — 22+ réseaux',
      description: 'Générez des adresses de portefeuille de test pour Bitcoin, Ethereum, Solana et 20 autres réseaux. Gratuit, dans le navigateur, pour le développement.',
      heroTitle: 'Générateur d’adresses de portefeuille crypto',
      heroSubtitle: 'Adresses de test pour 22+ blockchains. Tous les formats, tous les réseaux — entièrement dans le navigateur.',
    },
    pt: {
      faqs: WALLET_FAQS_PT,
      ctaLabel: 'Gerar carteiras',
      title: 'Gerador de carteiras cripto — 22+ redes',
      description: 'Gere endereços de carteira de teste para Bitcoin, Ethereum, Solana e mais 20 redes. Grátis, no navegador, para desenvolvimento e testes.',
      heroTitle: 'Gerador de endereços de carteira cripto',
      heroSubtitle: 'Endereços de teste para mais de 22 blockchains. Todos os formatos e redes — tudo no navegador.',
    },
  },
};

const BITCOIN_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'bitcoin-address-generator',
  slug: 'bitcoin-address-generator',
  title: 'Bitcoin Address Generator — Test BTC Addresses',
  description: 'Generate test Bitcoin addresses in Legacy, SegWit, Native SegWit and Taproot formats. Free, in your browser — keys never leave your device.',
  heroTitle: 'Bitcoin Address Generator',
  heroSubtitle: 'Generate test Bitcoin addresses in all four formats: Legacy (1...), SegWit (3...), Native SegWit (bc1) and Taproot (bc1p).',
  ctaLabel: 'Generate Bitcoin Addresses',
  faqs: BITCOIN_FAQS,
  locales: {
    ru: {
      faqs: BITCOIN_FAQS_RU,
      ctaLabel: 'Сгенерировать Bitcoin-адреса',
      title: 'Генератор Bitcoin-адресов для тестов',
      description: 'Генерируйте тестовые Bitcoin-адреса в форматах Legacy, SegWit, Native SegWit и Taproot. Бесплатно, прямо в браузере — ключи не покидают устройство.',
      heroTitle: 'Генератор Bitcoin-адресов',
      heroSubtitle: 'Тестовые Bitcoin-адреса во всех четырёх форматах: Legacy (1...), SegWit (3...), Native SegWit (bc1) и Taproot (bc1p).',
    },
    de: {
      faqs: BITCOIN_FAQS_DE,
      ctaLabel: 'Bitcoin-Adressen erzeugen',
      title: 'Bitcoin-Adressgenerator für Tests',
      description: 'Erzeugen Sie Bitcoin-Testadressen in den Formaten Legacy, SegWit, Native SegWit und Taproot. Kostenlos im Browser — Schlüssel verlassen das Gerät nie.',
      heroTitle: 'Bitcoin-Adressgenerator',
      heroSubtitle: 'Bitcoin-Testadressen in allen vier Formaten: Legacy (1...), SegWit (3...), Native SegWit (bc1) und Taproot (bc1p).',
    },
    es: {
      faqs: BITCOIN_FAQS_ES,
      ctaLabel: 'Generar direcciones Bitcoin',
      title: 'Generador de direcciones Bitcoin de prueba',
      description: 'Genere direcciones Bitcoin de prueba en formatos Legacy, SegWit, Native SegWit y Taproot. Gratis, en el navegador; las claves no salen del dispositivo.',
      heroTitle: 'Generador de direcciones Bitcoin',
      heroSubtitle: 'Direcciones Bitcoin de prueba en los cuatro formatos: Legacy (1...), SegWit (3...), Native SegWit (bc1) y Taproot (bc1p).',
    },
    fr: {
      faqs: BITCOIN_FAQS_FR,
      ctaLabel: 'Générer des adresses Bitcoin',
      title: 'Générateur d’adresses Bitcoin de test',
      description: 'Générez des adresses Bitcoin de test aux formats Legacy, SegWit, Native SegWit et Taproot. Gratuit, dans le navigateur ; les clés ne sortent jamais.',
      heroTitle: 'Générateur d’adresses Bitcoin',
      heroSubtitle: 'Adresses Bitcoin de test dans les quatre formats : Legacy (1...), SegWit (3...), Native SegWit (bc1) et Taproot (bc1p).',
    },
    pt: {
      faqs: BITCOIN_FAQS_PT,
      ctaLabel: 'Gerar endereços Bitcoin',
      title: 'Gerador de endereços Bitcoin de teste',
      description: 'Gere endereços Bitcoin de teste nos formatos Legacy, SegWit, Native SegWit e Taproot. Grátis, no navegador; as chaves não saem do dispositivo.',
      heroTitle: 'Gerador de endereços Bitcoin',
      heroSubtitle: 'Endereços Bitcoin de teste nos quatro formatos: Legacy (1...), SegWit (3...), Native SegWit (bc1) e Taproot (bc1p).',
    },
  },
};

const ETHEREUM_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'ethereum-address-generator',
  slug: 'ethereum-address-generator',
  title: 'Ethereum Address Generator — Test ETH Addresses',
  description: 'Generate test Ethereum addresses with EIP-55 checksum. Also works for BNB Chain, Polygon and Avalanche. Free, in your browser.',
  heroTitle: 'Ethereum Address Generator',
  heroSubtitle: 'Generate test Ethereum addresses with EIP-55 mixed-case checksum. Also compatible with BNB Chain, Polygon, Avalanche and other EVM networks.',
  ctaLabel: 'Generate Ethereum Addresses',
  faqs: ETHEREUM_FAQS,
  locales: {
    ru: {
      faqs: ETHEREUM_FAQS_RU,
      ctaLabel: 'Сгенерировать Ethereum-адреса',
      title: 'Генератор Ethereum-адресов для тестов',
      description: 'Генерируйте тестовые Ethereum-адреса с контрольной суммой EIP-55. Работает и для BNB Chain, Polygon, Avalanche. Бесплатно, прямо в браузере.',
      heroTitle: 'Генератор Ethereum-адресов',
      heroSubtitle: 'Тестовые Ethereum-адреса с контрольной суммой EIP-55. Совместимы с BNB Chain, Polygon, Avalanche и другими EVM-сетями.',
    },
    de: {
      faqs: ETHEREUM_FAQS_DE,
      ctaLabel: 'Ethereum-Adressen erzeugen',
      title: 'Ethereum-Adressgenerator für Tests',
      description: 'Erzeugen Sie Ethereum-Testadressen mit EIP-55-Prüfsumme. Auch für BNB Chain, Polygon und Avalanche. Kostenlos, direkt im Browser.',
      heroTitle: 'Ethereum-Adressgenerator',
      heroSubtitle: 'Ethereum-Testadressen mit EIP-55-Prüfsumme in gemischter Schreibweise. Kompatibel mit BNB Chain, Polygon, Avalanche und weiteren EVM-Netzen.',
    },
    es: {
      faqs: ETHEREUM_FAQS_ES,
      ctaLabel: 'Generar direcciones Ethereum',
      title: 'Generador de direcciones Ethereum de prueba',
      description: 'Genere direcciones Ethereum de prueba con suma de verificación EIP-55. También para BNB Chain, Polygon y Avalanche. Gratis, en el navegador.',
      heroTitle: 'Generador de direcciones Ethereum',
      heroSubtitle: 'Direcciones Ethereum de prueba con suma EIP-55 en mayúsculas y minúsculas. Compatibles con BNB Chain, Polygon, Avalanche y otras redes EVM.',
    },
    fr: {
      faqs: ETHEREUM_FAQS_FR,
      ctaLabel: 'Générer des adresses Ethereum',
      title: 'Générateur d’adresses Ethereum de test',
      description: 'Générez des adresses Ethereum de test avec somme de contrôle EIP-55. Compatible BNB Chain, Polygon, Avalanche. Gratuit, dans le navigateur.',
      heroTitle: 'Générateur d’adresses Ethereum',
      heroSubtitle: 'Adresses Ethereum de test avec somme de contrôle EIP-55. Compatibles BNB Chain, Polygon, Avalanche et autres réseaux EVM.',
    },
    pt: {
      faqs: ETHEREUM_FAQS_PT,
      ctaLabel: 'Gerar endereços Ethereum',
      title: 'Gerador de endereços Ethereum de teste',
      description: 'Gere endereços Ethereum de teste com checksum EIP-55. Compatível com BNB Chain, Polygon e Avalanche. Grátis, no navegador.',
      heroTitle: 'Gerador de endereços Ethereum',
      heroSubtitle: 'Endereços Ethereum de teste com checksum EIP-55. Compatíveis com BNB Chain, Polygon, Avalanche e outras redes EVM.',
    },
  },
};

const WALLET_VALIDATOR_PAGE: CryptoSEOPageConfig = {
  id: 'wallet-validator',
  slug: 'wallet-validator',
  title: 'Crypto Wallet Validator — 22+ Blockchains',
  description: 'Validate cryptocurrency wallet addresses across 22+ blockchains: format, checksum, prefix and length. Free, in your browser.',
  heroTitle: 'Crypto Wallet Address Validator',
  heroSubtitle: 'Validate addresses across 22+ blockchains. Detects format, checksum validity, network and encoding.',
  ctaLabel: 'Validate Addresses',
  faqs: VALIDATOR_FAQS,
  locales: {
    ru: {
      faqs: VALIDATOR_FAQS_RU,
      ctaLabel: 'Проверить адреса',
      title: 'Проверка криптоадресов — 22+ сети',
      description: 'Проверяйте адреса криптокошельков в 22+ блокчейнах: формат, контрольная сумма, префикс и длина. Бесплатно, прямо в браузере.',
      heroTitle: 'Валидатор криптоадресов',
      heroSubtitle: 'Проверка адресов в 22+ блокчейнах. Определяет формат, корректность контрольной суммы, сеть и кодировку.',
    },
    de: {
      faqs: VALIDATOR_FAQS_DE,
      ctaLabel: 'Adressen prüfen',
      title: 'Krypto-Adressprüfer — 22+ Blockchains',
      description: 'Prüfen Sie Wallet-Adressen in 22+ Blockchains: Format, Prüfsumme, Präfix und Länge. Kostenlos, direkt im Browser.',
      heroTitle: 'Krypto-Adressvalidator',
      heroSubtitle: 'Adressprüfung über 22+ Blockchains. Erkennt Format, Gültigkeit der Prüfsumme, Netzwerk und Kodierung.',
    },
    es: {
      faqs: VALIDATOR_FAQS_ES,
      ctaLabel: 'Validar direcciones',
      title: 'Validador de direcciones cripto — 22+ redes',
      description: 'Valide direcciones de monedero en más de 22 blockchains: formato, suma de verificación, prefijo y longitud. Gratis, en el navegador.',
      heroTitle: 'Validador de direcciones cripto',
      heroSubtitle: 'Validación de direcciones en más de 22 blockchains. Detecta formato, validez de la suma, red y codificación.',
    },
    fr: {
      faqs: VALIDATOR_FAQS_FR,
      ctaLabel: 'Valider des adresses',
      title: 'Validateur d’adresses crypto — 22+ réseaux',
      description: 'Validez des adresses de portefeuille sur 22+ blockchains : format, somme de contrôle, préfixe et longueur. Gratuit, dans le navigateur.',
      heroTitle: 'Validateur d’adresses crypto',
      heroSubtitle: 'Validation d’adresses sur 22+ blockchains. Détecte le format, la validité de la somme de contrôle, le réseau et l’encodage.',
    },
    pt: {
      faqs: VALIDATOR_FAQS_PT,
      ctaLabel: 'Validar endereços',
      title: 'Validador de endereços cripto — 22+ redes',
      description: 'Valide endereços de carteira em mais de 22 blockchains: formato, checksum, prefixo e comprimento. Grátis, no navegador.',
      heroTitle: 'Validador de endereços cripto',
      heroSubtitle: 'Validação de endereços em mais de 22 blockchains. Detecta formato, validade do checksum, rede e codificação.',
    },
  },
};

const BITCOIN_VALIDATOR_PAGE: CryptoSEOPageConfig = {
  id: 'bitcoin-validator',
  slug: 'bitcoin-validator',
  title: 'Bitcoin Address Validator — Check BTC Validity',
  description: 'Validate Bitcoin addresses in Legacy, SegWit, Native SegWit and Taproot formats. Checks Base58Check and bech32 encoding.',
  heroTitle: 'Bitcoin Address Validator',
  heroSubtitle: 'Validate any Bitcoin address format — Legacy, SegWit, Native SegWit or Taproot — with full checksum verification.',
  ctaLabel: 'Validate Bitcoin Address',
  faqs: BITCOIN_FAQS.concat(VALIDATOR_FAQS),
  locales: {
    ru: {
      faqs: BITCOIN_FAQS_RU.concat(VALIDATOR_FAQS_RU),
      ctaLabel: 'Проверить Bitcoin-адрес',
      title: 'Проверка Bitcoin-адреса',
      description: 'Проверяйте Bitcoin-адреса форматов Legacy, SegWit, Native SegWit и Taproot. Контроль кодировки Base58Check и bech32.',
      heroTitle: 'Валидатор Bitcoin-адресов',
      heroSubtitle: 'Проверка любого формата Bitcoin-адреса — Legacy, SegWit, Native SegWit или Taproot — с полной проверкой контрольной суммы.',
    },
    de: {
      faqs: BITCOIN_FAQS_DE.concat(VALIDATOR_FAQS_DE),
      ctaLabel: 'Bitcoin-Adresse prüfen',
      title: 'Bitcoin-Adressprüfer',
      description: 'Prüfen Sie Bitcoin-Adressen in den Formaten Legacy, SegWit, Native SegWit und Taproot. Base58Check- und bech32-Kodierung werden geprüft.',
      heroTitle: 'Bitcoin-Adressvalidator',
      heroSubtitle: 'Prüfung jedes Bitcoin-Adressformats — Legacy, SegWit, Native SegWit oder Taproot — mit vollständiger Prüfsummenkontrolle.',
    },
    es: {
      faqs: BITCOIN_FAQS_ES.concat(VALIDATOR_FAQS_ES),
      ctaLabel: 'Validar dirección Bitcoin',
      title: 'Validador de direcciones Bitcoin',
      description: 'Valide direcciones Bitcoin en formatos Legacy, SegWit, Native SegWit y Taproot. Comprueba la codificación Base58Check y bech32.',
      heroTitle: 'Validador de direcciones Bitcoin',
      heroSubtitle: 'Validación de cualquier formato de dirección Bitcoin — Legacy, SegWit, Native SegWit o Taproot — con verificación completa de la suma.',
    },
    fr: {
      faqs: BITCOIN_FAQS_FR.concat(VALIDATOR_FAQS_FR),
      ctaLabel: 'Valider une adresse Bitcoin',
      title: 'Validateur d’adresses Bitcoin',
      description: 'Validez des adresses Bitcoin aux formats Legacy, SegWit, Native SegWit et Taproot. Vérifie l’encodage Base58Check et bech32.',
      heroTitle: 'Validateur d’adresses Bitcoin',
      heroSubtitle: 'Validation de tout format d’adresse Bitcoin — Legacy, SegWit, Native SegWit ou Taproot — avec vérification complète de la somme de contrôle.',
    },
    pt: {
      faqs: BITCOIN_FAQS_PT.concat(VALIDATOR_FAQS_PT),
      ctaLabel: 'Validar endereço Bitcoin',
      title: 'Validador de endereços Bitcoin',
      description: 'Valide endereços Bitcoin nos formatos Legacy, SegWit, Native SegWit e Taproot. Verifica a codificação Base58Check e bech32.',
      heroTitle: 'Validador de endereços Bitcoin',
      heroSubtitle: 'Validação de qualquer formato de endereço Bitcoin — Legacy, SegWit, Native SegWit ou Taproot — com verificação completa do checksum.',
    },
  },
};

const ETHEREUM_VALIDATOR_PAGE: CryptoSEOPageConfig = {
  id: 'ethereum-validator',
  slug: 'ethereum-validator',
  title: 'Ethereum Address Validator — EIP-55 Checksum',
  description: 'Validate Ethereum addresses with EIP-55 checksum verification. Supports every EVM-compatible network.',
  heroTitle: 'Ethereum Address Validator',
  heroSubtitle: 'Validate Ethereum addresses with EIP-55 mixed-case checksum. Detects common copy-paste errors.',
  ctaLabel: 'Validate Ethereum Address',
  faqs: ETHEREUM_FAQS.concat(VALIDATOR_FAQS),
  locales: {
    ru: {
      faqs: ETHEREUM_FAQS_RU.concat(VALIDATOR_FAQS_RU),
      ctaLabel: 'Проверить Ethereum-адрес',
      title: 'Проверка Ethereum-адреса и EIP-55',
      description: 'Проверяйте Ethereum-адреса с контрольной суммой EIP-55. Поддерживаются все EVM-совместимые сети.',
      heroTitle: 'Валидатор Ethereum-адресов',
      heroSubtitle: 'Проверка Ethereum-адресов по контрольной сумме EIP-55. Находит типичные ошибки копирования.',
    },
    de: {
      faqs: ETHEREUM_FAQS_DE.concat(VALIDATOR_FAQS_DE),
      ctaLabel: 'Ethereum-Adresse prüfen',
      title: 'Ethereum-Adressprüfer mit EIP-55',
      description: 'Prüfen Sie Ethereum-Adressen mit EIP-55-Prüfsumme. Alle EVM-kompatiblen Netzwerke werden unterstützt.',
      heroTitle: 'Ethereum-Adressvalidator',
      heroSubtitle: 'Prüfung von Ethereum-Adressen anhand der EIP-55-Prüfsumme. Erkennt typische Kopierfehler.',
    },
    es: {
      faqs: ETHEREUM_FAQS_ES.concat(VALIDATOR_FAQS_ES),
      ctaLabel: 'Validar dirección Ethereum',
      title: 'Validador de direcciones Ethereum y EIP-55',
      description: 'Valide direcciones Ethereum con verificación de suma EIP-55. Compatible con todas las redes EVM.',
      heroTitle: 'Validador de direcciones Ethereum',
      heroSubtitle: 'Validación de direcciones Ethereum con suma EIP-55. Detecta errores comunes de copiar y pegar.',
    },
    fr: {
      faqs: ETHEREUM_FAQS_FR.concat(VALIDATOR_FAQS_FR),
      ctaLabel: 'Valider une adresse Ethereum',
      title: 'Validateur d’adresses Ethereum et EIP-55',
      description: 'Validez des adresses Ethereum avec vérification de la somme EIP-55. Compatible avec tous les réseaux EVM.',
      heroTitle: 'Validateur d’adresses Ethereum',
      heroSubtitle: 'Validation d’adresses Ethereum via la somme EIP-55. Détecte les erreurs de copier-coller courantes.',
    },
    pt: {
      faqs: ETHEREUM_FAQS_PT.concat(VALIDATOR_FAQS_PT),
      ctaLabel: 'Validar endereço Ethereum',
      title: 'Validador de endereços Ethereum e EIP-55',
      description: 'Valide endereços Ethereum com verificação de checksum EIP-55. Compatível com todas as redes EVM.',
      heroTitle: 'Validador de endereços Ethereum',
      heroSubtitle: 'Validação de endereços Ethereum com checksum EIP-55. Detecta erros comuns de copiar e colar.',
    },
  },
};

const MNEMONIC_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'mnemonic-generator',
  slug: 'mnemonic-generator',
  title: 'BIP39 Mnemonic Generator — Test Seed Phrases',
  description: 'Generate BIP39 mnemonic phrases for testing: 12 to 24 words, 10 languages. Free, in your browser.',
  heroTitle: 'BIP39 Mnemonic Generator',
  heroSubtitle: 'Generate BIP39-compliant mnemonic phrases in 10 languages. 12, 15, 18, 21 or 24 words.',
  ctaLabel: 'Generate Mnemonics',
  faqs: MNEMONIC_FAQS,
  locales: {
    ru: {
      faqs: MNEMONIC_FAQS_RU,
      ctaLabel: 'Сгенерировать мнемоники',
      title: 'Генератор BIP39-мнемоник для тестов',
      description: 'Генерируйте мнемонические фразы BIP39 для тестирования: 12–24 слова, 10 языков. Бесплатно, прямо в браузере.',
      heroTitle: 'Генератор BIP39-мнемоник',
      heroSubtitle: 'Мнемонические фразы по стандарту BIP39 на 10 языках. 12, 15, 18, 21 или 24 слова.',
    },
    de: {
      faqs: MNEMONIC_FAQS_DE,
      ctaLabel: 'Mnemonics erzeugen',
      title: 'BIP39-Mnemonic-Generator für Tests',
      description: 'Erzeugen Sie BIP39-Mnemonics zum Testen: 12 bis 24 Wörter, 10 Sprachen. Kostenlos, direkt im Browser.',
      heroTitle: 'BIP39-Mnemonic-Generator',
      heroSubtitle: 'BIP39-konforme Mnemonics in 10 Sprachen. 12, 15, 18, 21 oder 24 Wörter.',
    },
    es: {
      faqs: MNEMONIC_FAQS_ES,
      ctaLabel: 'Generar mnemónicas',
      title: 'Generador de frases mnemónicas BIP39',
      description: 'Genere frases mnemónicas BIP39 para pruebas: de 12 a 24 palabras, 10 idiomas. Gratis, en el navegador.',
      heroTitle: 'Generador de mnemónicas BIP39',
      heroSubtitle: 'Frases mnemónicas conformes a BIP39 en 10 idiomas. 12, 15, 18, 21 o 24 palabras.',
    },
    fr: {
      faqs: MNEMONIC_FAQS_FR,
      ctaLabel: 'Générer des mnémoniques',
      title: 'Générateur de phrases mnémoniques BIP39',
      description: 'Générez des phrases mnémoniques BIP39 pour vos tests : 12 à 24 mots, 10 langues. Gratuit, dans le navigateur.',
      heroTitle: 'Générateur de mnémoniques BIP39',
      heroSubtitle: 'Phrases mnémoniques conformes à BIP39 en 10 langues. 12, 15, 18, 21 ou 24 mots.',
    },
    pt: {
      faqs: MNEMONIC_FAQS_PT,
      ctaLabel: 'Gerar mnemônicas',
      title: 'Gerador de frases mnemônicas BIP39',
      description: 'Gere frases mnemônicas BIP39 para testes: de 12 a 24 palavras, 10 idiomas. Grátis, no navegador.',
      heroTitle: 'Gerador de mnemônicas BIP39',
      heroSubtitle: 'Frases mnemônicas conformes ao BIP39 em 10 idiomas. 12, 15, 18, 21 ou 24 palavras.',
    },
  },
};

const BIP39_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'bip39-generator',
  slug: 'bip39-generator',
  title: 'BIP39 Seed Phrase Generator — 12 to 24 Words',
  description: 'Generate BIP39 seed phrases for testing. Several phrase lengths, several languages. Free, in your browser.',
  heroTitle: 'BIP39 Seed Phrase Generator',
  heroSubtitle: 'BIP39-compliant mnemonic generation. Several phrase lengths, several languages.',
  ctaLabel: 'Generate Seed Phrase',
  faqs: MNEMONIC_FAQS,
  locales: {
    ru: {
      faqs: MNEMONIC_FAQS_RU,
      ctaLabel: 'Сгенерировать seed-фразу',
      title: 'Генератор seed-фразы BIP39 — 12–24 слова',
      description: 'Генерируйте seed-фразы BIP39 для тестирования. Разная длина фразы, поддержка нескольких языков. Бесплатно, в браузере.',
      heroTitle: 'Генератор seed-фразы BIP39',
      heroSubtitle: 'Мнемоники по стандарту BIP39. Разная длина фразы, несколько языков.',
    },
    de: {
      faqs: MNEMONIC_FAQS_DE,
      ctaLabel: 'Seed-Phrase erzeugen',
      title: 'BIP39-Seed-Phrase-Generator — 12 bis 24 Wörter',
      description: 'Erzeugen Sie BIP39-Seed-Phrasen zum Testen. Verschiedene Wortanzahlen, mehrere Sprachen. Kostenlos, im Browser.',
      heroTitle: 'BIP39-Seed-Phrase-Generator',
      heroSubtitle: 'BIP39-konforme Mnemonics. Verschiedene Wortanzahlen, mehrere Sprachen.',
    },
    es: {
      faqs: MNEMONIC_FAQS_ES,
      ctaLabel: 'Generar frase semilla',
      title: 'Generador de frase semilla BIP39 — 12 a 24 palabras',
      description: 'Genere frases semilla BIP39 para pruebas. Varias longitudes y varios idiomas. Gratis, en el navegador.',
      heroTitle: 'Generador de frase semilla BIP39',
      heroSubtitle: 'Mnemónicas conformes a BIP39. Varias longitudes, varios idiomas.',
    },
    fr: {
      faqs: MNEMONIC_FAQS_FR,
      ctaLabel: 'Générer une phrase de récupération',
      title: 'Générateur de phrase de récupération BIP39',
      description: 'Générez des phrases de récupération BIP39 pour vos tests. Plusieurs longueurs et plusieurs langues. Gratuit, dans le navigateur.',
      heroTitle: 'Générateur de phrase de récupération BIP39',
      heroSubtitle: 'Mnémoniques conformes à BIP39. Plusieurs longueurs, plusieurs langues.',
    },
    pt: {
      faqs: MNEMONIC_FAQS_PT,
      ctaLabel: 'Gerar frase semente',
      title: 'Gerador de frase semente BIP39 — 12 a 24 palavras',
      description: 'Gere frases semente BIP39 para testes. Vários comprimentos e vários idiomas. Grátis, no navegador.',
      heroTitle: 'Gerador de frase semente BIP39',
      heroSubtitle: 'Mnemônicas conformes ao BIP39. Vários comprimentos, vários idiomas.',
    },
  },
};

const HD_WALLET_PAGE: CryptoSEOPageConfig = {
  id: 'hd-wallet-explorer',
  slug: 'hd-wallet-explorer',
  title: 'HD Wallet Explorer — BIP32/BIP44 Derivation',
  description: 'Explore HD wallet derivation trees interactively. Visualise BIP32 and BIP44 paths. Free, in your browser.',
  heroTitle: 'HD Wallet Explorer',
  heroSubtitle: 'Interactive exploration of BIP32/BIP44 hierarchical deterministic wallet derivation trees.',
  ctaLabel: 'Explore HD Wallet',
  faqs: HD_FAQS,
  locales: {
    ru: {
      faqs: HD_FAQS_RU,
      ctaLabel: 'Открыть HD-кошелёк',
      title: 'HD-кошелёк — дерево деривации BIP32/BIP44',
      description: 'Изучайте дерево деривации HD-кошелька в интерактивном режиме. Визуализация путей BIP32 и BIP44. Бесплатно, в браузере.',
      heroTitle: 'Обозреватель HD-кошелька',
      heroSubtitle: 'Интерактивный разбор дерева деривации иерархических детерминированных кошельков BIP32/BIP44.',
    },
    de: {
      faqs: HD_FAQS_DE,
      ctaLabel: 'HD-Wallet erkunden',
      title: 'HD-Wallet-Explorer — BIP32/BIP44-Ableitung',
      description: 'Erkunden Sie den Ableitungsbaum eines HD-Wallets interaktiv. Visualisierung der BIP32- und BIP44-Pfade. Kostenlos, im Browser.',
      heroTitle: 'HD-Wallet-Explorer',
      heroSubtitle: 'Interaktive Erkundung des Ableitungsbaums hierarchisch deterministischer Wallets nach BIP32/BIP44.',
    },
    es: {
      faqs: HD_FAQS_ES,
      ctaLabel: 'Explorar monedero HD',
      title: 'Explorador de monedero HD — BIP32/BIP44',
      description: 'Explore de forma interactiva el árbol de derivación de un monedero HD. Visualización de rutas BIP32 y BIP44. Gratis, en el navegador.',
      heroTitle: 'Explorador de monedero HD',
      heroSubtitle: 'Exploración interactiva del árbol de derivación de monederos deterministas jerárquicos BIP32/BIP44.',
    },
    fr: {
      faqs: HD_FAQS_FR,
      ctaLabel: 'Explorer le portefeuille HD',
      title: 'Explorateur de portefeuille HD — BIP32/BIP44',
      description: 'Explorez interactivement l’arbre de dérivation d’un portefeuille HD. Visualisation des chemins BIP32 et BIP44. Gratuit, dans le navigateur.',
      heroTitle: 'Explorateur de portefeuille HD',
      heroSubtitle: 'Exploration interactive de l’arbre de dérivation des portefeuilles déterministes hiérarchiques BIP32/BIP44.',
    },
    pt: {
      faqs: HD_FAQS_PT,
      ctaLabel: 'Explorar carteira HD',
      title: 'Explorador de carteira HD — BIP32/BIP44',
      description: 'Explore interativamente a árvore de derivação de uma carteira HD. Visualização de caminhos BIP32 e BIP44. Grátis, no navegador.',
      heroTitle: 'Explorador de carteira HD',
      heroSubtitle: 'Exploração interativa da árvore de derivação de carteiras determinísticas hierárquicas BIP32/BIP44.',
    },
  },
};

const WALLET_QR_PAGE: CryptoSEOPageConfig = {
  id: 'wallet-qr-generator',
  slug: 'wallet-qr-generator',
  title: 'Crypto QR Code Generator — Payment URIs',
  description: 'Create QR codes for cryptocurrency payment URIs. Supports bitcoin:, ethereum: and 13 more schemes.',
  heroTitle: 'Crypto QR Code Generator',
  heroSubtitle: 'Generate payment QR codes for any cryptocurrency. Scan-ready URIs with amount, label and message.',
  ctaLabel: 'Generate QR Code',
  faqs: QR_FAQS,
  locales: {
    ru: {
      faqs: QR_FAQS_RU,
      ctaLabel: 'Сгенерировать QR-код',
      title: 'Генератор QR-кодов для криптоплатежей',
      description: 'Создавайте QR-коды для платёжных ссылок криптовалют. Поддерживаются схемы bitcoin:, ethereum: и ещё 13.',
      heroTitle: 'Генератор криптовалютных QR-кодов',
      heroSubtitle: 'Платёжные QR-коды для любой криптовалюты. Готовые к сканированию ссылки с суммой, меткой и сообщением.',
    },
    de: {
      faqs: QR_FAQS_DE,
      ctaLabel: 'QR-Code erzeugen',
      title: 'Krypto-QR-Code-Generator für Zahlungen',
      description: 'Erstellen Sie QR-Codes für Krypto-Zahlungs-URIs. Unterstützt bitcoin:, ethereum: und 13 weitere Schemata.',
      heroTitle: 'Krypto-QR-Code-Generator',
      heroSubtitle: 'Zahlungs-QR-Codes für jede Kryptowährung. Scanfertige URIs mit Betrag, Label und Nachricht.',
    },
    es: {
      faqs: QR_FAQS_ES,
      ctaLabel: 'Generar código QR',
      title: 'Generador de códigos QR para pagos cripto',
      description: 'Cree códigos QR para URIs de pago de criptomonedas. Compatible con bitcoin:, ethereum: y 13 esquemas más.',
      heroTitle: 'Generador de códigos QR cripto',
      heroSubtitle: 'Códigos QR de pago para cualquier criptomoneda. URIs listas para escanear con importe, etiqueta y mensaje.',
    },
    fr: {
      faqs: QR_FAQS_FR,
      ctaLabel: 'Générer un QR code',
      title: 'Générateur de QR codes de paiement crypto',
      description: 'Créez des QR codes pour les URI de paiement crypto. Prend en charge bitcoin:, ethereum: et 13 autres schémas.',
      heroTitle: 'Générateur de QR codes crypto',
      heroSubtitle: 'QR codes de paiement pour toute cryptomonnaie. URI prêtes à scanner avec montant, libellé et message.',
    },
    pt: {
      faqs: QR_FAQS_PT,
      ctaLabel: 'Gerar QR code',
      title: 'Gerador de QR codes para pagamentos cripto',
      description: 'Crie QR codes para URIs de pagamento cripto. Compatível com bitcoin:, ethereum: e mais 13 esquemas.',
      heroTitle: 'Gerador de QR codes cripto',
      heroSubtitle: 'QR codes de pagamento para qualquer criptomoeda. URIs prontas para escanear com valor, rótulo e mensagem.',
    },
  },
};

const PLAYGROUND_PAGE: CryptoSEOPageConfig = {
  id: 'wallet-playground',
  slug: 'wallet-playground',
  title: 'Crypto Wallet Playground — Web3 Dev Tools',
  description: 'A complete Web3 testing toolkit: generate wallets, validate addresses, create mnemonics, explore HD trees. Free, in your browser.',
  heroTitle: 'Crypto Wallet Playground',
  heroSubtitle: 'Your complete Web3 testing toolkit — wallet generation, validation, analysis and education. All in your browser.',
  ctaLabel: 'Open Playground',
  faqs: PLAYGROUND_FAQS,
  locales: {
    ru: {
      faqs: PLAYGROUND_FAQS_RU,
      ctaLabel: 'Открыть Playground',
      title: 'Crypto Wallet Playground — инструменты Web3',
      description: 'Полный набор для тестирования Web3: генерация кошельков, проверка адресов, мнемоники, деревья HD. Бесплатно, в браузере.',
      heroTitle: 'Crypto Wallet Playground',
      heroSubtitle: 'Полный набор для тестирования Web3 — генерация, проверка, анализ и обучение. Всё в браузере.',
    },
    de: {
      faqs: PLAYGROUND_FAQS_DE,
      ctaLabel: 'Playground öffnen',
      title: 'Crypto Wallet Playground — Web3-Werkzeuge',
      description: 'Vollständiges Web3-Testset: Wallets erzeugen, Adressen prüfen, Mnemonics erstellen, HD-Bäume erkunden. Kostenlos, im Browser.',
      heroTitle: 'Crypto Wallet Playground',
      heroSubtitle: 'Das vollständige Web3-Testset — Erzeugen, Prüfen, Analysieren und Lernen. Alles im Browser.',
    },
    es: {
      faqs: PLAYGROUND_FAQS_ES,
      ctaLabel: 'Abrir Playground',
      title: 'Crypto Wallet Playground — herramientas Web3',
      description: 'Kit completo de pruebas Web3: generar monederos, validar direcciones, crear mnemónicas y explorar árboles HD. Gratis, en el navegador.',
      heroTitle: 'Crypto Wallet Playground',
      heroSubtitle: 'El kit completo de pruebas Web3: generación, validación, análisis y aprendizaje. Todo en el navegador.',
    },
    fr: {
      faqs: PLAYGROUND_FAQS_FR,
      ctaLabel: 'Ouvrir le Playground',
      title: 'Crypto Wallet Playground — outils Web3',
      description: 'Boîte à outils Web3 complète : générer des portefeuilles, valider des adresses, créer des mnémoniques, explorer les arbres HD. Gratuit.',
      heroTitle: 'Crypto Wallet Playground',
      heroSubtitle: 'La boîte à outils Web3 complète : génération, validation, analyse et apprentissage. Le tout dans le navigateur.',
    },
    pt: {
      faqs: PLAYGROUND_FAQS_PT,
      ctaLabel: 'Abrir o Playground',
      title: 'Crypto Wallet Playground — ferramentas Web3',
      description: 'Kit completo de testes Web3: gerar carteiras, validar endereços, criar mnemônicas e explorar árvores HD. Grátis, no navegador.',
      heroTitle: 'Crypto Wallet Playground',
      heroSubtitle: 'O kit completo de testes Web3: geração, validação, análise e aprendizado. Tudo no navegador.',
    },
  },
};

const TEST_WALLET_PAGE: CryptoSEOPageConfig = {
  id: 'test-wallet-generator',
  slug: 'test-wallet-generator',
  title: 'Test Wallet Generator — Testnet Addresses',
  description: 'Generate wallet addresses for Sepolia, Holesky, Amoy, BNB Testnet and other public testnets. Free, in your browser.',
  heroTitle: 'Test Wallet Generator',
  heroSubtitle: 'Generate testnet wallet addresses for Sepolia, Holesky, Amoy and other public testnets.',
  ctaLabel: 'Generate Test Wallets',
  faqs: WALLET_FAQS,
  locales: {
    ru: {
      faqs: WALLET_FAQS_RU,
      ctaLabel: 'Сгенерировать тестовые кошельки',
      title: 'Генератор тестовых кошельков для testnet',
      description: 'Генерируйте адреса кошельков для Sepolia, Holesky, Amoy, BNB Testnet и других тестовых сетей. Бесплатно, в браузере.',
      heroTitle: 'Генератор тестовых кошельков',
      heroSubtitle: 'Адреса кошельков для Sepolia, Holesky, Amoy и других публичных тестовых сетей.',
    },
    de: {
      faqs: WALLET_FAQS_DE,
      ctaLabel: 'Test-Wallets erzeugen',
      title: 'Testnet-Wallet-Generator',
      description: 'Erzeugen Sie Wallet-Adressen für Sepolia, Holesky, Amoy, BNB Testnet und weitere Testnetze. Kostenlos, im Browser.',
      heroTitle: 'Testnet-Wallet-Generator',
      heroSubtitle: 'Wallet-Adressen für Sepolia, Holesky, Amoy und weitere öffentliche Testnetze.',
    },
    es: {
      faqs: WALLET_FAQS_ES,
      ctaLabel: 'Generar monederos de prueba',
      title: 'Generador de monederos de testnet',
      description: 'Genere direcciones de monedero para Sepolia, Holesky, Amoy, BNB Testnet y otras redes de prueba. Gratis, en el navegador.',
      heroTitle: 'Generador de monederos de prueba',
      heroSubtitle: 'Direcciones de monedero para Sepolia, Holesky, Amoy y otras redes de prueba públicas.',
    },
    fr: {
      faqs: WALLET_FAQS_FR,
      ctaLabel: 'Générer des portefeuilles de test',
      title: 'Générateur de portefeuilles testnet',
      description: 'Générez des adresses de portefeuille pour Sepolia, Holesky, Amoy, BNB Testnet et d’autres réseaux de test. Gratuit, dans le navigateur.',
      heroTitle: 'Générateur de portefeuilles de test',
      heroSubtitle: 'Adresses de portefeuille pour Sepolia, Holesky, Amoy et d’autres réseaux de test publics.',
    },
    pt: {
      faqs: WALLET_FAQS_PT,
      ctaLabel: 'Gerar carteiras de teste',
      title: 'Gerador de carteiras de testnet',
      description: 'Gere endereços de carteira para Sepolia, Holesky, Amoy, BNB Testnet e outras redes de teste. Grátis, no navegador.',
      heroTitle: 'Gerador de carteiras de teste',
      heroSubtitle: 'Endereços de carteira para Sepolia, Holesky, Amoy e outras redes de teste públicas.',
    },
  },
};

const BLOCKCHAIN_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'blockchain-address-generator',
  slug: 'blockchain-address-generator',
  title: 'Blockchain Address Generator — Multi-Network',
  description: 'Generate wallet addresses for Bitcoin, Ethereum, Litecoin, Dogecoin, Solana and other networks. Free, in your browser.',
  heroTitle: 'Blockchain Address Generator',
  heroSubtitle: 'Generate wallet addresses for any supported blockchain network. 22+ networks, all address formats.',
  ctaLabel: 'Generate Addresses',
  faqs: WALLET_FAQS,
  locales: {
    ru: {
      faqs: WALLET_FAQS_RU,
      ctaLabel: 'Сгенерировать адреса',
      title: 'Генератор адресов блокчейна — любые сети',
      description: 'Генерируйте адреса кошельков для Bitcoin, Ethereum, Litecoin, Dogecoin, Solana и других сетей. Бесплатно, в браузере.',
      heroTitle: 'Генератор адресов блокчейна',
      heroSubtitle: 'Адреса кошельков для любой поддерживаемой сети. 22+ блокчейна, все форматы адресов.',
    },
    de: {
      faqs: WALLET_FAQS_DE,
      ctaLabel: 'Adressen erzeugen',
      title: 'Blockchain-Adressgenerator für viele Netze',
      description: 'Erzeugen Sie Wallet-Adressen für Bitcoin, Ethereum, Litecoin, Dogecoin, Solana und weitere Netze. Kostenlos, im Browser.',
      heroTitle: 'Blockchain-Adressgenerator',
      heroSubtitle: 'Wallet-Adressen für jedes unterstützte Netzwerk. 22+ Blockchains, alle Adressformate.',
    },
    es: {
      faqs: WALLET_FAQS_ES,
      ctaLabel: 'Generar direcciones',
      title: 'Generador de direcciones blockchain multired',
      description: 'Genere direcciones de monedero para Bitcoin, Ethereum, Litecoin, Dogecoin, Solana y otras redes. Gratis, en el navegador.',
      heroTitle: 'Generador de direcciones blockchain',
      heroSubtitle: 'Direcciones de monedero para cualquier red compatible. Más de 22 blockchains y todos los formatos.',
    },
    fr: {
      faqs: WALLET_FAQS_FR,
      ctaLabel: 'Générer des adresses',
      title: 'Générateur d’adresses blockchain multi-réseaux',
      description: 'Générez des adresses de portefeuille pour Bitcoin, Ethereum, Litecoin, Dogecoin, Solana et d’autres réseaux. Gratuit, dans le navigateur.',
      heroTitle: 'Générateur d’adresses blockchain',
      heroSubtitle: 'Adresses de portefeuille pour tout réseau pris en charge. 22+ blockchains, tous les formats.',
    },
    pt: {
      faqs: WALLET_FAQS_PT,
      ctaLabel: 'Gerar endereços',
      title: 'Gerador de endereços blockchain multirrede',
      description: 'Gere endereços de carteira para Bitcoin, Ethereum, Litecoin, Dogecoin, Solana e outras redes. Grátis, no navegador.',
      heroTitle: 'Gerador de endereços blockchain',
      heroSubtitle: 'Endereços de carteira para qualquer rede compatível. Mais de 22 blockchains e todos os formatos.',
    },
  },
};

const CRYPTO_VALIDATOR_PAGE: CryptoSEOPageConfig = {
  id: 'crypto-address-validator',
  slug: 'crypto-address-validator',
  title: 'Crypto Address Validator — Multi-Network',
  description: 'Validate cryptocurrency addresses across 22+ blockchains: format, checksum and network compatibility.',
  heroTitle: 'Crypto Address Validator',
  heroSubtitle: 'Validate cryptocurrency addresses across 22+ blockchains with detailed analysis.',
  ctaLabel: 'Validate Addresses',
  faqs: VALIDATOR_FAQS,
  locales: {
    ru: {
      faqs: VALIDATOR_FAQS_RU,
      ctaLabel: 'Проверить адреса',
      title: 'Проверка криптоадресов в разных сетях',
      description: 'Проверяйте криптовалютные адреса в 22+ блокчейнах: формат, контрольная сумма и совместимость с сетью.',
      heroTitle: 'Валидатор криптовалютных адресов',
      heroSubtitle: 'Проверка криптовалютных адресов в 22+ блокчейнах с подробным разбором.',
    },
    de: {
      faqs: VALIDATOR_FAQS_DE,
      ctaLabel: 'Adressen prüfen',
      title: 'Krypto-Adressprüfer für viele Netzwerke',
      description: 'Prüfen Sie Kryptowährungsadressen in 22+ Blockchains: Format, Prüfsumme und Netzwerkkompatibilität.',
      heroTitle: 'Krypto-Adressvalidator',
      heroSubtitle: 'Prüfung von Kryptowährungsadressen in 22+ Blockchains mit ausführlicher Analyse.',
    },
    es: {
      faqs: VALIDATOR_FAQS_ES,
      ctaLabel: 'Validar direcciones',
      title: 'Validador de direcciones cripto multired',
      description: 'Valide direcciones de criptomonedas en más de 22 blockchains: formato, suma de verificación y compatibilidad de red.',
      heroTitle: 'Validador de direcciones cripto',
      heroSubtitle: 'Validación de direcciones de criptomonedas en más de 22 blockchains con análisis detallado.',
    },
    fr: {
      faqs: VALIDATOR_FAQS_FR,
      ctaLabel: 'Valider des adresses',
      title: 'Validateur d’adresses crypto multi-réseaux',
      description: 'Validez des adresses de cryptomonnaie sur 22+ blockchains : format, somme de contrôle et compatibilité réseau.',
      heroTitle: 'Validateur d’adresses crypto',
      heroSubtitle: 'Validation d’adresses de cryptomonnaie sur 22+ blockchains avec analyse détaillée.',
    },
    pt: {
      faqs: VALIDATOR_FAQS_PT,
      ctaLabel: 'Validar endereços',
      title: 'Validador de endereços cripto multirrede',
      description: 'Valide endereços de criptomoeda em mais de 22 blockchains: formato, checksum e compatibilidade de rede.',
      heroTitle: 'Validador de endereços cripto',
      heroSubtitle: 'Validação de endereços de criptomoeda em mais de 22 blockchains com análise detalhada.',
    },
  },
};

/* ── Registry ──────────────────────────────────────────────────────────────────── */

export const CRYPTO_SEO_PAGES: CryptoSEOPageConfig[] = [
  WALLET_GENERATOR_PAGE,
  BITCOIN_GENERATOR_PAGE,
  ETHEREUM_GENERATOR_PAGE,
  WALLET_VALIDATOR_PAGE,
  BITCOIN_VALIDATOR_PAGE,
  ETHEREUM_VALIDATOR_PAGE,
  MNEMONIC_GENERATOR_PAGE,
  BIP39_GENERATOR_PAGE,
  HD_WALLET_PAGE,
  WALLET_QR_PAGE,
  PLAYGROUND_PAGE,
  TEST_WALLET_PAGE,
  BLOCKCHAIN_GENERATOR_PAGE,
  CRYPTO_VALIDATOR_PAGE,
];

export const ALL_CRYPTO_SEO_PAGES = CRYPTO_SEO_PAGES;

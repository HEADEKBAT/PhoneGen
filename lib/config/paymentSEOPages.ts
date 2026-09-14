/**
 * Payment Studio — SEO Landing Pages Config.
 *
 * Defines metadata, hero content, and FAQ for each Payment Studio
 * SEO landing page. Each page is a thin server component that reads
 * its config from here.
 *
 * Follows the same pattern as credentialSEOPages.ts and barcodeSEOPages.ts.
 */

import type {
  StudioSEOConfig,
  StudioSEOFaq,
} from '@/components/seo-landing/StudioSEOPage';

export type SEOFaq = StudioSEOFaq;

/**
 * `StudioSEOConfig` carries the copy and its `locales` map; `id` is this
 * registry's own key. The shape used to be declared here, identically to the
 * crypto registry, and identically again in the renderer.
 */
export type PaymentSEOPageConfig = StudioSEOConfig & { id: string };

/* ── Shared FAQ pools ────────────────────────────────────────────────────────── */

const CREDIT_CARD_FAQS: SEOFaq[] = [
  { q: 'Are these real credit card numbers?', a: 'No. All generated numbers are test numbers that pass Luhn validation but are not linked to any real accounts. They are algorithmically generated based on public BIN/IIN ranges and are safe for development and testing purposes.' },
  { q: 'Is this safe to use?', a: 'Yes. All generation happens entirely in your browser using the Web Crypto API. No data is ever sent to any server, no history is stored, and no credentials leave your device.' },
  { q: 'What is Luhn validation?', a: 'The Luhn algorithm (ISO/IEC 7812) is a checksum formula used by all major credit card networks to validate card numbers. It detects single-digit errors and most adjacent digit transpositions.' },
  { q: 'Can I use these numbers in production?', a: 'No. These numbers are intended for development, testing, and QA purposes only. For production, use real card numbers issued by financial institutions.' },
];

const CREDIT_CARD_FAQS_RU: SEOFaq[] = [
  { q: 'Это настоящие номера карт?', a: 'Нет. Все номера тестовые: они проходят проверку Луна, но не привязаны ни к одному реальному счёту. Номера строятся алгоритмически по публичным диапазонам BIN/IIN и безопасны для разработки и тестирования.' },
  { q: 'Это безопасно?', a: 'Да. Вся генерация идёт целиком в вашем браузере через Web Crypto API. Данные никуда не отправляются, история не сохраняется, ничего не покидает устройство.' },
  { q: 'Что такое проверка Луна?', a: 'Алгоритм Луна (ISO/IEC 7812) — формула контрольной суммы, которой пользуются все крупные платёжные системы. Он находит ошибку в одной цифре и большинство перестановок соседних цифр.' },
  { q: 'Можно ли использовать эти номера в продакшене?', a: 'Нет. Они предназначены только для разработки, тестирования и QA. Для реальных операций нужны карты, выпущенные банком.' },
];

const CREDIT_CARD_FAQS_DE: SEOFaq[] = [
  { q: 'Sind das echte Kartennummern?', a: 'Nein. Alle Nummern sind Testnummern: Sie bestehen die Luhn-Prüfung, gehören aber zu keinem echten Konto. Sie entstehen algorithmisch aus öffentlichen BIN/IIN-Bereichen und sind für Entwicklung und Tests unbedenklich.' },
  { q: 'Ist das sicher?', a: 'Ja. Die gesamte Erzeugung läuft in Ihrem Browser über die Web Crypto API. Es werden keine Daten gesendet, kein Verlauf gespeichert, nichts verlässt Ihr Gerät.' },
  { q: 'Was ist die Luhn-Prüfung?', a: 'Der Luhn-Algorithmus (ISO/IEC 7812) ist eine Prüfsummenformel, die alle großen Kartennetzwerke verwenden. Er erkennt Fehler in einzelnen Ziffern und die meisten Vertauschungen benachbarter Ziffern.' },
  { q: 'Darf ich diese Nummern produktiv einsetzen?', a: 'Nein. Sie sind ausschließlich für Entwicklung, Tests und QA gedacht. Für den Echtbetrieb brauchen Sie von einem Institut ausgegebene Karten.' },
];

const CREDIT_CARD_FAQS_ES: SEOFaq[] = [
  { q: '¿Son números de tarjeta reales?', a: 'No. Todos son números de prueba: superan la validación Luhn, pero no están vinculados a ninguna cuenta real. Se generan algorítmicamente a partir de rangos BIN/IIN públicos y son seguros para desarrollo y pruebas.' },
  { q: '¿Es seguro usarlo?', a: 'Sí. Toda la generación ocurre en su navegador mediante la Web Crypto API. No se envía ningún dato, no se guarda historial y nada sale de su dispositivo.' },
  { q: '¿Qué es la validación Luhn?', a: 'El algoritmo de Luhn (ISO/IEC 7812) es una fórmula de suma de verificación que usan todas las grandes redes de tarjetas. Detecta errores de un solo dígito y la mayoría de las transposiciones de dígitos contiguos.' },
  { q: '¿Puedo usar estos números en producción?', a: 'No. Están pensados solo para desarrollo, pruebas y QA. Para producción se necesitan tarjetas emitidas por una entidad financiera.' },
];

const CREDIT_CARD_FAQS_FR: SEOFaq[] = [
  { q: 'Ces numéros de carte sont-ils réels ?', a: 'Non. Ce sont tous des numéros de test : ils passent la validation Luhn mais ne sont liés à aucun compte réel. Ils sont générés algorithmiquement à partir de plages BIN/IIN publiques et conviennent au développement et aux tests.' },
  { q: 'Est-ce sûr ?', a: 'Oui. Toute la génération se fait dans votre navigateur via la Web Crypto API. Aucune donnée n’est envoyée, aucun historique n’est conservé, rien ne quitte votre appareil.' },
  { q: 'Qu’est-ce que la validation de Luhn ?', a: 'L’algorithme de Luhn (ISO/IEC 7812) est une formule de somme de contrôle employée par tous les grands réseaux de cartes. Il détecte les erreurs sur un chiffre et la plupart des inversions de chiffres voisins.' },
  { q: 'Puis-je utiliser ces numéros en production ?', a: 'Non. Ils sont destinés au développement, aux tests et à la QA uniquement. En production, il faut des cartes émises par un établissement financier.' },
];

const CREDIT_CARD_FAQS_PT: SEOFaq[] = [
  { q: 'Estes números de cartão são reais?', a: 'Não. Todos são números de teste: passam na validação Luhn, mas não estão ligados a nenhuma conta real. São gerados algoritmicamente a partir de faixas BIN/IIN públicas e são seguros para desenvolvimento e testes.' },
  { q: 'É seguro usar?', a: 'Sim. Toda a geração acontece no seu navegador via Web Crypto API. Nenhum dado é enviado, nenhum histórico é guardado e nada sai do seu dispositivo.' },
  { q: 'O que é a validação de Luhn?', a: 'O algoritmo de Luhn (ISO/IEC 7812) é uma fórmula de checksum usada por todas as grandes redes de cartões. Ele detecta erros de um dígito e a maioria das trocas entre dígitos vizinhos.' },
  { q: 'Posso usar estes números em produção?', a: 'Não. Eles servem apenas para desenvolvimento, testes e QA. Em produção são necessários cartões emitidos por uma instituição financeira.' },
];

const NETWORK_FAQS: SEOFaq[] = [
  { q: 'What is a BIN range?', a: 'A Bank Identification Number (BIN), also called Issuer Identification Number (IIN), is the first 6-8 digits of a credit card that identify the issuing institution. Each card network has specific BIN ranges.' },
  { q: 'What test card numbers does this network use?', a: 'Each payment network provides official test card numbers through documentation. Our generator uses publicly available BIN ranges to produce structurally valid test numbers.' },
  { q: 'How many test card numbers can I generate?', a: 'You can generate as many test card numbers as you need, up to 1000 at once in bulk mode. All generation is client-side and free.' },
];

const NETWORK_FAQS_RU: SEOFaq[] = [
  { q: 'Что такое диапазон BIN?', a: 'BIN (Bank Identification Number), он же IIN, — первые 6–8 цифр номера карты, по которым определяется банк-эмитент. У каждой платёжной системы свои диапазоны BIN.' },
  { q: 'Какие тестовые номера использует эта система?', a: 'Каждая платёжная система публикует официальные тестовые номера в своей документации. Наш генератор строит структурно корректные номера по общедоступным диапазонам BIN.' },
  { q: 'Сколько номеров можно сгенерировать?', a: 'Сколько угодно — до 1000 за один раз в массовом режиме. Всё происходит в браузере и бесплатно.' },
];

const NETWORK_FAQS_DE: SEOFaq[] = [
  { q: 'Was ist ein BIN-Bereich?', a: 'Die BIN (Bank Identification Number), auch IIN genannt, sind die ersten 6 bis 8 Ziffern einer Kartennummer und benennen das herausgebende Institut. Jedes Kartennetzwerk hat eigene BIN-Bereiche.' },
  { q: 'Welche Testnummern verwendet dieses Netzwerk?', a: 'Jedes Zahlungsnetzwerk veröffentlicht offizielle Testnummern in seiner Dokumentation. Unser Generator bildet aus öffentlich verfügbaren BIN-Bereichen strukturell gültige Testnummern.' },
  { q: 'Wie viele Testnummern kann ich erzeugen?', a: 'So viele Sie brauchen — bis zu 1000 auf einmal im Stapelmodus. Alles läuft im Browser und ist kostenlos.' },
];

const NETWORK_FAQS_ES: SEOFaq[] = [
  { q: '¿Qué es un rango BIN?', a: 'El BIN (Bank Identification Number), también llamado IIN, son los primeros 6-8 dígitos de una tarjeta e identifican a la entidad emisora. Cada red de tarjetas tiene sus propios rangos BIN.' },
  { q: '¿Qué números de prueba usa esta red?', a: 'Cada red de pago publica números de prueba oficiales en su documentación. Nuestro generador usa rangos BIN públicos para producir números estructuralmente válidos.' },
  { q: '¿Cuántos números puedo generar?', a: 'Los que necesite: hasta 1000 de una vez en modo masivo. Todo ocurre en el navegador y es gratis.' },
];

const NETWORK_FAQS_FR: SEOFaq[] = [
  { q: 'Qu’est-ce qu’une plage BIN ?', a: 'Le BIN (Bank Identification Number), aussi appelé IIN, correspond aux 6 à 8 premiers chiffres d’une carte et identifie l’établissement émetteur. Chaque réseau a ses propres plages BIN.' },
  { q: 'Quels numéros de test ce réseau utilise-t-il ?', a: 'Chaque réseau de paiement publie des numéros de test officiels dans sa documentation. Notre générateur s’appuie sur des plages BIN publiques pour produire des numéros structurellement valides.' },
  { q: 'Combien de numéros puis-je générer ?', a: 'Autant que nécessaire : jusqu’à 1000 d’un coup en mode lot. Tout se passe dans le navigateur, et c’est gratuit.' },
];

const NETWORK_FAQS_PT: SEOFaq[] = [
  { q: 'O que é uma faixa BIN?', a: 'O BIN (Bank Identification Number), também chamado de IIN, são os primeiros 6 a 8 dígitos de um cartão e identificam a instituição emissora. Cada rede de cartões tem as suas próprias faixas BIN.' },
  { q: 'Quais números de teste esta rede usa?', a: 'Cada rede de pagamento publica números de teste oficiais na sua documentação. O nosso gerador usa faixas BIN públicas para produzir números estruturalmente válidos.' },
  { q: 'Quantos números posso gerar?', a: 'Quantos precisar: até 1000 de uma vez no modo em lote. Tudo acontece no navegador e é grátis.' },
];

const BULK_FAQS: SEOFaq[] = [
  { q: 'What is bulk credit card generation?', a: 'Bulk generation lets you create multiple test card numbers at once, up to 1000 per batch. Perfect for load testing, database seeding, and QA test suites.' },
  { q: 'What formats can I export bulk cards in?', a: 'You can export in TXT, CSV, JSON, SQL (INSERT statements), XML, or YAML formats. Choose the format that matches your testing workflow.' },
  { q: 'Is bulk generation fast?', a: 'Yes. Bulk generation happens entirely in your browser using efficient algorithmic generation. A batch of 1000 cards is typically generated in under a second.' },
];

const BULK_FAQS_RU: SEOFaq[] = [
  { q: 'Что такое массовая генерация карт?', a: 'Это создание сразу многих тестовых номеров — до 1000 за партию. Удобно для нагрузочного тестирования, наполнения баз и наборов QA-тестов.' },
  { q: 'В каких форматах можно выгрузить результат?', a: 'TXT, CSV, JSON, SQL (готовые INSERT), XML и YAML. Выберите тот, что подходит вашему процессу тестирования.' },
  { q: 'Быстро ли это работает?', a: 'Да. Генерация идёт целиком в браузере эффективным алгоритмом: партия из 1000 карт обычно готова меньше чем за секунду.' },
];

const BULK_FAQS_DE: SEOFaq[] = [
  { q: 'Was ist Massenerzeugung von Karten?', a: 'Dabei entstehen viele Testnummern auf einmal — bis zu 1000 pro Stapel. Praktisch für Lasttests, das Befüllen von Datenbanken und QA-Testsuiten.' },
  { q: 'In welchen Formaten kann ich exportieren?', a: 'TXT, CSV, JSON, SQL (fertige INSERT-Anweisungen), XML und YAML. Wählen Sie das Format, das zu Ihrem Testablauf passt.' },
  { q: 'Geht das schnell?', a: 'Ja. Die Erzeugung läuft vollständig im Browser mit einem effizienten Algorithmus: Ein Stapel von 1000 Karten ist meist in unter einer Sekunde fertig.' },
];

const BULK_FAQS_ES: SEOFaq[] = [
  { q: '¿Qué es la generación masiva de tarjetas?', a: 'Consiste en crear muchos números de prueba a la vez, hasta 1000 por lote. Va bien para pruebas de carga, poblar bases de datos y suites de QA.' },
  { q: '¿En qué formatos puedo exportar?', a: 'TXT, CSV, JSON, SQL (sentencias INSERT listas), XML y YAML. Elija el que encaje con su flujo de pruebas.' },
  { q: '¿Es rápido?', a: 'Sí. Todo se genera en el navegador con un algoritmo eficiente: un lote de 1000 tarjetas suele estar listo en menos de un segundo.' },
];

const BULK_FAQS_FR: SEOFaq[] = [
  { q: 'Qu’est-ce que la génération de cartes en masse ?', a: 'Il s’agit de créer de nombreux numéros de test d’un coup, jusqu’à 1000 par lot. Pratique pour les tests de charge, le remplissage de bases et les suites de QA.' },
  { q: 'Dans quels formats puis-je exporter ?', a: 'TXT, CSV, JSON, SQL (instructions INSERT prêtes), XML et YAML. Choisissez celui qui correspond à votre flux de test.' },
  { q: 'Est-ce rapide ?', a: 'Oui. Tout est généré dans le navigateur avec un algorithme efficace : un lot de 1000 cartes est généralement prêt en moins d’une seconde.' },
];

const BULK_FAQS_PT: SEOFaq[] = [
  { q: 'O que é a geração de cartões em massa?', a: 'É criar muitos números de teste de uma vez, até 1000 por lote. Serve bem para testes de carga, popular bancos de dados e suítes de QA.' },
  { q: 'Em quais formatos posso exportar?', a: 'TXT, CSV, JSON, SQL (instruções INSERT prontas), XML e YAML. Escolha o que combina com o seu fluxo de testes.' },
  { q: 'É rápido?', a: 'Sim. Tudo é gerado no navegador com um algoritmo eficiente: um lote de 1000 cartões costuma ficar pronto em menos de um segundo.' },
];

const VALIDATOR_FAQS: SEOFaq[] = [
  { q: 'How does card validation work?', a: 'The validator checks the card number against multiple criteria: card network identification (BIN range), length validation, and Luhn checksum verification.' },
  { q: 'What does a validation result include?', a: 'Each result shows the detected card network, whether the length is valid for that network, whether the number passes Luhn, and a human-readable status message.' },
  { q: 'Can I validate real card numbers?', a: 'This tool is for testing purposes. It only performs structural validation (network, length, Luhn) — it does not check whether a card is active or has available funds.' },
];

const VALIDATOR_FAQS_RU: SEOFaq[] = [
  { q: 'Как работает проверка карты?', a: 'Валидатор сверяет номер по нескольким признакам: определяет платёжную систему по диапазону BIN, проверяет допустимую длину и контрольную сумму Луна.' },
  { q: 'Что показывает результат проверки?', a: 'Определённую платёжную систему, допустима ли длина для неё, проходит ли номер проверку Луна, и понятное человеку пояснение к результату.' },
  { q: 'Можно ли проверять настоящие карты?', a: 'Инструмент предназначен для тестирования. Он проверяет только структуру — систему, длину и контрольную сумму — и ничего не знает о том, активна карта или есть ли на ней деньги.' },
];

const VALIDATOR_FAQS_DE: SEOFaq[] = [
  { q: 'Wie funktioniert die Kartenprüfung?', a: 'Der Validator prüft die Nummer nach mehreren Kriterien: Er bestimmt das Netzwerk anhand des BIN-Bereichs, kontrolliert die zulässige Länge und verifiziert die Luhn-Prüfsumme.' },
  { q: 'Was zeigt das Prüfergebnis?', a: 'Das erkannte Netzwerk, ob die Länge dafür zulässig ist, ob die Nummer die Luhn-Prüfung besteht, und eine verständliche Erläuterung dazu.' },
  { q: 'Kann ich echte Karten prüfen?', a: 'Das Werkzeug ist für Tests gedacht. Es prüft nur die Struktur — Netzwerk, Länge, Prüfsumme — und weiß nichts darüber, ob eine Karte aktiv ist oder Guthaben hat.' },
];

const VALIDATOR_FAQS_ES: SEOFaq[] = [
  { q: '¿Cómo funciona la validación de tarjetas?', a: 'El validador comprueba el número según varios criterios: identifica la red por el rango BIN, controla la longitud admitida y verifica la suma de Luhn.' },
  { q: '¿Qué muestra el resultado?', a: 'La red detectada, si la longitud es válida para ella, si el número supera Luhn y un mensaje de estado legible.' },
  { q: '¿Puedo validar tarjetas reales?', a: 'La herramienta es para pruebas. Solo comprueba la estructura —red, longitud y suma— y no sabe si una tarjeta está activa o tiene fondos.' },
];

const VALIDATOR_FAQS_FR: SEOFaq[] = [
  { q: 'Comment fonctionne la validation de carte ?', a: 'Le validateur contrôle le numéro selon plusieurs critères : il identifie le réseau via la plage BIN, vérifie la longueur admise et la somme de Luhn.' },
  { q: 'Qu’affiche le résultat ?', a: 'Le réseau détecté, si la longueur lui convient, si le numéro passe Luhn, et un message d’état lisible.' },
  { q: 'Puis-je valider de vraies cartes ?', a: 'L’outil sert aux tests. Il ne vérifie que la structure — réseau, longueur, somme de contrôle — et ignore si une carte est active ou approvisionnée.' },
];

const VALIDATOR_FAQS_PT: SEOFaq[] = [
  { q: 'Como funciona a validação de cartão?', a: 'O validador confere o número por vários critérios: identifica a rede pela faixa BIN, controla o comprimento admitido e verifica o checksum de Luhn.' },
  { q: 'O que o resultado mostra?', a: 'A rede detectada, se o comprimento é válido para ela, se o número passa no Luhn e uma mensagem de status legível.' },
  { q: 'Posso validar cartões reais?', a: 'A ferramenta é para testes. Ela só confere a estrutura — rede, comprimento e checksum — e não sabe se um cartão está ativo ou tem saldo.' },
];

const BIN_LOOKUP_FAQS: SEOFaq[] = [
  { q: 'What is a BIN lookup?', a: 'A BIN (Bank Identification Number) lookup identifies the card network, issuing bank, card type, and country from the first 6-8 digits of a card number.' },
  { q: 'Is BIN data accurate?', a: 'BIN ranges are based on publicly available IIN registry data and are accurate for testing purposes. For production BIN lookups, use a dedicated BIN database service.' },
  { q: 'What information does a BIN lookup provide?', a: 'A BIN lookup typically reveals: the card network (Visa, Mastercard, etc.), card type (credit, debit, prepaid), issuing country, and sometimes the issuing bank name.' },
];

const BIN_LOOKUP_FAQS_RU: SEOFaq[] = [
  { q: 'Что такое поиск по BIN?', a: 'Поиск по BIN (Bank Identification Number) определяет платёжную систему, банк-эмитент, тип карты и страну по первым 6–8 цифрам номера.' },
  { q: 'Насколько точны данные BIN?', a: 'Диапазоны BIN берутся из общедоступного реестра IIN и точны для целей тестирования. Для боевых задач нужен специализированный сервис BIN-данных.' },
  { q: 'Что даёт поиск по BIN?', a: 'Обычно — платёжную систему (Visa, Mastercard и т.д.), тип карты (кредитная, дебетовая, предоплаченная), страну выпуска, а иногда и название банка.' },
];

const BIN_LOOKUP_FAQS_DE: SEOFaq[] = [
  { q: 'Was ist eine BIN-Abfrage?', a: 'Eine BIN-Abfrage (Bank Identification Number) bestimmt aus den ersten 6 bis 8 Ziffern einer Kartennummer das Netzwerk, die herausgebende Bank, den Kartentyp und das Land.' },
  { q: 'Wie genau sind die BIN-Daten?', a: 'Die BIN-Bereiche stammen aus dem öffentlich verfügbaren IIN-Register und sind für Testzwecke genau. Im Produktivbetrieb ist ein spezialisierter BIN-Datendienst nötig.' },
  { q: 'Was liefert eine BIN-Abfrage?', a: 'Meist das Kartennetzwerk (Visa, Mastercard und andere), den Kartentyp (Kredit, Debit, Prepaid), das Ausgabeland und manchmal den Namen der Bank.' },
];

const BIN_LOOKUP_FAQS_ES: SEOFaq[] = [
  { q: '¿Qué es una consulta de BIN?', a: 'Una consulta de BIN (Bank Identification Number) identifica, a partir de los primeros 6-8 dígitos, la red de la tarjeta, el banco emisor, el tipo de tarjeta y el país.' },
  { q: '¿Son exactos los datos de BIN?', a: 'Los rangos BIN proceden del registro IIN público y son exactos para pruebas. Para producción conviene un servicio especializado de datos BIN.' },
  { q: '¿Qué información devuelve?', a: 'Normalmente la red (Visa, Mastercard, etc.), el tipo de tarjeta (crédito, débito, prepago), el país de emisión y a veces el nombre del banco.' },
];

const BIN_LOOKUP_FAQS_FR: SEOFaq[] = [
  { q: 'Qu’est-ce qu’une recherche BIN ?', a: 'Une recherche BIN (Bank Identification Number) identifie, à partir des 6 à 8 premiers chiffres, le réseau de la carte, la banque émettrice, le type de carte et le pays.' },
  { q: 'Les données BIN sont-elles fiables ?', a: 'Les plages BIN proviennent du registre IIN public et sont fiables pour les tests. En production, utilisez un service spécialisé de données BIN.' },
  { q: 'Que renvoie une recherche BIN ?', a: 'En général le réseau (Visa, Mastercard, etc.), le type de carte (crédit, débit, prépayée), le pays d’émission et parfois le nom de la banque.' },
];

const BIN_LOOKUP_FAQS_PT: SEOFaq[] = [
  { q: 'O que é uma consulta de BIN?', a: 'Uma consulta de BIN (Bank Identification Number) identifica, a partir dos primeiros 6 a 8 dígitos, a rede do cartão, o banco emissor, o tipo de cartão e o país.' },
  { q: 'Os dados de BIN são precisos?', a: 'As faixas BIN vêm do registro IIN público e são precisas para testes. Em produção, use um serviço especializado de dados BIN.' },
  { q: 'O que uma consulta de BIN devolve?', a: 'Normalmente a rede (Visa, Mastercard, etc.), o tipo de cartão (crédito, débito, pré-pago), o país de emissão e às vezes o nome do banco.' },
];

const CVV_FAQS: SEOFaq[] = [
  { q: 'What is a CVV?', a: 'CVV (Card Verification Value) is a 3-4 digit security code printed on credit cards. Visa, Mastercard, and Discover use 3-digit codes; American Express uses 4-digit codes.' },
  { q: 'Are generated CVVs valid?', a: 'Generated CVVs are random 3-4 digit numbers that match the correct format. They are not tied to any real card and are for testing purposes only.' },
  { q: 'What is the difference between CVV, CVC, and CID?', a: 'These are different names for the same security feature: CVV (Visa), CVC (Mastercard), CID (American Express/Discover). All serve the same purpose of verifying card-not-present transactions.' },
];

const CVV_FAQS_RU: SEOFaq[] = [
  { q: 'Что такое CVV?', a: 'CVV (Card Verification Value) — код безопасности из трёх-четырёх цифр, напечатанный на карте. У Visa, Mastercard и Discover он трёхзначный, у American Express — четырёхзначный.' },
  { q: 'Действительны ли сгенерированные CVV?', a: 'Это случайные числа нужной длины и формата. Они не привязаны ни к какой реальной карте и годятся только для тестирования.' },
  { q: 'Чем отличаются CVV, CVC и CID?', a: 'Это разные названия одного и того же: CVV у Visa, CVC у Mastercard, CID у American Express и Discover. Назначение одно — подтверждать операции без физической карты.' },
];

const CVV_FAQS_DE: SEOFaq[] = [
  { q: 'Was ist ein CVV?', a: 'Der CVV (Card Verification Value) ist ein drei- bis vierstelliger Sicherheitscode auf der Karte. Visa, Mastercard und Discover nutzen drei Stellen, American Express vier.' },
  { q: 'Sind die erzeugten CVVs gültig?', a: 'Es sind Zufallszahlen in der richtigen Länge und Form. Sie gehören zu keiner echten Karte und taugen nur für Tests.' },
  { q: 'Worin unterscheiden sich CVV, CVC und CID?', a: 'Das sind verschiedene Namen für dasselbe Merkmal: CVV bei Visa, CVC bei Mastercard, CID bei American Express und Discover. Der Zweck ist stets die Absicherung von Zahlungen ohne physische Karte.' },
];

const CVV_FAQS_ES: SEOFaq[] = [
  { q: '¿Qué es el CVV?', a: 'El CVV (Card Verification Value) es un código de seguridad de tres o cuatro dígitos impreso en la tarjeta. Visa, Mastercard y Discover usan tres; American Express, cuatro.' },
  { q: '¿Son válidos los CVV generados?', a: 'Son números aleatorios con la longitud y el formato correctos. No están vinculados a ninguna tarjeta real y solo sirven para pruebas.' },
  { q: '¿En qué se diferencian CVV, CVC y CID?', a: 'Son nombres distintos para lo mismo: CVV en Visa, CVC en Mastercard, CID en American Express y Discover. Todos sirven para verificar pagos sin tarjeta presente.' },
];

const CVV_FAQS_FR: SEOFaq[] = [
  { q: 'Qu’est-ce que le CVV ?', a: 'Le CVV (Card Verification Value) est un code de sécurité à trois ou quatre chiffres imprimé sur la carte. Visa, Mastercard et Discover en utilisent trois ; American Express, quatre.' },
  { q: 'Les CVV générés sont-ils valides ?', a: 'Ce sont des nombres aléatoires de la bonne longueur et du bon format. Ils ne sont liés à aucune carte réelle et ne servent qu’aux tests.' },
  { q: 'Quelle différence entre CVV, CVC et CID ?', a: 'Ce sont des noms différents pour la même chose : CVV chez Visa, CVC chez Mastercard, CID chez American Express et Discover. Tous servent à vérifier les paiements sans carte présente.' },
];

const CVV_FAQS_PT: SEOFaq[] = [
  { q: 'O que é o CVV?', a: 'O CVV (Card Verification Value) é um código de segurança de três ou quatro dígitos impresso no cartão. Visa, Mastercard e Discover usam três; a American Express, quatro.' },
  { q: 'Os CVVs gerados são válidos?', a: 'São números aleatórios com o comprimento e o formato certos. Não estão ligados a nenhum cartão real e servem apenas para testes.' },
  { q: 'Qual é a diferença entre CVV, CVC e CID?', a: 'São nomes diferentes para a mesma coisa: CVV na Visa, CVC na Mastercard, CID na American Express e Discover. Todos servem para verificar pagamentos sem cartão presente.' },
];

/* ── SEO Pages Registry ──────────────────────────────────────────────────────── */

export const PAYMENT_SEO_PAGES: Record<string, PaymentSEOPageConfig> = {
  'credit-card-generator': {
    id: 'credit-card-generator',
    slug: 'credit-card-generator',
    title: 'Credit Card Generator — Test Card Numbers',
    description: 'Generate valid test card numbers for Visa, Mastercard, Amex, Discover, JCB and 10 more networks. Luhn-valid, with several export formats.',
    heroTitle: 'Credit Card Generator',
    heroSubtitle: 'Generate valid test card numbers for 15+ payment networks. Every number is generated algorithmically, passes Luhn and is safe for development and testing.',
    faqs: CREDIT_CARD_FAQS,
    locales: {
      ru: {
        title: 'Генератор тестовых номеров карт',
        description: 'Генерируйте тестовые номера карт Visa, Mastercard, Amex, Discover, JCB и ещё 10 платёжных систем. Проходят проверку Луна, есть экспорт в разные форматы.',
        heroTitle: 'Генератор номеров банковских карт',
        heroSubtitle: 'Тестовые номера карт для 15+ платёжных систем. Каждый номер получен алгоритмически, проходит проверку Луна и безопасен для разработки и тестирования.',
        faqs: CREDIT_CARD_FAQS_RU,
      },
      de: {
        title: 'Kreditkartengenerator — Testkartennummern',
        description: 'Erzeugen Sie gültige Testkartennummern für Visa, Mastercard, Amex, Discover, JCB und 10 weitere Netzwerke. Luhn-gültig, mit mehreren Exportformaten.',
        heroTitle: 'Kreditkartengenerator',
        heroSubtitle: 'Testkartennummern für über 15 Zahlungsnetzwerke. Jede Nummer entsteht algorithmisch, besteht die Luhn-Prüfung und ist für Entwicklung und Tests unbedenklich.',
        faqs: CREDIT_CARD_FAQS_DE,
      },
      es: {
        title: 'Generador de tarjetas — números de prueba',
        description: 'Genere números de tarjeta de prueba para Visa, Mastercard, Amex, Discover, JCB y 10 redes más. Válidos según Luhn y con varios formatos de exportación.',
        heroTitle: 'Generador de tarjetas de crédito',
        heroSubtitle: 'Números de tarjeta de prueba para más de 15 redes de pago. Cada número se genera algorítmicamente, supera Luhn y es seguro para desarrollo y pruebas.',
        faqs: CREDIT_CARD_FAQS_ES,
      },
      fr: {
        title: 'Générateur de cartes — numéros de test',
        description: 'Générez des numéros de carte de test pour Visa, Mastercard, Amex, Discover, JCB et 10 autres réseaux. Valides selon Luhn, avec plusieurs formats d’export.',
        heroTitle: 'Générateur de cartes bancaires',
        heroSubtitle: 'Numéros de carte de test pour plus de 15 réseaux de paiement. Chaque numéro est généré algorithmiquement, passe Luhn et convient au développement et aux tests.',
        faqs: CREDIT_CARD_FAQS_FR,
      },
      pt: {
        title: 'Gerador de cartões — números de teste',
        description: 'Gere números de cartão de teste para Visa, Mastercard, Amex, Discover, JCB e mais 10 redes. Válidos por Luhn e com vários formatos de exportação.',
        heroTitle: 'Gerador de cartões de crédito',
        heroSubtitle: 'Números de cartão de teste para mais de 15 redes de pagamento. Cada número é gerado algoritmicamente, passa no Luhn e é seguro para desenvolvimento e testes.',
        faqs: CREDIT_CARD_FAQS_PT,
      },
    },
  },
  'visa-card-generator': {
    id: 'visa-card-generator',
    slug: 'visa-card-generator',
    title: 'Visa Card Generator — Test Visa Numbers',
    description: 'Generate valid test Visa card numbers starting with 4. Free Visa generator for payment testing, with Luhn validation.',
    heroTitle: 'Visa Card Generator',
    heroSubtitle: 'Generate valid test Visa card numbers. Every number uses the 4xxx BIN range and passes Luhn validation.',
    faqs: NETWORK_FAQS,
    locales: {
      ru: {
        title: 'Генератор тестовых карт Visa',
        description: 'Генерируйте тестовые номера карт Visa, начинающиеся с 4. Бесплатно, для тестирования платежей, с проверкой Луна.',
        heroTitle: 'Генератор карт Visa',
        heroSubtitle: 'Тестовые номера карт Visa. Все номера лежат в диапазоне BIN 4xxx и проходят проверку Луна.',
        faqs: NETWORK_FAQS_RU,
      },
      de: {
        title: 'Visa-Kartengenerator — Testnummern',
        description: 'Erzeugen Sie gültige Visa-Testkartennummern, die mit 4 beginnen. Kostenlos, für Zahlungstests, mit Luhn-Prüfung.',
        heroTitle: 'Visa-Kartengenerator',
        heroSubtitle: 'Gültige Visa-Testkartennummern. Jede Nummer liegt im BIN-Bereich 4xxx und besteht die Luhn-Prüfung.',
        faqs: NETWORK_FAQS_DE,
      },
      es: {
        title: 'Generador de tarjetas Visa de prueba',
        description: 'Genere números de tarjeta Visa de prueba que empiezan por 4. Gratis, para pruebas de pago, con validación Luhn.',
        heroTitle: 'Generador de tarjetas Visa',
        heroSubtitle: 'Números de tarjeta Visa de prueba. Todos usan el rango BIN 4xxx y superan la validación Luhn.',
        faqs: NETWORK_FAQS_ES,
      },
      fr: {
        title: 'Générateur de cartes Visa de test',
        description: 'Générez des numéros de carte Visa de test commençant par 4. Gratuit, pour les tests de paiement, avec validation Luhn.',
        heroTitle: 'Générateur de cartes Visa',
        heroSubtitle: 'Numéros de carte Visa de test. Tous relèvent de la plage BIN 4xxx et passent la validation Luhn.',
        faqs: NETWORK_FAQS_FR,
      },
      pt: {
        title: 'Gerador de cartões Visa de teste',
        description: 'Gere números de cartão Visa de teste começando por 4. Grátis, para testes de pagamento, com validação Luhn.',
        heroTitle: 'Gerador de cartões Visa',
        heroSubtitle: 'Números de cartão Visa de teste. Todos usam a faixa BIN 4xxx e passam na validação Luhn.',
        faqs: NETWORK_FAQS_PT,
      },
    },
  },
  'mastercard-generator': {
    id: 'mastercard-generator',
    slug: 'mastercard-generator',
    title: 'Mastercard Generator — Test Card Numbers',
    description: 'Generate valid test Mastercard numbers in the 51-55 and 2221-2720 BIN ranges. Free Mastercard generator.',
    heroTitle: 'Mastercard Generator',
    heroSubtitle: 'Generate valid test Mastercard numbers. Covers both the 51-55 range and the newer 2-series BIN range.',
    faqs: NETWORK_FAQS,
    locales: {
      ru: {
        title: 'Генератор тестовых карт Mastercard',
        description: 'Генерируйте тестовые номера Mastercard в диапазонах BIN 51–55 и 2221–2720. Бесплатно.',
        heroTitle: 'Генератор карт Mastercard',
        heroSubtitle: 'Тестовые номера карт Mastercard. Поддерживаются и диапазон 51–55, и более новый диапазон на 2.',
        faqs: NETWORK_FAQS_RU,
      },
      de: {
        title: 'Mastercard-Generator — Testkartennummern',
        description: 'Erzeugen Sie gültige Mastercard-Testnummern in den BIN-Bereichen 51–55 und 2221–2720. Kostenlos.',
        heroTitle: 'Mastercard-Generator',
        heroSubtitle: 'Gültige Mastercard-Testnummern. Abgedeckt sind der Bereich 51–55 und der neuere 2er-BIN-Bereich.',
        faqs: NETWORK_FAQS_DE,
      },
      es: {
        title: 'Generador de Mastercard de prueba',
        description: 'Genere números Mastercard de prueba en los rangos BIN 51-55 y 2221-2720. Gratis.',
        heroTitle: 'Generador de Mastercard',
        heroSubtitle: 'Números Mastercard de prueba. Cubre tanto el rango 51-55 como el más reciente rango BIN de la serie 2.',
        faqs: NETWORK_FAQS_ES,
      },
      fr: {
        title: 'Générateur de Mastercard de test',
        description: 'Générez des numéros Mastercard de test dans les plages BIN 51-55 et 2221-2720. Gratuit.',
        heroTitle: 'Générateur de Mastercard',
        heroSubtitle: 'Numéros Mastercard de test. Couvre la plage 51-55 et la plage BIN plus récente de la série 2.',
        faqs: NETWORK_FAQS_FR,
      },
      pt: {
        title: 'Gerador de Mastercard de teste',
        description: 'Gere números Mastercard de teste nas faixas BIN 51-55 e 2221-2720. Grátis.',
        heroTitle: 'Gerador de Mastercard',
        heroSubtitle: 'Números Mastercard de teste. Abrange tanto a faixa 51-55 quanto a mais recente faixa BIN da série 2.',
        faqs: NETWORK_FAQS_PT,
      },
    },
  },
  'amex-card-generator': {
    id: 'amex-card-generator',
    slug: 'amex-card-generator',
    title: 'American Express Generator — Test Amex Numbers',
    description: 'Generate valid test American Express numbers starting with 34 or 37. Free Amex generator with a 4-digit CVV.',
    heroTitle: 'American Express Generator',
    heroSubtitle: 'Generate valid test American Express numbers. Amex uses 15 digits, a 34 or 37 prefix and a 4-digit CVV.',
    faqs: NETWORK_FAQS,
    locales: {
      ru: {
        title: 'Генератор тестовых карт American Express',
        description: 'Генерируйте тестовые номера American Express, начинающиеся с 34 или 37. Бесплатно, с четырёхзначным CVV.',
        heroTitle: 'Генератор карт American Express',
        heroSubtitle: 'Тестовые номера American Express. У Amex 15 цифр, префикс 34 или 37 и четырёхзначный CVV.',
        faqs: NETWORK_FAQS_RU,
      },
      de: {
        title: 'American-Express-Generator — Testnummern',
        description: 'Erzeugen Sie gültige American-Express-Testnummern, die mit 34 oder 37 beginnen. Kostenlos, mit vierstelligem CVV.',
        heroTitle: 'American-Express-Generator',
        heroSubtitle: 'Gültige American-Express-Testnummern. Amex nutzt 15 Stellen, das Präfix 34 oder 37 und einen vierstelligen CVV.',
        faqs: NETWORK_FAQS_DE,
      },
      es: {
        title: 'Generador de American Express de prueba',
        description: 'Genere números American Express de prueba que empiezan por 34 o 37. Gratis, con CVV de 4 dígitos.',
        heroTitle: 'Generador de American Express',
        heroSubtitle: 'Números American Express de prueba. Amex usa 15 dígitos, prefijo 34 o 37 y un CVV de 4 dígitos.',
        faqs: NETWORK_FAQS_ES,
      },
      fr: {
        title: 'Générateur d’American Express de test',
        description: 'Générez des numéros American Express de test commençant par 34 ou 37. Gratuit, avec un CVV à 4 chiffres.',
        heroTitle: 'Générateur d’American Express',
        heroSubtitle: 'Numéros American Express de test. Amex utilise 15 chiffres, un préfixe 34 ou 37 et un CVV à 4 chiffres.',
        faqs: NETWORK_FAQS_FR,
      },
      pt: {
        title: 'Gerador de American Express de teste',
        description: 'Gere números American Express de teste começando por 34 ou 37. Grátis, com CVV de 4 dígitos.',
        heroTitle: 'Gerador de American Express',
        heroSubtitle: 'Números American Express de teste. A Amex usa 15 dígitos, prefixo 34 ou 37 e um CVV de 4 dígitos.',
        faqs: NETWORK_FAQS_PT,
      },
    },
  },
  'discover-card-generator': {
    id: 'discover-card-generator',
    slug: 'discover-card-generator',
    title: 'Discover Card Generator — Test Card Numbers',
    description: 'Generate valid test Discover card numbers in the 6011, 622126-622925, 644-649 and 65 BIN ranges. Free.',
    heroTitle: 'Discover Card Generator',
    heroSubtitle: 'Generate valid test Discover card numbers across every Discover BIN range.',
    faqs: NETWORK_FAQS,
    locales: {
      ru: {
        title: 'Генератор тестовых карт Discover',
        description: 'Генерируйте тестовые номера Discover в диапазонах BIN 6011, 622126–622925, 644–649 и 65. Бесплатно.',
        heroTitle: 'Генератор карт Discover',
        heroSubtitle: 'Тестовые номера карт Discover во всех диапазонах BIN этой системы.',
        faqs: NETWORK_FAQS_RU,
      },
      de: {
        title: 'Discover-Kartengenerator — Testnummern',
        description: 'Erzeugen Sie gültige Discover-Testkartennummern in den BIN-Bereichen 6011, 622126–622925, 644–649 und 65. Kostenlos.',
        heroTitle: 'Discover-Kartengenerator',
        heroSubtitle: 'Gültige Discover-Testkartennummern aus allen BIN-Bereichen dieses Netzwerks.',
        faqs: NETWORK_FAQS_DE,
      },
      es: {
        title: 'Generador de tarjetas Discover de prueba',
        description: 'Genere números Discover de prueba en los rangos BIN 6011, 622126-622925, 644-649 y 65. Gratis.',
        heroTitle: 'Generador de tarjetas Discover',
        heroSubtitle: 'Números de tarjeta Discover de prueba en todos los rangos BIN de esa red.',
        faqs: NETWORK_FAQS_ES,
      },
      fr: {
        title: 'Générateur de cartes Discover de test',
        description: 'Générez des numéros Discover de test dans les plages BIN 6011, 622126-622925, 644-649 et 65. Gratuit.',
        heroTitle: 'Générateur de cartes Discover',
        heroSubtitle: 'Numéros de carte Discover de test dans toutes les plages BIN de ce réseau.',
        faqs: NETWORK_FAQS_FR,
      },
      pt: {
        title: 'Gerador de cartões Discover de teste',
        description: 'Gere números Discover de teste nas faixas BIN 6011, 622126-622925, 644-649 e 65. Grátis.',
        heroTitle: 'Gerador de cartões Discover',
        heroSubtitle: 'Números de cartão Discover de teste em todas as faixas BIN dessa rede.',
        faqs: NETWORK_FAQS_PT,
      },
    },
  },
  'jcb-card-generator': {
    id: 'jcb-card-generator',
    slug: 'jcb-card-generator',
    title: 'JCB Card Generator — Test JCB Card Numbers',
    description: 'Generate valid test JCB card numbers in the 3528-3589 BIN range. Free JCB card generator.',
    heroTitle: 'JCB Card Generator',
    heroSubtitle: 'Generate valid test JCB card numbers for testing Japanese payment systems.',
    faqs: NETWORK_FAQS,
    locales: {
      ru: {
        title: 'Генератор тестовых карт JCB',
        description: 'Генерируйте тестовые номера карт JCB в диапазоне BIN 3528–3589. Бесплатно.',
        heroTitle: 'Генератор карт JCB',
        heroSubtitle: 'Тестовые номера карт JCB для проверки японских платёжных систем.',
        faqs: NETWORK_FAQS_RU,
      },
      de: {
        title: 'JCB-Kartengenerator — Testkartennummern',
        description: 'Erzeugen Sie gültige JCB-Testkartennummern im BIN-Bereich 3528–3589. Kostenlos.',
        heroTitle: 'JCB-Kartengenerator',
        heroSubtitle: 'Gültige JCB-Testkartennummern zum Prüfen japanischer Zahlungssysteme.',
        faqs: NETWORK_FAQS_DE,
      },
      es: {
        title: 'Generador de tarjetas JCB de prueba',
        description: 'Genere números de tarjeta JCB de prueba en el rango BIN 3528-3589. Gratis.',
        heroTitle: 'Generador de tarjetas JCB',
        heroSubtitle: 'Números de tarjeta JCB de prueba para comprobar sistemas de pago japoneses.',
        faqs: NETWORK_FAQS_ES,
      },
      fr: {
        title: 'Générateur de cartes JCB de test',
        description: 'Générez des numéros de carte JCB de test dans la plage BIN 3528-3589. Gratuit.',
        heroTitle: 'Générateur de cartes JCB',
        heroSubtitle: 'Numéros de carte JCB de test pour éprouver les systèmes de paiement japonais.',
        faqs: NETWORK_FAQS_FR,
      },
      pt: {
        title: 'Gerador de cartões JCB de teste',
        description: 'Gere números de cartão JCB de teste na faixa BIN 3528-3589. Grátis.',
        heroTitle: 'Gerador de cartões JCB',
        heroSubtitle: 'Números de cartão JCB de teste para verificar sistemas de pagamento japoneses.',
        faqs: NETWORK_FAQS_PT,
      },
    },
  },
  'test-credit-card-numbers': {
    id: 'test-credit-card-numbers',
    slug: 'test-credit-card-numbers',
    title: 'Test Credit Card Numbers — Full Reference',
    description: 'A complete reference of test card numbers for every major payment network, including the Stripe, PayPal, Adyen and Braintree test cards.',
    heroTitle: 'Test Credit Card Numbers',
    heroSubtitle: 'A complete reference of test card numbers for every payment network and gateway, including the official Stripe, PayPal, Adyen and Braintree cards.',
    faqs: CREDIT_CARD_FAQS,
    locales: {
      ru: {
        title: 'Тестовые номера карт — полный справочник',
        description: 'Полный справочник тестовых номеров карт для всех основных платёжных систем, включая карты Stripe, PayPal, Adyen и Braintree.',
        heroTitle: 'Тестовые номера банковских карт',
        heroSubtitle: 'Полный справочник тестовых номеров карт для всех платёжных систем и шлюзов, включая официальные карты Stripe, PayPal, Adyen и Braintree.',
        faqs: CREDIT_CARD_FAQS_RU,
      },
      de: {
        title: 'Test-Kartennummern — vollständige Übersicht',
        description: 'Eine vollständige Übersicht der Testkartennummern für alle großen Zahlungsnetzwerke, samt der Testkarten von Stripe, PayPal, Adyen und Braintree.',
        heroTitle: 'Test-Kreditkartennummern',
        heroSubtitle: 'Eine vollständige Übersicht der Testkartennummern für alle Zahlungsnetzwerke und Gateways, samt der offiziellen Karten von Stripe, PayPal, Adyen und Braintree.',
        faqs: CREDIT_CARD_FAQS_DE,
      },
      es: {
        title: 'Números de tarjeta de prueba — referencia',
        description: 'Una referencia completa de números de tarjeta de prueba para todas las grandes redes de pago, incluidas las tarjetas de Stripe, PayPal, Adyen y Braintree.',
        heroTitle: 'Números de tarjeta de prueba',
        heroSubtitle: 'Una referencia completa de números de tarjeta de prueba para todas las redes y pasarelas de pago, incluidas las tarjetas oficiales de Stripe, PayPal, Adyen y Braintree.',
        faqs: CREDIT_CARD_FAQS_ES,
      },
      fr: {
        title: 'Numéros de carte de test — référence complète',
        description: 'Une référence complète des numéros de carte de test pour tous les grands réseaux de paiement, y compris les cartes Stripe, PayPal, Adyen et Braintree.',
        heroTitle: 'Numéros de carte de test',
        heroSubtitle: 'Une référence complète des numéros de carte de test pour tous les réseaux et passerelles de paiement, y compris les cartes officielles Stripe, PayPal, Adyen et Braintree.',
        faqs: CREDIT_CARD_FAQS_FR,
      },
      pt: {
        title: 'Números de cartão de teste — referência',
        description: 'Uma referência completa de números de cartão de teste para todas as grandes redes de pagamento, incluindo os cartões de Stripe, PayPal, Adyen e Braintree.',
        heroTitle: 'Números de cartão de teste',
        heroSubtitle: 'Uma referência completa de números de cartão de teste para todas as redes e gateways de pagamento, incluindo os cartões oficiais de Stripe, PayPal, Adyen e Braintree.',
        faqs: CREDIT_CARD_FAQS_PT,
      },
    },
  },
  'credit-card-validator': {
    id: 'credit-card-validator',
    slug: 'credit-card-validator',
    title: 'Credit Card Validator — Check Card Numbers',
    description: 'Validate card numbers as you type. Detects the network, checks the length and verifies the Luhn checksum. Free.',
    heroTitle: 'Credit Card Validator',
    heroSubtitle: 'Validate card numbers instantly: detect the network, check the length and verify the Luhn checksum.',
    faqs: VALIDATOR_FAQS,
    locales: {
      ru: {
        title: 'Проверка номера банковской карты',
        description: 'Проверяйте номера карт на лету: определение платёжной системы, контроль длины и проверка по алгоритму Луна. Бесплатно.',
        heroTitle: 'Валидатор номеров карт',
        heroSubtitle: 'Мгновенная проверка номера карты: платёжная система, допустимая длина и контрольная сумма Луна.',
        faqs: VALIDATOR_FAQS_RU,
      },
      de: {
        title: 'Kreditkartenprüfer — Kartennummern prüfen',
        description: 'Prüfen Sie Kartennummern beim Tippen: Netzwerk erkennen, Länge kontrollieren und die Luhn-Prüfsumme verifizieren. Kostenlos.',
        heroTitle: 'Kreditkartenvalidator',
        heroSubtitle: 'Kartennummern sofort prüfen: Netzwerk erkennen, Länge kontrollieren, Luhn-Prüfsumme verifizieren.',
        faqs: VALIDATOR_FAQS_DE,
      },
      es: {
        title: 'Validador de tarjetas — comprobar números',
        description: 'Valide números de tarjeta mientras escribe: detecta la red, comprueba la longitud y verifica la suma Luhn. Gratis.',
        heroTitle: 'Validador de tarjetas de crédito',
        heroSubtitle: 'Valide números de tarjeta al instante: detecte la red, compruebe la longitud y verifique la suma Luhn.',
        faqs: VALIDATOR_FAQS_ES,
      },
      fr: {
        title: 'Validateur de cartes — vérifier un numéro',
        description: 'Validez les numéros de carte au fil de la saisie : détection du réseau, contrôle de la longueur et vérification de la somme de Luhn. Gratuit.',
        heroTitle: 'Validateur de cartes bancaires',
        heroSubtitle: 'Validez un numéro de carte instantanément : détecter le réseau, contrôler la longueur, vérifier la somme de Luhn.',
        faqs: VALIDATOR_FAQS_FR,
      },
      pt: {
        title: 'Validador de cartões — verificar números',
        description: 'Valide números de cartão enquanto digita: detecta a rede, confere o comprimento e verifica o checksum de Luhn. Grátis.',
        heroTitle: 'Validador de cartões de crédito',
        heroSubtitle: 'Valide números de cartão na hora: detecte a rede, confira o comprimento e verifique o checksum de Luhn.',
        faqs: VALIDATOR_FAQS_PT,
      },
    },
  },
  'bin-lookup': {
    id: 'bin-lookup',
    slug: 'bin-lookup',
    title: 'BIN Lookup — Identify Card Issuer Numbers',
    description: 'Look up BIN/IIN numbers to identify the card network. Free BIN lookup for payment testing.',
    heroTitle: 'BIN Lookup',
    heroSubtitle: 'Identify the card network and BIN range from the first 6-8 digits of any card number.',
    faqs: BIN_LOOKUP_FAQS,
    locales: {
      ru: {
        title: 'Поиск по BIN — определить платёжную систему',
        description: 'Определяйте платёжную систему по номерам BIN/IIN. Бесплатный поиск по BIN для тестирования платежей.',
        heroTitle: 'Поиск по BIN',
        heroSubtitle: 'Определяйте платёжную систему и диапазон BIN по первым 6–8 цифрам любого номера карты.',
        faqs: BIN_LOOKUP_FAQS_RU,
      },
      de: {
        title: 'BIN-Abfrage — Kartenherausgeber erkennen',
        description: 'Schlagen Sie BIN/IIN-Nummern nach, um das Kartennetzwerk zu bestimmen. Kostenlos, für Zahlungstests.',
        heroTitle: 'BIN-Abfrage',
        heroSubtitle: 'Bestimmen Sie Kartennetzwerk und BIN-Bereich anhand der ersten 6 bis 8 Stellen einer Kartennummer.',
        faqs: BIN_LOOKUP_FAQS_DE,
      },
      es: {
        title: 'Consulta de BIN — identificar la red emisora',
        description: 'Consulte números BIN/IIN para identificar la red de la tarjeta. Gratis, para pruebas de pago.',
        heroTitle: 'Consulta de BIN',
        heroSubtitle: 'Identifique la red de la tarjeta y el rango BIN a partir de los primeros 6-8 dígitos de cualquier número.',
        faqs: BIN_LOOKUP_FAQS_ES,
      },
      fr: {
        title: 'Recherche BIN — identifier l’émetteur',
        description: 'Recherchez des numéros BIN/IIN pour identifier le réseau de la carte. Gratuit, pour les tests de paiement.',
        heroTitle: 'Recherche BIN',
        heroSubtitle: 'Identifiez le réseau de la carte et la plage BIN à partir des 6 à 8 premiers chiffres d’un numéro.',
        faqs: BIN_LOOKUP_FAQS_FR,
      },
      pt: {
        title: 'Consulta de BIN — identificar o emissor',
        description: 'Consulte números BIN/IIN para identificar a rede do cartão. Grátis, para testes de pagamento.',
        heroTitle: 'Consulta de BIN',
        heroSubtitle: 'Identifique a rede do cartão e a faixa BIN a partir dos primeiros 6 a 8 dígitos de qualquer número.',
        faqs: BIN_LOOKUP_FAQS_PT,
      },
    },
  },
  'cvv-generator': {
    id: 'cvv-generator',
    slug: 'cvv-generator',
    title: 'CVV Generator — Create Test CVV/CVC Codes',
    description: 'Generate random test CVV codes for Visa, Mastercard, Amex and Discover. Free CVV generator for payment testing.',
    heroTitle: 'CVV Generator',
    heroSubtitle: 'Generate random test CVV codes for every major network: three digits for most, four for American Express.',
    faqs: CVV_FAQS,
    locales: {
      ru: {
        title: 'Генератор тестовых кодов CVV и CVC',
        description: 'Генерируйте случайные тестовые коды CVV для Visa, Mastercard, Amex и Discover. Бесплатно, для тестирования платежей.',
        heroTitle: 'Генератор CVV',
        heroSubtitle: 'Случайные тестовые коды CVV для всех основных платёжных систем: три цифры для большинства и четыре для American Express.',
        faqs: CVV_FAQS_RU,
      },
      de: {
        title: 'CVV-Generator — Test-CVV/CVC-Codes',
        description: 'Erzeugen Sie zufällige Test-CVV-Codes für Visa, Mastercard, Amex und Discover. Kostenlos, für Zahlungstests.',
        heroTitle: 'CVV-Generator',
        heroSubtitle: 'Zufällige Test-CVV-Codes für alle großen Netzwerke: drei Stellen bei den meisten, vier bei American Express.',
        faqs: CVV_FAQS_DE,
      },
      es: {
        title: 'Generador de CVV — códigos CVV/CVC de prueba',
        description: 'Genere códigos CVV de prueba aleatorios para Visa, Mastercard, Amex y Discover. Gratis, para pruebas de pago.',
        heroTitle: 'Generador de CVV',
        heroSubtitle: 'Códigos CVV de prueba aleatorios para todas las grandes redes: tres dígitos en la mayoría y cuatro en American Express.',
        faqs: CVV_FAQS_ES,
      },
      fr: {
        title: 'Générateur de CVV — codes CVV/CVC de test',
        description: 'Générez des codes CVV de test aléatoires pour Visa, Mastercard, Amex et Discover. Gratuit, pour les tests de paiement.',
        heroTitle: 'Générateur de CVV',
        heroSubtitle: 'Codes CVV de test aléatoires pour tous les grands réseaux : trois chiffres pour la plupart, quatre pour American Express.',
        faqs: CVV_FAQS_FR,
      },
      pt: {
        title: 'Gerador de CVV — códigos CVV/CVC de teste',
        description: 'Gere códigos CVV de teste aleatórios para Visa, Mastercard, Amex e Discover. Grátis, para testes de pagamento.',
        heroTitle: 'Gerador de CVV',
        heroSubtitle: 'Códigos CVV de teste aleatórios para todas as grandes redes: três dígitos na maioria e quatro na American Express.',
        faqs: CVV_FAQS_PT,
      },
    },
  },
  'bulk-credit-card-generator': {
    id: 'bulk-credit-card-generator',
    slug: 'bulk-credit-card-generator',
    title: 'Bulk Credit Card Generator — 1000 at a Time',
    description: 'Generate test card numbers in bulk and export them as TXT, CSV, JSON, SQL, XML or YAML. Free, with progress tracking.',
    heroTitle: 'Bulk Credit Card Generator',
    heroSubtitle: 'Generate up to 1000 test card numbers at once. Export as TXT, CSV, JSON, SQL, XML or YAML.',
    faqs: BULK_FAQS,
    locales: {
      ru: {
        title: 'Массовая генерация тестовых карт — до 1000',
        description: 'Генерируйте тестовые номера карт пачками и выгружайте в TXT, CSV, JSON, SQL, XML или YAML. Бесплатно, с индикатором прогресса.',
        heroTitle: 'Массовый генератор номеров карт',
        heroSubtitle: 'До 1000 тестовых номеров карт за один раз. Выгрузка в TXT, CSV, JSON, SQL, XML или YAML.',
        faqs: BULK_FAQS_RU,
      },
      de: {
        title: 'Massen-Kreditkartengenerator — 1000 auf einmal',
        description: 'Erzeugen Sie Testkartennummern im Stapel und exportieren Sie sie als TXT, CSV, JSON, SQL, XML oder YAML. Kostenlos, mit Fortschrittsanzeige.',
        heroTitle: 'Massen-Kreditkartengenerator',
        heroSubtitle: 'Bis zu 1000 Testkartennummern auf einmal. Export als TXT, CSV, JSON, SQL, XML oder YAML.',
        faqs: BULK_FAQS_DE,
      },
      es: {
        title: 'Generador masivo de tarjetas — 1000 de una vez',
        description: 'Genere números de tarjeta de prueba por lotes y expórtelos en TXT, CSV, JSON, SQL, XML o YAML. Gratis, con indicador de progreso.',
        heroTitle: 'Generador masivo de tarjetas',
        heroSubtitle: 'Hasta 1000 números de tarjeta de prueba de una sola vez. Exporte en TXT, CSV, JSON, SQL, XML o YAML.',
        faqs: BULK_FAQS_ES,
      },
      fr: {
        title: 'Générateur de cartes en masse — 1000 d’un coup',
        description: 'Générez des numéros de carte de test par lots et exportez-les en TXT, CSV, JSON, SQL, XML ou YAML. Gratuit, avec indicateur de progression.',
        heroTitle: 'Générateur de cartes en masse',
        heroSubtitle: 'Jusqu’à 1000 numéros de carte de test d’un seul coup. Export en TXT, CSV, JSON, SQL, XML ou YAML.',
        faqs: BULK_FAQS_FR,
      },
      pt: {
        title: 'Gerador de cartões em massa — 1000 de uma vez',
        description: 'Gere números de cartão de teste em lote e exporte em TXT, CSV, JSON, SQL, XML ou YAML. Grátis, com indicador de progresso.',
        heroTitle: 'Gerador de cartões em massa',
        heroSubtitle: 'Até 1000 números de cartão de teste de uma só vez. Exporte em TXT, CSV, JSON, SQL, XML ou YAML.',
        faqs: BULK_FAQS_PT,
      },
    },
  },
};

export const ALL_PAYMENT_SEO_PAGES = Object.values(PAYMENT_SEO_PAGES);

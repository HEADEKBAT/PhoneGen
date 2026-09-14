/**
 * Media Studio — SEO Landing Pages Config.
 *
 * Follows the same pattern as cryptoSEOPages.ts and paymentSEOPages.ts.
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
export type MediaSEOPageConfig = StudioSEOConfig & { id: string };

/* ── Shared FAQ pools ───────────────────────────────────────────── */

const VIDEO_FAQS: SEOFaq[] = [
  { q: 'Is this video converter free?', a: 'Yes, completely free. All video conversion happens in your browser using FFmpeg.wasm. There are no limits, watermarks, or hidden charges.' },
  { q: 'Are my videos uploaded to a server?', a: 'Files you pick from your device are not: they are decoded and encoded in this tab, and never sent anywhere. There is one exception, and it only applies to links: if a stream\'s host does not allow browsers to read its files directly, the segments are fetched through our proxy and passed straight to your browser. Nothing is stored there, and the conversion itself still happens on your machine.' },
  { q: 'Can I convert an m3u8 or HLS link?', a: 'Yes. Paste the playlist URL and the segments are downloaded and joined here. If the playlist offers several qualities you choose one first. AES-128 streams are decrypted in the browser; DRM-protected ones (SAMPLE-AES, Widevine, FairPlay) cannot be converted by anyone without the licence, and you will be told so rather than handed a broken file. Live playlists have no end, so there is nothing finite to convert — use a VOD link.' },
  { q: 'What is the maximum file size?', a: '500 MB for a file you pick, and around 2 GB for a stream assembled from a link. Both are limits of browser memory rather than policy: everything is held in this tab while it works. Changing only the container — an HLS recording into MP4, say — copies the streams instead of re-encoding them and is far lighter on both memory and time than a full conversion.' },
  { q: 'What formats are supported?', a: 'Video: MP4, MOV, AVI, MKV, WEBM, GIF. Audio: MP3, WAV, OGG, AAC, M4A, FLAC. As input you can also give an m3u8/HLS playlist or an MPEG-TS stream.' },
];

const VIDEO_FAQS_RU: SEOFaq[] = [
  { q: 'Конвертер видео бесплатный?', a: 'Да, полностью. Вся конвертация идёт в браузере через FFmpeg.wasm. Ни ограничений, ни водяных знаков, ни скрытых платежей.' },
  { q: 'Загружаются ли мои видео на сервер?', a: 'Файлы с вашего устройства — нет: они декодируются и кодируются прямо в этой вкладке и никуда не отправляются. Исключение одно и касается только ссылок: если хост потока не разрешает браузеру читать свои файлы напрямую, сегменты идут через наш прокси и сразу отдаются вашему браузеру. Там ничего не сохраняется, а сама конвертация в любом случае происходит на вашей машине.' },
  { q: 'Можно ли сконвертировать ссылку m3u8 или HLS?', a: 'Да. Вставьте ссылку на плейлист — сегменты скачаются и соберутся здесь. Если плейлист предлагает несколько качеств, сначала выберите нужное. Потоки с AES-128 расшифровываются в браузере; защищённые DRM (SAMPLE-AES, Widevine, FairPlay) не сконвертирует никто без лицензии, и вам об этом скажут, а не отдадут битый файл. У прямого эфира нет конца, то есть нечего конвертировать — нужна ссылка на запись.' },
  { q: 'Какой максимальный размер файла?', a: '500 МБ для файла с устройства и около 2 ГБ для потока, собранного по ссылке. И то и другое — предел памяти браузера, а не правило: пока идёт работа, всё держится в этой вкладке. Смена только контейнера — скажем, запись HLS в MP4 — копирует потоки вместо перекодирования и обходится куда дешевле и по памяти, и по времени.' },
  { q: 'Какие форматы поддерживаются?', a: 'Видео: MP4, MOV, AVI, MKV, WEBM, GIF. Аудио: MP3, WAV, OGG, AAC, M4A, FLAC. На вход можно дать ещё плейлист m3u8/HLS или поток MPEG-TS.' },
];

const VIDEO_FAQS_DE: SEOFaq[] = [
  { q: 'Ist der Video-Konverter kostenlos?', a: 'Ja, vollständig. Die gesamte Umwandlung läuft im Browser über FFmpeg.wasm. Keine Limits, keine Wasserzeichen, keine versteckten Kosten.' },
  { q: 'Werden meine Videos auf einen Server geladen?', a: 'Dateien von Ihrem Gerät nicht: Sie werden in diesem Tab dekodiert und kodiert und nirgendwohin gesendet. Es gibt eine Ausnahme, und sie betrifft nur Links: Erlaubt der Host eines Streams dem Browser nicht, seine Dateien direkt zu lesen, laufen die Segmente über unseren Proxy und gehen unmittelbar an Ihren Browser weiter. Dort wird nichts gespeichert, und die Umwandlung selbst findet weiterhin auf Ihrem Rechner statt.' },
  { q: 'Kann ich einen m3u8- oder HLS-Link umwandeln?', a: 'Ja. Fügen Sie die Playlist-URL ein, und die Segmente werden hier geladen und zusammengefügt. Bietet die Playlist mehrere Qualitäten, wählen Sie zuerst eine aus. AES-128-Streams werden im Browser entschlüsselt; DRM-geschützte (SAMPLE-AES, Widevine, FairPlay) kann ohne Lizenz niemand umwandeln, und das wird Ihnen gesagt, statt Ihnen eine kaputte Datei zu geben. Ein Livestream hat kein Ende — nehmen Sie einen VOD-Link.' },
  { q: 'Wie groß darf die Datei sein?', a: '500 MB für eine Datei von Ihrem Gerät und rund 2 GB für einen über einen Link zusammengesetzten Stream. Beides sind Grenzen des Browser-Speichers, keine Regeln: Während der Arbeit liegt alles in diesem Tab. Nur den Container zu wechseln — etwa eine HLS-Aufnahme nach MP4 — kopiert die Streams, statt sie neu zu kodieren, und kostet erheblich weniger Speicher und Zeit.' },
  { q: 'Welche Formate werden unterstützt?', a: 'Video: MP4, MOV, AVI, MKV, WEBM, GIF. Audio: MP3, WAV, OGG, AAC, M4A, FLAC. Als Eingabe sind auch eine m3u8/HLS-Playlist oder ein MPEG-TS-Stream möglich.' },
];

const VIDEO_FAQS_ES: SEOFaq[] = [
  { q: '¿El conversor de vídeo es gratuito?', a: 'Sí, del todo. Toda la conversión se ejecuta en el navegador con FFmpeg.wasm. Sin límites, sin marcas de agua y sin cargos ocultos.' },
  { q: '¿Se suben mis vídeos a un servidor?', a: 'Los archivos de su dispositivo no: se decodifican y codifican en esta pestaña y no se envían a ninguna parte. Hay una excepción, y solo afecta a los enlaces: si el host de un stream no permite que el navegador lea sus archivos directamente, los segmentos pasan por nuestro proxy y van de inmediato a su navegador. Allí no se guarda nada, y la conversión sigue ocurriendo en su equipo.' },
  { q: '¿Puedo convertir un enlace m3u8 o HLS?', a: 'Sí. Pegue la URL de la lista y los segmentos se descargan y se unen aquí. Si la lista ofrece varias calidades, primero elige una. Los streams con AES-128 se descifran en el navegador; los protegidos con DRM (SAMPLE-AES, Widevine, FairPlay) no los convierte nadie sin la licencia, y se le dirá en lugar de entregarle un archivo roto. Una emisión en directo no tiene final: use un enlace de vídeo bajo demanda.' },
  { q: '¿Cuál es el tamaño máximo de archivo?', a: '500 MB para un archivo de su dispositivo y unos 2 GB para un stream montado desde un enlace. Ambos son límites de la memoria del navegador, no normas: mientras trabaja, todo se mantiene en esta pestaña. Cambiar solo el contenedor —una grabación HLS a MP4, por ejemplo— copia los flujos en vez de recodificarlos y cuesta mucho menos memoria y tiempo.' },
  { q: '¿Qué formatos admite?', a: 'Vídeo: MP4, MOV, AVI, MKV, WEBM, GIF. Audio: MP3, WAV, OGG, AAC, M4A, FLAC. Como entrada también admite una lista m3u8/HLS o un flujo MPEG-TS.' },
];

const VIDEO_FAQS_FR: SEOFaq[] = [
  { q: 'Le convertisseur vidéo est-il gratuit ?', a: 'Oui, entièrement. Toute la conversion se fait dans le navigateur via FFmpeg.wasm. Aucune limite, aucun filigrane, aucun frais caché.' },
  { q: 'Mes vidéos sont-elles envoyées sur un serveur ?', a: 'Les fichiers de votre appareil, non : ils sont décodés et encodés dans cet onglet et ne partent nulle part. Il y a une exception, et elle ne concerne que les liens : si l’hôte d’un flux n’autorise pas le navigateur à lire ses fichiers directement, les segments transitent par notre proxy et sont transmis aussitôt à votre navigateur. Rien n’y est conservé, et la conversion, elle, se fait toujours sur votre machine.' },
  { q: 'Puis-je convertir un lien m3u8 ou HLS ?', a: 'Oui. Collez l’URL de la playlist et les segments sont téléchargés puis assemblés ici. Si la playlist propose plusieurs qualités, vous en choisissez une d’abord. Les flux AES-128 sont déchiffrés dans le navigateur ; ceux protégés par DRM (SAMPLE-AES, Widevine, FairPlay) ne sont convertibles par personne sans la licence, et on vous le dira plutôt que de vous rendre un fichier corrompu. Un direct n’a pas de fin : prenez un lien de replay.' },
  { q: 'Quelle est la taille maximale de fichier ?', a: '500 Mo pour un fichier de votre appareil et environ 2 Go pour un flux assemblé depuis un lien. Ce sont des limites de la mémoire du navigateur, pas des règles : pendant le travail, tout tient dans cet onglet. Ne changer que le conteneur — un enregistrement HLS vers MP4, par exemple — copie les flux au lieu de les réencoder et coûte bien moins en mémoire et en temps.' },
  { q: 'Quels formats sont pris en charge ?', a: 'Vidéo : MP4, MOV, AVI, MKV, WEBM, GIF. Audio : MP3, WAV, OGG, AAC, M4A, FLAC. En entrée, une playlist m3u8/HLS ou un flux MPEG-TS sont aussi acceptés.' },
];

const VIDEO_FAQS_PT: SEOFaq[] = [
  { q: 'O conversor de vídeo é gratuito?', a: 'Sim, totalmente. Toda a conversão roda no navegador via FFmpeg.wasm. Sem limites, sem marcas d’água e sem cobranças ocultas.' },
  { q: 'Os meus vídeos são enviados para um servidor?', a: 'Os arquivos do seu dispositivo não: eles são decodificados e codificados nesta aba e não são enviados a lugar nenhum. Há uma exceção, e ela vale só para links: se o host de um stream não deixa o navegador ler os seus arquivos diretamente, os segmentos passam pelo nosso proxy e seguem imediatamente para o seu navegador. Nada fica guardado lá, e a conversão continua acontecendo na sua máquina.' },
  { q: 'Posso converter um link m3u8 ou HLS?', a: 'Sim. Cole a URL da playlist e os segmentos são baixados e unidos aqui. Se a playlist oferecer várias qualidades, você escolhe uma primeiro. Streams com AES-128 são descriptografados no navegador; os protegidos por DRM (SAMPLE-AES, Widevine, FairPlay) ninguém converte sem a licença, e você será avisado em vez de receber um arquivo quebrado. Uma transmissão ao vivo não tem fim: use um link de VOD.' },
  { q: 'Qual é o tamanho máximo de arquivo?', a: '500 MB para um arquivo do seu dispositivo e cerca de 2 GB para um stream montado a partir de um link. Os dois são limites da memória do navegador, não regras: enquanto o trabalho corre, tudo fica nesta aba. Trocar apenas o contêiner — uma gravação HLS para MP4, por exemplo — copia os fluxos em vez de recodificá-los e custa bem menos memória e tempo.' },
  { q: 'Quais formatos são suportados?', a: 'Vídeo: MP4, MOV, AVI, MKV, WEBM, GIF. Áudio: MP3, WAV, OGG, AAC, M4A, FLAC. Na entrada também vale uma playlist m3u8/HLS ou um fluxo MPEG-TS.' },
];

const COMPRESS_FAQS: SEOFaq[] = [
  { q: 'How much can I compress a video?', a: 'Compression depends on the source format and codec. Typically, you can reduce file size by 50-80% using H.264/H.265 with minimal quality loss.' },
  { q: 'What is the best compression format?', a: 'For maximum compression, use HEVC (H.265) or AV1. For the best balance of compatibility and compression, use H.264 in MP4 container.' },
  { q: 'Will compression reduce quality?', a: 'With proper settings (CRF 18-23), quality loss is barely noticeable. Higher compression (CRF 24+) will reduce quality more noticeably.' },
];

const COMPRESS_FAQS_RU: SEOFaq[] = [
  { q: 'Насколько сильно можно сжать видео?', a: 'Зависит от исходного формата и кодека. Обычно размер удаётся уменьшить на 50–80% с H.264/H.265 почти без потери качества.' },
  { q: 'Какой формат сжимает лучше всего?', a: 'Максимальное сжатие дают HEVC (H.265) и AV1. Лучший баланс совместимости и размера — H.264 в контейнере MP4.' },
  { q: 'Пострадает ли качество?', a: 'При разумных настройках (CRF 18–23) потеря почти незаметна. При более сильном сжатии (CRF 24 и выше) разница уже видна.' },
];

const COMPRESS_FAQS_DE: SEOFaq[] = [
  { q: 'Wie stark lässt sich ein Video komprimieren?', a: 'Das hängt von Ausgangsformat und Codec ab. Üblich sind 50 bis 80 Prozent weniger Dateigröße mit H.264/H.265 bei minimalem Qualitätsverlust.' },
  { q: 'Welches Format komprimiert am besten?', a: 'Die stärkste Kompression bieten HEVC (H.265) und AV1. Das beste Verhältnis aus Kompatibilität und Größe bietet H.264 im MP4-Container.' },
  { q: 'Leidet die Qualität?', a: 'Bei sinnvollen Einstellungen (CRF 18–23) ist der Verlust kaum wahrnehmbar. Bei stärkerer Kompression (CRF 24 und höher) wird er sichtbar.' },
];

const COMPRESS_FAQS_ES: SEOFaq[] = [
  { q: '¿Cuánto se puede comprimir un vídeo?', a: 'Depende del formato y el códec de origen. Lo habitual es reducir el tamaño entre un 50 y un 80 % con H.264/H.265 y una pérdida mínima.' },
  { q: '¿Qué formato comprime mejor?', a: 'La mayor compresión la dan HEVC (H.265) y AV1. El mejor equilibrio entre compatibilidad y tamaño es H.264 en contenedor MP4.' },
  { q: '¿Se pierde calidad?', a: 'Con ajustes razonables (CRF 18-23) la pérdida es casi imperceptible. Con más compresión (CRF 24 o más) ya se nota.' },
];

const COMPRESS_FAQS_FR: SEOFaq[] = [
  { q: 'Jusqu’où peut-on compresser une vidéo ?', a: 'Cela dépend du format et du codec source. On réduit couramment la taille de 50 à 80 % en H.264/H.265 avec une perte minime.' },
  { q: 'Quel format compresse le mieux ?', a: 'La compression la plus forte vient de HEVC (H.265) et d’AV1. Le meilleur compromis compatibilité/taille reste H.264 en conteneur MP4.' },
  { q: 'La qualité en souffre-t-elle ?', a: 'Avec des réglages raisonnables (CRF 18-23), la perte est à peine perceptible. Au-delà (CRF 24 et plus), elle devient visible.' },
];

const COMPRESS_FAQS_PT: SEOFaq[] = [
  { q: 'Quanto dá para comprimir um vídeo?', a: 'Depende do formato e do codec de origem. É comum reduzir de 50 a 80 % do tamanho com H.264/H.265 e perda mínima.' },
  { q: 'Qual formato comprime melhor?', a: 'A maior compressão vem de HEVC (H.265) e AV1. O melhor equilíbrio entre compatibilidade e tamanho é H.264 em contêiner MP4.' },
  { q: 'A qualidade piora?', a: 'Com ajustes razoáveis (CRF 18-23) a perda é quase imperceptível. Com mais compressão (CRF 24 ou mais) já dá para notar.' },
];

const MP4_WEBM_FAQS: SEOFaq[] = [
  { q: 'What is the difference between MP4 and WEBM?', a: 'MP4 is more universally compatible, while WEBM offers better compression and supports transparency. WEBM uses royalty-free codecs (VP9/AV1).' },
  { q: 'Which is better for web: MP4 or WEBM?', a: 'For maximum compatibility, use MP4 with H.264. For better compression and modern browsers, use WEBM with VP9. Many sites use both with a fallback.' },
  { q: 'Does WEBM support transparency?', a: 'Yes, WEBM supports alpha channel transparency, making it ideal for overlays and graphics with transparent backgrounds.' },
];

const MP4_WEBM_FAQS_RU: SEOFaq[] = [
  { q: 'Чем MP4 отличается от WEBM?', a: 'MP4 совместим почти со всем, WEBM лучше сжимает и поддерживает прозрачность. В WEBM используются свободные от лицензионных отчислений кодеки VP9 и AV1.' },
  { q: 'Что лучше для веба — MP4 или WEBM?', a: 'Для максимальной совместимости — MP4 с H.264. Для лучшего сжатия в современных браузерах — WEBM с VP9. Многие сайты отдают оба формата с запасным вариантом.' },
  { q: 'Поддерживает ли WEBM прозрачность?', a: 'Да, WEBM умеет работать с альфа-каналом, поэтому подходит для наложений и графики с прозрачным фоном.' },
];

const MP4_WEBM_FAQS_DE: SEOFaq[] = [
  { q: 'Worin unterscheiden sich MP4 und WEBM?', a: 'MP4 ist nahezu überall kompatibel, WEBM komprimiert besser und unterstützt Transparenz. WEBM nutzt die lizenzfreien Codecs VP9 und AV1.' },
  { q: 'Was ist besser fürs Web — MP4 oder WEBM?', a: 'Für größtmögliche Kompatibilität MP4 mit H.264. Für bessere Kompression in modernen Browsern WEBM mit VP9. Viele Seiten liefern beides mit Fallback aus.' },
  { q: 'Unterstützt WEBM Transparenz?', a: 'Ja, WEBM beherrscht den Alphakanal und eignet sich damit für Overlays und Grafiken mit transparentem Hintergrund.' },
];

const MP4_WEBM_FAQS_ES: SEOFaq[] = [
  { q: '¿En qué se diferencian MP4 y WEBM?', a: 'MP4 es compatible con casi todo; WEBM comprime mejor y admite transparencia. WEBM usa los códecs libres de regalías VP9 y AV1.' },
  { q: '¿Qué conviene para la web, MP4 o WEBM?', a: 'Para máxima compatibilidad, MP4 con H.264. Para mejor compresión en navegadores modernos, WEBM con VP9. Muchos sitios sirven ambos con respaldo.' },
  { q: '¿WEBM admite transparencia?', a: 'Sí, WEBM maneja el canal alfa, por lo que va bien para superposiciones y gráficos con fondo transparente.' },
];

const MP4_WEBM_FAQS_FR: SEOFaq[] = [
  { q: 'Quelle différence entre MP4 et WEBM ?', a: 'MP4 est compatible avec presque tout ; WEBM compresse mieux et gère la transparence. WEBM utilise les codecs libres de redevances VP9 et AV1.' },
  { q: 'Que choisir pour le web, MP4 ou WEBM ?', a: 'Pour une compatibilité maximale, MP4 avec H.264. Pour une meilleure compression sur les navigateurs modernes, WEBM avec VP9. Beaucoup de sites servent les deux.' },
  { q: 'WEBM gère-t-il la transparence ?', a: 'Oui, WEBM prend en charge le canal alpha, ce qui convient aux incrustations et aux graphismes sur fond transparent.' },
];

const MP4_WEBM_FAQS_PT: SEOFaq[] = [
  { q: 'Qual é a diferença entre MP4 e WEBM?', a: 'MP4 é compatível com quase tudo; WEBM comprime melhor e suporta transparência. O WEBM usa os codecs livres de royalties VP9 e AV1.' },
  { q: 'O que é melhor para a web, MP4 ou WEBM?', a: 'Para compatibilidade máxima, MP4 com H.264. Para melhor compressão em navegadores modernos, WEBM com VP9. Muitos sites entregam os dois com fallback.' },
  { q: 'O WEBM suporta transparência?', a: 'Sim, o WEBM trabalha com canal alfa, o que serve bem para sobreposições e gráficos com fundo transparente.' },
];

const EXTRACT_AUDIO_FAQS: SEOFaq[] = [
  { q: 'How do I extract audio from a video?', a: 'Upload your video, select "Extract Audio" from recommendations, choose your preferred audio format (MP3, AAC, WAV, FLAC, OGG), and convert.' },
  { q: 'What is the best audio format for extraction?', a: 'MP3 for maximum compatibility, AAC for better quality at the same bitrate, FLAC for lossless audio, and Opus for the best compression/quality ratio.' },
  { q: 'Can I extract audio without quality loss?', a: 'Yes, use FLAC format for lossless audio extraction. The file will be larger, but the audio quality will be identical to the source.' },
];

const EXTRACT_AUDIO_FAQS_RU: SEOFaq[] = [
  { q: 'Как извлечь звук из видео?', a: 'Загрузите видео, выберите «Извлечь звук» в рекомендациях, укажите формат (MP3, AAC, WAV, FLAC, OGG) и запустите конвертацию.' },
  { q: 'Какой формат выбрать?', a: 'MP3 — для максимальной совместимости, AAC — лучше качество на том же битрейте, FLAC — без потерь, Opus — лучшее соотношение размера и качества.' },
  { q: 'Можно ли извлечь звук без потерь?', a: 'Да, выберите FLAC. Файл получится больше, зато качество будет неотличимо от исходного.' },
];

const EXTRACT_AUDIO_FAQS_DE: SEOFaq[] = [
  { q: 'Wie extrahiere ich den Ton aus einem Video?', a: 'Video laden, in den Empfehlungen „Audio extrahieren“ wählen, Format angeben (MP3, AAC, WAV, FLAC, OGG) und umwandeln.' },
  { q: 'Welches Audioformat ist das richtige?', a: 'MP3 für größtmögliche Kompatibilität, AAC für bessere Qualität bei gleicher Bitrate, FLAC für verlustfreien Ton und Opus für das beste Verhältnis aus Größe und Qualität.' },
  { q: 'Geht das verlustfrei?', a: 'Ja, wählen Sie FLAC. Die Datei wird größer, die Qualität ist aber nicht vom Original zu unterscheiden.' },
];

const EXTRACT_AUDIO_FAQS_ES: SEOFaq[] = [
  { q: '¿Cómo extraigo el audio de un vídeo?', a: 'Cargue el vídeo, elija «Extraer audio» en las recomendaciones, seleccione el formato (MP3, AAC, WAV, FLAC, OGG) y convierta.' },
  { q: '¿Qué formato de audio conviene?', a: 'MP3 para máxima compatibilidad, AAC para mejor calidad al mismo bitrate, FLAC para audio sin pérdidas y Opus para la mejor relación tamaño/calidad.' },
  { q: '¿Se puede extraer sin pérdida de calidad?', a: 'Sí, elija FLAC. El archivo será mayor, pero la calidad será idéntica a la del original.' },
];

const EXTRACT_AUDIO_FAQS_FR: SEOFaq[] = [
  { q: 'Comment extraire l’audio d’une vidéo ?', a: 'Chargez la vidéo, choisissez « Extraire l’audio » dans les recommandations, sélectionnez le format (MP3, AAC, WAV, FLAC, OGG) et lancez la conversion.' },
  { q: 'Quel format audio choisir ?', a: 'MP3 pour une compatibilité maximale, AAC pour une meilleure qualité à débit égal, FLAC pour du sans perte et Opus pour le meilleur rapport taille/qualité.' },
  { q: 'Peut-on extraire sans perte ?', a: 'Oui, choisissez FLAC. Le fichier sera plus lourd, mais la qualité sera identique à celle de la source.' },
];

const EXTRACT_AUDIO_FAQS_PT: SEOFaq[] = [
  { q: 'Como extraio o áudio de um vídeo?', a: 'Carregue o vídeo, escolha «Extrair áudio» nas recomendações, selecione o formato (MP3, AAC, WAV, FLAC, OGG) e converta.' },
  { q: 'Qual formato de áudio escolher?', a: 'MP3 para compatibilidade máxima, AAC para melhor qualidade no mesmo bitrate, FLAC para áudio sem perdas e Opus para a melhor relação tamanho/qualidade.' },
  { q: 'Dá para extrair sem perda?', a: 'Sim, escolha FLAC. O arquivo fica maior, mas a qualidade é idêntica à da origem.' },
];

const PLATFORM_FAQS: SEOFaq[] = [
  { q: 'What video format does YouTube recommend?', a: 'YouTube recommends H.264 video with AAC audio in an MP4 container. Optimal settings: 1080p at 30fps with a bitrate of 8-12 Mbps.' },
  { q: 'What format works best for Instagram?', a: 'Instagram supports MP4 with H.264 video and AAC audio. Recommended resolution is 1080×1080 for feed posts and 1080×1920 for Stories.' },
  { q: 'What format should I use for TikTok?', a: 'TikTok works best with MP4 format, H.264 codec, vertical 9:16 aspect ratio (1080×1920), and 30fps frame rate.' },
];

const PLATFORM_FAQS_RU: SEOFaq[] = [
  { q: 'Какой формат рекомендует YouTube?', a: 'YouTube советует видео H.264 со звуком AAC в контейнере MP4. Оптимально: 1080p, 30 кадров в секунду, битрейт 8–12 Мбит/с.' },
  { q: 'Что подходит для Instagram?', a: 'Instagram принимает MP4 с видео H.264 и звуком AAC. Рекомендуемое разрешение — 1080×1080 для ленты и 1080×1920 для историй.' },
  { q: 'Какой формат нужен для TikTok?', a: 'TikTok лучше всего работает с MP4, кодеком H.264, вертикальным кадром 9:16 (1080×1920) и частотой 30 кадров в секунду.' },
];

const PLATFORM_FAQS_DE: SEOFaq[] = [
  { q: 'Welches Format empfiehlt YouTube?', a: 'YouTube empfiehlt H.264-Video mit AAC-Ton im MP4-Container. Optimal sind 1080p bei 30 Bildern pro Sekunde und 8 bis 12 Mbit/s.' },
  { q: 'Was passt für Instagram?', a: 'Instagram akzeptiert MP4 mit H.264-Video und AAC-Ton. Empfohlen sind 1080×1080 für den Feed und 1080×1920 für Stories.' },
  { q: 'Welches Format braucht TikTok?', a: 'TikTok funktioniert am besten mit MP4, dem Codec H.264, dem Hochformat 9:16 (1080×1920) und 30 Bildern pro Sekunde.' },
];

const PLATFORM_FAQS_ES: SEOFaq[] = [
  { q: '¿Qué formato recomienda YouTube?', a: 'YouTube recomienda vídeo H.264 con audio AAC en contenedor MP4. Lo óptimo: 1080p a 30 fps y entre 8 y 12 Mbps.' },
  { q: '¿Qué formato va bien para Instagram?', a: 'Instagram admite MP4 con vídeo H.264 y audio AAC. La resolución recomendada es 1080×1080 para el feed y 1080×1920 para Stories.' },
  { q: '¿Qué formato necesita TikTok?', a: 'TikTok funciona mejor con MP4, códec H.264, formato vertical 9:16 (1080×1920) y 30 fotogramas por segundo.' },
];

const PLATFORM_FAQS_FR: SEOFaq[] = [
  { q: 'Quel format YouTube recommande-t-il ?', a: 'YouTube recommande de la vidéo H.264 avec de l’audio AAC dans un conteneur MP4. L’idéal : 1080p à 30 images par seconde et 8 à 12 Mbit/s.' },
  { q: 'Quel format convient à Instagram ?', a: 'Instagram accepte le MP4 avec vidéo H.264 et audio AAC. Résolution conseillée : 1080×1080 pour le fil et 1080×1920 pour les Stories.' },
  { q: 'Quel format faut-il pour TikTok ?', a: 'TikTok fonctionne au mieux en MP4, codec H.264, format vertical 9:16 (1080×1920) et 30 images par seconde.' },
];

const PLATFORM_FAQS_PT: SEOFaq[] = [
  { q: 'Qual formato o YouTube recomenda?', a: 'O YouTube recomenda vídeo H.264 com áudio AAC em contêiner MP4. O ideal: 1080p a 30 fps e entre 8 e 12 Mbps.' },
  { q: 'Qual formato funciona bem no Instagram?', a: 'O Instagram aceita MP4 com vídeo H.264 e áudio AAC. A resolução recomendada é 1080×1080 para o feed e 1080×1920 para os Stories.' },
  { q: 'Qual formato o TikTok precisa?', a: 'O TikTok funciona melhor com MP4, codec H.264, formato vertical 9:16 (1080×1920) e 30 quadros por segundo.' },
];

/* ── SEO Pages ─────────────────────────────────────────────────── */

const VIDEO_CONVERTER_PAGE: MediaSEOPageConfig = {
  id: 'video-converter',
  slug: 'video-converter',
  title: 'Free Online Video Converter — MP4, MOV, WEBM',
  description: 'Convert videos online for free. MP4, MOV, AVI, MKV, WEBM, GIF, MP3 and more. Entirely in your browser — no uploads, no limits.',
  heroTitle: 'Free Online Video Converter',
  heroSubtitle: 'Convert any video to any format. Fast, private and free — all in your browser.',
  ctaLabel: 'Convert Video',
  faqs: VIDEO_FAQS,
  locales: {
    ru: {
      title: 'Онлайн-конвертер видео — MP4, MOV, WEBM',
      description: 'Конвертируйте видео онлайн бесплатно: MP4, MOV, AVI, MKV, WEBM, GIF, MP3 и другие. Полностью в браузере — без загрузки на сервер и без ограничений.',
      heroTitle: 'Бесплатный онлайн-конвертер видео',
      heroSubtitle: 'Любое видео в любой формат. Быстро, приватно и бесплатно — прямо в браузере.',
      ctaLabel: 'Конвертировать видео',
      faqs: VIDEO_FAQS_RU,
    },
    de: {
      title: 'Online-Video-Konverter — MP4, MOV, WEBM',
      description: 'Videos kostenlos online umwandeln: MP4, MOV, AVI, MKV, WEBM, GIF, MP3 und mehr. Vollständig im Browser — ohne Upload, ohne Limits.',
      heroTitle: 'Kostenloser Online-Video-Konverter',
      heroSubtitle: 'Jedes Video in jedes Format. Schnell, privat und kostenlos — direkt im Browser.',
      ctaLabel: 'Video umwandeln',
      faqs: VIDEO_FAQS_DE,
    },
    es: {
      title: 'Conversor de vídeo online — MP4, MOV, WEBM',
      description: 'Convierta vídeos online gratis: MP4, MOV, AVI, MKV, WEBM, GIF, MP3 y más. Todo en el navegador, sin subidas y sin límites.',
      heroTitle: 'Conversor de vídeo online gratuito',
      heroSubtitle: 'Cualquier vídeo a cualquier formato. Rápido, privado y gratis, todo en su navegador.',
      ctaLabel: 'Convertir vídeo',
      faqs: VIDEO_FAQS_ES,
    },
    fr: {
      title: 'Convertisseur vidéo en ligne — MP4, MOV, WEBM',
      description: 'Convertissez vos vidéos en ligne gratuitement : MP4, MOV, AVI, MKV, WEBM, GIF, MP3 et plus. Entièrement dans le navigateur, sans téléversement ni limite.',
      heroTitle: 'Convertisseur vidéo en ligne gratuit',
      heroSubtitle: 'N’importe quelle vidéo vers n’importe quel format. Rapide, privé et gratuit — dans votre navigateur.',
      ctaLabel: 'Convertir la vidéo',
      faqs: VIDEO_FAQS_FR,
    },
    pt: {
      title: 'Conversor de vídeo online — MP4, MOV, WEBM',
      description: 'Converta vídeos online gratuitamente: MP4, MOV, AVI, MKV, WEBM, GIF, MP3 e mais. Tudo no navegador, sem uploads e sem limites.',
      heroTitle: 'Conversor de vídeo online gratuito',
      heroSubtitle: 'Qualquer vídeo para qualquer formato. Rápido, privado e grátis — no seu navegador.',
      ctaLabel: 'Converter vídeo',
      faqs: VIDEO_FAQS_PT,
    },
  },
};

const COMPRESSOR_PAGE: MediaSEOPageConfig = {
  id: 'video-compressor',
  slug: 'video-compressor',
  title: 'Free Online Video Compressor — Smaller Files',
  description: 'Compress videos online for free. Cut file size by up to 80% with barely noticeable quality loss. MP4, MOV, AVI and more.',
  heroTitle: 'Free Online Video Compressor',
  heroSubtitle: 'Cut video file size by up to 80%. No visible quality loss. No uploads.',
  ctaLabel: 'Compress Video',
  faqs: COMPRESS_FAQS,
  locales: {
    ru: {
      title: 'Онлайн-сжатие видео — уменьшить размер файла',
      description: 'Сжимайте видео онлайн бесплатно: размер файла меньше до 80% почти без потери качества. MP4, MOV, AVI и другие форматы.',
      heroTitle: 'Бесплатное онлайн-сжатие видео',
      heroSubtitle: 'Уменьшайте размер видео до 80%. Без заметной потери качества. Без загрузки на сервер.',
      ctaLabel: 'Сжать видео',
      faqs: COMPRESS_FAQS_RU,
    },
    de: {
      title: 'Video online komprimieren — kleinere Dateien',
      description: 'Videos kostenlos online komprimieren: bis zu 80 % kleinere Dateien bei kaum sichtbarem Qualitätsverlust. MP4, MOV, AVI und mehr.',
      heroTitle: 'Kostenloser Online-Video-Kompressor',
      heroSubtitle: 'Dateigröße um bis zu 80 % senken. Kein sichtbarer Qualitätsverlust. Kein Upload.',
      ctaLabel: 'Video komprimieren',
      faqs: COMPRESS_FAQS_DE,
    },
    es: {
      title: 'Compresor de vídeo online — archivos más pequeños',
      description: 'Comprima vídeos online gratis: hasta un 80 % menos de tamaño con una pérdida de calidad apenas perceptible. MP4, MOV, AVI y más.',
      heroTitle: 'Compresor de vídeo online gratuito',
      heroSubtitle: 'Reduzca el tamaño del vídeo hasta un 80 %. Sin pérdida visible de calidad. Sin subidas.',
      ctaLabel: 'Comprimir vídeo',
      faqs: COMPRESS_FAQS_ES,
    },
    fr: {
      title: 'Compresseur vidéo en ligne — fichiers plus légers',
      description: 'Compressez vos vidéos en ligne gratuitement : jusqu’à 80 % de taille en moins pour une perte de qualité à peine perceptible. MP4, MOV, AVI et plus.',
      heroTitle: 'Compresseur vidéo en ligne gratuit',
      heroSubtitle: 'Réduisez la taille de vos vidéos jusqu’à 80 %. Sans perte visible. Sans téléversement.',
      ctaLabel: 'Compresser la vidéo',
      faqs: COMPRESS_FAQS_FR,
    },
    pt: {
      title: 'Compressor de vídeo online — arquivos menores',
      description: 'Comprima vídeos online gratuitamente: até 80 % menos tamanho com perda de qualidade quase imperceptível. MP4, MOV, AVI e mais.',
      heroTitle: 'Compressor de vídeo online gratuito',
      heroSubtitle: 'Reduza o tamanho do vídeo em até 80 %. Sem perda visível de qualidade. Sem uploads.',
      ctaLabel: 'Comprimir vídeo',
      faqs: COMPRESS_FAQS_PT,
    },
  },
};

const MP4_WEBM_PAGE: MediaSEOPageConfig = {
  id: 'mp4-to-webm',
  slug: 'mp4-to-webm',
  title: 'Convert MP4 to WEBM — Free Online Converter',
  description: 'Convert MP4 to WEBM online for free, with VP9 and Opus codecs for the web. No uploads, no sign-up.',
  heroTitle: 'Convert MP4 to WEBM Online Free',
  heroSubtitle: 'Turn your MP4 videos into WEBM for smoother playback on the web.',
  ctaLabel: 'Convert MP4 to WEBM',
  faqs: MP4_WEBM_FAQS,
  locales: {
    ru: {
      title: 'Конвертировать MP4 в WEBM — бесплатно онлайн',
      description: 'Конвертируйте MP4 в WEBM онлайн бесплатно: кодеки VP9 и Opus для веба. Без загрузки на сервер и без регистрации.',
      heroTitle: 'Конвертация MP4 в WEBM онлайн',
      heroSubtitle: 'Переведите видео из MP4 в WEBM для лучшего воспроизведения в вебе.',
      ctaLabel: 'Конвертировать в WEBM',
      faqs: MP4_WEBM_FAQS_RU,
    },
    de: {
      title: 'MP4 in WEBM umwandeln — kostenlos online',
      description: 'Wandeln Sie MP4 kostenlos online in WEBM um, mit den Codecs VP9 und Opus fürs Web. Ohne Upload, ohne Anmeldung.',
      heroTitle: 'MP4 online kostenlos in WEBM umwandeln',
      heroSubtitle: 'Machen Sie aus Ihren MP4-Videos WEBM für flüssigere Wiedergabe im Web.',
      ctaLabel: 'In WEBM umwandeln',
      faqs: MP4_WEBM_FAQS_DE,
    },
    es: {
      title: 'Convertir MP4 a WEBM — gratis y online',
      description: 'Convierta MP4 a WEBM online y gratis, con los códecs VP9 y Opus pensados para la web. Sin subidas ni registro.',
      heroTitle: 'Convertir MP4 a WEBM online gratis',
      heroSubtitle: 'Pase sus vídeos MP4 a WEBM para una reproducción web más fluida.',
      ctaLabel: 'Convertir a WEBM',
      faqs: MP4_WEBM_FAQS_ES,
    },
    fr: {
      title: 'Convertir MP4 en WEBM — gratuit et en ligne',
      description: 'Convertissez du MP4 en WEBM en ligne gratuitement, avec les codecs VP9 et Opus pensés pour le web. Sans téléversement ni inscription.',
      heroTitle: 'Convertir MP4 en WEBM en ligne gratuitement',
      heroSubtitle: 'Passez vos vidéos MP4 en WEBM pour une lecture plus fluide sur le web.',
      ctaLabel: 'Convertir en WEBM',
      faqs: MP4_WEBM_FAQS_FR,
    },
    pt: {
      title: 'Converter MP4 para WEBM — grátis e online',
      description: 'Converta MP4 para WEBM online e de graça, com os codecs VP9 e Opus pensados para a web. Sem uploads nem cadastro.',
      heroTitle: 'Converter MP4 para WEBM online grátis',
      heroSubtitle: 'Passe os seus vídeos MP4 para WEBM e tenha reprodução mais fluida na web.',
      ctaLabel: 'Converter para WEBM',
      faqs: MP4_WEBM_FAQS_PT,
    },
  },
};

const EXTRACT_AUDIO_PAGE: MediaSEOPageConfig = {
  id: 'extract-audio',
  slug: 'extract-audio',
  title: 'Extract Audio from Video — Free Online Tool',
  description: 'Pull the audio out of a video file for free. Save as MP3, AAC, WAV, FLAC or OGG. No uploads — everything runs in the browser.',
  heroTitle: 'Free Online Audio Extractor',
  heroSubtitle: 'Extract the audio from any video. MP3, AAC, WAV, FLAC, OGG — your choice.',
  ctaLabel: 'Extract Audio',
  faqs: EXTRACT_AUDIO_FAQS,
  locales: {
    ru: {
      title: 'Извлечь звук из видео — бесплатно онлайн',
      description: 'Вытащите звуковую дорожку из видеофайла бесплатно и сохраните в MP3, AAC, WAV, FLAC или OGG. Ничего не загружается — всё в браузере.',
      heroTitle: 'Извлечение звука из видео',
      heroSubtitle: 'Заберите звук из любого видео. MP3, AAC, WAV, FLAC, OGG — на выбор.',
      ctaLabel: 'Извлечь звук',
      faqs: EXTRACT_AUDIO_FAQS_RU,
    },
    de: {
      title: 'Audio aus Video extrahieren — kostenlos online',
      description: 'Holen Sie die Tonspur kostenlos aus einer Videodatei und speichern Sie sie als MP3, AAC, WAV, FLAC oder OGG. Kein Upload — alles im Browser.',
      heroTitle: 'Audio aus Video extrahieren',
      heroSubtitle: 'Holen Sie den Ton aus jedem Video. MP3, AAC, WAV, FLAC, OGG — Ihre Wahl.',
      ctaLabel: 'Audio extrahieren',
      faqs: EXTRACT_AUDIO_FAQS_DE,
    },
    es: {
      title: 'Extraer audio de un vídeo — gratis y online',
      description: 'Saque la pista de audio de un vídeo gratis y guárdela en MP3, AAC, WAV, FLAC u OGG. Sin subidas: todo ocurre en el navegador.',
      heroTitle: 'Extractor de audio online gratuito',
      heroSubtitle: 'Extraiga el audio de cualquier vídeo. MP3, AAC, WAV, FLAC, OGG, a su elección.',
      ctaLabel: 'Extraer audio',
      faqs: EXTRACT_AUDIO_FAQS_ES,
    },
    fr: {
      title: 'Extraire l’audio d’une vidéo — gratuit en ligne',
      description: 'Récupérez la piste audio d’une vidéo gratuitement et enregistrez-la en MP3, AAC, WAV, FLAC ou OGG. Sans téléversement : tout se passe dans le navigateur.',
      heroTitle: 'Extracteur audio en ligne gratuit',
      heroSubtitle: 'Extrayez l’audio de n’importe quelle vidéo. MP3, AAC, WAV, FLAC, OGG, à votre choix.',
      ctaLabel: 'Extraire l’audio',
      faqs: EXTRACT_AUDIO_FAQS_FR,
    },
    pt: {
      title: 'Extrair áudio de vídeo — grátis e online',
      description: 'Tire a faixa de áudio de um vídeo de graça e salve em MP3, AAC, WAV, FLAC ou OGG. Sem uploads: tudo acontece no navegador.',
      heroTitle: 'Extrator de áudio online gratuito',
      heroSubtitle: 'Extraia o áudio de qualquer vídeo. MP3, AAC, WAV, FLAC, OGG, à sua escolha.',
      ctaLabel: 'Extrair áudio',
      faqs: EXTRACT_AUDIO_FAQS_PT,
    },
  },
};

const PLATFORM_YOUTUBE_PAGE: MediaSEOPageConfig = {
  id: 'video-for-youtube',
  slug: 'video-for-youtube',
  title: 'Convert Video for YouTube — Best Upload Format',
  description: 'Convert a video to the format YouTube prefers: H.264 video, AAC audio, MP4 container. Free, and nothing is uploaded anywhere.',
  heroTitle: 'Convert Video for YouTube',
  heroSubtitle: 'Get your video ready for YouTube. The right format, the right settings.',
  ctaLabel: 'Convert for YouTube',
  faqs: PLATFORM_FAQS,
  locales: {
    ru: {
      title: 'Подготовить видео для YouTube — нужный формат',
      description: 'Переведите видео в формат, который предпочитает YouTube: H.264, звук AAC, контейнер MP4. Бесплатно, и ничего никуда не загружается.',
      heroTitle: 'Подготовка видео для YouTube',
      heroSubtitle: 'Приведите видео в готовый для YouTube вид. Нужный формат и правильные настройки.',
      ctaLabel: 'Подготовить для YouTube',
      faqs: PLATFORM_FAQS_RU,
    },
    de: {
      title: 'Video für YouTube umwandeln — richtiges Format',
      description: 'Bringen Sie Ihr Video in das von YouTube bevorzugte Format: H.264, AAC-Ton, MP4-Container. Kostenlos, und nichts wird hochgeladen.',
      heroTitle: 'Video für YouTube umwandeln',
      heroSubtitle: 'Machen Sie Ihr Video YouTube-fertig. Das richtige Format, die richtigen Einstellungen.',
      ctaLabel: 'Für YouTube umwandeln',
      faqs: PLATFORM_FAQS_DE,
    },
    es: {
      title: 'Convertir vídeo para YouTube — formato correcto',
      description: 'Pase su vídeo al formato que YouTube prefiere: vídeo H.264, audio AAC, contenedor MP4. Gratis, y sin subir nada a ningún sitio.',
      heroTitle: 'Convertir vídeo para YouTube',
      heroSubtitle: 'Deje su vídeo listo para YouTube. El formato correcto y los ajustes adecuados.',
      ctaLabel: 'Convertir para YouTube',
      faqs: PLATFORM_FAQS_ES,
    },
    fr: {
      title: 'Convertir une vidéo pour YouTube — bon format',
      description: 'Mettez votre vidéo au format que YouTube préfère : vidéo H.264, audio AAC, conteneur MP4. Gratuit, et rien n’est envoyé nulle part.',
      heroTitle: 'Convertir une vidéo pour YouTube',
      heroSubtitle: 'Préparez votre vidéo pour YouTube. Le bon format et les bons réglages.',
      ctaLabel: 'Convertir pour YouTube',
      faqs: PLATFORM_FAQS_FR,
    },
    pt: {
      title: 'Converter vídeo para o YouTube — formato certo',
      description: 'Coloque o seu vídeo no formato que o YouTube prefere: vídeo H.264, áudio AAC, contêiner MP4. Grátis, e nada é enviado para lugar nenhum.',
      heroTitle: 'Converter vídeo para o YouTube',
      heroSubtitle: 'Deixe o seu vídeo pronto para o YouTube. O formato certo e os ajustes certos.',
      ctaLabel: 'Converter para o YouTube',
      faqs: PLATFORM_FAQS_PT,
    },
  },
};

/* ── Registry ───────────────────────────────────────────────────── */

export const MEDIA_SEO_PAGES: MediaSEOPageConfig[] = [
  VIDEO_CONVERTER_PAGE,
  COMPRESSOR_PAGE,
  MP4_WEBM_PAGE,
  EXTRACT_AUDIO_PAGE,
  PLATFORM_YOUTUBE_PAGE,
];

export const ALL_MEDIA_SEO_PAGES = MEDIA_SEO_PAGES;

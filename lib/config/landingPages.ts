/**
 * Standalone SEO landing pages.
 *
 * Each entry replaces a 76-line page component that differed from its
 * neighbours only in the fields below. The pages themselves are now four lines
 * that hand one of these manifests to `createLandingPage`.
 *
 * The copy is carried over verbatim from those pages: these URLs are indexed,
 * and rewriting their titles or descriptions would change what search engines
 * already have.
 *
 * Adding a landing page means adding an entry here plus a four-line
 * `app/[locale]/{slug}/page.tsx`. Add it to STANDALONE_SEO_ROUTES in
 * staticRoutes.ts too, or `node scripts/seo/sitemap.check.mjs` will fail —
 * a page nobody links to and the sitemap never mentions cannot be found.
 */

import type { LandingPageManifest } from '@/core/landing-factory';

export const LANDING_PAGES: LandingPageManifest[] = [
  {
    slug: 'gradient-generator',
    product: 'color',
    label: 'Gradient Generator',
    cta: 'color-generator/tool?mode=gradient',
    copy: {
      en: {
        title: 'Gradient Generator — Modern CSS Gradient Maker',
        description: 'Free modern gradient generator. Create linear, radial, conic, mesh, and aurora gradients with multiple color stops, blend modes, and noise. Export to CSS, Tailwind, SVG, and more.',
      },
      ru: {
        title: 'Генератор градиентов — Современный CSS конструктор градиентов',
        description: 'Бесплатный генератор градиентов. Создавайте линейные, радиальные, конические, mesh и aurora градиенты. Экспорт в CSS, Tailwind, SVG и другие.',
      },
      de: {
        title: 'Farbverlauf-Generator — Moderner CSS-Verlaufs-Editor',
        description: 'Kostenloser Farbverlauf-Generator. Erstellen Sie lineare, radiale, konische, Mesh- und Aurora-Verläufe. Export nach CSS, Tailwind, SVG uvm.',
      },
      es: {
        title: 'Generador de degradados — Creador moderno de degradados CSS',
        description: 'Generador de degradados gratuito. Cree degradados lineales, radiales, cónicos, mesh y aurora. Exporte a CSS, Tailwind, SVG y más.',
      },
      fr: {
        title: 'Générateur de dégradés — Créateur de dégradés CSS moderne',
        description: 'Générateur de dégradés gratuit. Créez des dégradés linéaires, radiaux, coniques, mesh et aurora. Exportez en CSS, Tailwind, SVG et plus.',
      },
      pt: {
        title: 'Gerador de gradientes — Criador moderno de gradientes CSS',
        description: 'Gerador de gradientes gratuito. Crie gradientes lineares, radiais, cônicos, mesh e aurora. Exporte para CSS, Tailwind, SVG e mais.',
      },
    },
  },
  {
    slug: 'linear-gradient-generator',
    product: 'color',
    label: 'Linear Gradient Generator',
    cta: 'color-generator/tool?mode=gradient&sub=classic&type=linear',
    copy: {
      en: {
        title: 'Linear Gradient Generator — CSS Linear Gradient Maker',
        description: 'Free linear gradient generator. Create beautiful CSS linear gradients with multiple color stops, angle control, and real-time preview. Export to CSS, Tailwind, and SVG.',
      },
      ru: {
        title: 'Генератор линейного градиента — CSS конструктор линейных градиентов',
        description: 'Бесплатный генератор линейных градиентов. Создавайте красивые CSS линейные градиенты с контролем угла и предпросмотром.',
      },
      de: {
        title: 'Linearer Farbverlauf-Generator — CSS Linearverlauf-Editor',
        description: 'Kostenloser linearer Farbverlauf-Generator. Erstellen Sie schöne CSS-Linearverläufe mit Winkelsteuerung und Live-Vorschau.',
      },
      es: {
        title: 'Generador de degradado lineal — Creador de degradado lineal CSS',
        description: 'Generador de degradado lineal gratuito. Cree hermosos degradados lineales CSS con control de ángulo y vista previa en vivo.',
      },
      fr: {
        title: 'Générateur de dégradé linéaire — Créateur de dégradé linéaire CSS',
        description: 'Générateur de dégradé linéaire gratuit. Créez de superbes dégradés linéaires CSS avec contrôles d\'angle et prévisualisation en direct.',
      },
      pt: {
        title: 'Gerador de gradiente linear — Criador de gradiente linear CSS',
        description: 'Gerador de gradiente linear gratuito. Crie belos gradientes lineares CSS com controle de ângulo e pré-visualização em tempo real.',
      },
    },
  },
  {
    slug: 'radial-gradient-generator',
    product: 'color',
    label: 'Radial Gradient Generator',
    cta: 'color-generator/tool?mode=gradient&sub=classic&type=radial',
    copy: {
      en: {
        title: 'Radial Gradient Generator — CSS Radial Gradient Maker',
        description: 'Free radial gradient generator. Create stunning CSS radial gradients with shape, size, and position controls. Multiple color stops with real-time preview.',
      },
      ru: {
        title: 'Генератор радиального градиента — CSS конструктор радиальных градиентов',
        description: 'Бесплатный генератор радиальных градиентов. Создавайте впечатляющие CSS радиальные градиенты с контролем формы, размера и позиции.',
      },
      de: {
        title: 'Radialer Farbverlauf-Generator — CSS Radialverlauf-Editor',
        description: 'Kostenloser radialer Farbverlauf-Generator. Erstellen Sie beeindruckende CSS-Radialverläufe mit Form-, Größen- und Positionssteuerung.',
      },
      es: {
        title: 'Generador de degradado radial — Creador de degradado radial CSS',
        description: 'Generador de degradado radial gratuito. Cree impresionantes degradados radiales CSS con control de forma, tamaño y posición.',
      },
      fr: {
        title: 'Générateur de dégradé radial — Créateur de dégradé radial CSS',
        description: 'Générateur de dégradé radial gratuit. Créez de superbes dégradés radiaux CSS avec contrôles de forme, taille et position.',
      },
      pt: {
        title: 'Gerador de gradiente radial — Criador de gradiente radial CSS',
        description: 'Gerador de gradiente radial gratuito. Crie impressionantes gradientes radiais CSS com controle de forma, tamanho e posição.',
      },
    },
  },
  {
    slug: 'conic-gradient-generator',
    product: 'color',
    label: 'Conic Gradient Generator',
    cta: 'color-generator/tool?mode=gradient&sub=classic&type=conic',
    copy: {
      en: {
        title: 'Conic Gradient Generator — CSS Conic Gradient Maker',
        description: 'Free conic gradient generator. Create stunning CSS conic gradients with angle, position controls, and multiple color stops. Perfect for pie charts and color wheels.',
      },
      ru: {
        title: 'Генератор конического градиента — CSS конструктор конических градиентов',
        description: 'Бесплатный генератор конических градиентов. Создавайте впечатляющие CSS конические градиенты — идеально для круговых диаграмм и цветовых кругов.',
      },
      de: {
        title: 'Konischer Farbverlauf-Generator — CSS Konischverlauf-Editor',
        description: 'Kostenloser konischer Farbverlauf-Generator. Erstellen Sie beeindruckende CSS-Konischverläufe — perfekt für Tortendiagramme und Farbkreise.',
      },
      es: {
        title: 'Generador de degradado cónico — Creador de degradado cónico CSS',
        description: 'Generador de degradado cónico gratuito. Cree impresionantes degradados cónicos CSS — perfecto para gráficos circulares y ruedas de color.',
      },
      fr: {
        title: 'Générateur de dégradé conique — Créateur de dégradé conique CSS',
        description: 'Générateur de dégradé conique gratuit. Créez de superbes dégradés coniques CSS — idéal pour diagrammes circulaires et roues chromatiques.',
      },
      pt: {
        title: 'Gerador de gradiente cônico — Criador de gradiente cônico CSS',
        description: 'Gerador de gradiente cônico gratuito. Crie impressionantes gradientes cônicos CSS — perfeito para gráficos de pizza e rodas de cores.',
      },
    },
  },
  {
    slug: 'mesh-gradient-generator',
    product: 'color',
    label: 'Mesh Gradient Generator',
    cta: 'color-generator/tool?mode=gradient&sub=mesh',
    copy: {
      en: {
        title: 'Mesh Gradient Generator — Interactive Mesh Gradient Creator',
        description: 'Free mesh gradient generator. Create stunning mesh gradients with draggable color points on an interactive canvas. Perfect for modern UI backgrounds and brand visuals.',
      },
      ru: {
        title: 'Генератор Mesh градиентов — Интерактивный конструктор сетчатых градиентов',
        description: 'Бесплатный генератор Mesh градиентов. Создавайте сетчатые градиенты с перетаскиваемыми цветовыми точками на интерактивном холсте.',
      },
      de: {
        title: 'Mesh-Farbverlauf-Generator — Interaktiver Mesh-Verlaufs-Editor',
        description: 'Kostenloser Mesh-Farbverlauf-Generator. Erstellen Sie Mesh-Verläufe mit ziehbaren Farbpunkten auf einer interaktiven Leinwand.',
      },
      es: {
        title: 'Generador de degradado mesh — Creador de degradado mesh interactivo',
        description: 'Generador de degradado mesh gratuito. Cree degradados mesh con puntos de color en un lienzo interactivo.',
      },
      fr: {
        title: 'Générateur de dégradé mesh — Créateur de dégradé mesh interactif',
        description: 'Générateur de dégradé mesh gratuit. Créez des dégradés mesh avec des points de couleur sur un canvas interactif.',
      },
      pt: {
        title: 'Gerador de gradiente mesh — Criador de gradiente mesh interativo',
        description: 'Gerador de gradiente mesh gratuito. Crie gradientes mesh com pontos de cor arrastáveis em uma tela interativa.',
      },
    },
  },
  {
    slug: 'aurora-gradient-generator',
    product: 'color',
    label: 'Aurora Gradient Generator',
    cta: 'color-generator/tool?mode=gradient&sub=aurora',
    copy: {
      en: {
        title: 'Aurora Gradient Generator — Dreamy Aurora Background Creator',
        description: 'Free aurora gradient generator. Create dreamy multi-layer aurora backgrounds with 15+ presets. Customize colors, blur, position, and animation for stunning visual effects.',
      },
      ru: {
        title: 'Генератор Aurora градиентов — Создатель атмосферных фонов',
        description: 'Бесплатный генератор Aurora градиентов. Создавайте многослойные фоны с 15+ готовыми стилями.',
      },
      de: {
        title: 'Aurora-Farbverlauf-Generator — Verträumter Aurora-Hintergrund-Editor',
        description: 'Kostenloser Aurora-Farbverlauf-Generator. Erstellen Sie mehrschichtige Aurora-Hintergründe mit über 15 Voreinstellungen.',
      },
      es: {
        title: 'Generador de degradado aurora — Creador de fondos aurora',
        description: 'Generador de degradado aurora gratuito. Cree fondos aurora multicapa con 15+ estilos predefinidos.',
      },
      fr: {
        title: 'Générateur de dégradé aurora — Créateur de fond aurora',
        description: 'Générateur de dégradé aurora gratuit. Créez des fonds aurora multicouches avec 15+ styles prédéfinis.',
      },
      pt: {
        title: 'Gerador de gradiente aurora — Criador de fundo aurora',
        description: 'Gerador de gradiente aurora gratuito. Crie fundos aurora multicamadas com 15+ estilos predefinidos.',
      },
    },
  },
  {
    slug: 'css-gradient-generator',
    product: 'color',
    label: 'CSS Gradient Generator',
    cta: 'color-generator/tool?mode=gradient&sub=export&format=css',
    copy: {
      en: {
        title: 'CSS Gradient Generator — Generate CSS Gradient Code Online',
        description: 'Free CSS gradient generator. Generate clean CSS gradient code with multiple formats including linear, radial, conic, and repeating gradients. Export with Tailwind, SVG, and React support.',
      },
      ru: {
        title: 'CSS генератор градиентов — Создавайте CSS код градиентов онлайн',
        description: 'Бесплатный CSS генератор градиентов. Создавайте чистый CSS код градиентов с экспортом в Tailwind, SVG и React.',
      },
      de: {
        title: 'CSS-Verlauf-Generator — CSS-Verlaufscode online erstellen',
        description: 'Kostenloser CSS-Verlauf-Generator. Generieren Sie sauberen CSS-Verlaufscode mit Export nach Tailwind, SVG und React.',
      },
      es: {
        title: 'Generador de degradado CSS — Genere código de degradado CSS en línea',
        description: 'Generador de degradado CSS gratuito. Genere código de degradado CSS con exportación a Tailwind, SVG y React.',
      },
      fr: {
        title: 'Générateur de dégradé CSS — Générer du code de dégradé CSS en ligne',
        description: 'Générateur de dégradé CSS gratuit. Générez du code de dégradé CSS avec export Tailwind, SVG et React.',
      },
      pt: {
        title: 'Gerador de gradiente CSS — Gere código de gradiente CSS online',
        description: 'Gerador de gradiente CSS gratuito. Gere código de gradiente CSS com exportação para Tailwind, SVG e React.',
      },
    },
  },
  {
    slug: 'smart-gradient-generator',
    product: 'color',
    label: 'Smart Gradient Generator',
    cta: 'color-generator/tool?mode=gradient',
    copy: {
      en: {
        title: 'Smart Gradient Generator — AI-Powered Gradient Suggestions',
        description: 'Free smart gradient generator. Describe your desired gradient in natural language and get instant matching suggestions. Type "warm sunset" or "dark cyberpunk" and find the perfect gradient.',
      },
      ru: {
        title: 'Умный генератор градиентов — Предложения градиентов с ИИ',
        description: 'Бесплатный умный генератор градиентов. Опишите желаемый градиент на естественном языке и получите мгновенные предложения.',
      },
      de: {
        title: 'Intelligenter Farbverlauf-Generator — KI-gestützte Verlaufsvorschläge',
        description: 'Kostenloser intelligenter Farbverlauf-Generator. Beschreiben Sie Ihren Wunschverlauf und erhalten Sie sofort passende Vorschläge.',
      },
      es: {
        title: 'Generador de degradado inteligente — Sugerencias de degradados por IA',
        description: 'Generador inteligente gratuito. Describa su degradado en lenguaje natural y obtenga sugerencias instantáneas.',
      },
      fr: {
        title: 'Générateur de dégradé intelligent — Suggestions de dégradés par IA',
        description: 'Générateur intelligent gratuit. Décrivez votre dégradé en langage naturel et obtenez des suggestions instantanées.',
      },
      pt: {
        title: 'Gerador de gradiente inteligente — Sugestões de gradiente por IA',
        description: 'Gerador inteligente gratuito. Descreva seu gradiente em linguagem natural e obtenha sugestões instantâneas.',
      },
    },
  },
  {
    slug: 'gradient-animation-generator',
    product: 'color',
    label: 'Gradient Animation Generator',
    cta: 'color-generator/tool?mode=gradient&sub=animation',
    copy: {
      en: {
        title: 'Gradient Animation Generator — Animated CSS Gradient Maker',
        description: 'Free animated gradient generator. Create stunning CSS gradient animations with 9 animation types. Control speed, direction, timing, and export ready-to-use CSS keyframes.',
      },
      ru: {
        title: 'Генератор анимации градиента — Создатель анимированных CSS градиентов',
        description: 'Бесплатный генератор анимации градиентов. Создавайте CSS анимацию с 9 типами, контролем скорости и экспортом.',
      },
      de: {
        title: 'Farbverlauf-Animation-Generator — Animierter CSS-Verlaufs-Editor',
        description: 'Kostenloser Farbverlauf-Animation-Generator. Erstellen Sie CSS-Verlaufsanimationen mit 9 Animationsarten und Export.',
      },
      es: {
        title: 'Generador de animación de degradado — Creador de animación CSS degradada',
        description: 'Generador de animación de degradado gratuito. Cree animaciones CSS con 9 tipos, control de velocidad y exportación.',
      },
      fr: {
        title: 'Générateur d\'animation de dégradé — Créateur d\'animation CSS dégradé',
        description: 'Générateur d\'animation de dégradé gratuit. Créez des animations CSS avec 9 types d\'animation, contrôles de vitesse et export.',
      },
      pt: {
        title: 'Gerador de animação de gradiente — Criador de animação CSS gradiente',
        description: 'Gerador de animação de gradiente gratuito. Crie animações CSS com 9 tipos, controle de velocidade e exportação.',
      },
    },
  },
  {
    slug: 'gradient-background-generator',
    product: 'color',
    label: 'Gradient Background Generator',
    cta: 'color-generator/tool?mode=gradient&sub=background',
    copy: {
      en: {
        title: 'Gradient Background Generator — Beautiful Gradient Backgrounds',
        description: 'Free gradient background generator. Create beautiful context-aware gradient backgrounds for landing pages, dashboards, and apps. Smart suggestions for every mood and context.',
      },
      ru: {
        title: 'Генератор градиентных фонов — Красивые градиентные фоны',
        description: 'Бесплатный генератор градиентных фонов. Создавайте красивые контекстно-зависимые градиентные фоны.',
      },
      de: {
        title: 'Farbverlauf-Hintergrund-Generator — Schöne Farbverlauf-Hintergründe',
        description: 'Kostenloser Farbverlauf-Hintergrund-Generator. Erstellen Sie schöne kontextbewusste Farbverlaufshintergründe.',
      },
      es: {
        title: 'Generador de fondos degradados — Hermosos fondos degradados',
        description: 'Generador de fondos degradados gratuito. Cree hermosos fondos degradados para páginas de inicio, paneles y aplicaciones.',
      },
      fr: {
        title: 'Générateur de fond dégradé — Beaux fonds d\'écran dégradés',
        description: 'Générateur de fond dégradé gratuit. Créez de beaux fonds dégradés adaptés au contexte pour pages d\'accueil, tableaux de bord et applications.',
      },
      pt: {
        title: 'Gerador de fundo gradiente — Lindos fundos gradientes',
        description: 'Gerador de fundo gradiente gratuito. Crie lindos fundos gradientes para páginas iniciais, painéis e aplicativos.',
      },
    },
  },
  {
    slug: 'gradient-palette-library',
    product: 'color',
    label: 'Gradient Palette Library',
    cta: 'color-generator/tool?mode=gradient&sub=collections',
    copy: {
      en: {
        title: 'Gradient Palette Library — Collection of 200+ Curated Gradients',
        description: 'Free gradient palette library. Browse 200+ curated gradients across 25 categories — minimal, corporate, tech, nature, cyberpunk, and more. Search, filter, and save your favorites.',
      },
      ru: {
        title: 'Библиотека градиентных палитр — 200+ тщательно отобранных градиентов',
        description: 'Бесплатная библиотека градиентов. 200+ тщательно отобранных градиентов в 25 категориях.',
      },
      de: {
        title: 'Farbverlauf-Palettenbibliothek — 200+ kuratierte Farbverläufe',
        description: 'Kostenlose Farbverlauf-Bibliothek. Durchsuchen Sie 200+ kuratierte Farbverläufe in 25 Kategorien.',
      },
      es: {
        title: 'Biblioteca de paletas de degradados — 200+ degradados seleccionados',
        description: 'Biblioteca de degradados gratuita. Explore 200+ degradados en 25 categorías. Busque, filtre y guarde sus favoritos.',
      },
      fr: {
        title: 'Bibliothèque de palettes de dégradés — 200+ dégradés organisés',
        description: 'Bibliothèque de dégradés gratuite. Parcourez 200+ dégradés organisés en 25 catégories. Recherchez, filtrez et sauvegardez vos favoris.',
      },
      pt: {
        title: 'Biblioteca de paletas de gradientes — 200+ gradientes selecionados',
        description: 'Biblioteca de gradientes gratuita. Navegue por 200+ gradientes em 25 categorias. Pesquise, filtre e salve seus favoritos.',
      },
    },
  },
  {
    slug: 'gradient-export-tool',
    product: 'color',
    label: 'Gradient Export Tool',
    cta: 'color-generator/tool?mode=gradient&sub=export',
    copy: {
      en: {
        title: 'Gradient Export Tool — Export Gradients to CSS, SVG, Tailwind & More',
        description: 'Free gradient export tool. Export your gradients to 10+ formats: CSS, Tailwind CSS, SVG, JSON, React, Vue, SCSS, LESS, and Style Dictionary. Perfect for developers and designers.',
      },
      ru: {
        title: 'Инструмент экспорта градиентов — Экспорт в CSS, SVG, Tailwind и другие',
        description: 'Бесплатный инструмент экспорта. Экспортируйте градиенты в 10+ форматов: CSS, Tailwind, SVG, JSON, React, Vue, SCSS, LESS и Style Dictionary.',
      },
      de: {
        title: 'Farbverlauf-Export-Tool — Export nach CSS, SVG, Tailwind uvm.',
        description: 'Kostenloses Export-Tool. Exportieren Sie Farbverläufe in 10+ Formate: CSS, Tailwind, SVG, JSON, React, Vue, SCSS, LESS und Style Dictionary.',
      },
      es: {
        title: 'Herramienta de exportación de degradados — Exporte a CSS, SVG, Tailwind y más',
        description: 'Herramienta de exportación gratuita. Exporte sus degradados a 10+ formatos: CSS, Tailwind, SVG, JSON, React, Vue, SCSS, LESS y Style Dictionary.',
      },
      fr: {
        title: 'Outil d\'export de dégradés — Exportez en CSS, SVG, Tailwind et plus',
        description: 'Outil d\'export gratuit. Exportez vos dégradés en 10+ formats: CSS, Tailwind, SVG, JSON, React, Vue, SCSS, LESS et Style Dictionary.',
      },
      pt: {
        title: 'Ferramenta de exportação de gradientes — Exporte para CSS, SVG, Tailwind e mais',
        description: 'Ferramenta de exportação gratuita. Exporte seus gradientes para 10+ formatos: CSS, Tailwind, SVG, JSON, React, Vue, SCSS, LESS e Style Dictionary.',
      },
    },
  },
  {
    slug: 'theme-generator',
    product: 'color',
    label: 'Theme Generator',
    cta: 'color-generator/tool?mode=theme',
    copy: {
      en: {
        title: 'Theme Generator — Create Complete Design Systems from One Color',
        description: 'Free online theme generator. Create a complete design system from a single color — 50-950 scales, semantic colors, light/dark themes with WCAG accessibility.',
      },
      ru: {
        title: 'Генератор тем — Создавайте полные дизайн-системы из одного цвета',
        description: 'Бесплатный генератор тем. Создайте полную дизайн-систему из одного цвета — шкалы 50-950, семантические цвета, светлая/тёмная темы.',
      },
      de: {
        title: 'Theme Generator — Erstellen Sie komplette Design-Systeme aus einer Farbe',
        description: 'Kostenloser Theme-Generator. Erstellen Sie ein komplettes Design-System aus einer Farbe — 50-950 Skalen, semantische Farben, Hell-/Dunkelmodus.',
      },
      es: {
        title: 'Generador de temas — Cree sistemas de diseño completos desde un color',
        description: 'Generador de temas gratuito. Cree un sistema de diseño completo desde un solo color — escalas 50-950, colores semánticos, temas claro/oscuro.',
      },
      fr: {
        title: 'Générateur de thèmes — Créez des systèmes de design complets à partir d\'une couleur',
        description: 'Générateur de thèmes gratuit. Créez un système de design complet à partir d\'une seule couleur — échelles 50-950, couleurs sémantiques, thèmes clair/sombre.',
      },
      pt: {
        title: 'Gerador de temas — Crie sistemas de design completos a partir de uma cor',
        description: 'Gerador de temas gratuito. Crie um sistema de design completo a partir de uma única cor — escalas 50-950, cores semânticas, temas claro/escuro.',
      },
    },
  },
  {
    slug: 'tailwind-theme-generator',
    product: 'color',
    label: 'Tailwind Theme Generator',
    cta: 'color-generator/tool?mode=theme',
    copy: {
      en: {
        title: 'Tailwind Theme Generator — Create Tailwind CSS Color Configurations',
        description: 'Free Tailwind theme generator. Create complete Tailwind CSS v4 color configurations from one color — 50-950 scales, semantic tokens, and ready-to-export config.',
      },
      ru: {
        title: 'Генератор тем Tailwind — Создавайте конфигурации цветов Tailwind CSS',
        description: 'Бесплатный генератор тем Tailwind. Создавайте полные конфигурации цветов Tailwind CSS v4 — шкалы 50-950, семантические токены, готовый экспорт.',
      },
      de: {
        title: 'Tailwind-Theme-Generator — Erstellen Sie Tailwind-CSS-Farbkonfigurationen',
        description: 'Kostenloser Tailwind-Theme-Generator. Erstellen Sie komplette Tailwind-CSS-v4-Farbkonfigurationen — 50-950 Skalen, semantische Tokens, exportfertig.',
      },
      es: {
        title: 'Generador de temas Tailwind — Cree configuraciones de color Tailwind CSS',
        description: 'Generador de temas Tailwind gratuito. Cree configuraciones Tailwind CSS v4 completas — escalas 50-950, tokens semánticos, exportación lista.',
      },
      fr: {
        title: 'Générateur de thème Tailwind — Créez des configurations de couleurs Tailwind CSS',
        description: 'Générateur de thème Tailwind gratuit. Créez des configurations Tailwind CSS v4 complètes — échelles 50-950, jetons sémantiques, export prêt à l\'emploi.',
      },
      pt: {
        title: 'Gerador de temas Tailwind — Crie configurações de cores Tailwind CSS',
        description: 'Gerador de temas Tailwind gratuito. Crie configurações Tailwind CSS v4 completas — escalas 50-950, tokens semânticos, exportação pronta.',
      },
    },
  },
  {
    slug: 'design-system-generator',
    product: 'color',
    label: 'Design System Generator',
    cta: 'color-generator/tool?mode=theme',
    copy: {
      en: {
        title: 'Design System Generator — Build Complete Design Systems Online',
        description: 'Free online design system generator. Build complete design systems from one color — color scales, semantic tokens, light/dark themes, and developer-ready exports.',
      },
      ru: {
        title: 'Генератор дизайн-систем — Создавайте полные дизайн-системы онлайн',
        description: 'Бесплатный генератор дизайн-систем. Создавайте полные дизайн-системы из одного цвета — цветовые шкалы, семантические токены, светлые/тёмные темы, экспорт для разработчиков.',
      },
      de: {
        title: 'Design-System-Generator — Erstellen Sie komplette Design-Systeme online',
        description: 'Kostenloser Design-System-Generator. Erstellen Sie komplette Design-Systeme aus einer Farbe — Farbskalen, semantische Tokens, Hell-/Dunkelmodus, Entwickler-Exports.',
      },
      es: {
        title: 'Generador de sistemas de diseño — Cree sistemas completos en línea',
        description: 'Generador de sistemas de diseño gratuito. Cree sistemas completos desde un color — escalas, tokens semánticos, temas claro/oscuro, exportaciones para desarrolladores.',
      },
      fr: {
        title: 'Générateur de systèmes de design — Créez des systèmes complets en ligne',
        description: 'Générateur de systèmes de design gratuit. Créez des systèmes complets à partir d\'une couleur — échelles, jetons sémantiques, thèmes clair/sombre, exports développeur.',
      },
      pt: {
        title: 'Gerador de sistemas de design — Crie sistemas completos online',
        description: 'Gerador de sistemas de design gratuito. Crie sistemas completos a partir de uma cor — escalas, tokens semânticos, temas claro/escuro, exportações para desenvolvedores.',
      },
    },
  },
  {
    slug: 'brand-palette-generator',
    product: 'color',
    label: 'Brand Palette Generator',
    cta: 'color-generator/tool?mode=brands',
    copy: {
      en: {
        title: 'Brand Palette Generator — Create Brand Color Palettes Online',
        description: 'Free brand palette generator. Create professional brand color palettes — explore harmonious schemes, preview brand personalities, and export to CSS/Tailwind.',
      },
      ru: {
        title: 'Генератор палитр бренда — Создавайте цветовые палитры бренда онлайн',
        description: 'Бесплатный генератор палитр бренда. Создавайте профессиональные цветовые палитры — исследуйте гармонии, характеристики бренда, экспорт.',
      },
      de: {
        title: 'Markenfarbpaletten-Generator — Erstellen Sie Markenfarbpaletten online',
        description: 'Kostenloser Markenfarbpaletten-Generator. Erstellen Sie professionelle Farbpaletten — erkunden Sie Harmonien, Markenpersönlichkeiten, Export.',
      },
      es: {
        title: 'Generador de paletas de marca — Cree paletas de colores de marca en línea',
        description: 'Generador de paletas de marca gratuito. Cree paletas de colores profesionales — explore armonías, previsualice personalidades de marca, exporte.',
      },
      fr: {
        title: 'Générateur de palette de marque — Créez des palettes de couleurs de marque',
        description: 'Générateur de palette de marque gratuit. Créez des palettes professionnelles — explorez des harmonies, prévisualisez des personnalités de marque, exportez.',
      },
      pt: {
        title: 'Gerador de paletas de marca — Crie paletas de cores de marca online',
        description: 'Gerador de paletas de marca gratuito. Crie paletas de cores profissionais — explore harmonias, visualize personalidades de marca, exporte.',
      },
    },
  },
  {
    slug: 'ui-color-generator',
    product: 'color',
    label: 'UI Color Generator',
    cta: 'color-generator/tool?mode=theme',
    copy: {
      en: {
        title: 'UI Color Generator — Color Systems for User Interface Design',
        description: 'Free UI color generator. Create accessible color systems for your user interfaces — 50-950 scales, semantic colors, light/dark themes, and Tailwind-ready tokens.',
      },
      ru: {
        title: 'Генератор цветов UI — Цветовые системы для дизайна интерфейсов',
        description: 'Бесплатный генератор цветов UI. Создавайте доступные цветовые системы — шкалы 50-950, семантические цвета, светлые/тёмные темы, Tailwind-токены.',
      },
      de: {
        title: 'UI-Farbgenerator — Farbsysteme für das UI-Design',
        description: 'Kostenloser UI-Farbgenerator. Erstellen Sie zugängliche Farbsysteme — 50-950 Skalen, semantische Farben, Hell-/Dunkelmodus, Tailwind-Tokens.',
      },
      es: {
        title: 'Generador de colores UI — Sistemas de color para diseño de interfaces',
        description: 'Generador de colores UI gratuito. Cree sistemas de color accesibles — escalas 50-950, colores semánticos, temas claro/oscuro, tokens Tailwind.',
      },
      fr: {
        title: 'Générateur de couleurs UI — Systèmes de couleurs pour le design d\'interface',
        description: 'Générateur de couleurs UI gratuit. Créez des systèmes de couleurs accessibles — échelles 50-950, couleurs sémantiques, thèmes clair/sombre, jetons Tailwind.',
      },
      pt: {
        title: 'Gerador de cores UI — Sistemas de cores para design de interface',
        description: 'Gerador de cores UI gratuito. Crie sistemas de cores acessíveis — escalas 50-950, cores semânticas, temas claro/escuro, tokens Tailwind.',
      },
    },
  },
];

const BY_SLUG = new Map(LANDING_PAGES.map((page) => [page.slug, page]));

/**
 * Look up a landing manifest. Throws rather than returning undefined: a page
 * file naming a slug that does not exist is a build-time mistake, and failing
 * loudly beats rendering a blank page.
 */
export function getLandingPage(slug: string): LandingPageManifest {
  const page = BY_SLUG.get(slug);
  if (!page) throw new Error(`Unknown landing page: ${slug}`);
  return page;
}

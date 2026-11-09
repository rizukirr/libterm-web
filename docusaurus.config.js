// @ts-check
// Site configuration for the libterm documentation, served from GitHub Pages.

/** Code colours come from the Cobalt tokens in src/css/tokens.css, so the
 * highlighter takes variables rather than literals and stays on one hue. */
const graphitePrism = {
  plain: {color: 'var(--color-graphite-ink)', backgroundColor: 'var(--color-graphite)'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: 'var(--color-graphite-muted)'}},
    {types: ['keyword', 'builtin', 'directive', 'directive-hash', 'macro', 'property'], style: {color: 'var(--color-accent-2)'}},
    {types: ['string', 'char', 'attr-value'], style: {color: 'var(--color-accent-2)'}},
    {types: ['function', 'class-name', 'constant'], style: {color: 'var(--color-graphite-ink)'}},
    {types: ['number', 'boolean'], style: {color: 'var(--color-graphite-ink)'}},
    {types: ['punctuation', 'operator'], style: {color: 'var(--color-graphite-muted)'}},
  ],
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'libterm',
  tagline: 'Cross-platform, native, modern terminal UI library',
  favicon: 'img/favicon.svg',
  future: {v4: true},

  url: 'https://rizukirr.github.io',
  baseUrl: '/libterm-web/',
  organizationName: 'rizukirr',
  projectName: 'libterm-web',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {hooks: {onBrokenMarkdownLinks: 'throw'}},

  i18n: {defaultLocale: 'en', locales: ['en']},

  headTags: [
    {tagName: 'script', attributes: {}, innerHTML: "document.documentElement.classList.add('js');"},
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'}},
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'}},
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
      },
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/rizukirr/libterm-web/tree/main/',
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {name: 'description', content: 'libterm: a cross-platform, native, modern terminal UI library with a termbox2-compatible API on POSIX and native Windows (Win32 Console API).'},
      ],
      colorMode: {defaultMode: 'dark', disableSwitch: true, respectPrefersColorScheme: false},
      announcementBar: {
        id: 'v0-1-3',
        content: 'v0.1.3 is out: F1 to F4 with modifiers and split UTF-8 keystrokes now decode on POSIX. <a href="https://github.com/rizukirr/libterm/releases/tag/v0.1.3">Release notes</a>',
        isCloseable: true,
      },
      docs: {sidebar: {hideable: false, autoCollapseCategories: false}},
      navbar: {
        title: 'libterm',
        hideOnScroll: false,
        items: [
          {type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs'},
          {type: 'docSidebar', sidebarId: 'apiSidebar', position: 'left', label: 'API'},
          {href: 'https://github.com/rizukirr/libterm', label: 'GitHub', position: 'right'},
        ],
      },
      footer: {
        style: 'light',
        links: [],
        copyright:
          'libterm | MIT | <a href="https://github.com/rizukirr/libterm">github.com/rizukirr/libterm</a> | pictures are real runs of <code>examples/</code>, cell for cell | <a href="https://github.com/rizukirr/libterm-web">site source</a>',
      },
      prism: {
        theme: graphitePrism,
        darkTheme: graphitePrism,
        additionalLanguages: ['c', 'cmake', 'bash'],
      },
      tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 3},
    }),
};

export default config;

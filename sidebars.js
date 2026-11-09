// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'index',
    {
      type: 'category',
      label: 'Getting started',
      items: ['getting-started/install', 'getting-started/first-program', 'getting-started/build-options'],
    },
    {
      type: 'category',
      label: 'Tutorials',
      link: {type: 'doc', id: 'tutorials/index'},
      items: [
        'tutorials/first-screen',
        'tutorials/drawing-and-layout',
        'tutorials/keyboard',
        'tutorials/mouse',
        'tutorials/put-it-together',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/screen-and-rendering',
        'guides/text-and-unicode',
        'guides/colors-and-attributes',
        'guides/input-and-events',
        'guides/platforms',
        'guides/errors',
        'guides/porting-from-termbox2',
      ],
    },
    'examples',
  ],
  apiSidebar: [
    'api/index',
    {
      type: 'category',
      label: 'Functions',
      items: [
        'api/lifecycle',
        'api/screen',
        'api/cells',
        'api/text',
        'api/raw-output',
        'api/input',
        'api/modes',
        'api/color-query',
        'api/unicode',
        'api/cursor',
        'api/misc',
      ],
    },
    {
      type: 'category',
      label: 'Constants and types',
      items: [
        'api/constants/types',
        'api/constants/return-codes',
        'api/constants/events-and-keys',
        'api/constants/colors-and-attributes',
        'api/constants/modes',
        'api/constants/version',
      ],
    },
  ],
};

export default sidebars;

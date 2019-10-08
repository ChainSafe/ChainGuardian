import { configure } from '@storybook/react';

import '!style-loader!css-loader!sass-loader!../src/renderer/style/index.scss'

// automatically import all files ending in *.stories.tsx
const req = require.context("../src", true, /.stories.tsx$/);

function loadStories() {
    req.keys().forEach(req);
}

configure(loadStories, module);

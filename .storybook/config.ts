import { addParameters, configure } from '@storybook/react';

import '../src/renderer/style/index.scss'

addParameters({
    backgrounds: [
        { name: 'main', value: '#052437', default: true }
    ],
});

// automatically import all files ending in *.stories.tsx
const req = require.context("../src", true, /.stories.tsx$/);

function loadStories() {
    req.keys().forEach(req);
}

configure(loadStories, module);


export interface Interface {
    new(aas: string): Interface
}
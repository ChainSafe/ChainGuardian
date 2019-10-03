import { configure } from '@storybook/react';

import '!style-loader!css-loader!sass-loader!../src/renderer/style/index.scss'

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.tsx$/), module);

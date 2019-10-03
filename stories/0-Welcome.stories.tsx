import * as React from 'react';
import { storiesOf } from "@storybook/react";
import { Welcome } from '@storybook/react/demo';
import { linkTo } from "@storybook/addon-links";

storiesOf("Welcome", module).add("to Storybook", () => <Welcome showApp={linkTo("RoundedButton")} />);

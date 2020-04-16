import React from 'react';
import { storiesOf } from '@storybook/react';
import {withKnobs} from "@storybook/addon-knobs";
import {MemoryRouter} from "react-router";
import {ValidatorDetailsContainer} from "./ValidatorDetailsContainer";

storiesOf('Validator Details', module).add('container', () => {
    return <ValidatorDetailsContainer />
})
    .addDecorator(withKnobs)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ));

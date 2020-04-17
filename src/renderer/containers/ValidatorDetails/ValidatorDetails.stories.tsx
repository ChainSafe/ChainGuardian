import React from 'react';
import { storiesOf } from '@storybook/react';
import {withKnobs} from "@storybook/addon-knobs";
import {MemoryRouter} from "react-router";
import { Provider as ReduxProvider } from 'react-redux';
import {combineReducers, createStore} from "redux";

import {ValidatorDetailsContainer} from "./ValidatorDetailsContainer";

function Provider({ story }: any) {
    const store = createStore(combineReducers({auth: () => ({
        account: null,
        validators: [],
    })}));
    return (
        <ReduxProvider store={store}>
            {story}
        </ReduxProvider>
    );
}

storiesOf('Validator Details', module).add('container', () => {
    return <ValidatorDetailsContainer />
})
    .addDecorator(story => <Provider story={story()} />)
    .addDecorator(withKnobs)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ));

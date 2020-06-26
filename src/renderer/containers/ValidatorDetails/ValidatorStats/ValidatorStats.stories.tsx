import React from 'react';
import { storiesOf } from '@storybook/react';
import {withKnobs} from "@storybook/addon-knobs";
import {MemoryRouter} from "react-router";
import { Provider as ReduxProvider } from 'react-redux';
import {combineReducers, createStore} from "redux";

import {ValidatorStats} from "./ValidatorStats";

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

storiesOf('Validator stats', module).add('stats', () => {
    return <ValidatorStats
        validatorId={1}
        validator={{
            name: "test",
            status: "good",
            publicKey: "0xpublic",
            network: "Lighthouse",
            privateKey: "0xprivate",
        }}
    />
})
    .addDecorator(story => <Provider story={story()} />)
    .addDecorator(withKnobs)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ));

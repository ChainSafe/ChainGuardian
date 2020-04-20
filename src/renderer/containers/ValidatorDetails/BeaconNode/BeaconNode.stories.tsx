import React from 'react';
import { storiesOf } from '@storybook/react';
import {withKnobs} from "@storybook/addon-knobs";
import {MemoryRouter} from "react-router";
import { Provider as ReduxProvider } from 'react-redux';
import {combineReducers, createStore} from "redux";

import {BeaconNode} from "./BeaconNode";

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

storiesOf('BeaconNode', module).add('stats', () => {
    return <BeaconNode
        node={{
            url: "test.com",
            localDockerId: "prysm-network-node",
        }}
    />
})
    .addDecorator(story => <Provider story={story()} />)
    .addDecorator(withKnobs)
    .addDecorator(story => (
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ));

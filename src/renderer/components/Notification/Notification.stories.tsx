import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { Notification} from './Notification';

storiesOf('Notification', module).add('System Notice/Error', () => {
    const typeOptions = {
        info: "info",
        error: "error",
    }
    const type = select("type", typeOptions, "info");
    return <Notification isVisible={true} level={type} title="Main message">
        Description of notice. Try to use conversational copy to give a friendly notice to your users!
        </Notification>
}).addDecorator(withKnobs);
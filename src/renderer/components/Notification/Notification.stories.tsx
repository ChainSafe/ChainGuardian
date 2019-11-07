import * as React from 'react';
import {useState} from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, button } from '@storybook/addon-knobs';
import { Notification} from './Notification';
import {Level, Horizontal, Vertical} from "./NotificationEnums";

storiesOf('Notification', module).add('System Notice/Error', () => {
    const [visible, setVisible]=useState(true);

    const levelOptions = {
        info: Level.INFO,
        error: Level.ERROR,
    }
    const horizontalOptions = {
        left: Horizontal.LEFT,
        right: Horizontal.RIGHT,
        center: Horizontal.CENTER,
    }
    const verticalOptions = {
        top: Vertical.TOP,
        bottom: Vertical.BOTTOM,
        center: Vertical.CENTER,
    }

    const handler = () => setVisible(true);
    button("show notification", handler);

    const levelValue = select("level", levelOptions, Level.INFO);
    const horizontalValue = select("horizontalPosition", horizontalOptions, Horizontal.LEFT);
    const verticalValue = select("verticalPosition", verticalOptions, Vertical.TOP);
    const childrenValue = text("text", "Description of notice. Try to use conversational copy to give a friendly notice to your users!")

    return <Notification 
        title="Main message"
        isVisible={visible} 
        level={levelValue} 
        horizontalPosition={horizontalValue}
        verticalPosition={verticalValue}
        onClose={()=>setVisible(false)}>
        {childrenValue}
        </Notification>
}).addDecorator(withKnobs);
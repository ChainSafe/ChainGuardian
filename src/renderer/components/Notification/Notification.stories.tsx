import * as React from 'react';
import {useState} from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, button } from '@storybook/addon-knobs';
import { Notification} from './Notification';
import {level, horizontal, vertical} from "./NotificationEnums";

storiesOf('Notification', module).add('System Notice/Error', () => {
    const [visible, setVisible]=useState(true);

    const levelOptions = {
        info: level.INFO,
        error: level.ERROR,
    }
    const horizontalOptions = {
        left: horizontal.LEFT,
        right: horizontal.RIGHT,
        center: horizontal.CENTER,
    }
    const verticalOptions = {
        top: vertical.TOP,
        bottom: vertical.BOTTOM,
        center: vertical.CENTER,
    }

    const handler = () => setVisible(true);
    button("show notification", handler);

    const levelValue = select("level", levelOptions, level.INFO);
    const horizontalValue = select("horizontalPosition", horizontalOptions, horizontal.LEFT);
    const verticalValue = select("verticalPosition", verticalOptions, vertical.TOP);
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
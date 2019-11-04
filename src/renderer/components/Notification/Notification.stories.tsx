import * as React from 'react';
import {useState} from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, button } from '@storybook/addon-knobs';
import { Notification, horizontal, vertical, level} from './Notification';

storiesOf('Notification', module).add('System Notice/Error', () => {
    const [visible, setVisible]=useState(true);

    const levelOptions = {
        info: level.info,
        error: level.error,
    }
    const horizontalOptions = {
        left: horizontal.left,
        right: horizontal.right,
        center: horizontal.center,
    }
    const verticalOptions = {
        top: vertical.top,
        bottom: vertical.bottom,
        center: vertical.center,
    }

    const handler = () => setVisible(true);
    button("show notification", handler);

    const levelValue = select("level", levelOptions, level.info);
    const horizontalValue = select("horizontalPosition", horizontalOptions, horizontal.left);
    const verticalValue = select("verticalPosition", verticalOptions, vertical.top);
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
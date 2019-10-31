import * as React from 'react';
import {useState} from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select, button } from '@storybook/addon-knobs';
import { Notification} from './Notification';

storiesOf('Notification', module).add('System Notice/Error', () => {
    const [visible, setVisible]=useState(true);

    const levelOptions = {
        info: "info",
        error: "error",
    }
    const horizontalOptions = {
        left: "left",
        right: "right",
        center: "center-horizontal",
    }
    const verticalOptions = {
        top: "top",
        bottom: "bottom",
        center: "center-vertical",
    }
    // const visible = boolean("visible", true);

    const handler = () => setVisible(true);
    button("show notification", handler);

    const levelValue = select("level", levelOptions, "info");
    const horizontalValue = select("horizontalPosition", horizontalOptions, "left");
    const verticalValue = select("verticalPosition", verticalOptions, "top");
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
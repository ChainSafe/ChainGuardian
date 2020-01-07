import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { PrivateKeyField} from './PrivateKeyField';
import {Background} from '../Background/Background';
import {Modal} from '../Modal/Modal';

storiesOf('Private Key Field', module).add('Private Key Field', () => {
    const options = {
        gray: "",
        success: true,
        error: false,
    }
    const defaultValue = undefined;
    const label = text("label text", "Input")
    const validValue = select("valid", options, defaultValue,);
    const eMessage = text("error message", "Error message");
    const idValue = text("id", "");
    const inputValue = text("inputValue", "test");
    const divStyle={
        width: "500px"
    }
    return  (
        <Background>
            <Modal>
                <div style={divStyle}>
                    <PrivateKeyField 
                        inputValue={inputValue}
                        inputId={idValue} 
                        valid={validValue} 
                        label={label} 
                        errorMessage={eMessage} 
                    />
                </div>
            </Modal>
        </Background>
    );
}).addDecorator(withKnobs);
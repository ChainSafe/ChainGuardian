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
    const label = text("label text", "Private key")
    const validValue = select("valid", options, defaultValue,);
    const eMessage = text("error message", "Error message");
    const idValue = text("id", "");
    const inputValue = text("Private Key", "0xd68ffdb8b9729cb02c5be506e9a2fad086746b4bdc2f50fb74d10ac8419c5259");
    const passwordValue = text("Password", "test");
    const divStyle={
        width: "500px"
    }
    return  (
        <Background>
            <Modal>
                <div style={divStyle}>
                    <PrivateKeyField 
                        password={passwordValue}
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
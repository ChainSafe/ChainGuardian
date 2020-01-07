import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { InputForm} from './InputForm';

storiesOf('Input Form', module).add('Input Form', () => {
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
    const divStyle={
        width: "700px"
    }
    return  (
        <div style={divStyle}>
            <InputForm 
                inputId={idValue} 
                valid={validValue} 
                label={label} 
                errorMessage={eMessage} 
                onSubmit={():void => {}}
                eye
            />;
        </div>
    );
}).addDecorator(withKnobs);
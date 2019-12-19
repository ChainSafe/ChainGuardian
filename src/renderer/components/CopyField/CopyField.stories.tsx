import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { CopyField, MnemonicCopyField } from './CopyField';
import {useState} from "react";

storiesOf('CopyField', module).add('CopyField', () => {
    const textValue = text("value", "Test string for copy");
    const [clickedValue, setClickedValue] = useState(false);

    return (
        <>
            <CopyField 
                onCopy={()=>{setClickedValue(true)}}
                clicked={clickedValue} value={textValue} />
        </>
    )
    
}).addDecorator(withKnobs);

storiesOf('CopyField', module).add('MnemonicCopyField', () => {
    const [clickedValue, setClickedValue] = useState(false);
    const textValue = text("mnemonic value", "hold solve hurdle seed paper rely fog burden potato portion column brisk");

    return (
        <>
            <MnemonicCopyField
                onCopy={()=>{setClickedValue(true)}}
                clicked={clickedValue} value={textValue} />
        </>
    )
}).addDecorator(withKnobs);
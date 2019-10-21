import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { Modal} from './Modal';
import { ButtonPrimitive } from '../Button/ButtonStandard';

storiesOf('Modal', module).add('Modal', () => {
    const backButton = boolean('back button', false);
    
    return <div style={{display: "flex", justifyContent: "center"}}>
            <Modal hasBack={backButton}>
                <ButtonPrimitive>BUTTON</ButtonPrimitive>
            </Modal>
        </div>;
}).addDecorator(withKnobs);
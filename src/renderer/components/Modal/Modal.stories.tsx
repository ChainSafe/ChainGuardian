import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import { Modal} from './Modal';
import { ButtonPrimitive } from '../Button/ButtonStandard';

storiesOf('Modal', module).add('Modal', () => {
    const backButton = boolean('back button', false);
    
    return  <Modal hasBack={backButton}>
        <ButtonPrimitive>REGISTER</ButtonPrimitive>
        </Modal>;
}).addDecorator(withKnobs);
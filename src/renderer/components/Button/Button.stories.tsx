import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ButtonPrimitive, ButtonPrimary, ButtonSecondary, ButtonInverted, ButtonDestructive } from './Button';

storiesOf('Button', module).add('Submit Primitive', () => {
    return <ButtonPrimitive >Submit</ButtonPrimitive>;
});
storiesOf('Button', module).add('Submit Primary', () => {
    return <ButtonPrimary >Submit</ButtonPrimary>;
});
storiesOf('Button', module).add('Submit Secondary', () => {
    return <ButtonSecondary >Submit</ButtonSecondary>;
});
storiesOf('Button', module).add('Submit Inverted', () => {
    return <ButtonInverted >Submit</ButtonInverted>;
});
storiesOf('Button', module).add('Submit Destructive', () => {
    return <ButtonDestructive >Submit</ButtonDestructive>;
});
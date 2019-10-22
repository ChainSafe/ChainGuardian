import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ButtonPrimitive, ButtonPrimary, ButtonSecondary, ButtonInverted, ButtonDestructive } from './ButtonStandard';
import { BackTab, BackButton, AddButton, CopyButton } from './ButtonAction';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

storiesOf('Button', module).add('Submit Primitive', () => {
    const content = text('button content', 'Submit');
    const value = boolean('focus', false);
    return  <ButtonPrimitive buttonSize="small" focused={value} >{content}</ButtonPrimitive>;
}).addDecorator(withKnobs);

storiesOf('Button', module).add('Submit Primary', () => {
    const content = text('button content', 'Submit');
    const value = boolean('focus', false);
    return <ButtonPrimary focused={value} >{content}</ButtonPrimary>;
}).addDecorator(withKnobs);

storiesOf('Button', module).add('Submit Secondary', () => {
    const content = text('button content', 'Submit');
    const value = boolean('focus', false);
    return <ButtonSecondary focused={value} >{content}</ButtonSecondary>;
}).addDecorator(withKnobs);

storiesOf('Button', module).add('Submit Inverted', () => {
    const content = text('button content', 'Submit');
    const value = boolean('focus', false);
    return <ButtonInverted focused={value} >{content}</ButtonInverted>;
}).addDecorator(withKnobs);

storiesOf('Button', module).add('Submit Destructive', () => {
    const content = text('button content', 'Submit');
    const value = boolean('focus', false);
    return <ButtonDestructive focused={value} >{content}</ButtonDestructive>;
}).addDecorator(withKnobs);

storiesOf('Button', module).add('Back Tab', () => {
    return <BackTab />;
});

storiesOf('Button', module).add('Back Button', () => {
    return <BackButton />;
});

storiesOf('Button', module).add('Add Button', () => {
    return <AddButton />;
});

storiesOf('Button', module).add('Copy Button', () => {
    return <CopyButton />;
});
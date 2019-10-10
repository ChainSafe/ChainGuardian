import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ButtonPrimitive } from './Button';

storiesOf('Button', module).add('Submit', () => {
    return <ButtonPrimitive >Submit</ButtonPrimitive>;
});

// storiesOf('Button', module).add('primary', () => {
//     return <Button type="primary">Submit</Button>;
// });

// storiesOf('Button', module).add('secondary', () => {
//     return <Button type="secondary">Submit</Button>;
// });

// storiesOf('Button', module).add('inverted', () => {
//     return <Button type="inverted">Submit</Button>;
// });

// storiesOf('Button', module).add('destructive', () => {
//     return <Button type="destructive">Submit</Button>;
// });

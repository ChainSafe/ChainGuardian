import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import {LogStream} from './LogStream';

storiesOf('Log Stream', module).add('Log Stream', () => {

    function randomChars() {
        let string = "";
        let choices = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        for (let i = 0; i < 8; i++) {
          string += choices.charAt(Math.floor(Math.random() * choices.length));
        }
        return string;
      }

      const testStream = new ReadableStream({
        start(controller) {
          setInterval(() => {
            let string = randomChars();

            controller.enqueue(string);

            // console.log("generirani: "+string);
          }, 2000);
        } 
      });
    return  <LogStream
    stream={testStream}
    />;
}).addDecorator(withKnobs);
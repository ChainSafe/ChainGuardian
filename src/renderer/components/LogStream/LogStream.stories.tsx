import * as React from "react";
import {storiesOf} from "@storybook/react";
import {withKnobs, number} from "@storybook/addon-knobs";
import {Readable} from "stream";
import {LogStream} from "./LogStream";

storiesOf("Log Stream", module)
    .add("Log Stream", () => {
        const time = number("speed, seconds", 2);
        function randomChars(): string {
            let string = "";
            const choices = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
            for (let i = 0; i < 8; i++) {
                string += choices.charAt(Math.floor(Math.random() * choices.length));
            }
            return string;
        }

        const testStream = new Readable({
            read: function (): void {
                setInterval(() => {
                    const string = randomChars();
                    this.push(string);
                }, time * 1000);
            },
        });

        return <LogStream source={testStream} />;
    })
    .addDecorator(withKnobs);

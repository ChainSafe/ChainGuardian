import * as React from "react";
import {storiesOf} from "@storybook/react";
import {button, withKnobs} from "@storybook/addon-knobs";
import {InputPrompt, ISubmitStatus} from "./InputPrompt";
import {Background} from "../Background/Background";
import {useState} from "react";

storiesOf("Input prompt", module)
    .add("Basic prompt input", () => {
        const [visible, setVisible] = useState(false);

        const handler = (): void => setVisible(true);
        button("show prompt", handler);

        return (
            <div>
                <InputPrompt
                    display={visible}
                    onSubmit={async (): Promise<ISubmitStatus> => {
                        return {valid: true};
                    }}
                    onCancel={(): void => {
                        setVisible(false);
                    }}
                    title={"Input prompt"}
                />
                <Background />
            </div>
        );
    })
    .addDecorator(withKnobs);

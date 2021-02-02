import * as React from "react";
import {storiesOf} from "@storybook/react";
import {withKnobs, text, boolean} from "@storybook/addon-knobs";
import {ConfirmModal} from "./ConfirmModal";

storiesOf("Confirm Modal", module)
    .add("Confirm Modal", () => {
        const questionValue = text("question", "Are you sure you want to quit?");
        const subTextValue = text("subText", "Validator is still active...");
        const showModalValue = boolean("showModal", true);
        return (
            <div>
                <ConfirmModal
                    showModal={showModalValue}
                    question={questionValue}
                    description={subTextValue}
                    onOKClick={(): void => {}}
                    onCancelClick={(): void => {}}
                />
            </div>
        );
    })
    .addDecorator(withKnobs);

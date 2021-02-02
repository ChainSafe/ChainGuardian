import * as React from "react";
import {storiesOf} from "@storybook/react";
import {withKnobs, text} from "@storybook/addon-knobs";
import {CopyField, MnemonicCopyField} from "./CopyField";

storiesOf("CopyField", module)
    .add("CopyField", () => {
        const textValue = text("value", "Test string for copy");

        return <CopyField value={textValue} />;
    })
    .addDecorator(withKnobs);

storiesOf("CopyField", module)
    .add("MnemonicCopyField", () => {
        const textValue = text(
            "mnemonic value",
            "hold solve hurdle seed paper rely fog burden potato portion column brisk",
        );

        return <MnemonicCopyField value={textValue} />;
    })
    .addDecorator(withKnobs);

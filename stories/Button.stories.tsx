import * as React from 'react';
import { storiesOf } from "@storybook/react";
import { Button } from "../src/renderer/components/Button";

storiesOf("Button", module)
    .add("primitive",
        () => {
            return (
                <Button type="primitive">Submit</Button>
            );
        });

import * as React from "react";
import * as renderer from "react-test-renderer";
import {StepNavigation} from "../../src/renderer/components/StepNavigation/StepNavigation";

describe("StepNavigation", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<StepNavigation 
                current={1}
                steps={
                    [
                        {
                            stepId: 1,
                            stepName:"Signing key"
                        },
                        {
                            stepId: 2,
                            stepName:"Withdrawal key"
                        },
                        {
                            stepId: 3,
                            stepName:"Password"
                        },
                        {
                            stepId: 4,
                            stepName:"Configure"
                        },
                        {
                            stepId: 5,
                            stepName:"Consent"
                        },
                    ]
                }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
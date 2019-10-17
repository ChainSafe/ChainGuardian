import * as React from "react";
import * as renderer from "react-test-renderer";
import {
    ButtonPrimitive, 
    ButtonPrimary, 
    ButtonSecondary, 
    ButtonInverted, 
    ButtonDestructive} from "../../src/renderer/components/Button/ButtonStandard";
import {
    BackTab, 
    CopyButton, 
    AddButton, 
    BackButton} from "../../src/renderer/components/Button/ButtonAction";

describe("ButtonPrimitive", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<ButtonPrimitive>Submit</ButtonPrimitive>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders disabled button", () => {
        const tree = renderer
            .create(<ButtonPrimitive disabled={true}>Submit</ButtonPrimitive>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders focused button", () => {
        const tree = renderer
            .create(<ButtonPrimitive focused={true}>Submit</ButtonPrimitive>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("ButtonPrimary", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<ButtonPrimary>Submit</ButtonPrimary>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders disabled button", () => {
        const tree = renderer
            .create(<ButtonPrimary disabled={true}>Submit</ButtonPrimary>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders focused button", () => {
        const tree = renderer
            .create(<ButtonPrimary focused={true}>Submit</ButtonPrimary>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("ButtonSecondary", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<ButtonSecondary>Submit</ButtonSecondary>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders disabled button", () => {
        const tree = renderer
            .create(<ButtonSecondary disabled={true}>Submit</ButtonSecondary>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders focused button", () => {
        const tree = renderer
            .create(<ButtonSecondary focused={true}>Submit</ButtonSecondary>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("ButtonInverted", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<ButtonInverted>Submit</ButtonInverted>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders disabled button", () => {
        const tree = renderer
            .create(<ButtonInverted disabled={true}>Submit</ButtonInverted>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders focused button", () => {
        const tree = renderer
            .create(<ButtonInverted focused={true}>Submit</ButtonInverted>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("ButtonDestructive", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<ButtonDestructive>Submit</ButtonDestructive>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders disabled button", () => {
        const tree = renderer
            .create(<ButtonDestructive disabled={true}>Submit</ButtonDestructive>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders focused button", () => {
        const tree = renderer
            .create(<ButtonDestructive focused={true}>Submit</ButtonDestructive>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("BackTab", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<BackTab />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("CopyButton", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<CopyButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("AddButton", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<AddButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("BackButton", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(<BackButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
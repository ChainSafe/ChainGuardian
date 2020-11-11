interface INetwork {
    name: string;
}

export interface IValidatorNetwork {
    [validatorAddress: string]: string;
}

export class ValidatorNetwork implements INetwork {
    public name: string;

    public constructor(name: string) {
        this.name = name;
    }
}

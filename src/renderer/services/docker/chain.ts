import { Container } from './container';

export class ValidatorNetwork extends Container {
    public static connectToPrysmNetwork() {
        return new ValidatorNetwork({
            image: "gcr.io/prysmaticlabs/prysm/validator:latest",
            name: "PrysmValidator",
            restart: "unless-stopped"
        });
    }
}

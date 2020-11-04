import {ParametricSelector} from "@reduxjs/toolkit";

export const getPublicKeyFromProps: ParametricSelector<unknown, {publicKey: string}, string> =
    (_, props) => props.publicKey;
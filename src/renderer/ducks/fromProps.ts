import {ParametricSelector} from "@reduxjs/toolkit";

export const getPublicKeyFromProps: ParametricSelector<unknown, {publicKey: string}, string> = (_, props) =>
    props.publicKey;

export const getValidatorFromProps: ParametricSelector<unknown, {validator: string}, string> = (_, props) =>
    props.validator;

export const getKeyFromProps: ParametricSelector<unknown, {key: string}, string> = (_, props) => props.key;

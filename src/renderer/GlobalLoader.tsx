import React from "react";
import {useSelector} from "react-redux";
import {isApplicationLoading, isLoadingValidator} from "./ducks/settings/selectors";
import {Loading} from "./components/Loading/Loading";

export const GlobalLoader: React.FC = () => {
    const isInitializing = useSelector(isApplicationLoading);
    const isLoading = useSelector(isLoadingValidator);

    return <Loading visible={isInitializing || isLoading} title='Loading...' />;
};

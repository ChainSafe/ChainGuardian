import {Store, applyMiddleware, createStore, Middleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {IRootState, rootReducer} from "../reducers";
import thunk from "redux-thunk";
// Logger with default options
import logger from "redux-logger";
import {createValidatorMiddleware} from "./middleware/validator";

const configureStore = (initialState?: IRootState): Store<IRootState | undefined> => {
    const middlewares: Middleware[] = [thunk, logger, createValidatorMiddleware()],
        enhancer = composeWithDevTools(applyMiddleware(...middlewares));
    return createStore(rootReducer, initialState, enhancer);
};

const store = configureStore();

if (typeof module.hot !== "undefined") {
    module.hot.accept("../reducers", () =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
        store.replaceReducer(require("../reducers").rootReducer)
    );
}

export default store;

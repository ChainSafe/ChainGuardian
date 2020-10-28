import {Store, applyMiddleware, createStore, Middleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {IRootState, rootReducer} from "./reducers";
// Logger with default options
import logger from "redux-logger";

const configureStore = (initialState?: IRootState): Store<IRootState | undefined> => {
    const middlewares: Middleware[] = [logger],
        enhancer = composeWithDevTools(applyMiddleware(...middlewares));
    return createStore(rootReducer, initialState, enhancer);
};

const store = configureStore();

console.log(module);
if (typeof module.hot !== "undefined") {
    module.hot.accept("./reducers", () =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
        store.replaceReducer(require("./reducers").rootReducer)
    );
}

export default store;

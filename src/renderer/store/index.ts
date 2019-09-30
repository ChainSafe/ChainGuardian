import {Store, applyMiddleware, createStore, Middleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {RootState, rootReducer} from "../reducers";

const configureStore = (initialState?: RootState): Store<RootState | undefined> => {
    const middlewares: Middleware[] = [],
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

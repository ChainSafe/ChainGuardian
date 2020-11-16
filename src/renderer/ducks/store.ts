import {Store, applyMiddleware, createStore, Middleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import reduxSaga from "redux-saga";
import {IRootState, rootReducer} from "./reducers";
// Logger with default options
import logger from "redux-logger";
import {rootSaga} from "./rootSaga";
import {createAction} from "@reduxjs/toolkit";

const sagaMiddleware = reduxSaga();

const configureStore = (initialState?: IRootState): Store<IRootState | undefined> => {
    const middlewares: Middleware[] = [sagaMiddleware, logger];
    const enhancer = composeWithDevTools(applyMiddleware(...middlewares));
    return createStore(rootReducer, initialState, enhancer);
};

const store = configureStore();

// special action - sagas can hook on it to make special actions required for app (can be async)
export const postInit = createAction("@@POST_INIT");

sagaMiddleware.run(rootSaga);

store.dispatch(postInit());

if (typeof module.hot !== "undefined") {
    module.hot.accept("./reducers", () =>
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        store.replaceReducer(require("./reducers").rootReducer),
    );
}

export default store;

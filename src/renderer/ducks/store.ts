import {Store, applyMiddleware, createStore, Middleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import reduxSaga from "redux-saga";
import {IRootState, rootReducer} from "./reducers";
// Logger with default options
import logger from "redux-logger";
import {rootSaga} from "./rootSaga";

const sagaMiddleware = reduxSaga();

const configureStore = (initialState?: IRootState): Store<IRootState | undefined> => {
    const middlewares: Middleware[] = [sagaMiddleware, logger];
    const enhancer = composeWithDevTools(applyMiddleware(...middlewares));
    return createStore(rootReducer, initialState, enhancer);
};

const store = configureStore();

sagaMiddleware.run(rootSaga);

if (typeof module.hot !== "undefined") {
    module.hot.accept("./reducers", () =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
        store.replaceReducer(require("./reducers").rootReducer)
    );
}

export default store;

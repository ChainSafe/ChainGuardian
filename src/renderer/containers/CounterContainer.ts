import {connect} from "react-redux";
import {Dispatch} from "redux";
import Counter from "../components/Counter";
import {RootState} from "../reducers";
import {CounterAction, decrement, increment} from "../actions/counterActions";

const mapStateToProps = (state: RootState): {value: number} => ({
    value: state.counter.value
}),

mapDispatchToProps = (dispatch: Dispatch<CounterAction>): {incrementValue: any, decrementValue: any} => ({
    incrementValue: (): ReturnType<typeof dispatch> => dispatch(increment()),
    decrementValue: (): ReturnType<typeof dispatch> => dispatch(decrement())
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);

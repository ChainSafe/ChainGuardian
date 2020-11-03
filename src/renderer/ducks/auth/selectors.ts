import {IRootState} from "../reducers";
import {CGAccount} from "../../models/account";

export const getAuthAccount = (state: IRootState): CGAccount | null => state.auth.account;

import { combineReducers } from "redux";
import taggersReducer from "../features/taggers/taggersSlice";
import visibilitySorterReducer from "../features/sorters/sortersSlice";

export default combineReducers({
  tags: taggersReducer,
  visibilitySorter: visibilitySorterReducer,
});

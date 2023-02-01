import { legacy_createStore as createStore } from "redux";
import { rootReducer } from "./store/reducer/rootReducer";

const store = createStore(rootReducer);

export default store;

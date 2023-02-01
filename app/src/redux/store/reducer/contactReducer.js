import { LIST_BANJEE_CONTACT } from "../action/contactAction";

const initialState = {
  listContact: () => {},
};
export const listContactReducer = (state = initialState, action) => {
  switch (action.type) {
    case LIST_BANJEE_CONTACT:
      return { ...state, ...action.payload };
    default:
      return initialState;
  }
};

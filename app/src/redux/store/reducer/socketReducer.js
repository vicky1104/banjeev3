import { SOCKET } from "../action/socketAction";

const initialState = {};

export default function socketReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SOCKET:
      return payload;
    default:
      return state;
  }
}

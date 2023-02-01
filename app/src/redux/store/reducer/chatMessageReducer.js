const initialState = {};

function ChatMessage(state = initialState, { type, payload }) {
  switch (type) {
    case "GET_API_CHAT_MESSAGE":
      let data;
      if (Object.keys(state).length > 0) {
        if (state?.[payload.chatroomId].length > 0) {
          data = {
            ...state,
            [payload.chatroomId]: [
              ...state?.[payload.chatroomId],
              ...payload?.items,
            ],
          };
        } else {
          data = { ...state, [payload.chatroomId]: payload.items };
        }
      } else {
        data = { ...state, [payload?.chatroomId]: payload.items };
      }
      return data;
    case "GET_SOCKET_CHAT_MESSAGE":
      let x;
      if (Object.keys(state).length > 0) {
        if (state?.[payload.roomId].length > 0) {
          x = {
            ...state,
            [payload.roomId]: [payload, ...state?.[payload.roomId]],
          };
        } else {
          x = { ...state, [payload.roomId]: [payload] };
        }
      } else {
        x = { ...state, [payload.roomId]: [payload] };
      }
      return x;
    case "CLEAR_CHAT_MESSAGE_STATE":
      return [];
    case "DELETE_CHAT_MESSAGE":
      return state?.filter((ele) => ele?.id !== payload?.id);
    case "DELETE_CHAT_MESSAGE":
      return state?.map((ele) => {
        if (ele?.id === payload?.id) {
          return {
            ...ele,
            seen: true,
          };
        } else return ele;
      });
    default:
      return state;
  }
}

export default ChatMessage;

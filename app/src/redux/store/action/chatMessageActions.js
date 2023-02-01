export const GET_SOCKET_CHAT_MESSAGE = "GET_SOCKET_CHAT_MESSAGE";
export const GET_API_CHAT_MESSAGE = "GET_API_CHAT_MESSAGE";
export const CLEAR_CHAT_MESSAGE_STATE = "CLEAR_CHAT_MESSAGE_STATE";
export const DELETE_CHAT_MESSAGE = "DELETE_CHAT_MESSAGE";
export const SEEN_CHAT_MESSAGE = "SEEN_CHAT_MESSAGE";
// export const SEEN_CHAT_MESSAGE = "";

export const getSocketChatMessage = (data) => {
  return {
    type: GET_SOCKET_CHAT_MESSAGE,
    payload: data,
  };
};

export const getApiChatMessage = (data) => {
  return {
    type: GET_API_CHAT_MESSAGE,
    payload: data,
  };
};

export const clearChatMessageState = (data) => {
  return {
    type: CLEAR_CHAT_MESSAGE_STATE,
    payload: data,
  };
};

export const deleteChatMessage = (data) => {
  return {
    type: DELETE_CHAT_MESSAGE,
    payload: data,
  };
};

export const seenChatMessage = (data) => {
  return {
    type: SEEN_CHAT_MESSAGE,
    payload: data,
  };
};

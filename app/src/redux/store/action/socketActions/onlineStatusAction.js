export const ONLINE_STATUS = "ONLINE_STATUS";
// export const SEEN_CHAT_MESSAGE = "";

export const onlineStatus = (data) => {
  return {
    type: ONLINE_STATUS,
    payload: data,
  };
};

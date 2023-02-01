export const SOCKET = "SOCKET";

export const socket = (data) => {
  return {
    type: SOCKET,
    payload: data,
  };
};

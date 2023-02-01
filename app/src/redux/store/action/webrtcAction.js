const MAKE_CALL = "MAKE_CALL";
const SET_PC = "SET_PC";
const SEND_READY = "SEND_READY";
const SEND_OFFER = "SEND_OFFER";
const SEND_ANSWER = "SEND_ANSWER";

const makeCall = (data) => {
  return {
    type: MAKE_CALL,
    action: data,
  };
};

const initialState = [];

function OnlineStatus(state = initialState, { type, payload }) {
  switch (type) {
    case "ONLINE_STATUS":
      if (
        state?.length > 0 &&
        state?.filter((ele) => ele?.fromId === payload?.fromId)?.length > 0
      ) {
        return state?.map((ele) => {
          if (ele?.fromId === payload?.fromId) {
            return {
              ...ele,
              ...payload,
            };
          } else return ele;
        });
      } else {
        return [...state, payload];
      }
    default:
      return state;
  }
}

export default OnlineStatus;

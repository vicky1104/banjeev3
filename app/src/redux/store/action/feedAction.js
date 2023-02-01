export const SAVE_MAIN_FEED = "SAVE_MAIN_FEED";
export const VIEW_SCREEN = "VIEW_SCREEN";
export const OTHER_POST_ID = "OTHER_POST_ID";
export const SAVE_FEED_ACTION = "SAVE_FEED_ACTION";
export const PUSH_TO_PLAY_BACK = "PUSH_TO_PLAY_BACK";

export const saveFeed = (data) => {
  return {
    type: SAVE_MAIN_FEED,
    payload: data,
  };
};
export const viewScreen = (screen) => {
  return {
    type: SAVE_MAIN_FEED,
    payload: screen,
  };
};

export const saveOtherPostId = (id) => {
  return {
    type: SAVE_MAIN_FEED,
    payload: id,
  };
};
export const saveFeedAction = (data) => {
  return {
    type: SAVE_FEED_ACTION,
    payload: data,
  };
};

export const pushToPlayBack = (data) => {
  return {
    type: PUSH_TO_PLAY_BACK,
    payload: data,
  };
};

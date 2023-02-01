import { Dimensions, Platform } from "react-native";

export const CONTENT_SPACING = 15;

const SAFE_BOTTOM =
	Platform.select({
		ios: 10,
	}) ?? 0;

export const SAFE_AREA_PADDING = {
	paddingLeft: 10 + CONTENT_SPACING,
	paddingTop: 10 + CONTENT_SPACING,
	paddingRight: 10 + CONTENT_SPACING,
	paddingBottom: SAFE_BOTTOM + CONTENT_SPACING,
};

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 20;

export const SCREEN_WIDTH = Dimensions.get("screen").width;
export const SCREEN_HEIGHT = Platform.select({
	android: Dimensions.get("screen").height - 10,
	ios: Dimensions.get("screen").height,
});

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;

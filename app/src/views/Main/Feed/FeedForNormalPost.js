import React, { createRef, useRef, useState } from "react";

import {
	View,
	StyleSheet,
	Image,
	Dimensions,
	Animated,
	ScrollView,
	Platform,
} from "react-native";
import {
	PanGestureHandler,
	PinchGestureHandler,
	State,
} from "react-native-gesture-handler";
import { cloudinaryFeedUrl } from "../../../utils/util-func/constantExport";
function FeedForNormalPost({ src }) {
	const [panEnabled, setPanEnabled] = useState(false);

	const scale = useRef(new Animated.Value(1)).current;
	const translateX = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(0)).current;

	const pinchRef = createRef();
	const panRef = createRef();

	const onPinchEvent = Animated.event(
		[
			{
				nativeEvent: { scale },
			},
		],
		{ useNativeDriver: Platform.OS === "android" }
	);

	const onPanEvent = Animated.event(
		[
			{
				nativeEvent: {
					translationX: translateX,
					translationY: translateY,
				},
			},
		],
		{ useNativeDriver: Platform.OS === "android" }
	);

	const handlePinchStateChange = ({ nativeEvent }) => {
		// enabled pan only after pinch-zoom
		if (nativeEvent.state === State.ACTIVE) {
			setPanEnabled(true);
		}

		// when scale < 1, reset scale back to original (1)
		const nScale = nativeEvent.scale;
		if (nativeEvent.state === State.END) {
			if (nScale < 1) {
				Animated.spring(scale, {
					toValue: 1,
					useNativeDriver: Platform.OS === "android",
				}).start();
				Animated.spring(translateX, {
					toValue: 0,
					useNativeDriver: Platform.OS === "android",
				}).start();
				Animated.spring(translateY, {
					toValue: 0,
					useNativeDriver: Platform.OS === "android",
				}).start();

				setPanEnabled(false);
			}
		}
	};
	const IMAGE_URL = (src) => {
		return `https://res.cloudinary.com/banjee/image/upload/f_auto,q_auto:low/v1/${src}.png`;
	};
	return (
		<PanGestureHandler
			onGestureEvent={onPanEvent}
			ref={panRef}
			simultaneousHandlers={[pinchRef]}
			enabled={panEnabled}
			failOffsetX={[-1000, 1000]}
			shouldCancelWhenOutside
		>
			<Animated.View>
				<PinchGestureHandler
					ref={pinchRef}
					onGestureEvent={onPinchEvent}
					simultaneousHandlers={[panRef]}
					onHandlerStateChange={handlePinchStateChange}
				>
					<Animated.Image
						source={{
							uri: cloudinaryFeedUrl(src, "image"),
						}}
						style={{
							width: "100%",
							aspectRatio: 1,
							transform: [{ scale }, { translateX }, { translateY }],
						}}
						resizeMode="contain"
					/>
				</PinchGestureHandler>
			</Animated.View>
		</PanGestureHandler>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default FeedForNormalPost;

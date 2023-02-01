import React from "react";
import {
	findNodeHandle,
	UIManager,
	Animated,
	View,
	Platform,
	StyleSheet,
	requireNativeComponent,
	NativeModules,
	processColor,
} from "react-native";
import SafeModule from "react-native-safe-modules";

const getNativeLottieViewForDesktop = () => {
	return requireNativeComponent("LottieAnimationView");
};

const NativeLottieView =
	Platform.OS === "macos" || Platform.OS === "windows"
		? getNativeLottieViewForDesktop()
		: SafeModule.component({
				viewName: "LottieAnimationView",
				mockComponent: View,
		  });

const AnimatedNativeLottieView =
	Animated.createAnimatedComponent(NativeLottieView);

const LottieViewManager = Platform.select({
	// react-native-windows doesn't work with SafeModule, it always returns the mock component
	macos: NativeModules.LottieAnimationView,
	windows: NativeModules.LottieAnimationView,
	default: SafeModule.module({
		moduleName: "LottieAnimationView",
		mock: {
			play: () => {},
			reset: () => {},
			pause: () => {},
			resume: () => {},
			getConstants: () => {},
		},
	}),
});

// const defaultProps = {
// 	progress: 0,
// 	speed: 1,
// 	loop: true,
// 	autoPlay: false,
// 	autoSize: false,
// 	enableMergePathsAndroidForKitKatAndAbove: false,
// 	cacheComposition: true,
// 	useNativeLooping: false,
// 	resizeMode: "contain",
// 	colorFilters: [],
// 	textFiltersAndroid: [],
// 	textFiltersIOS: [],
// };

// const viewConfig = {
// 	uiViewClassName: "LottieAnimationView",
// 	validAttributes: {
// 		progress: true,
// 	},
// };

const safeGetViewManagerConfig = (moduleName) => {
	if (UIManager.getViewManagerConfig) {
		// RN >= 0.58
		return UIManager.getViewManagerConfig(moduleName);
	}
	// RN < 0.58
	return UIManager[moduleName];
};

export default function LottieView(props) {
	// const setNativeProps = (props) => {
	// 	UIManager.updateView(getHandle(), viewConfig.uiViewClassName, {
	// 		progress: props.progress,
	// 	});
	// };
	const refRoot = (root) => {
		root = root;
		if (props.autoPlay) {
			play();
		}
	};

	const getHandle = (root) => {
		return findNodeHandle(root);
	};

	const runCommand = (name, args = []) => {
		const handle = getHandle();
		if (!handle) {
			return null;
		}
		return Platform.select({
			android: () =>
				UIManager.dispatchViewManagerCommand(
					handle,
					safeGetViewManagerConfig("LottieAnimationView").Commands[name],
					args
				),
			windows: () =>
				UIManager.dispatchViewManagerCommand(
					handle,
					safeGetViewManagerConfig("LottieAnimationView").Commands[name],
					args
				),
			ios: () => LottieViewManager[name](getHandle(), ...args),
			macos: () => LottieViewManager[name](getHandle(), ...args),
		})();
	};

	const play = (startFrame = -1, endFrame = -1) => {
		runCommand("play", [startFrame, endFrame]);
	};

	const reset = () => {
		runCommand("reset");
	};

	const pause = () => {
		runCommand("pause");
	};

	const resume = () => {
		runCommand("resume");
	};

	const onAnimationFinish = (evt) => {
		if (props.onAnimationFinish) {
			props.onAnimationFinish(evt.nativeEvent.isCancelled);
		}
	};

	React.useEffect(() => {
		if (props.autoPlay && !!props.source) {
			play();
		}
	}, []);

	const { style, source, autoSize, autoPlay, ...rest } = props;

	const sourceName = typeof source === "string" ? source : undefined;
	const sourceJson =
		typeof source === "object" && !source.uri
			? JSON.stringify(source)
			: undefined;
	const sourceURL =
		typeof source === "object" && source.uri ? source.uri : undefined;

	const aspectRatioStyle = sourceJson
		? { aspectRatio: source.w / source.h }
		: undefined;

	const styleObject = StyleSheet.flatten(style);
	let sizeStyle;
	if (
		!styleObject ||
		(styleObject.width === undefined && styleObject.height === undefined)
	) {
		sizeStyle =
			autoSize && sourceJson ? { width: source.w } : StyleSheet.absoluteFill;
	}

	const speed =
		props.duration && sourceJson && props.source.fr
			? Math.round(((props.source.op / props.source.fr) * 1000) / props.duration)
			: props.speed;

	const colorFilters = Array.isArray(props.colorFilters)
		? props.colorFilters.map(({ keypath, color }) => ({
				keypath,
				color: processColor(color),
		  }))
		: undefined;

	return (
		<View style={[aspectRatioStyle, sizeStyle, style]}>
			<AnimatedNativeLottieView
				ref={refRoot}
				{...rest}
				colorFilters={colorFilters}
				speed={speed}
				style={[
					aspectRatioStyle,
					sizeStyle || { width: "100%", height: "100%" },
					style,
				]}
				sourceName={sourceName}
				sourceJson={sourceJson}
				sourceURL={sourceURL}
				onAnimationFinish={onAnimationFinish}
			/>
		</View>
	);
}

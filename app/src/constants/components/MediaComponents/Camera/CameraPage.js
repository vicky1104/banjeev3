import * as React from "react";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
	Dimensions,
	Platform,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import {
	PinchGestureHandler,
	TapGestureHandler,
} from "react-native-gesture-handler";
import { sortFormats, useCameraDevices } from "react-native-vision-camera";
import { Camera, frameRateIncluded } from "react-native-vision-camera";
import Reanimated, {
	Extrapolate,
	interpolate,
	useAnimatedGestureHandler,
	useAnimatedProps,
	useSharedValue,
} from "react-native-reanimated";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
// Constants
import { MAX_ZOOM_FACTOR, SAFE_AREA_PADDING } from "./Constants";
// Components
import { useIsForeground } from "./hooks/useIsForeground";
import { StatusBarBlurBackground } from "./views/StatusBarBlurBackground";
import { CaptureButton } from "./views/CaptureButton";
import GalaryMedia from "./GalaryMedia";
import { Text } from "native-base";

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
	zoom: true,
});

const SCALE_FULL_ZOOM = 3;
const BUTTON_SIZE = 40;
const BOTTOM_BUTTON_SIZE = 50;
const ICON_SIZE = 22;
const BOTTOM_ICON_SIZE = 25;

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export function CameraPage({
	closeMediaModal,
	setMediaState,
	displayCameraMedia,
	getGallery,
	video,
	statusbar,
}) {
	const navigation = useNavigation();
	const { goBack } = useNavigation();
	const camera = useRef(null);
	const [isCameraInitialized, setIsCameraInitialized] = useState(false);
	const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
	const [permissions, setPermissions] = useState(false);
	const zoom = useSharedValue(0);
	const isPressingButton = useSharedValue(false);

	// check if camera page is active
	const isFocussed = useIsFocused();
	const isForeground = useIsForeground();
	const isActive = isFocussed && isForeground;

	const [cameraPosition, setCameraPosition] = useState("back");
	const [enableHdr, setEnableHdr] = useState(false);
	const [flash, setFlash] = useState("off");
	const [enableNightMode, setEnableNightMode] = useState(false);

	// camera format settings
	const devices = useCameraDevices();
	const device = devices[cameraPosition];
	const formats = useMemo(() => {
		if (device?.formats == null) return [];
		return device.formats.sort(sortFormats);
	}, [device?.formats]);

	//#region Memos
	const [is60Fps, setIs60Fps] = useState(true);
	const fps = useMemo(() => {
		if (!is60Fps) return 30;

		if (enableNightMode && !device?.supportsLowLightBoost) {
			// User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
			return 30;
		}

		const supportsHdrAt60Fps = formats.some(
			(f) =>
				f.supportsVideoHDR &&
				f.frameRateRanges.some((r) => frameRateIncluded(r, 60))
		);
		if (enableHdr && !supportsHdrAt60Fps) {
			// User has enabled HDR, but HDR is not supported at 60 FPS.
			return 30;
		}

		const supports60Fps = formats.some((f) =>
			f.frameRateRanges.some((r) => frameRateIncluded(r, 60))
		);
		if (!supports60Fps) {
			// 60 FPS is not supported by any format.
			return 30;
		}
		// If nothing blocks us from using it, we default to 60 FPS.
		return 60;
	}, [
		device?.supportsLowLightBoost,
		enableHdr,
		enableNightMode,
		formats,
		is60Fps,
	]);

	const supportsCameraFlipping = useMemo(
		() => devices.back != null && devices.front != null,
		[devices.back, devices.front]
	);

	const supportsFlash = device?.hasFlash ?? false;

	const supportsHdr = useMemo(
		() => formats.some((f) => f.supportsVideoHDR || f.supportsPhotoHDR),
		[formats]
	);
	const supports60Fps = useMemo(
		() =>
			formats.some((f) =>
				f.frameRateRanges.some((rate) => frameRateIncluded(rate, 60))
			),
		[formats]
	);
	const canToggleNightMode = enableNightMode
		? true // it's enabled so you have to be able to turn it off again
		: (device?.supportsLowLightBoost ?? false) || fps > 30; // either we have native support, or we can lower the FPS
	//#endregion

	const format = useMemo(() => {
		let result = formats;
		if (enableHdr) {
			// We only filter by HDR capable formats if HDR is set to true.
			// Otherwise we ignore the `supportsVideoHDR` property and accept formats which support HDR `true` or `false`
			result = result.filter((f) => f.supportsVideoHDR || f.supportsPhotoHDR);
		}

		// find the first format that includes the given FPS
		return result.find((f) =>
			f.frameRateRanges.some((r) => frameRateIncluded(r, fps))
		);
	}, [formats, fps, enableHdr]);

	//#region Animated Zoom
	// This just maps the zoom factor to a percentage value.
	// so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
	const minZoom = device?.minZoom ?? 1;
	const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

	const cameraAnimatedProps = useAnimatedProps(() => {
		const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
		return {
			zoom: z,
		};
	}, [maxZoom, minZoom, zoom]);
	//#endregion

	//#region Callbacks
	const setIsPressingButton = useCallback(
		(_isPressingButton) => {
			isPressingButton.value = _isPressingButton;
		},
		[isPressingButton]
	);
	// Camera callbacks
	const onError = useCallback((error) => {
		console.error(error);
	}, []);
	const onInitialized = useCallback(() => {
		console.log("Camera initialized!");
		setIsCameraInitialized(true);
	}, []);
	const onMediaCaptured = useCallback((media, type) => {
		console.log(`Media captured! ${JSON.stringify(media)}`, type);
		let filePath;
		if (media?.path?.includes("file:///")) {
			filePath = media?.path;
		} else {
			filePath = `file://${media?.path}`;
		}
		const mimeType = `${type === "photo" ? "image" : "video"}/${
			media.path.split(".")[media.path.split(".").length - 1]
		}`;
		setMediaState((prev) => ({
			...prev,
			media: {
				...media,
				fileUri: filePath,
				mimeType: mimeType,
				captured: true,
			},
			type: type,
		}));
		displayCameraMedia();
	}, []);
	const onFlipCameraPressed = useCallback(() => {
		setCameraPosition((p) => (p === "back" ? "front" : "back"));
	}, []);
	const onFlashPressed = useCallback(() => {
		setFlash((f) => (f === "off" ? "on" : "off"));
	}, []);
	//#endregion

	//#region Tap Gesture
	const onDoubleTap = useCallback(() => {
		onFlipCameraPressed();
	}, [onFlipCameraPressed]);
	//#endregion

	//#region Effects
	const neutralZoom = device?.neutralZoom ?? 1;
	useEffect(() => {
		// Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
		zoom.value = neutralZoom;
	}, [neutralZoom, zoom]);

	useEffect(() => {
		Camera.getMicrophonePermissionStatus().then((status) =>
			setHasMicrophonePermission(status === "authorized")
		);
	}, []);
	//#endregion

	//#region Pinch to Zoom Gesture
	// The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
	// function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
	const onPinchGesture = useAnimatedGestureHandler({
		onStart: (_, context) => {
			context.startZoom = zoom.value;
		},
		onActive: (event, context) => {
			// we're trying to map the scale gesture to a linear zoom here
			const startZoom = context.startZoom ?? 0;
			const scale = interpolate(
				event.scale,
				[1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
				[-1, 0, 1],
				Extrapolate.CLAMP
			);
			zoom.value = interpolate(
				scale,
				[-1, 0, 1],
				[minZoom, startZoom, maxZoom],
				Extrapolate.CLAMP
			);
		},
	});
	//#endregion

	if (device != null && format != null) {
		console.log(
			`Re-rendering camera page with ${
				isActive ? "active" : "inactive"
			} camera. ` +
				`Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} @ ${fps}fps)`
		);
	} else {
		console.log("re-rendering camera page without active camera");
	}

	return (
		<View style={styles.container}>
			{device != null && (
				<PinchGestureHandler
					onGestureEvent={onPinchGesture}
					enabled={isActive}
				>
					<Reanimated.View
						style={[
							StyleSheet.absoluteFill,
							{ justifyContent: "center", alignItems: "center" },
						]}
					>
						<TapGestureHandler
							onEnded={onDoubleTap}
							numberOfTaps={2}
						>
							<ReanimatedCamera
								ref={camera}
								style={{
									height: screenHeight,
									width: screenWidth,
								}}
								enableHighQualityPhotos={true}
								device={device}
								// format={format}
								preset="high"
								fps={fps}
								hdr={false}
								lowLightBoost={false}
								isActive={isActive}
								onInitialized={onInitialized}
								onError={onError}
								enableZoomGesture={true}
								animatedProps={cameraAnimatedProps}
								photo={true}
								video={video}
								audio={hasMicrophonePermission}
								orientation="portrait"
								zoom={0}
								// displayName="BanjeeCamera"
							/>
						</TapGestureHandler>
					</Reanimated.View>
				</PinchGestureHandler>
			)}
			{Platform.OS === "android" && (
				<View
					style={{
						height: 100,
						width: Dimensions.get("screen").width,
						position: "absolute",
						bottom: 120,
					}}
				>
					<GalaryMedia
						video={video}
						setMediaState={setMediaState}
						displayCameraMedia={displayCameraMedia}
					/>
				</View>
			)}

			<CaptureButton
				style={styles.captureButton}
				camera={camera}
				onMediaCaptured={onMediaCaptured}
				cameraZoom={zoom}
				minZoom={minZoom}
				maxZoom={maxZoom}
				video={video}
				flash={supportsFlash ? flash : "off"}
				enabled={isCameraInitialized && isActive}
				setIsPressingButton={setIsPressingButton}
			/>
			{video && (
				<Text
					fontSize={12}
					color={"white"}
					style={styles.pressText}
				>
					Hold button to record video
				</Text>
			)}

			<StatusBarBlurBackground />

			{supportsCameraFlipping && (
				<TouchableOpacity
					style={styles.flipButton}
					onPress={onFlipCameraPressed}
					disabledOpacity={0.4}
				>
					<IonIcon
						name="camera-reverse"
						color="white"
						size={30}
					/>
				</TouchableOpacity>
			)}
			{supportsFlash && (
				<TouchableOpacity
					style={[
						styles.flashButton,
						{
							top: statusbar ? 10 : Constants.statusBarHeight + 10,
						},
					]}
					onPress={onFlashPressed}
					disabledOpacity={0.4}
				>
					<IonIcon
						name={flash === "on" ? "flash" : "flash-off"}
						color="white"
						size={ICON_SIZE}
					/>
				</TouchableOpacity>
			)}
			<TouchableOpacity
				style={styles.galaryButton}
				disabledOpacity={0.4}
				onPress={getGallery}
			>
				<IonIcon
					name="images"
					color="white"
					size={BOTTOM_ICON_SIZE}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.closeButton,
					{
						top: statusbar ? 10 : Constants.statusBarHeight + 10,
					},
				]}
				onPress={closeMediaModal}
				disabledOpacity={0.4}
			>
				<IonIcon
					name="close"
					color="white"
					size={30}
				/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: "100%",
		width: "100%",
		backgroundColor: "#000",
	},
	captureButton: {
		position: "absolute",
		alignSelf: "center",
		bottom: SAFE_AREA_PADDING.paddingBottom,
		zIndex: 50,
	},
	closeButton: {
		position: "absolute",
		left: 20,
		width: BUTTON_SIZE,
		height: BUTTON_SIZE,
		borderRadius: BUTTON_SIZE / 2,
		// backgroundColor: "rgba(140, 140, 140, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	flashButton: {
		position: "absolute",
		right: 20,
		width: BUTTON_SIZE,
		height: BUTTON_SIZE,
		borderRadius: BUTTON_SIZE / 2,
		backgroundColor: "rgba(140, 140, 140, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	flipButton: {
		position: "absolute",
		bottom: SAFE_AREA_PADDING.paddingBottom + 15,
		right: 30,
		width: BOTTOM_BUTTON_SIZE,
		height: BOTTOM_BUTTON_SIZE,
		borderRadius: BOTTOM_BUTTON_SIZE / 2,
		backgroundColor: "rgba(140, 140, 140, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	galaryButton: {
		position: "absolute",
		bottom: SAFE_AREA_PADDING.paddingBottom + 15,
		left: 30,
		width: BOTTOM_BUTTON_SIZE,
		height: BOTTOM_BUTTON_SIZE,
		borderRadius: BOTTOM_BUTTON_SIZE / 2,
		backgroundColor: "rgba(140, 140, 140, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: "white",
		fontSize: 11,
		fontWeight: "bold",
		textAlign: "center",
	},
	pressText: {
		position: "absolute",
		bottom: SAFE_AREA_PADDING.paddingBottom - 43,
		textAlign: "center",
		width: "100%",
		height: BOTTOM_BUTTON_SIZE,
		borderRadius: BOTTOM_BUTTON_SIZE / 2,
		justifyContent: "center",
		alignItems: "center",
	},
});

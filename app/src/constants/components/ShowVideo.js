import { HeaderBackButton } from "@react-navigation/elements";
import React from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import color from "../env/color";
import AppFabButton from "./ui-component/AppFabButton";
import VideoViewer from "./VideoViewer";
import { useIsForeground } from "../../utils/hooks/useIsForeground";
import { useIsFocused } from "@react-navigation/core";
import CarousalVideo from "./CarousalView/RenderViewComponents/CarousalVideo";

function ShowVideo({ video, hideModal, showBtn, closeModal }) {
	const isForeground = useIsForeground();

	const isScreenFocused = useIsFocused();
	const isVideoPaused = !isForeground || !isScreenFocused;
	return (
		<View
			style={{
				flex: 1,
				height: "100%",
				width: "100%",
				backgroundColor: color.gradientWhite,
			}}
		>
			<SafeAreaView>
				<HeaderBackButton
					labelVisible={Platform.OS === "ios"}
					onPress={closeModal}
					style={{ marginLeft: 10 }}
					tintColor={color.black}
				/>
			</SafeAreaView>

			{/* <Video
				source={{ uri: video }}
				style={StyleSheet.absoluteFill}
				paused={isVideoPaused}
				resizeMode="cover"
				posterResizeMode="cover"
				allowsExternalPlayback={false}
				automaticallyWaitsToMinimizeStalling={false}
				disableFocus={true}
				repeat={true}
				useTextureView={false}
				controls={false}
				playWhenInactive={true}
				ignoreSilentSwitch="ignore"
				// onReadyForDisplay={onMediaLoadEnd}
				// onLoad={onMediaLoad}
				// onError={onMediaLoadError}
			/> */}
			<View style={{ flex: 1, backgroundColor: color.gradientWhite }}>
				{video && video.length > 0 && (
					<View style={{ height: "100%" }}>
						<CarousalVideo
							s3Url={true}
							src={video}
							fullScreenRatio="alertThumbnail"
						/>
					</View>
				)}

				{showBtn && (
					<View
						style={{
							height: 70,
							width: "100%",
							backgroundColor: "purple",
							position: "absolute",
							bottom: 0,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<View
							style={{
								width: "40%",
								justifyContent: "space-evenly",
								flexDirection: "row",
							}}
						>
							<AppFabButton
								onPress={hideModal}
								size={20}
								icon={
									<FastImage
										source={require("../../../assets/EditDrawerIcon/ic_send_message_round.png")}
										style={{ height: 35, width: 35 }}
									/>
								}
							/>
							<AppFabButton
								size={20}
								icon={
									<FastImage
										source={require("../../../assets/EditDrawerIcon/ic_distructive.png")}
										style={{ height: 35, width: 35 }}
									/>
								}
							/>
						</View>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default ShowVideo;

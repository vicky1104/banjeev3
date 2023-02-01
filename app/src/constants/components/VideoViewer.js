// import { Video } from "expo-av";
import React, { useContext, useRef, useState } from "react";
import {
	Image,
	Platform,
	StyleSheet,
	useWindowDimensions,
	View,
} from "react-native";
import Video, { FilterType } from "react-native-video";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Slider } from "native-base";
import AppFabButton from "./ui-component/AppFabButton";
import AppLoading from "./ui-component/AppLoading";

export default function VideoViewer({ src }) {
	const videoRef = useRef(null);
	const [play, setPlay] = useState(true);
	const [muted, setMuted] = useState(false);
	const [slider, setSlider] = useState(0);
	const [duration, setDuration] = useState(0);

	const onError = (err) => {
		console.log(err, "video error");
	};

	const onLoadStart = () => <AppLoading visible={true} />;

	return (
		<View style={{}}>
			<View style={styles.singlePostView}>
				<Video
					fullscreen={true}
					poster={src}
					posterResizeMode={"cover"}
					onBuffer={(e) => {
						e.isBuffering = true;
					}}
					// onEnd={() => alert("video ended")}
					ref={videoRef}
					source={{ uri: src }}
					resizeMode="cover"
					onLoad={(d) => {
						setDuration(d.duration);
					}}
					onProgress={(d) => {
						setSlider((d.currentTime / d.playableDuration) * 100);
					}}
					paused={play}
					filterEnabled={false}
					filter={FilterType.INSTANT}
					onLoadStart={onLoadStart}
					playWhenInactive={false}
					playInBackground={false}
					// controls={Platform.OS === "ios"}
					controls={true}
					pictureInPicture={false}
					minLoadRetryCount={2}
					muted={play || muted}
					allowsExternalPlayback={true}
					style={{
						// flex: 1,

						// height: "100%",

						width: "100%",

						// aspectRatio: 1,
						aspectRatio: 1,
						// aspectRatio: aspectRatio,
						// aspectRatio: Platform.OS === "ios" ? 16 / 13 : 16 / 9,
					}}
					onError={onError}
				/>
			</View>
			{Platform.OS === "android" && (
				<View style={styles.androidPlayer}>
					<AppFabButton
						onPress={() => setPlay((pre) => !pre)}
						icon={
							<AntDesign
								name={play ? "play" : "pausecircle"}
								size={24}
								color="white"
							/>
						}
					/>
					<Slider
						width={"250"}
						defaultValue={0}
						value={slider}
						minValue={0}
						maxValue={100}
						onChangeEnd={(v) => {
							videoRef.current?.seek((Math.floor(v) * duration) / 100, 50);
						}}
					>
						<Slider.Track>
							<Slider.FilledTrack />
						</Slider.Track>
						<Slider.Thumb />
					</Slider>
					<AppFabButton
						onPress={() => setMuted((pre) => !pre)}
						icon={
							<MaterialCommunityIcons
								name={!muted ? "volume-low" : "volume-mute"}
								size={24}
								color="white"
							/>
						}
					/>
					{/* <AppFabButton
					onPress={() => setMuted((pre) => !pre)}
					icon={
						<MaterialCommunityIcons
							name={!muted ? "volume-low" : "volume-mute"}
							size={24}
							color="black"
						/>
					}
				/> */}
				</View>
			)}
		</View>
	);
}
const styles = StyleSheet.create({
	singlePostView: {
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	androidPlayer: {
		// borderWidth: 1,
		position: "absolute",
		bottom: 0,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		flexWrap: "wrap",
		backgroundColor: "rgba(0,0,0,0.5)",
		width: "100%",
	},
});

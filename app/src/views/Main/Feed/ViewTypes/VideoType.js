// import { Video } from "expo-av";
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";
import { Dimensions, StyleSheet, View } from "react-native";
import VideoPlayer from "../../../../constants/components/VideoPlayer/VideoPlayer";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import color from "../../../../constants/env/color";

function VideoItem({ src, localUrl, fullScreen }, ref) {
	const videoPlayer = useRef(null);
	const { addListener } = useNavigation();
	const focused = useIsFocused();

	useEffect(() => {
		addListener("blur", () => {
			videoPlayer?.current?.pause();
		});
		if (!focused) {
			videoPlayer?.current?.pause();
		}
		if (!videoPlayer?.current?.state.paused) {
			videoPlayer?.current?.pause();
		}

		return () => {
			videoPlayer?.current?.pause();
		};
	}, [videoPlayer.current, focused, addListener]);

	const play = () => {
		videoPlayer?.current?.play();
	};

	const pause = () => {
		videoPlayer?.current?.pause();
	};

	useImperativeHandle(
		ref,
		() => ({
			play,
			pause,
		}),
		[play, pause]
	);

	return (
		<View
			style={
				fullScreen
					? styles.singlePostView
					: {
							width: Dimensions.get("screen").width,
							aspectRatio: fullScreen ? null : 1,
					  }
			}
		>
			{/* <VideoPlayer
				removeClippedSubviews={true}
				resizeMode="contain"
				showOnStart={true}
				disableBack={true}
				isFullscreen={fullScreen ? true : false}
				disableFullscreen={fullScreen ? false : true}
				poster={localUrl ? src : cloudinaryFeedUrl(src, "thumbnail")}
				tapAnywhereToPause={false}
				playInBackground={false}
				playWhenInactive={false}
				paused={true}
				disableVolume={true}
				ref={videoPlayer}
				source={{ uri: localUrl ? src : cloudinaryFeedUrl(src, "video") }}
				style={
					localUrl
						? { backgroundColor: color?.gradientWhite, width: "100%", height: "100%" }
						: {
								backgroundColor: color?.gradientWhite,
								width: Dimensions.get("screen").width,
								aspectRatio: fullScreen ? null : 1,
						  }
				}
			/> */}
			<VideoPlayer
				endWithThumbnail
				thumbnail={{ uri: localUrl ? src : cloudinaryFeedUrl(src, "thumbnail") }}
				video={{ uri: localUrl ? src : cloudinaryFeedUrl(src, "video") }}
				//   videoWidth={this.state.video.width}
				//   videoHeight={this.state.video.height}
				customStyles={{
					thumbnail: {
						backgroundColor: color?.gradientWhite,
						width: Dimensions.get("screen").width,
						height: "100%",
					},
					video: localUrl
						? { backgroundColor: color?.gradientWhite, width: "100%", height: "100%" }
						: {
								backgroundColor: color?.gradientWhite,
								width: Dimensions.get("screen").width,
								height: "100%",
						  },
				}}
				ref={videoPlayer}
			/>
		</View>
	);
}

export default VideoType = forwardRef(VideoItem);

const styles = StyleSheet.create({
	singlePostView: {
		// alignItems: "center",
		// justifyContent: "center",
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
	toolbar: {
		color: "red",
		marginTop: 30,
		backgroundColor: "white",
		padding: 10,
		borderRadius: 5,
	},
	mediaPlayer: {
		// position: "absolute",
		// justifyContent: "center",
	},
});

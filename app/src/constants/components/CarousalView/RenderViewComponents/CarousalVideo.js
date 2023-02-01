// import { Video } from "expo-av";
import React, { useContext, useRef, useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	Platform,
	StyleSheet,
	useWindowDimensions,
	View,
} from "react-native";
import Video, { FilterType } from "react-native-video";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Slider } from "native-base";
import { MainContext } from "../../../../../context/MainContext";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";
import AppLoading from "../../ui-component/AppLoading";
import AppFabButton from "../../ui-component/AppFabButton";
import VideoPlayer from "../../VideoPlayer/VideoPlayer";

export default function CarousalVideo({ src, fullScreenRatio, s3Url }) {
	const onError = (err) => {
		console.log(err, "video error aaaaaaaaaaaaaaaaaaa");
	};
	const [aspectRatio, setAspectRatio] = useState();

	Image.getSize(cloudinaryFeedUrl(src, "thumbnail"), (height, width) =>
		setAspectRatio(height / width)
	);

	const onLoadStart = () => <AppLoading visible={true} />;

	function getThumbnail() {
		switch (fullScreenRatio) {
			case "alertThumbnail":
				return "alertThumbnail";
			case "thumbnail":
				return "thumbnail";
			case "newsAlert":
				return "newsAlert";
			default:
				return "thumbnail";
		}
	}

	function getVideoUrl() {
		switch (fullScreenRatio) {
			case "alertThumbnail":
				return "alertVideo";
			case "thumbnail":
				return "alertVideo";

			case "newsAlert":
				return "newsAlertVideo";
			default:
				return "video";
		}
	}

	function getVideoRatio() {
		switch (fullScreenRatio) {
			case "alertThumbnail":
				return aspectRatio;

			case "thumbnail":
				return aspectRatio;

			case "newsAlert":
				return 1;
			default:
				return 1;
		}
	}
	// console.warn(src, "dsfdfbf");

	return (
		<View style={{ flex: 1 }}>
			<VideoPlayer
				removeClippedSubviews={true}
				resizeMode="contain"
				showOnStart={true}
				disableBack={true}
				disableFullscreen={true}
				poster={s3Url ? undefined : cloudinaryFeedUrl(src, getThumbnail())}
				tapAnywhereToPause={true}
				playInBackground={false}
				playWhenInactive={false}
				paused={true}
				disableVolume={true}
				source={{ uri: s3Url ? src : cloudinaryFeedUrl(src, getVideoUrl()) }}
				style={{
					width: Dimensions.get("screen").width,
					aspectRatio: getVideoRatio(),
				}}
			/>
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

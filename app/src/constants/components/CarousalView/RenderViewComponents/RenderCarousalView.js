import React from "react";
import { View, StyleSheet } from "react-native";
import FeedForSinglePost from "../../../../views/Main/Feed/FeedForSinglePost";
import AudioTypes from "../../../../views/Main/Feed/ViewTypes/AudioTypes";
import CarousalVideo from "./CarousalVideo";

function RenderCarousalView({ feedView, item, fullScreenRatio }) {
	const { mimeType, src } = item;

	console.warn(mimeType, src, "mimeType, srcmimeType, src");

	// console.warn("fullScreenRatiofullScreenRatio", fullScreenRatio);
	const renderComp = () => {
		switch (mimeType) {
			case "video/mp4":
				return (
					<CarousalVideo
						src={src}
						fullScreenRatio={fullScreenRatio}
					/>
				);
			case "audio/mp3":
				return <AudioTypes src={src} />;
			case "image/jpg":
				return (
					<FeedForSinglePost
						src={src}

						// id={id}
					/>
				);
			default:
				break;
		}
	};

	return (
		<View
			style={{
				alignItems: "center",
				display: "flex",
				// height: 350,
				flex: 1,
			}}
		>
			{renderComp()}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default RenderCarousalView;

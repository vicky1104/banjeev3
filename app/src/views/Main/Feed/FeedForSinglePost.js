import React from "react";
import { View } from "react-native";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import color from "../../../constants/env/color";
import AppLoading from "../../../constants/components/ui-component/AppLoading";

function FeedForSinglePost({ src }) {
	const IMAGE_URL = (src) => {
		return `https://res.cloudinary.com/banjee/image/upload/f_auto,q_auto:low/v1/${src}.png`;
	};

	return (
		<View style={{ height: "100%", width: "100%" }}>
			<ImageZoom
				uri={IMAGE_URL(src)}
				renderLoader={
					() => null
					// <View
					// 	style={{
					// 		justifyContent: "center",
					// 		backgroundColor: color.gradientWhite,
					// 		alignItems: "center",
					// 		height: "100%",
					// 		width: "100%",
					// 	}}
					// >
					// 	<AppLoading
					// 		color={"grey"}
					// 		size="small"
					// 		visible={true}
					// 	/>
					// </View>
				}
			/>
		</View>
	);
}

export default FeedForSinglePost;

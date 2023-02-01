import React, { forwardRef, useContext, useImperativeHandle } from "react";
import { Dimensions, Image, Platform, View } from "react-native";
import FastImage from "react-native-fast-image";
import { MainContext } from "../../../../context/MainContext";
import color from "../../../constants/env/color";
import { cloudinaryFeedUrl } from "../../../utils/util-func/constantExport";
import FeedForSinglePost from "./FeedForSinglePost";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import AppLoading from "../../../constants/components/ui-component/AppLoading";

const FeedItem = ({ src, id: feedId, localUrl, ratio }, ref) => {
	// const [aspectRatio, setAspectRatio] = useState();
	// Image.getSize(IMAGE_URL(src), (height, width) =>
	// 	setAspectRatio(height / width)
	// );

	useImperativeHandle(ref, () => null, []);
	return (
		// <View
		// 	style={{
		// 		backgroundColor: color?.gradientWhite,
		// 		height: "100%",
		// 		alignItems: "center",
		// 		justifyContent: "center",
		// 	}}
		// >
		<Image
			source={{ uri: localUrl ? src : cloudinaryFeedUrl(src, "image") }}
			resizeMode="contain"
			// renderLoder={(e) =>
			// 	Platform.select({
			// 		android: (
			// 			<View
			// 				style={{
			// 					justifyContent: "center",
			// 					backgroundColor: color.gradientWhite,
			// 					alignItems: "center",
			// 					height: "100%",
			// 					width: "100%",
			// 				}}
			// 			>
			// 				<AppLoading
			// 					color={"grey"}
			// 					size="small"
			// 					visible={true}
			// 				/>
			// 			</View>
			// 		),
			// 		ios: null,
			// 	})
			// }
			style={{
				// height: !ratio ? undefined : "100%",
				backgroundColor: color?.gradientWhite,
				width: Dimensions.get("screen").width,
				aspectRatio: 1,
			}}
		/>
		// </View>
		// 	)}
		// </View>
	);
};

export default FeedZoom = forwardRef(FeedItem);

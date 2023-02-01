import { LinearGradient } from "expo-linear-gradient";

import React, { useContext } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import FastImage from "react-native-fast-image";
import { MainContext } from "../../../../../context/MainContext";
import { profileUrl } from "../../../../utils/util-func/constantExport";
import ImageModal from "../../../Others/ImageModal";

function SelectImage({ imageModal, setImageModal }) {
	const { imageContent } = useContext(MainContext).room; //src from api and url for selected image
	return (
		<View style={{ position: "relative", marginTop: 24 }}>
			<FastImage
				style={{ height: 120, width: 120, borderRadius: 60 }}
				source={
					imageContent
						? imageContent.url
							? { uri: imageContent.url }
							: imageContent.src
							? { uri: profileUrl(imageContent.src) }
							: require("../../../../../assets/EditDrawerIcon/dummy_image_group.png")
						: imageContent?.src
						? { uri: profileUrl(imageContent.src) }
						: require("../../../../../assets/EditDrawerIcon/dummy_image_group.png")
				}
			/>

			<LinearGradient
				start={{ x: 0, y: 0 }}
				end={{ x: 0.2, y: 1 }}
				colors={["rgba(237, 69, 100, 1 )", "rgba(169, 50, 148, 1 )"]}
				style={styles.gradient2}
			>
				<TouchableWithoutFeedback onPress={() => setImageModal(true)}>
					<FastImage
						style={{ height: 24, width: 24 }}
						source={require("../../../../../assets/EditDrawerIcon/ic_white_camera.png")}
					/>
				</TouchableWithoutFeedback>
			</LinearGradient>

			<ImageModal
				imageModal={imageModal}
				imageModalHandler={setImageModal}
				roomImage={true}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	gradient2: {
		height: 40,
		width: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		right: -10,
	},
});

export default SelectImage;

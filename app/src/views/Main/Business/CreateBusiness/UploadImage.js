import { Entypo } from "@expo/vector-icons";
import { useFormikContext } from "formik";
import React from "react";
import {
	Image,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import color from "../../../../constants/env/color";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";

function UploadImage({ openMediaModal }) {
	const { values, setFieldValue } = useFormikContext();

	console.warn("values", values);

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
		>
			<TouchableWithoutFeedback onPress={openMediaModal}>
				<View
					style={{
						height: 65,
						width: 65,
						borderRadius: 8,
						borderWidth: 1,
						borderColor: color?.black,
						borderStyle: "dashed",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Entypo
						name="plus"
						size={24}
						color={color?.black}
					/>
				</View>
			</TouchableWithoutFeedback>
			<View style={styles.postImgView}>
				{values?.img?.map((ele, i) => {
					return (
						<View
							key={i}
							style={{ position: "relative" }}
						>
							<View style={styles.mapView}>
								<AppFabButton
									onPress={() => {
										setFieldValue(
											"img",
											values.img.filter((el) => el.uri !== ele.uri)
										);
									}}
									size={15}
									icon={
										<Entypo
											size={20}
											name="cross"
											color={color.primary}
										/>
									}
								/>
							</View>
							{ele.uri?.includes("file:///") ? (
								<Image
									style={styles.postImg}
									source={{ uri: ele.uri }}
								/>
							) : (
								<Image
									style={styles.postImg}
									source={{ uri: cloudinaryFeedUrl(ele.uri, "image") }}
								/>
							)}
						</View>

						// <View
						// 	key={i}
						// 	style={{
						// 		height: 65,
						// 		width: 65,
						// 		borderRadius: 8,
						// 		borderWidth: 1,
						// 		borderColor: color.grey,
						// 		elevation: 3,
						// 		alignItems: "center",
						// 		justifyContent: "center",
						// 		marginLeft: 10,
						// 		overflow: "hidden",
						// 		position: "relative",
						// 	}}
						// >
						// <View style={styles.mapView}>
						// 	<AppFabButton
						// 		size={10}
						// 		// style={{ zIndex: 99, position: "absolute", top: -5, right: -5 }}
						// 		icon={<Entypo size={20} name="cross" color="black" />}
						// 	/>
						// </View>
						// 	<Image
						// 		source={{ uri: ele }}
						// 		style={{ height: "100%", width: "100%" }}
						// 	/>
						// </View>
					);
				})}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	mapView: {
		zIndex: 1,
		top: -7,
		right: -7,

		borderRadius: 50,
		position: "absolute",
		// height: 40,
	},
	postImg: {
		height: 65,
		width: 65,
		borderRadius: 8,
		marginLeft: 10,
		borderWidth: 1,
		borderColor: color.grey,
	},

	postImgView: {
		height: 65,
		justifyContent: "flex-start",
		alignItems: "center",
		width: "100%",
		flexDirection: "row",
	},
});
export default UploadImage;

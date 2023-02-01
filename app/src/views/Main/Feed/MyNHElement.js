import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { Fragment } from "react";
import {
	View,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
} from "react-native";
import color from "../../../constants/env/color";
import { cloudinaryFeedUrl } from "../../../utils/util-func/constantExport";

function MyNHElement({ item }) {
	const { navigate } = useNavigation();

	return (
		<View style={{ paddingBottom: 3 }}>
			<View
				style={[
					styles.container,
					{ borderColor: color?.border, backgroundColor: color?.gradientWhite },
				]}
			>
				<View style={{ flexDirection: "row" }}>
					<Image
						resizeMode="cover"
						source={{
							uri: cloudinaryFeedUrl(item.payload.imageUrl, "image", "3:1"),
						}}
						style={[styles.image, { borderColor: color?.border }]}
					/>

					<View style={{ marginLeft: 10 }}>
						<Fragment>
							<View>
								<Text color={color?.black}>{item.payload.name}</Text>
								<Text color={color?.black}>{item.payload.countryName}</Text>
							</View>

							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text color={color?.black}>
									<Text fontWeight={"bold"}>{item.payload.totalMembers}</Text> Members
								</Text>
								<Text
									color={color?.black}
									ml={3}
								>
									<Text fontWeight={"bold"}>{item.payload.totalPosts}</Text> Posts
								</Text>
							</View>

							<View style={styles.btnView}>
								<TouchableWithoutFeedback
									onPress={() =>
										navigate("FilterNeighbourhood", {
											cloudId: item.cloudId,
											cloudName: item?.payload?.name,
											NHImage: item.payload.imageUrl,
										})
									}
								>
									<View style={[{ backgroundColor: color?.primary }, styles.btn]}>
										<Text color={color?.white}>Alert</Text>
									</View>
								</TouchableWithoutFeedback>

								<TouchableWithoutFeedback
									onPress={() =>
										navigate("DetailNeighbourhood", { cloudId: item.cloudId })
									}
								>
									<View
										style={[
											styles.btn,
											{ backgroundColor: color?.primary, marginLeft: 10 },
										]}
									>
										<Text color={color?.white}>Explore</Text>
									</View>
								</TouchableWithoutFeedback>
							</View>
						</Fragment>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		padding: 10,
		marginLeft: 10,
		borderRadius: 8,
		width: 320,
		elevation: 3,
	},
	image: { height: 64, width: 64, borderRadius: 50, borderWidth: 1 },
	btnView: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
		width: "75%",
	},
	btn: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 16,
		alignItems: "center",
	},
});

export default MyNHElement;

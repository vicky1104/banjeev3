import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React from "react";
import {
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import FastImage from "react-native-fast-image";
import color from "../../../../../constants/env/color";
import { cloudinaryFeedUrl } from "../../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../../utils/util-func/convertTime";

const CARD_WIDTH = Dimensions.get("screen").width / 2 - 15;

function AllProductItem({ item }) {
	const { navigate } = useNavigation();
	return (
		<TouchableWithoutFeedback
			onPress={() =>
				navigate("ViewProductInDetail", {
					productId: item.id,
				})
			}
		>
			<View style={{ paddingBottom: 5 }}>
				<View
					style={{
						// height: 200,
						width: CARD_WIDTH,
						borderWidth: 1,
						marginTop: 5,
						borderColor: color.grey,
						overflow: "hidden",
						borderRadius: 8,
						elevation: 3,
						shadowOffset: { width: 1, height: 1 },
						shadowOpacity: 0.4,
						shadowRadius: 3,
						marginRight: 10,
						backgroundColor: color?.white,
					}}
				>
					<View style={{ height: 130, width: "100%" }}>
						<FastImage
							source={{
								uri: cloudinaryFeedUrl(item.imageUrl, "image"),
							}}
							style={{ width: "100%", height: "100%" }}
						/>
					</View>

					<View
						style={{
							// height: "35%",
							width: "100%",
							paddingHorizontal: 5,
							paddingVertical: 3,
						}}
					>
						<Text
							fontSize={14}
							numberOfLines={2}
							color={color?.grey}
						>
							{item.name}
						</Text>

						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Text
								fontSize={16}
								color={color?.black}
							>
								{item.price} <Text fontWeight={"medium"}>{item.currency}</Text>
							</Text>

							<Text
								fontSize={12}
								style={{ color: color.greyText }}
							>
								{convertTime(item.createdOn)}
							</Text>
						</View>
						{/* <Text
											// fontSize={12}
											style={{ color: color.greyText }}
											numberOfLines={3}
										>
											{item.description}
										</Text> */}
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default AllProductItem;

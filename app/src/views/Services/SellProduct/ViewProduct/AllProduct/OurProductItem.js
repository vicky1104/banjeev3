import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Switch, Text } from "native-base";
import React, { useEffect, useState } from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import AppFabButton from "../../../../../constants/components/ui-component/AppFabButton";
import color from "../../../../../constants/env/color";
import { sellProductService } from "../../../../../helper/services/Classifieds";
import { cloudinaryFeedUrl } from "../../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../../utils/util-func/convertTime";

const CARD_WIDTH = Dimensions.get("screen").width / 2 - 15;

function OurProductItem({ item, setDeleteModal }) {
	const [check, setCheck] = useState(false);
	const { navigate } = useNavigation();
	// useEffect(() => {
	// 	if (check) {
	// 		activateProductService(item.id);
	// 	} else {
	// 		deactivateProductService(item.id);
	// 	}

	// }, [check]);

	useEffect(() => {
		if (check) {
			sellProductService(item.id)
				.then((res) => console.warn(res, ".............."))
				.catch((err) => console.warn(err));
		}
	});

	return (
		<TouchableWithoutFeedback
			onPress={() =>
				navigate("ViewProductInDetail", {
					productId: item.id,
				})
			}
		>
			<View
				style={{
					// height: 220,
					height: 275,
					width: CARD_WIDTH,
					borderWidth: 1,
					marginTop: 10,
					borderColor: color.grey,
					overflow: "hidden",
					borderRadius: 8,
					elevation: 3,
					shadowOffset: { width: 1, height: 1 },
					shadowOpacity: 0.4,
					shadowRadius: 3,
					backgroundColor: color?.white,
				}}
			>
				<View style={{ height: "60%", width: "100%" }}>
					<Image
						source={{
							uri: cloudinaryFeedUrl(item.imageUrl, "image"),
						}}
						style={{ width: "100%", height: "100%" }}
					/>
				</View>

				<View
					style={{
						height: "40%",
						// height: "50%",
						width: "100%",
						paddingHorizontal: 5,
						paddingVertical: 3,
						justifyContent: "space-between",
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
					{/* 
				<Text
					// fontSize={12}
					style={{ color: color.greyText }}
					numberOfLines={2}
				>
					{item.description}
				</Text> */}

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginTop: 3,
							justifyContent: "space-between",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Text
								fontSize={12}
								color={color?.grey}
							>
								Sold
							</Text>
							<Switch
								accessibilityLabel="active"
								size={"sm"}
								offThumbColor={color.grey}
								onThumbColor={color.primary}
								value={item.sold}
								onTrackColor={color.gradient}
								onValueChange={(e) => setCheck(e)}
							/>
						</View>

						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								width: "40%",
								justifyContent: "space-around",
							}}
						>
							{!item.sold && (
								<AppFabButton
									size={15}
									onPress={() => {
										navigate("CreateListing", { item });
									}}
									icon={
										<Feather
											name="edit"
											size={18}
											color="black"
										/>
									}
								/>
							)}

							<AppFabButton
								size={15}
								onPress={() => setDeleteModal(item.id)}
								icon={
									<AntDesign
										name="delete"
										size={18}
										color="black"
									/>
								}
							/>
						</View>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default OurProductItem;

import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
	Dimensions,
} from "react-native";
import GetDistance from "../../constants/components/GetDistance";
import color from "../../constants/env/color";
import { AppContext } from "../../Context/AppContext";
import { cloudinaryFeedUrl } from "../../utils/util-func/constantExport";
import { convertTime } from "../../utils/util-func/convertTime";

const CARD_WIDTH = Dimensions.get("screen").width / 2 - 50;

function BusinessNearByItem({ item }) {
	const { navigate } = useNavigation();
	const [newBusiness, setNewBusiness] = useState();
	const { location } = useContext(AppContext);
	useEffect(() => {
		let x = convertTime(item.createdOn);
		let p = x?.substring(0, 2);

		switch (true) {
			case x.includes("day ago"):
				if (p <= 10) {
					setNewBusiness("New");
				}
				break;

			case x.includes("hrs ago"):
				setNewBusiness("New");
				break;

			case x.includes("just now"):
				setNewBusiness("New");
				break;

			case x.includes("min ago"):
				setNewBusiness("New");
				break;

			default:
				break;
		}
	}, [item]);

	return (
		<TouchableWithoutFeedback
			onPress={() => navigate("DetailService", { businessId: item.id })}
		>
			<View style={{ paddingBottom: 5, marginRight: 10 }}>
				<View
					style={{
						borderWidth: 1,
						borderColor: color.border,
						flexDirection: "row",
						alignItems: "center",
						width: Dimensions.get("screen").width - 10,
						alignSelf: "center",
						borderRadius: 16,
						overflow: "hidden",
					}}
				>
					<View style={{ width: "30%" }}>
						<Image
							style={{ width: "100%", height: 140 }}
							source={{
								uri: cloudinaryFeedUrl(item.logoURL, "image"),
							}}
						/>
					</View>

					<View
						style={{
							width: "70%",
							alignItems: "flex-start",
							height: "100%",
							padding: 10,
						}}
					>
						<Text
							color={color?.black}
							fontSize={14}
							style={{ textAlign: "center" }}
							fontWeight="medium"
							numberOfLines={1}
						>
							{item.name}
						</Text>

						<Text
							style={{
								textAlign: "center",
								color: color.black,
							}}
							opacity={70}
							// fontSize={12}
							numberOfLines={1}
						>
							{item.categoryName}
						</Text>

						<Text
							style={{
								color: color.black,
								marginTop: 5,
							}}
							opacity={70}
							// fontSize={12}
							numberOfLines={2}
						>
							{item.address.trim()}
						</Text>

						<View
							style={{
								alignSelf: "flex-end",
								position: "absolute",
								bottom: 10,
								right: 10,
							}}
						>
							<GetDistance
								lat1={location?.location?.latitude}
								lon1={location?.location?.longitude}
								lat2={item?.location?.coordinates[1]}
								lon2={item?.location?.coordinates[0]}
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

export default BusinessNearByItem;

// <View
// // key={i}
// style={{
// 	// height: 200,
// 	backgroundColor: color?.white,
// 	width: CARD_WIDTH,
// 	borderWidth: 1,
// 	borderColor: color?.border,
// 	borderRadius: 8,
// 	shadowColor: "#470000",
// 	shadowOffset: { width: 0, height: 1 },
// 	shadowOpacity: 0.2,
// 	elevation: 2,
// 	shadowRadius: 8,
// 	marginLeft: 10,
// 	marginRight: 0,
// 	overflow: "hidden",
// }}
// >
// {newBusiness && (
// 	<Text
// 		style={{
// 			position: "absolute",
// 			zIndex: 1,
// 			backgroundColor: "red",
// 			right: 0,
// 			paddingHorizontal: 5,
// 		}}
// 	>
// 		{newBusiness}
// 	</Text>
// )}
// <Image
// source={{
// 	uri: cloudinaryFeedUrl(item.logoURL, "image"),
// }}
// 	style={{ height: 100, width: "100%" }}
// />
// <View
// 	style={{
// 		height: 60,
// 		borderTopWidth: 1,
// 		borderColor: color.border,
// 		justifyContent: "space-evenly",
// 		backgroundColor: color?.gradientWhite,
// 	}}
// >
// <Text
// 	color={color?.black}
// 	fontSize={14}
// 	style={{ textAlign: "center" }}
// 	fontWeight="medium"
// 	numberOfLines={1}
// >
// 	{item.name}
// </Text>
// <Text
// 	style={{
// 		marginTop: -10,
// 		textAlign: "center",
// 		color: color.greyText,
// 	}}
// 	fontSize={12}
// 	numberOfLines={1}
// >
// 	{item.categoryName}
// </Text>
// </View>
// </View>

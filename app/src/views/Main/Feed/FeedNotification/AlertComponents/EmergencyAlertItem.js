import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useCallback, useContext, useState } from "react";
import {
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { MainContext } from "../../../../../../context/MainContext";
import { AppContext } from "../../../../../Context/AppContext";
import { alertIcons } from "../../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../../utils/util-func/convertTime";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { shareAlert } from "../../../../Other/ShareApp";
import Carousel from "../../../../../constants/components/FlatlistSwiper/FlatListSwiper";
import color from "../../../../../constants/env/color";
import GetDistance from "../../../../../constants/components/GetDistance";

function AlertNotificationItems({
	itemData,
	openSheet,
	setBottomSheetData,
	...rest
}) {
	const item = itemData?.contents ? itemData?.contents : itemData;

	const iconObj = alertIcons?.filter((ele) => item?.eventName === ele.name)[0];
	const { navigate } = useNavigation();
	const { incidentCount, setAlertId, alertId } = useContext(MainContext);
	const { location } = useContext(AppContext);
	const [count, setCount] = useState(0);

	useFocusEffect(
		useCallback(() => {
			if (alertId === item.id) {
				setCount(incidentCount);
			}
		}, [incidentCount])
	);

	return (
		<>
			{item !== undefined ? (
				<View
					style={{
						marginHorizontal: "1%",
						overflow: "hidden",
						borderWidth: rest?.showShare ? 0 : 1,
						paddingHorizontal: "1.5%",
						borderColor: color?.border,
						marginBottom: 15,
						backgroundColor: rest?.color ? rest?.color : color?.gradientWhite,
						paddingVertical: 10,
						borderRadius: 8,
					}}
				>
					<TouchableWithoutFeedback
						onPress={() => {
							setAlertId(item.id);
							navigate("DetailAlert", { alertId: item.id });
						}}
					>
						<View style={{ flex: 1 }}>
							<View
								style={{
									flexDirection: "row-reverse",
									alignItems: "center",
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
										color={color?.black}
										opacity={70}
									>
										{convertTime(item?.createdOn)} .{" "}
									</Text>

									<GetDistance
										lat1={location?.location?.latitude}
										lon1={location?.location?.longitude}
										lat2={item?.location?.coordinates[1]}
										lon2={item?.location?.coordinates[0]}
									/>
								</View>

								<Text
									fontSize={16}
									fontWeight={"medium"}
									color={color?.black}
								>
									{item?.eventName}
								</Text>
							</View>
							<View style={styles.row}>
								<Ionicons
									name="person"
									size={16}
									color="grey"
								/>
								<Text
									ml={2}
									color={color?.black}
									opacity={80}
								>
									{item?.anonymous
										? "Anonymous"
										: `${item?.createdByUser.firstName} ${item?.createdByUser.lastName}`}
								</Text>
							</View>

							<Text
								fontSize={12}
								color={color?.black}
								opacity={70}
							>
								{item?.metaInfo?.address}
							</Text>
						</View>
					</TouchableWithoutFeedback>

					{item?.mediaArray?.length > 0 && (
						<View
							style={{
								aspectRatio: 1,
								width: Dimensions.get("screen").width - 10,
								flex: 1,
								marginVertical: 10,
							}}
						>
							<Carousel
								dataArray={item?.mediaArray}
								currentIndex={0}
								fullScreenRatio={"newsAlert"}
							/>
						</View>
					)}

					{/* {item?.mediaArray?.length === 0 && (
						<View
							style={{
								borderWidth: 0.5,
								marginVertical: 5,
								borderColor: color?.border,
							}}
						/>
					)} */}
					<TouchableWithoutFeedback
						onPress={() => {
							navigate("DetailAlert", { alertId: item.id });
						}}
					>
						<View
							style={{ flex: 1, marginTop: item?.mediaArray?.length === 0 ? 10 : 0 }}
						>
							<Text
								fontStyle={"italic"}
								fontSize={12}
								color={color?.black}
								numberOfLines={2}
								opacity={80}
							>
								{item?.description}
							</Text>

							{rest?.showShare && (
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										marginTop: 10,
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<TouchableWithoutFeedback
											onPress={() => {
												navigate("AlertComment", { alertId: item.id });
											}}
										>
											<View style={{ flexDirection: "row", alignItems: "center" }}>
												<Ionicons
													name="chatbubble-outline"
													color={"grey"}
													size={20}
												/>
												{item?.totalComments > 0 && (
													<Text
														ml={2}
														color={color?.black}
														fontSize={10}
													>
														{item?.totalComments}
													</Text>
												)}
												<Text
													fontSize={10}
													ml={2}
													color={color?.black}
													opacity={70}
												>
													COMMENT
												</Text>
											</View>
										</TouchableWithoutFeedback>

										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												marginLeft: 10,
											}}
										>
											<Text
												ml={2}
												mr={1}
												color={color?.black}
												opacity={70}
												fontSize={14}
											>
												{count
													? count
													: item?.confirmIncidenceCount > 0
													? item?.confirmIncidenceCount
													: null}
											</Text>

											<Ionicons
												name="person-outline"
												size={18}
												color={"grey"}
											/>

											<Text
												ml={2}
												color={color?.black}
												opacity={70}
												fontSize={12}
											>
												Confirmed incident
											</Text>
										</View>
									</View>

									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<TouchableWithoutFeedback
											onPress={() => {
												shareAlert(item, "emergency");
											}}
										>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													// marginLeft: 10,
												}}
											>
												<MaterialCommunityIcons
													name="share-variant"
													color={"grey"}
													size={18}
												/>
												<Text
													mx={2}
													color={color?.black}
													opacity={70}
													fontSize={10}
												>
													SHARE
												</Text>
											</View>
										</TouchableWithoutFeedback>
									</View>
								</View>
							)}
						</View>
					</TouchableWithoutFeedback>
				</View>
			) : null}
		</>
	);
}

const styles = StyleSheet.create({
	row: { flexDirection: "row", alignItems: "center" },
	container: {},
});

export default AlertNotificationItems;

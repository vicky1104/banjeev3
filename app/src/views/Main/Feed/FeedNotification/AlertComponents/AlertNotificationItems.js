import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, {
	forwardRef,
	useCallback,
	useContext,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import {
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	VirtualizedList,
} from "react-native";
import { MainContext } from "../../../../../../context/MainContext";
import { AppContext } from "../../../../../Context/AppContext";
import { convertTime } from "../../../../../utils/util-func/convertTime";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { shareAlert } from "../../../../Other/ShareApp";
import color from "../../../../../constants/env/color";
import RenderTypeExoSkeleton from "../../NewFeedFlow/RenderTypeExoSkeleton";
import FeedCarousel from "../../NewFeedFlow/FeedCarousel";
import GetDistance from "../../../../../constants/components/GetDistance";

function AlertNotificationItems(
	{ itemData, openSheet, setBottomSheetData, emergency, ...rest },
	ref
) {
	const item = itemData?.contents ? itemData?.contents : itemData;

	const { navigate } = useNavigation();

	const { incidentCount, setAlertId, alertId } = useContext(MainContext);

	const { location } = useContext(AppContext);
	const carouserItemRef = useRef();

	const [commentCount, setCommentCount] = useState();
	const [incidentContextCount, setIncidentContextCount] = useState();

	useFocusEffect(
		useCallback(() => {
			setCommentCount(alertId?.[item?.id] | 0);
			setIncidentContextCount(incidentCount?.[item.id] | 0);
		}, [alertId, item, incidentCount])
	);

	const navigateFunc = () => {
		emergency
			? navigate("DetailEmergencyAlert", { alertId: item.id })
			: navigate("DetailAlert", { alertId: item.id });
	};

	useImperativeHandle(
		ref,
		() => ({
			itemRef: carouserItemRef.current,
		}),
		[carouserItemRef]
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
							setAlertId((pre) => ({ ...pre, [item.id]: item?.totalComments | 0 }));
							navigateFunc();
						}}
					>
						<View style={{ flex: 1 }}>
							<View style={styles.header}>
								<View style={styles.row}>
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
										: `${item?.createdByUser?.firstName} ${item?.createdByUser?.lastName}`}
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

					{item?.mediaArray?.length > 1 ? (
						<FeedCarousel
							item={{ ...item, mediaContent: item?.mediaArray }}
							// dotTypeInstagram={true}
						/>
					) : (
						<View
							style={{
								alignItems: "center",
								display: "flex",
								flex: 1,
								overflow: "hidden",
								// height: 350,
							}}
						>
							<RenderTypeExoSkeleton
								item={item?.mediaArray?.[0]}
								id={item?.id}
								ref={(ref) => {
									if (ref?.itemRef) {
										carouserItemRef.current = {
											...carouserItemRef.current,
											[item?.key]: ref?.itemRef,
										};
									}
								}}
							/>
						</View>
					)}

					<TouchableWithoutFeedback onPress={navigateFunc}>
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
									<View style={styles.row}>
										<TouchableWithoutFeedback
											onPress={() => {
												setAlertId((pre) => ({
													...pre,
													[item.id]: item.totalComments | 0,
												}));
												navigate("AlertComment", { alertId: item.id });
											}}
										>
											<View style={styles.row}>
												<Ionicons
													name="chatbubble-outline"
													color={"grey"}
													size={20}
												/>
												{
													<Text
														ml={2}
														color={color?.black}
														fontSize={10}
													>
														{commentCount ? commentCount : item.totalComments}
													</Text>
												}
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

										<View style={[styles.row, { marginLeft: 10 }]}>
											<Ionicons
												name="person-outline"
												size={18}
												color={"grey"}
											/>
											<Text
												ml={2}
												mr={1}
												color={color?.black}
												opacity={70}
												fontSize={14}
											>
												{incidentContextCount
													? incidentContextCount
													: item?.confirmIncidenceCount}
											</Text>

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

									<View style={styles.row}>
										<TouchableWithoutFeedback
											onPress={() => shareAlert(item, emergency ? "emergency" : "alert")}
										>
											<View style={styles.row}>
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
	header: {
		flexDirection: "row-reverse",
		alignItems: "center",
		justifyContent: "space-between",
	},
	container: {},
	feed: {
		aspectRatio: 1,
		width: Dimensions.get("screen").width - 10,
		alignSelf: "center",
		flex: 1,
		marginVertical: 10,
	},
});

export default AlertNotificationItems = forwardRef(AlertNotificationItems);

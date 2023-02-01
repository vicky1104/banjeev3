import {
	Entypo,
	Feather,
	Ionicons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
	StackActions,
	useIsFocused,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Text } from "native-base";
import React, {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	BackHandler,
	Dimensions,
	FlatList,
	Image,
	ImageBackground,
	Linking,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MainContext } from "../../../../context/MainContext";
import GetDistance from "../../../constants/components/GetDistance";
import { showToast } from "../../../constants/components/ShowToast";
import AppButton from "../../../constants/components/ui-component/AppButton";
import AppFabButton from "../../../constants/components/ui-component/AppFabButton";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import AppMenu from "../../../constants/components/ui-component/AppMenu";
import color from "../../../constants/env/color";
import { AppContext } from "../../../Context/AppContext";
import CallRtcEngine from "../../../Context/CallRtcEngine";
import { findBusinessByID } from "../../../helper/services/BusinessCategory";
import { CreateRoomService } from "../../../helper/services/RoomServices";
import {
	cloudinaryFeedUrl,
	darkMap,
	mapStandardStyle,
} from "../../../utils/util-func/constantExport";
import { shareBusiness } from "../../Other/ShareApp";

function DetailService(props) {
	const { setOptions, dispatch, navigate } = useNavigation();
	const [data, setData] = useState();
	const { params } = useRoute();
	const [visible, setVisible] = useState(true);

	const { profile, location } = React.useContext(AppContext);

	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine;

	const getOurLocation = useCallback(async () => {
		findBusinessByID(params.businessId)
			.then((res) => {
				setData(res);
				setVisible(false);
			})
			.catch((err) => console.warn(err));
	}, [params]);

	const focused = useIsFocused();

	useEffect(() => {
		getOurLocation();
		if (params?.deepLinking) {
			BackHandler.addEventListener("hardwareBackPress", () => {
				if (focused) {
					dispatch(StackActions.replace("Bottom"));
					return true;
				}
			});
		}

		return () => {
			BackHandler.removeEventListener("hardwareBackPress", () => false);
		};
	}, [getOurLocation, params, focused]);

	setOptions({
		headerTitle: data?.name,
	});
	async function navigateToMap() {
		const scheme = Platform.select({
			ios: "maps:0,0?q=",
			android: "geo:0,0?q=",
		});
		const latLng = `${data.geoLocation.coordinates[0]},${data.geoLocation.coordinates[1]}`;
		const label = data?.name;
		const url = Platform.select({
			ios: `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`,
		});

		Linking.openURL(url);
	}

	function callResurant() {
		let phoneNumber = "";

		if (Platform.OS === "android") {
			phoneNumber = "tel:${+1234567890}";
		} else {
			phoneNumber = "telprompt:${+1234567890}";
		}

		Linking.openURL(phoneNumber);
	}

	const handleClickAction = (oppUser, screenName, callType) => {
		CreateRoomService({
			userA: oppUser,
			userB: profile,
		})
			.then((res) => {
				if (_rtcEngine) {
					if (callType) {
						showToast("Can't place a new call while you're already in a call");
					} else {
						navigate(screenName, {
							item: {
								...oppUser,
								userId: oppUser.id,
								roomId: res.id,
								callType,
								initiator: true,
							},
						});
					}
				} else {
					navigate(
						screenName,
						callType
							? {
									...oppUser,
									userId: oppUser.id,
									roomId: res.id,
									callType,
									initiator: true,
							  }
							: {
									item: {
										...oppUser,
										userId: oppUser.id,
										roomId: res.id,
										callType,
										initiator: true,
									},
							  }
					);
				}
			})
			.catch((err) => console.error(err));
	};

	return (
		<View style={{ flex: 1, backgroundColor: color?.white }}>
			{visible ? (
				<AppLoading visible={visible} />
			) : (
				<ScrollView>
					<Image
						source={{ uri: cloudinaryFeedUrl(data?.logoURL, "image") }}
						style={{ height: 250, backgroundColor: color?.white }}
					/>

					<View
						style={{
							paddingVertical: 10,
							borderWidth: 1,
							borderRadius: 8,
							elevation: 5,
							backgroundColor: color.gradientWhite,
							marginTop: 10,
							width: "98%",
							borderColor: color.border,
							alignSelf: "center",
						}}
					>
						<View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
							<Text
								fontWeight={"bold"}
								fontSize={16}
								color={color?.black}
							>
								{data?.name.toUpperCase()}
							</Text>

							<Text
								my={2}
								opacity={70}
								color={color?.black}
							>
								{data?.categoryName}
							</Text>

							<Text
								opacity={70}
								color={color?.black}
							>
								{data.address}
							</Text>

							<View
								style={{ marginTop: 5, flexDirection: "row", alignItems: "center" }}
							>
								<MaterialCommunityIcons
									name="run"
									size={18}
									color={"grey"}
								/>
								<GetDistance
									lat1={location?.location?.latitude}
									lon1={location?.location?.longitude}
									lat2={data?.location?.coordinates[1]}
									lon2={data?.location?.coordinates[0]}
								/>
							</View>
						</View>

						{data?.createdBy !== profile?.systemUserId && (
							<View
								style={{
									borderTopWidth: 1,
									borderColor: color.border,
									marginVertical: 5,
								}}
							>
								<View
									style={{
										width: "70%",
										alignSelf: "center",
										marginTop: 10,
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<View style={{ alignItems: "center" }}>
										<AppFabButton
											style={{
												backgroundColor: "rgba(255,255,255,0.1)",
												borderRadius: 50,
											}}
											onPress={() =>
												handleClickAction(data.userObject, "OneToOneCall", "audio")
											}
											size={20}
											icon={
												<Feather
													name="phone-call"
													size={24}
													color="white"
												/>
											}
										/>
										<Text color={color.black}>Call</Text>
									</View>

									<View style={{ alignItems: "center" }}>
										<AppFabButton
											style={{
												backgroundColor: "rgba(255,255,255,0.1)",
												borderRadius: 50,
											}}
											onPress={() =>
												handleClickAction(data.userObject, "OneToOneCall", "video")
											}
											size={20}
											icon={
												<Feather
													name="video"
													size={24}
													color="white"
												/>
											}
										/>
										<Text color={color.black}>Video call</Text>
									</View>

									<View style={{ alignItems: "center" }}>
										<AppFabButton
											style={{
												backgroundColor: "rgba(255,255,255,0.1)",
												borderRadius: 50,
											}}
											onPress={() =>
												handleClickAction(data.userObject, "BanjeeUserChatScreen")
											}
											size={20}
											icon={
												<Ionicons
													name="ios-chatbubble-outline"
													size={24}
													color="white"
												/>
											}
										/>
										<Text color={color.black}>Chat</Text>
									</View>
								</View>
							</View>
						)}
					</View>

					{data?.imageUrls?.length > 0 && (
						<View
							style={{
								width: "98%",
								paddingVertical: 10,
								borderWidth: 1,
								borderRadius: 8,
								elevation: 5,
								backgroundColor: color.gradientWhite,
								marginTop: 10,

								borderColor: color.border,
								alignSelf: "center",
							}}
						>
							<Text
								fontSize={16}
								fontWeight={"medium"}
								style={{
									marginLeft: 10,
									color: color?.black,
									marginBottom: 10,
								}}
							>
								Photos
							</Text>

							<FlatList
								data={data.imageUrls}
								horizontal
								showsHorizontalScrollIndicator={false}
								keyExtractor={(e) => Math.random()}
								renderItem={({ item, index }) => (
									<Box
										style={{
											width: 100,
											borderRadius: 8,
											marginLeft: 10,
											marginRight: 5,
											overflow: "hidden",
											elevation: 5,
											shadowRadius: 8,
											shadowColor: "#470000",
											shadowOffset: { width: 0, height: 1 },
											shadowOpacity: 0.2,
											borderWidth: 1,
											borderColor: color?.gradientWhite,
										}}
									>
										<Image
											source={{ uri: cloudinaryFeedUrl(item, "image") }}
											style={{ height: 100, width: "100%" }}
										/>
									</Box>
								)}
							/>
						</View>
					)}

					<View
						style={{
							paddingVertical: 10,
							borderWidth: 1,
							borderRadius: 8,
							elevation: 5,
							backgroundColor: color.gradientWhite,
							marginTop: 10,
							width: "98%",
							paddingHorizontal: 10,
							borderColor: color.border,
							alignSelf: "center",
						}}
					>
						<Text
							fontWeight={"medium"}
							fontSize={16}
							color={color?.black}
						>
							About
						</Text>

						<Text
							style={{
								color: color?.black,
								textAlign: "justify",
								marginRight: 10,
								marginTop: 4,
							}}
						>
							{data?.description}
						</Text>
					</View>

					<View
						style={{
							paddingVertical: 10,
							borderWidth: 1,
							borderRadius: 8,
							elevation: 5,
							backgroundColor: color.gradientWhite,
							marginTop: 10,
							width: "98%",
							paddingHorizontal: 10,
							borderColor: color.border,
							alignSelf: "center",
							marginBottom: 30,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								width: "100%",
							}}
						>
							<Text
								fontWeight={"medium"}
								fontSize={16}
								color={color?.black}
							>
								Location
							</Text>
							<Text
								onPress={() => navigateToMap()}
								fontWeight={"medium"}
								fontSize={14}
								color={color?.black}
							>
								GET DIRECTION
							</Text>
						</View>

						<MapView
							mapType="hybrid"
							// liteMode={true}
							customMapStyle={darkMap}
							showsCompass={false}
							maxZoomLevel={20}
							initialRegion={{
								latitude: data.geoLocation.coordinates[0],
								longitude: data.geoLocation.coordinates[1],
								latitudeDelta: 0.001,
								longitudeDelta: 0.001,
							}}
							userLocationPriority="low"
							provider={PROVIDER_GOOGLE}
							onRegionChange={() => {}}
							style={{
								height: 200,
								width: "100%",
								alignSelf: "center",
								marginVertical: 10,
							}}
						>
							<Marker
								coordinate={{
									latitude: data.geoLocation.coordinates[0],
									longitude: data.geoLocation.coordinates[1],
								}}
							>
								<View style={{ alignItems: "center" }}>
									<Text
										fontWeight={"bold"}
										color={color?.black}
										fontSize={16}
									>
										{data?.name}
									</Text>
									<Entypo
										name="location-pin"
										size={40}
										color="red"
									/>
								</View>
							</Marker>
						</MapView>
						{/* <Text
							style={{
								color: color?.black,
								textAlign: "justify",
								marginRight: 10,
								marginTop: 4,
							}}
						>
							{data?.address}
						</Text> */}
					</View>
				</ScrollView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { paddingBottom: 80, position: "relative", flex: 1 },
});

export default DetailService;

{
	/* <Fragment>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={styles.container}>
							<Image
								source={{ uri: cloudinaryFeedUrl(data?.logoURL, "image") }}
								style={{ height: 250, backgroundColor: color?.white }}
							/>

							<View
								style={{
									width: "95%",
									alignSelf: "center",
									marginTop: 10,
									borderBottomWidth: 1,
									paddingBottom: 10,
									borderBottomColor: color?.gradientBlack,
								}}
							>
								<View
									style={{
										width: "100%",
										flexDirection: "row",
									}}
								>
									<View style={{ alignItems: "flex-start", width: "60%" }}>
										<Text
											fontWeight={"bold"}
											fontSize={16}
											color={color?.black}
										>
											{data?.name} ,Thaltej
										</Text>
										<Text
											style={{
												// width: "30%",
												marginTop: 4,
												marginBottom: 4,
												textAlign: "left",
												color: "grey",
											}}
										>
											{data.categoryName}
										</Text>
										<Text
											style={{
												// width: "30%",
												// marginTop: 4,
												marginBottom: 4,
												textAlign: "left",
												color: color?.black,
											}}
										>
											{data.address}
										</Text>
										<Text color={color?.black}>2.0 km away</Text>
									</View>

									<View style={{ width: "40%" }}>
										<View
											style={{
												width: "80%",
												flexDirection: "row",
												justifyContent: "flex-end",
												alignSelf: "flex-start",
											}}
										>
											<AppFabButton
												onPress={() => shareBusiness(data)}
												size={20}
												icon={
													<Entypo
														name="share"
														size={24}
														color={color?.black}
													/>
												}
											/>
										</View>

										<View
											style={{
												position: "absolute",
												right: -10,
												top: -4,
												// borderWidth: 1,
												borderRadius: 8,
											}}
										>
											<AppMenu
												iconSize={24}
												menuColor={color?.black}
												menuContent={[
													{
														icon: "flag",
														label: "Report Business",
														onPress: () => showToast("Business Reported"),
													},
												]}
											/>
										</View>
									</View>
								</View>
							</View>

							<View style={{ marginLeft: 10, marginTop: 10 }}>
								<Text
									fontWeight={"medium"}
									fontSize={16}
									color={color?.black}
								>
									About
								</Text>

								<Text
									style={{
										color: color?.black,
										textAlign: "justify",
										marginRight: 10,
										marginTop: 4,
									}}
								>
									{data?.description}
								</Text>
							</View>

							{data?.imageUrls?.length > 0 && (
								<View style={{ marginTop: 15 }}>
									<Text
										fontSize={16}
										fontWeight={"medium"}
										style={{
											marginLeft: 10,
											color: color?.black,
											marginBottom: 10,
										}}
									>
										Photos
									</Text>

									<FlatList
										data={data.imageUrls}
										horizontal
										showsHorizontalScrollIndicator={false}
										keyExtractor={(e) => Math.random()}
										renderItem={({ item, index }) => (
											<Box
												// key={i}
												style={{
													// height: 200,
													width: CARD_WIDTH,
													borderRadius: 8,
													// marginHorizontal: 10
													marginLeft: 10,
													marginRight: 5,
													overflow: "hidden",
													elevation: 5,
													shadowRadius: 8,
													shadowColor: "#470000",
													shadowOffset: { width: 0, height: 1 },
													shadowOpacity: 0.2,
													borderWidth: 1,
													borderColor: color?.gradientWhite,
													// paddingLeft: 10,
												}}
											>
												<Image
													source={{ uri: cloudinaryFeedUrl(item, "image") }}
													style={{ height: 200, width: "100%" }}
												/>
											</Box>
										)}
									/>
								</View>
							)}

							<View style={{ marginTop: 15 }}>
								<Text
									fontSize={16}
									fontWeight={"medium"}
									style={{
										marginLeft: 10,
										marginBottom: 10,
										color: color?.black,
									}}
								>
									Direction
								</Text>

								<MapView
									mapType="hybrid"
									// liteMode={true}
									customMapStyle={darkMap}
									showsCompass={false}
									maxZoomLevel={20}
									initialRegion={{
										latitude: data.geoLocation.coordinates[0],
										longitude: data.geoLocation.coordinates[1],
										latitudeDelta: 0.001,
										longitudeDelta: 0.001,
									}}
									userLocationPriority="low"
									provider={"google"}
									onRegionChange={() => {}}
									style={{
										height: 200,
										width: "95%",
										alignSelf: "center",
									}}
								>
									<Marker
										coordinate={{
											latitude: data.geoLocation.coordinates[0],
											longitude: data.geoLocation.coordinates[1],
										}}
									>
										<View style={{ alignItems: "center" }}>
											<Text
												fontWeight={"bold"}
												color={color?.black}
												fontSize={16}
											>
												{data?.name}
											</Text>
											<Entypo
												name="location-pin"
												size={40}
												color="red"
											/>
										</View>
									</Marker>
								</MapView>

								<AppButton
									onPress={() => navigateToMap()}
									title={"Get Direction"}
									style={{ width: 120, alignSelf: "center", marginTop: 20 }}
								/>
							</View>

							
						</View>
					</ScrollView>
					<LinearGradient
						style={{
							flexDirection: "row",
							height: 50,
							marginBottom: 10,
							alignItems: "center",
							width: "50%",
							alignSelf: "center",
							borderRadius: 30,
							marginTop: 10,
							position: "absolute",
							bottom: 0,
							justifyContent: "space-around",
							elevation: 5,
						}}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						colors={["rgba(237, 69, 100, 0.8 )", "rgba(169, 50, 148, 0.8)"]}
					>
						<AppFabButton
							// onPress={() => callResurant()}
							onPress={() =>
								handleClickAction(data.userObject, "OneToOneCall", "audio")
							}
							size={20}
							icon={
								<Feather
									name="phone-call"
									size={24}
									color="white"
								/>
							}
						/>

						<AppFabButton
							onPress={() =>
								handleClickAction(data.userObject, "OneToOneCall", "video")
							}
							size={20}
							icon={
								<Feather
									name="video"
									size={24}
									color="white"
								/>
							}
						/>

						<AppFabButton
							onPress={() =>
								handleClickAction(data.userObject, "BanjeeUserChatScreen")
							}
							size={20}
							icon={
								<Ionicons
									name="ios-chatbubble-outline"
									size={24}
									color="white"
								/>
							}
						/>
					</LinearGradient>
				</Fragment> */
}

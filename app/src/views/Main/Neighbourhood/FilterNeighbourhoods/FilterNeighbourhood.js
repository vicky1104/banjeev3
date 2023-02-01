import { useNavigation, useRoute } from "@react-navigation/native";
import { Avatar, Text } from "native-base";
import React, {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	Image,
	TouchableWithoutFeedback,
	Vibration,
	Alert,
} from "react-native";
import MapView, {
	Circle,
	Marker,
	Heatmap,
	PROVIDER_GOOGLE,
} from "react-native-maps";
import Carousel from "react-native-snap-carousel";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import { AppContext } from "../../../../Context/AppContext";
import { createAlertService } from "../../../../helper/services/CreateAlertService";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import RNLocation from "react-native-location";

import {
	alertIcons,
	cloudinaryFeedUrl,
	darkMap,
	listProfileUrl,
} from "../../../../utils/util-func/constantExport";
import MapAlertBottomSheet from "./MapAlertBottomSheet";
import {
	mapService,
	userALertLocationUpdateAlert,
} from "../../../../helper/services/SettingService";
import color from "../../../../constants/env/color";
import { FloatingAction } from "react-native-floating-action";
import CircularProgress from "react-native-circular-progress-indicator";
import { showToast } from "../../../../constants/components/ShowToast";
import SearchLocationInputComp from "../../Feed/CreateFeed/SearchLocationInputComp";
import AlertNotificationItems from "../../Feed/FeedNotification/AlertComponents/AlertNotificationItems";
import { copilot, CopilotStep, walkthroughable } from "react-native-copilot";
import { getLocalStorage } from "../../../../utils/Cache/TempStorage";
import copilotConfig from "../../../../constants/components/copilotConfig";

const CardRender = ({ children, color, ...rest }) => (
	<View
		style={[
			{
				borderWidth: 1,

				elevation: 3,
				shadowOffset: { width: 1, height: 1 },
				shadowOpacity: 0.4,
				shadowRadius: 3,
				borderColor: color?.border,
				backgroundColor: color?.gradientWhite,
				padding: 10,
				borderRadius: 25,
			},
			rest?.style,
		]}
	>
		{children}
	</View>
);

const FlexRender = ({ children, ...rest }) => (
	<View
		style={{
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-around",
			alignItems: "center",
		}}
	>
		{children}
	</View>
);

const CopilotView = walkthroughable(View);
function FilterNeighbourhood(props) {
	const { params } = useRoute();
	const [data, setData] = useState([]);
	const { location, neighbourhood, profile } = useContext(AppContext);
	const [visible, setVisible] = useState(true);
	const [bottomSheetData, setBottomSheetData] = useState();
	const [ourLoc, setOurLoc] = useState(location?.location);
	const [key, setKey] = useState("location");
	const [locationName, setLocationName] = useState("");
	const [disable, setDisable] = useState(false);
	const [page, setPage] = useState(0);
	const [isLast, setIsLast] = useState(0);
	const [currentLocation, setCurrentLocation] = useState();
	const { navigate } = useNavigation();
	const c = useRef();
	const mapRef = useRef();
	const rbSheet = useRef();

	function openSheet() {
		rbSheet.current.open();
	}

	const manageDataHandler = useCallback(
		({ lat, lon }) => {
			userALertLocationUpdateAlert({
				distance: 10,
				page,
				pageSize: 10,
				eventCode: ["NEW_ALERT"],
				point: {
					lon,
					lat,
				},
			})
				.then((res) => {
					setVisible(false);
					console.warn("visible false");
					setIsLast(res?.last);

					if (res && res.content.length > 0) {
						if (page === 0) {
							setData(
								res?.content?.filter(
									(ele) =>
										ele.eventCode !== "EMERGENCY" &&
										ele.eventCode !== "ADMIN_NOTIFICATION"
								)
							);
						} else {
							setData((pre) => [
								...pre,
								...res?.content?.filter(
									(ele) =>
										ele.eventCode !== "EMERGENCY" &&
										ele.eventCode !== "ADMIN_NOTIFICATION"
								),
							]);
						}
					}
				})
				.catch((err) => {
					console.error(err);
				});
		},
		[page]
	);

	const getOurLocation = useCallback(
		async (searchLat, searchLon, longitude, latitude) => {
			// let locationAsync = await Location.getCurrentPositionAsync({});
			// const { longitude, latitude } = currentLocation;

			console.warn(longitude, latitude, "vlongitude, latitudes");

			// const { longitude, latitude } = locationAsync.coords;

			if (searchLat && searchLon) {
				setOurLoc({
					longitude: searchLon,
					latitude: searchLat,
				});
			} else {
				setOurLoc({
					latitude,
					longitude,
				});
				const res = await mapService([longitude, latitude].reverse());
				setLocationName(res.data.results?.[0]?.formatted_address);
			}
			mapRef.current?.animateToRegion(
				{
					longitude: searchLon ? searchLon : longitude,
					latitude: searchLat ? searchLat : latitude,
					latitudeDelta: 0.001,
					longitudeDelta: 0.001,
				},
				1000
			);
			manageDataHandler({
				lon: searchLon ? searchLon : longitude,
				lat: searchLat ? searchLat : latitude,
			});
		},
		[manageDataHandler]
	);

	useEffect(() => {
		getLocalStorage("walkThrough3").then((res) => {
			if (!JSON.parse(res)) {
				if (props?.start) {
					props?.start();
				}
			}
		});
	}, []);

	useEffect(() => {
		// filterNHService({ cloudIds: [params?.cloudId] })

		RNLocation.getLatestLocation()
			.then((pos) => {
				const { longitude, latitude } = pos;

				setCurrentLocation({ longitude, latitude });
				getOurLocation(null, null, longitude, latitude);
			})
			.catch((err) => console.warn(err));
	}, [getOurLocation]);

	const [time, setTime] = useState(0);
	var timer = useRef();

	useEffect(() => {
		if (time > 3) {
			Vibration.cancel();
			clearInterval(timer.current);
			setTime(0);
			createAlertService({
				// cloudIds: [neighbourhood.cloudId],
				videoUrl: [],
				imageUrl: [],
				eventCode: "EMERGENCY",
				eventName: "EMERGENCY",
				location: {
					coordinates: [ourLoc?.longitude, ourLoc?.latitude],
					type: "Point",
				},
				metaInfo: { address: location?.address?.formatted_address },
				sendTo: "NEAR_BY_AND_EMERGENCY",
			})
				.then((res) => {
					setDisable(true);
					Alert.alert(
						"Help is on the way",
						"Nearby people and your emergency contact have been notified of your emergency",
						[{ text: "Ok" }]
					);
					setTimeout(() => {
						setDisable(false);
					}, 2000);
				})
				.catch((err) => console.warn(err));
		}
	}, [time, ourLoc, neighbourhood, location]);

	function btnPressIn(params) {
		Vibration.vibrate(4 * 1000);
		if (time <= 3) {
			timer.current = setInterval(() => {
				setTime((prev) => prev + 1);
			}, 1000);
		}
	}

	const actions = [
		{
			color: color.primary,
			text: "Emergency Contact",
			icon: require("../../../../../assets/alerticonset/emergency-call.png"),
			name: "EmergencyContact",
			position: 1,
			tintColor: color?.white,
		},
		{
			color: color.primary,
			text: "Create alert",
			icon: require("../../../../../assets/alerticonset/danger.png"),
			name: "SelectAlertLocation",
			// name: "ViewAlert",
			position: 2,
			tintColor: color?.white,
		},
		{
			color: color.primary,
			text: "History",
			icon: require("../../../../../assets/alerticonset/history.png"),
			name: "FeedNotification",
			position: 3,
			tintColor: color?.white,
		},
		{
			color: color.primary,
			text: "My Alerts",
			icon: require("../../../../../assets/alerticonset/history.png"),
			name: "MyAlerts",
			position: 3,
			tintColor: color?.white,
		},
	];

	function openSheet() {
		rbSheet.current.open();
	}
	function btnPressOut() {
		Vibration.cancel();
		if (time <= 3) {
			showToast("Hold button for 3 Second to send alerts to notify nearby people");
		}
		setTime(0);
		clearInterval(timer.current);
	}
	const handleSearch = (d) => {
		setVisible(true);
		setKey(d);
		setPage(0);
		setData([]);
		switch (d) {
			case "location":
			case "search":
				getOurLocation(
					null,
					null,
					currentLocation?.longitude,
					currentLocation?.latitude
				);
				break;
			case "neighbourhood":
				getOurLocation(
					neighbourhood?.payload?.geoLocation?.coordinates?.[1],
					neighbourhood?.payload?.geoLocation?.coordinates?.[0]
				);
				break;
			default:
				break;
		}
	};
	const renderSearchComponment = () => {
		switch (key) {
			case "search":
				return (
					<FlexRender>
						<CardRender color={color}>
							<MaterialIcons
								onPress={() => handleSearch("location")}
								name="gps-fixed"
								size={24}
								color="white"
							/>
						</CardRender>
						<CardRender>
							<MaterialIcons
								onPress={() => handleSearch("neighbourhood")}
								name="home"
								size={24}
								color="white"
							/>
						</CardRender>
						<SearchLocationInputComp
							containerStyle={{
								zIndex: 12,
								width: "70%",
								borderWidth: 1,
								flexDirection: "row",
								alignItems: "center",
								alignSelf: "center",
								borderRadius: 15,
								elevation: 3,
								shadowOffset: { width: 1, height: 1 },
								shadowOpacity: 0.4,
								shadowRadius: 3,
								borderColor: color?.border,
								backgroundColor: color?.gradientWhite,
							}}
							inputHeight={60}
							inputContainerStyle={{
								backgroundColor: color?.gradientWhite,
								borderRadius: 15,
							}}
							textInputProps={{
								placeholderTextColor: color?.black,
								placeholder: "Enter Search Location",
								autoCorrect: false,
								autoCapitalize: "none",
								style: {
									color: color?.black,
								},
							}}
							getData={(data) => {
								if (data?.geometry?.location) {
									const { lat, lng } = data.geometry.location;
									setData([]);
									getOurLocation(lat, lng);
									mapRef.current?.animateToRegion(
										{
											latitude: lat,
											longitude: lng,
											latitudeDelta: 0.001,
											longitudeDelta: 0.001,
										},
										1000
									);
								} else {
									setData([]);
									getOurLocation();
									// setOurLoc({
									// latitude: location.location.latitude,
									// longitude: location.location.longitude,
									// });
									console.warn("location.location.latitude", location.location.latitude);
									mapRef.current?.animateToRegion(
										{
											latitude: location.location.latitude,
											longitude: location.location.longitude,
											latitudeDelta: 0.001,
											longitudeDelta: 0.001,
										},
										1000
									);
								}
							}}
						/>
					</FlexRender>
				);

			case "neighbourhood":
				return (
					<FlexRender>
						<CardRender
							color={color}
							style={{
								padding: 10,
								borderRadius: 25,
							}}
						>
							<MaterialIcons
								onPress={() => handleSearch("location")}
								name="gps-fixed"
								size={24}
								color="white"
							/>
						</CardRender>
						<CardRender
							color={color}
							style={{
								zIndex: 12,
								paddingHorizontal: 20,
								paddingVertical: 10,
								flexDirection: "row",
								alignItems: "center",
								borderRadius: 15,
								alignSelf: "center",
							}}
						>
							<Avatar
								borderColor={color?.border}
								borderWidth={1}
								// backgroundColor={color?.primary}
								style={{
									height: 40,
									width: 40,
									borderRadius: 20,
									borderWidth: 1,
									borderColor: color?.border,
								}}
								source={{ uri: cloudinaryFeedUrl(params?.NHImage, "image") }}
							>
								{params?.cloudName?.[0]}
							</Avatar>
							<Text
								fontSize={16}
								fontWeight="medium"
								color={color?.black}
								ml={5}
							>
								{params?.cloudName}
							</Text>
						</CardRender>
						<CardRender color={color}>
							<MaterialIcons
								onPress={() => handleSearch("search")}
								name="search"
								size={24}
								color="white"
							/>
						</CardRender>
					</FlexRender>
				);
			case "location":
				return (
					<FlexRender>
						<CopilotStep
							order={1}
							text={"Alerts nearby in your location"}
							name={"Alerts nearby in your location"}
						>
							<CopilotView
								style={[
									{
										borderWidth: 1,

										elevation: 3,
										shadowOffset: { width: 1, height: 1 },
										shadowOpacity: 0.4,
										shadowRadius: 3,
										borderColor: color?.border,
										backgroundColor: color?.gradientWhite,
										padding: 10,
										borderRadius: 25,
										zIndex: 12,
										paddingHorizontal: 20,
										paddingVertical: 10,
										flexDirection: "row",
										alignItems: "center",
										width: "70%",
										alignSelf: "center",
										height: 60,
										borderRadius: 15,
									},
								]}
							>
								<Text
									numberOfLines={1}
									flexWrap={"wrap"}
									color={color?.black}
								>
									{locationName?.length > 0 ? locationName : "Your Location"}
								</Text>
							</CopilotView>
						</CopilotStep>

						<CopilotStep
							order={2}
							text={"Select your neighborhood to watch alerts in your neighborhood "}
							name={"Select your neighbourhood to watch alerts in your neighbourhood"}
						>
							<CopilotView
								style={[
									{
										borderWidth: 1,

										elevation: 3,
										shadowOffset: { width: 1, height: 1 },
										shadowOpacity: 0.4,
										shadowRadius: 3,
										borderColor: color?.border,
										backgroundColor: color?.gradientWhite,
										padding: 10,
										borderRadius: 25,
									},
								]}
							>
								<MaterialIcons
									onPress={() => handleSearch("neighbourhood")}
									name="home"
									size={24}
									color="white"
								/>
							</CopilotView>
						</CopilotStep>

						<CopilotStep
							order={3}
							text={"Search location to watch alerts in particular location"}
							name={"Search location to watch alerts in particular location"}
						>
							<CopilotView
								style={[
									{
										borderWidth: 1,

										elevation: 3,
										shadowOffset: { width: 1, height: 1 },
										shadowOpacity: 0.4,
										shadowRadius: 3,
										borderColor: color?.border,
										backgroundColor: color?.gradientWhite,
										padding: 10,
										borderRadius: 25,
									},
								]}
							>
								<MaterialIcons
									onPress={() => handleSearch("search")}
									name="search"
									size={24}
									color="white"
								/>
							</CopilotView>
						</CopilotStep>
					</FlexRender>
				);
			default:
				break;
		}
	};

	const onEndReached = () => {
		if (!isLast) {
			setPage((pre) => pre + 1);
		}
	};
	return (
		<>
			<AppLoading
				visible={visible}
				style={{ flex: 1 }}
			/>
			{/* <SafeAreaView> */}
			<View style={styles.container}>
				<Fragment>
					{time > 0 && (
						<View style={styles.timerBg}>
							<CircularProgress
								value={time}
								radius={120}
								duration={time > 0 ? 1000 : 0}
								progressValueColor={"#ecf0f1"}
								maxValue={3}
								title={"Emergency"}
								titleColor={"white"}
								titleStyle={{ fontWeight: "bold" }}
							/>
						</View>
					)}
					<CopilotStep
						order={6}
						text="View more options for Alerts"
						name="View more options for Alerts"
					>
						<CopilotView
							style={{
								zIndex: 1,
								position: "absolute",
								bottom: -12,
								height: 150,
								width: 100,
								right: -15,
							}}
						>
							<View style={{ zIndex: 1, position: "absolute", bottom: 0, right: 0 }}>
								<FloatingAction
									actionsPaddingTopBottom={5}
									// distanceToEdge={{ horizontal: 20 }}
									buttonSize={60}
									color={color.white}
									tintColor="white"
									actions={actions}
									onPressItem={(e) => {
										navigate(e);
									}}
								/>
							</View>
						</CopilotView>
					</CopilotStep>

					<CopilotStep
						order={5}
						text=" In case of an emergency, hold for 3sec "
						name=" In case of an emergency, hold for 3sec "
					>
						<CopilotView style={styles.alertView}>
							<TouchableWithoutFeedback
								style={{ padding: 20 }}
								delayPressIn={0}
								disabled={disable}
								onPressIn={() => {
									btnPressIn();
								}}
								onPressOut={() => {
									btnPressOut();
								}}
							>
								<View style={styles.alertView}>
									<View style={styles.alertBg}>
										<Text color={color.white}>Panic</Text>
									</View>
								</View>
							</TouchableWithoutFeedback>
						</CopilotView>
					</CopilotStep>
				</Fragment>
				<View
					style={{
						marginTop: 20,
						zIndex: 99,
						position: "absolute",
						top: -17,
						width: "100%",
						padding: 10,
						alignSelf: "center",
					}}
				>
					{renderSearchComponment()}
				</View>

				<MapView
					customMapStyle={darkMap}
					userInterfaceStyle={"dark"}
					// showsUserLocation={true}
					ref={mapRef}
					maxZoomLevel={20}
					initialRegion={{
						latitude: params?.latitude,
						longitude: params?.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
					userLocationPriority="low"
					provider={PROVIDER_GOOGLE}
					onRegionChange={() => {}}
					style={{
						height: "100%",
						width: "100%",
						alignSelf: "center",
					}}
				>
					<>
						{key === "location" && (
							<Marker
								coordinate={{
									latitude: ourLoc?.latitude,
									longitude: ourLoc?.longitude,
									latitudeDelta: 0.001,
									longitudeDelta: 0.001,
								}}
							>
								<Avatar
									style={{
										height: 30,
										width: 30,
										margin: 5,
										zIndex: 9999,
									}}
									source={{
										uri: listProfileUrl(profile?.systemUserId),
									}}
								>
									{profile?.firstName[0]}
								</Avatar>
							</Marker>
						)}
						<Marker
							coordinate={{
								latitude: params?.latitude,
								longitude: params?.longitude,
								latitudeDelta: 0.001,
								longitudeDelta: 0.001,
							}}
						>
							<Entypo
								name="home"
								size={30}
								color="red"
							/>
						</Marker>
						<Circle
							center={{ latitude: params?.latitude, longitude: params?.longitude }}
							radius={5000}
							strokeColor="#4F6D7A"
							strokeWidth={2}
							fillColor={"rgba(0,0,0,0.3)"}
						/>
						{data?.length > 0 && (
							<Heatmap
								points={data?.map((ele) => {
									return {
										latitude: ele?.location?.coordinates?.[1],
										longitude: ele?.location?.coordinates?.[0],
										weight: 1,
									};
								})}
								opacity={1}
								radius={20}
								maxIntensity={100}
								gradientSmoothing={10}
							/>
						)}
						{data.length > 0 &&
							data?.map((ele, i) => {
								const iconObj = alertIcons.filter((el) => ele?.eventName === el.name);
								return (
									<Marker
										onPress={() => {
											navigate("DetailAlert", { alertId: ele.id });
										}}
										key={i}
										tracksViewChanges={false}
										coordinate={{
											latitude: ele?.location?.coordinates?.[1],
											longitude: ele?.location?.coordinates?.[0],
											latitudeDelta: 1,
											longitudeDelta: 1,
										}}
									>
										<View
											style={{
												flexDirection: "row",
												borderWidth: 1,
												borderColor: color.border,
												backgroundColor: color.border,
												paddingVertical: 5,
												paddingHorizontal: 5,
												borderRadius: 16,
											}}
										>
											<Image
												source={iconObj[0]?.img}
												style={{ height: 16, width: 16 }}
												resizeMode={"cover"}
											/>
											<Text
												fontSize={10}
												textAlign={"center"}
												fontWeight={"medium"}
												color={"white"}
												ml={1}
											>
												{ele?.eventName}
											</Text>
										</View>
									</Marker>
								);
							})}
					</>
				</MapView>

				<View
					style={{
						position: "absolute",
						bottom: 90,
						alignSelf: "center",

						paddingHorizontal: 10,
						overflow: "hidden",
						alignItems: "center",
						// borderWidth: 1,
					}}
				>
					<Carousel
						ref={c}
						data={data}
						enableMomentum={true}
						enableSnap={true}
						onEndReachedThreshold={0.01}
						onEndReached={onEndReached}
						sliderWidth={Dimensions.get("screen").width}
						itemWidth={Dimensions.get("screen").width - 50}
						onSnapToItem={(index) => {
							mapRef.current.animateToRegion(
								{
									latitude: data?.[index].location.coordinates[1],
									longitude: data?.[index].location.coordinates[0],
									latitudeDelta: 0.01,
									longitudeDelta: 0.01,
								},
								1000
							);
						}}
						renderItem={({ item, index }) => {
							if (index === 0) {
								return (
									<CopilotStep
										order={4}
										text={"Alert"}
										name={"Alert"}
									>
										<CopilotView>
											<AlertNotificationItems
												color={color?.gradientWhite}
												itemData={item}
											/>
										</CopilotView>
									</CopilotStep>
								);
							} else {
								return (
									<AlertNotificationItems
										color={color?.gradientWhite}
										itemData={item}
									/>
								);
							}
						}}
						ListEmptyComponent={() => (
							<View
								style={{
									height: 100,
									width: Dimensions.get("screen").width - 50,
									alignSelf: "center",
									padding: 10,
									backgroundColor: color?.gradientWhite,
									borderRadius: 8,
									borderColor: color?.border,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Text color={color?.black}>No alerts in this neighbourhood...!</Text>
							</View>
						)}
					/>
				</View>
			</View>
			{/* </SafeAreaView> */}

			<MapAlertBottomSheet
				bottomSheetData={bottomSheetData}
				rbSheet={rbSheet}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", alignItems: "center" },
	timerBg: {
		zIndex: 2,
		height: "100%",
		width: "100%",
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
	},
	alertView: {
		zIndex: 3,
		bottom: 0,
		left: 0,
		height: 90,
		width: 90,
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
	},
	alertBg: {
		height: 60,
		width: 60,
		backgroundColor: "red",
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
		shadowColor: color.shadow,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
		// borderWidth: 1,
	},
	carousalView: {
		position: "absolute",
		bottom: 90,
		alignSelf: "center",
		width: "95%",
		paddingHorizontal: 10,
		overflow: "hidden",
		alignItems: "center",
		// borderWidth: 1,
	},
});

export default copilot(copilotConfig)(FilterNeighbourhood);

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
	Image,
	TouchableWithoutFeedback,
	Vibration,
	Alert as SysAlert,
	Dimensions,
} from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import {
	mapService,
	userALertLocationUpdateAlert,
} from "../../../../helper/services/SettingService";
import { AppContext } from "../../../../Context/AppContext";
import color from "../../../../constants/env/color";
import CircularProgress from "react-native-circular-progress-indicator";
import { Text } from "native-base";
import {
	alertIcons,
	darkMap,
	profileUrl,
} from "../../../../utils/util-func/constantExport";
import { showToast } from "../../../../constants/components/ShowToast";
import { createAlertService } from "../../../../helper/services/CreateAlertService";
import { FloatingAction } from "react-native-floating-action";
import Carousel from "react-native-snap-carousel";
import AlertNotificationItems from "../FeedNotification/AlertComponents/AlertNotificationItems";
import MapAlertBottomSheet from "../../Neighbourhood/FilterNeighbourhoods/MapAlertBottomSheet";
import SearchLocationInputComp from "../CreateFeed/SearchLocationInputComp";
import RNLocation from "react-native-location";

function Alert(props) {
	const { neighbourhood, profile, location } = useContext(AppContext);

	const { navigate } = useNavigation();

	const [alertUser, setAlertUser] = useState([]);
	const [ourLoc, setOurLoc] = useState(location?.location);
	const [bottomSheetData, setBottomSheetData] = useState();
	const [disable, setDisable] = useState(false);

	const c = useRef();
	const mapRef = useRef();
	const rbSheet = useRef();

	const getOurLocation = useCallback(
		async (searchLat, searchLon, longitude, latitude) => {
			// let locationAsync = await Location.getCurrentPositionAsync({});
			// const { longitude, latitude } = locationAsync.coords;

			if (searchLat) {
				setOurLoc({
					longitude: searchLon,
					latitude: searchLat,
				});
			} else {
				setOurLoc({
					latitude,
					longitude,
				});
			}

			userALertLocationUpdateAlert({
				distance: 10,
				eventCode: ["NEW_ALERT"],
				point: {
					lon: searchLon ? searchLon : longitude,
					lat: searchLat ? searchLat : latitude,
				},
			})
				.then((res) => setAlertUser(res?.content))
				.catch((err) => console.error(err));
		},
		[]
	);

	React.useEffect(() => {
		RNLocation.getLatestLocation()
			.then((pos) => {
				const { longitude, latitude } = pos;
				getOurLocation(null, null, longitude, latitude);
			})
			.catch((err) => console.warn(err));
	}, [getOurLocation]);

	const [time, setTime] = useState(0);
	var timer = useRef();

	useEffect(() => {
		if (time >= 3) {
			Vibration.cancel();
			clearInterval(timer.current);
			setTime(0);
			mapService([latitude, longitude])
				.then((address) => {
					createAlertService({
						// cloudIds: [neighbourhood.cloudId],
						anonymous: false,
						eventCode: "EMERGENCY",
						eventName: "EMERGENCY",
						location: {
							coordinates: [ourLoc.longitude, ourLoc.latitude],
							type: "Point",
						},
						metaInfo: { address: address.data.results[0]?.formatted_address },
						sendTo: "NEAR_BY_AND_EMERGENCY",
					})
						.then((res) => {
							setDisable(true);
							SysAlert.alert(
								"Help is on the way",
								"Nearby people and your emergency contact have been notified of your emergency",
								[{ text: "Ok" }]
							);
							setTimeout(() => {
								setDisable(false);
							}, 2000);
						})
						.catch((err) => {
							SysAlert.alert("Alert", err.message, [{ text: "Ok" }]);
							console.warn(err);
						});
				})
				.catch((err) => console.warn(err));
		}
	}, [time]);

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
			// showToast("Hold button for 3 Second to send alerts to notify nearby people");
		}
		setTime(0);
		clearInterval(timer.current);
	}
	return (
		<View style={styles.container}>
			<Fragment>
				{time > 0 && (
					<View style={styles.timerBg}>
						<CircularProgress
							value={time <= 3 ? time : 3}
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
				<View style={{ zIndex: 1, position: "absolute", bottom: -12, right: -15 }}>
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
							<Text color={color.white}>Alert</Text>
						</View>
					</View>
				</TouchableWithoutFeedback>

				<View
					style={{
						marginTop: 20,
						zIndex: 99,
						position: "absolute",
						top: 0,
						width: "95%",
						alignSelf: "center",
					}}
				>
					<SearchLocationInputComp
						textInputProps={{
							placeholderTextColor: color?.black,
							placeholder: "Enter Search Location",
							autoCorrect: false,
							autoCapitalize: "none",
							style: {
								color: color?.black,
								borderRadius: 50,
								width: "80%",
							},
						}}
						getData={(data) => {
							if (data?.geometry?.location) {
								const { lat, lng } = data.geometry.location;
								setAlertUser([]);
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
								setAlertUser([]);
								getOurLocation(
									location?.location?.latitude,
									location?.location?.longitude
								);
								// setOurLoc({
								// 	latitude: location.location.latitude,
								// 	longitude: location.location.longitude,
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
				</View>

				{ourLoc?.latitude && (
					<MapView
						mapType="hybrid"
						customMapStyle={darkMap}
						userInterfaceStyle={"dark"}
						// showsUserLocation={true}
						// liteMode={true}
						// showsCompass={true}
						// maxZoomLevel={20}

						initialRegion={{
							...ourLoc,
							latitudeDelta: 0.001,
							longitudeDelta: 0.001,
						}}
						// initialCamera={{
						// 	center: { ...ourLoc },

						// 	pitch: 0,
						// 	heading: 0,
						// 	altitude: 0,
						// 	zoom: 13,
						// }}
						ref={mapRef}
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
							<Circle
								center={ourLoc}
								radius={5000}
								strokeColor="#4F6D7A"
								strokeWidth={2}
								fillColor={"rgba(0,0,0,0.3)"}
							/>
							<Marker
								coordinate={ourLoc}
								tracksViewChanges={false}
								// title="hello"
								style={{ alignItems: "center", flex: 1 }}
							>
								<Image
									source={{
										uri: profileUrl(profile?.avtarUrl),
									}}
									style={{
										height: 50,
										width: 50,
										borderRadius: 25,
										borderWidth: 1,
										// shadowOffset: { width: 1, height: 1 },
										shadowOpacity: 0.4,
										shadowRadius: 3,
									}}
								/>
							</Marker>
							{alertUser.map((ele, index) => {
								const iconObj = alertIcons.filter((el) => ele.eventName === el.name);

								return (
									<Marker
										onPress={() => {
											setBottomSheetData(ele);
											openSheet();
										}}
										tracksViewChanges={false}
										key={index}
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
												paddingHorizontal: 10,
												borderRadius: 16,
											}}
										>
											<Image
												source={iconObj[0]?.img}
												style={{ height: 24, width: 24 }}
												resizeMode={"cover"}
											/>
											<Text
												fontSize={14}
												fontWeight={"medium"}
												ml={1}
											>
												{ele.eventName}
											</Text>
										</View>
									</Marker>
								);
							})}
						</>
					</MapView>
				)}
				<MapAlertBottomSheet
					bottomSheetData={bottomSheetData}
					rbSheet={rbSheet}
				/>
				{alertUser.length > 0 && (
					<View style={styles.carousalView}>
						<Carousel
							onSnapToItem={(item) => {
								mapRef.current?.animateToRegion(
									{
										latitude: alertUser?.[item].location.coordinates[1],
										longitude: alertUser?.[item].location.coordinates[0],
										latitudeDelta: 0.001,
										longitudeDelta: 0.001,
									},
									1000
								);
							}}
							windowSize={10}
							layout={"default"}
							ref={c}
							enableMomentum={true}
							data={alertUser}
							renderItem={({ item }) => {
								return (
									<AlertNotificationItems
										itemData={item}
										setBottomSheetData={setBottomSheetData}
										openSheet={openSheet}
									/>
								);
							}}
							sliderWidth={Dimensions.get("screen").width}
							itemWidth={Dimensions.get("screen").width - 50}
						/>
					</View>
				)}
			</Fragment>
		</View>
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

export default Alert;

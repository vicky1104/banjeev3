import {
	Animated,
	Dimensions,
	Linking,
	SafeAreaView,
	TouchableWithoutFeedback,
	View,
	Platform,
	Alert,
} from "react-native";
import React, { useCallback, useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationJson } from "./Navigation";
import { useNavigation } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import { AppContext } from "../Context/AppContext";
import EmergencyModal from "../views/Others/EmergencyModal";
import { Text } from "native-base";
import CallRtcEngine from "../Context/CallRtcEngine";
import { AuthNavJson } from "./Navigation/AuthNavJson";
import Constants from "expo-constants";
import IncomingCallModal from "../views/Call/OneToOneCall/Components/IncomingCallModal";
import usePermission from "../utils/hooks/usePermission";
import {
	getLocalStorage,
	getMyDefaultNeighbourhood,
	removeLocalStorage,
	setLocalStorage,
	setMyDefaultNeighbourhood,
} from "../utils/Cache/TempStorage";
import jwtDecode from "jwt-decode";
import {
	getUserProfile,
	mapService,
	userLocationUpdate,
} from "../helper/services/SettingService";
import { listMyNeighbourhood } from "../helper/services/ListOurNeighbourhood";
// import NotificationActionsHandler from "../notification/NotificationActionsHandler";
import * as Location from "expo-location";
import RNExitApp from "react-native-exit-app";
import RNLocation from "react-native-location";
import { memo } from "react";
import { MainContext } from "../../context/MainContext";
import { useQuery } from "react-query";

const Stack = createStackNavigator();

function NavigationView({}) {
	const { checkPermission } = usePermission();
	const { setModalData, setOpenPostModal } = useContext(MainContext);
	const _rtcEngine = React.useContext(CallRtcEngine)?._rtcEngine || false;
	const { dispatch, navigate } = useNavigation();
	const state = useNavigation();
	const {
		token,
		isLoaded,
		userData,
		profile,
		location,
		neighbourhood,
		emergency,
		activeCallTimer,
		callType,
		incomingCallModal,
		setNeighbourhood,
		setUserData,
		setProfile,
		setToken,
		setIsLoaded,
		setLocation,
	} = useContext(AppContext);
	const [timer, setTimer] = React.useState(activeCallTimer);
	const [isAccepted, setIsAccepted] = React.useState(false);
	var inverval_timer;

	/**
	 * React Qurey for Token Event
	 */

	useQuery(
		["token", token],
		async () => {
			if (token === "loading" || token === null) {
				let tokenData = await getLocalStorage("token");
				if (tokenData?.length > 5) {
					setToken(JSON.parse(tokenData));
					const jwtToken = jwtDecode(tokenData);
					setUserData(jwtToken);
				} else {
					setToken(JSON.parse(tokenData));
				}
			}
		},
		{
			enabled: !!token,
		}
	);

	useQuery(
		["locationAcceptance", token],
		async () => {
			if (token !== "loading" && token !== null) {
				if (Platform.OS === "android") {
					getLocalStorage("LOCATION_PERMISSION")
						.then((res) => {
							if (JSON.parse(res) !== "granted") {
								Alert.alert(
									"Location Required",
									"Banjee collects location data to find nearby Neighbourhood and activity (Neighbourhood watch) when the app is open or in use",
									[
										{
											text: "Deny",
											onPress: () =>
												Linking.openSettings().then((res) => {
													RNExitApp.exitApp();
												}),
										},
										{
											text: "Accept",
											onPress: () => {
												setIsAccepted(true);
											},
										},
									]
								);
							} else {
								setIsAccepted(true);
							}
						})
						.catch((err) => {
							Alert.alert(
								"Location Permission",
								"Banjee collects location data to find nearby Neighbourhood and activity (Neighbourhood watch) when the app is open or in use",
								[
									{
										text: "Deny",
										onPress: () =>
											Linking.openSettings().then((res) => {
												RNExitApp.exitApp();
											}),
									},
									{
										text: "Accept",
										onPress: () => {
											setIsAccepted(true);
										},
									},
								]
							);
						});
				}
			}
		},
		{
			enabled: !!token,
		}
	);

	useQuery(
		["locationPermission", userData],
		async () => {
			let p = await getLocalStorage("profile");
			if (p) {
				p = JSON.parse(p);
				setProfile(p);
				await setLocalStorage("profile", p);
			} else {
				p = await getUserProfile(userData.externalReferenceId, {});
				setProfile(p);
				await setLocalStorage("profile", p);
			}
			const result = await checkPermission("LOCATION");
			if (result === "granted") {
				await setLocalStorage("LOCATION_PERMISSION", "granted");

				Location.enableNetworkProviderAsync()
					.then(() => {
						if (userData) {
							RNLocation.getLatestLocation({ timeout: 2000 })
								.then((pos) => {
									const { longitude, latitude } = pos;

									mapService([latitude, longitude])
										.then((res) => {
											setLocation({
												location: { longitude, latitude },
												address: res.data.results[0],
											});
										})
										.catch((err) => {
											console.warn(JSON.stringify(err));
										});
								})
								.catch((err) => console.warn(err));
						}
					})
					.catch((err) => {
						RNExitApp.exitApp();
					});
			} else {
				navigate("IOSLocation");
			}
		},
		{
			enabled: !!userData,
		}
	);

	useQuery(
		["getneighbourhood", location],
		async () => {
			if (location) {
				Promise.all([
					await getMyDefaultNeighbourhood("neighbourhood"),
					await userLocationUpdate({
						lon: location.location.longitude,
						lat: location.location.latitude,
					}),
				]).then((res) => {
					if (res?.[0]) {
						setMyDefaultNeighbourhood("neighbourhood", JSON.parse(res?.[0])).then(
							(response) => {
								setNeighbourhood(JSON.parse(res?.[0]));
								if (isLoaded != "inSigin") {
									setIsLoaded(true);
								}
							}
						);
					} else {
						listMyNeighbourhood()
							.then(async (result) => {
								if (result.length > 0) {
									setMyDefaultNeighbourhood("neighbourhood", result?.[0]).then(
										(response) => {
											setNeighbourhood(result?.[0]);
											if (isLoaded != "inSigin") {
												setIsLoaded(true);
											}
										}
									);
								} else {
									setNeighbourhood(null);
									setTimeout(() => {
										if (isLoaded != "inSigin") {
											setIsLoaded(true);
										}
									}, 500);
								}
							})
							.catch((err) => console.warn(err));
					}
				});
			}
		},
		{
			enabled: !!location,
		}
	);

	/**
	 *
	 */

	useEffect(() => {
		removeLocalStorage("RtcEngine").then().catch();

		if (profile) {
			if (!profile?.firstName && !profile?.lastName) {
				navigate("UpdateName", { updateName: true });
			}
		}

		setTimer(activeCallTimer);
		if (activeCallTimer > 0) {
			inverval_timer = setInterval(function () {
				setTimer((prev) => prev + 1);
			}, 1000);
		} else {
			clearInterval(inverval_timer);
		}

		Linking.getInitialURL()
			.then((res) => {
				if (token !== "loading" && userData) {
					if (res) {
						let responseLength = res.split("/").length - 2;
						let responseId = res.split("/").length - 1;

						let path = res.split("/")[responseLength];
						let id = res.split("/")[responseId];

						checkNavigation(path, id, true, res);
					}
				}
			})
			.catch((err) => console.log(err));

		Linking?.addEventListener("url", ({ url: res }) => {
			console.warn("ressss", res);
			if (token !== "loading" && userData) {
				if (res) {
					let responseLength = res.split("/").length - 2;
					let responseId = res.split("/").length - 1;

					let path = res.split("/")[responseLength];
					let id = res.split("/")[responseId];
					checkNavigation(path, id, false, res);
				}
			} else {
				console.warn("no token present");
			}
		});

		return () => {};
	}, [token, activeCallTimer, checkNavigation, profile, dispatch]);

	const checkNavigation = useCallback(
		(path, id, openNewApp, url) => {
			setTimeout(() => {
				switch (path) {
					case "business":
						navigate("DetailService", {
							businessId: id,
							// deepLinking:openNewApp?true:false
						});
						SplashScreen.hide();
						break;

					case "blog":
						navigate("ViewBlog", {
							id: id,
						});
						SplashScreen.hide();
						break;

					case "alert":
						console.warn(url, "urllllll");

						let type = url.split("=").reverse()[0];

						switch (type) {
							case "alert":
								navigate("DetailAlert", { alertId: id });
								SplashScreen.hide();
								break;
							case "emergency":
								navigate("DetailEmergencyAlert", { alertId: id });
								SplashScreen.hide();
								break;

							default:
								break;
						}
						// navigate("ViewBlog", {
						// 	id: id,
						// });

						break;

					case "neighborhood":
						navigate("DetailNeighbourhood", {
							cloudId: id,
						});
						SplashScreen.hide();
						break;

					case "feed":
						setModalData({ feedID: id });
						setOpenPostModal(true);

						// navigate("SinglePost", {
						// 	feedId: id,
						// });
						SplashScreen.hide();
						break;
					default:
						break;
				}
			}, 2000);
		},
		[navigate, profile]
	);
	const formatTime = () => {
		const getSeconds = `0${parseInt(timer) % 60}`.slice(-2);
		const minutes = `${Math.floor(parseInt(timer) / 60)}`;
		const getMinutes = `0${minutes % 60}`.slice(-2);
		const getHours = `0${Math.floor(parseInt(timer) / 3600)}`.slice(-2);
		return getHours > 0
			? `${getHours} : ${getMinutes} : ${getSeconds}`
			: `${getMinutes} : ${getSeconds}`;
	};

	let activeScreen = state?.getCurrentRoute();

	return (
		<>
			{activeScreen?.name === "OneToOneCall" ||
			activeScreen?.name === "GroupCall" ||
			activeScreen?.name === "Broadcast"
				? null
				: _rtcEngine && (
						<TouchableWithoutFeedback
							onPress={() => {
								if (callType) {
									if (callType === "Group") {
										navigate("GroupCall", { fromFixedNotification: true });
									} else if (callType === "Broadcast") {
										navigate("Broadcast", { fromFixedNotification: true });
									} else {
										navigate("OneToOneCall", { fromFixedNotification: true });
									}
								}
							}}
						>
							<SafeAreaView
								style={{
									zIndex: 1500,
									height:
										Platform.OS === "ios" ? "auto" : Constants.statusBarHeight + 30,
									paddingTop: Constants.statusBarHeight + 2,
									backgroundColor: "rgba(60, 179, 113, 1)",
									width: Dimensions.get("screen").width,
								}}
							>
								<View
									style={{
										width: "100%",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										paddingHorizontal: 20,
										marginBottom: Platform.OS === "ios" ? 10 : 0,
										// position: "absolute",
									}}
								>
									<Text color="#FFF">Ongoing Call</Text>
									{callType !== "Group" && <Text color="#FFF">{formatTime()}</Text>}
								</View>
							</SafeAreaView>
						</TouchableWithoutFeedback>
				  )}

			{/* {registry && <NotificationActionsHandler />} */}
			<View
				style={{
					flex: 1,
					marginTop: _rtcEngine
						? activeScreen?.name === "OneToOneCall" ||
						  activeScreen?.name === "GroupCall" ||
						  activeScreen?.name === "Broadcast"
							? 0
							: -Constants.statusBarHeight
						: 0,
				}}
			>
				<Stack.Navigator
					screenOptions={{
						title: "",
						freezeOnBlur: true,
					}}
				>
					{(token === null &&
						!userData?.id &&
						!profile?.avtarUrl &&
						neighbourhood === "loading") ||
					isLoaded === false ||
					(isLoaded === "inSigin" && activeScreen?.name === "Login")
						? AuthNavJson.map((ele, index) => {
								return (
									<Stack.Screen
										{...ele}
										key={index}
									/>
								);
						  })
						: NavigationJson.map((ele, index) => {
								return (
									<Stack.Screen
										{...ele}
										key={index}
									/>
								);
						  })}
				</Stack.Navigator>
			</View>

			{emergency && emergency?.open && <EmergencyModal />}
			{incomingCallModal && incomingCallModal?.open && <IncomingCallModal />}
		</>
	);
}
export default memo(NavigationView);

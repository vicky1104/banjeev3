import { Skeleton, Text, VStack } from "native-base";
import React, {
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
	Dimensions,
} from "react-native";
import { AppContext } from "../../../../Context/AppContext";
import {
	cloudinaryFeedUrl,
	darkMap,
} from "../../../../utils/util-func/constantExport";
import { Foundation, Ionicons, Entypo } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import FastImage from "react-native-fast-image";
import MainPageStory from "./MainPageStory";
import { getLocalStorage } from "../../../../utils/Cache/TempStorage";
import { walkthroughable, CopilotStep } from "react-native-copilot";
import axios from "axios";
import color from "../../../../constants/env/color";
import { showToast } from "../../../../constants/components/ShowToast";
import { listMyNeighbourhood } from "../../../../helper/services/ListOurNeighbourhood";
import MainHeaderSkeleton from "../../../../constants/components/ui-component/Skeleton/MainHeaderSkeleton";

const CopilotView = walkthroughable(View);

function MainHeader({ data, refresh }) {
	const { profile: p, location } = useContext(AppContext);
	const [neighbourhood, setNeighbourhood] = useState();
	const mapRef = useRef();
	const { navigate } = useNavigation();
	const [weatherData, setWeatherData] = useState();
	const [toggleDegree, setToggleDegree] = useState(false);
	const [profile, setProfile] = useState(null);
	const [weatherLoader, setWeatherLoader] = useState(true);
	const [loader, setLoader] = useState(true);
	const [neighInfo, setNeighInfo] = useState(false);

	const joinedNH = useCallback(() => {
		listMyNeighbourhood()
			.then((res) => {
				setLoader(false);
				setNeighbourhood(res[0]);
			})
			.catch((err) => console.warn(err));
	}, []);

	useEffect(() => {
		joinedNH();
	}, [joinedNH]);

	const neighbourhoodApiCall = React.useCallback(() => {
		axios
			.get(
				`https://imydp54x0j.execute-api.eu-central-1.amazonaws.com/broadcast/status/${neighbourhood?.payload?.id}`
			)
			.then((res) => {
				setNeighInfo(res.data.data);
			})
			.catch((err) => console.error(err));
	}, [neighbourhood]);

	useEffect(() => {
		// joinedNH();
		getLocalStorage("profile").then((res) => {
			setProfile(JSON.parse(res));
		});
		neighbourhoodApiCall();

		let url = `https://api.weatherapi.com/v1/current.json?key=ccd4aaaca4444a178ab50745221012&q=${location?.location?.latitude},${location?.location?.longitude}&aqi=yes`;

		axios
			.get(url)
			.then((res) => {
				setWeatherLoader(false);
				setWeatherData(res.data);
			})
			.catch((err) => console.warn(err));
	}, [p, location, neighbourhoodApiCall]);

	useEffect(() => {
		if (refresh) {
			// joinedNH();
			neighbourhoodApiCall();
		}
	}, [refresh, neighbourhoodApiCall]);

	const emptyComponent = () => (
		<>
			{loader ? (
				<MainHeaderSkeleton />
			) : (
				<TouchableWithoutFeedback onPress={() => navigate("MyCloud")}>
					<View style={styles.emptyComponent}>
						<Text color={"#ffff"}>Click here to join your neighbourhood</Text>
					</View>
				</TouchableWithoutFeedback>
			)}
		</>
	);

	const navigateToMemberPage = () =>
		navigate("NeighbourhoodMember", {
			cloudId: neighbourhood?.cloudId,
			cloudName: neighbourhood?.payload?.name,
		});
	const navigateToDetailNHPage = () => {
		navigate("DetailNeighbourhood", {
			cloudId: neighbourhood?.cloudId,
			cloudName: neighbourhood?.payload?.name,
		});
	};

	const navigateToFilterNH = () => {
		navigate("FilterNeighbourhood", {
			latitude: neighbourhood?.payload?.geoLocation?.coordinates[1],
			longitude: neighbourhood?.payload?.geoLocation?.coordinates[0],
			cloudId: neighbourhood?.cloudId,
			cloudName: neighbourhood?.payload?.name,
			NHImage: neighbourhood?.payload?.imageUrl,
		});
	};

	const handleBroadcast = (data) => {
		axios
			.get(
				`https://imydp54x0j.execute-api.eu-central-1.amazonaws.com/broadcast/status/${data?.id}`
			)
			.then((res) => {
				console.warn(res);

				if (res.data.data) {
					navigate("Broadcast", {
						cloudId: data?.id || "",
						name: data?.name || "",
						imageUri: data?.imageUrl || "",
						memberId: p?.systemUserId || "",
						memberObj: {
							firstName: p.firstName,
							lastName: p.lastName,
							mobile: p.mobile,
							email: p.email,
						},
						isHost: false,
					});
				} else {
					if (neighbourhood?.role === "ADMIN") {
						navigate("Broadcast", {
							cloudId: data?.id || "",
							name: data?.name || "",
							imageUri: data?.imageUrl || "",
							memberId: p?.systemUserId || "",
							memberObj: {
								firstName: p.firstName,
								lastName: p.lastName,
								mobile: p.mobile,
								email: p.email,
							},
							isHost: true,
						});
					} else {
						showToast(
							"Neighbourhood group call is not live. You can join after admin make it live."
						);
					}
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};
	return (
		<View style={styles.container}>
			<View style={styles.welcomeView}>
				<View>
					<Text
						color={"white"}
						fontSize={16}
					>
						{" Welcome"}
					</Text>
					<Text
						fontSize={18}
						color={"white"}
					>
						{" "}
						{profile?.firstName} {profile?.lastName} 👋
					</Text>
				</View>

				<View style={{ marginRight: 20 }}>
					<CopilotStep
						text="Click to explore other neighborhoods"
						order={2}
						name="search"
					>
						<CopilotView
							style={{
								padding: 10,
								borderRadius: 25,
								backgroundColor: "#00000020",
							}}
						>
							<Ionicons
								onPress={() => {
									navigate("MyCloud");
								}}
								name="search"
								size={24}
								color={"#ffff"}
							/>
						</CopilotView>
					</CopilotStep>
				</View>
			</View>

			{neighbourhood ? (
				<View style={styles?.nhContainer}>
					<View style={styles.subView}>
						<View style={styles.imgView}>
							<View style={{ width: "57%", position: "relative" }}>
								<TouchableWithoutFeedback onPress={navigateToDetailNHPage}>
									<View>
										<FastImage
											resizeMode="cover"
											source={{
												uri: cloudinaryFeedUrl(
													neighbourhood?.payload?.imageUrl,
													"image",
													"4:3"
												),
											}}
											style={styles.img}
										/>
										<LinearGradient
											colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0)"].reverse()}
											style={styles.gradient}
											start={{ x: 0, y: 0 }}
											end={{ x: 0, y: 1 }}
										>
											<Text
												alignSelf={"center"}
												position={"absolute"}
												bottom={0}
												opacity={70}
												color={color.iosText}
											>
												Click to explore
											</Text>
										</LinearGradient>
									</View>
								</TouchableWithoutFeedback>

								<View style={styles.postMember}>
									<View style={{ width: "100%" }}>
										<Text
											color={"#ffff"}
											fontSize={18}
											mb={2}
											fontWeight={"bold"}
											numberOfLines={1}
										>
											{neighbourhood?.payload?.name}
										</Text>

										<View style={styles.postMemberView}>
											<TouchableWithoutFeedback onPress={navigateToMemberPage}>
												<View style={styles.row}>
													<Ionicons
														name="people"
														size={18}
														color={"#ffff"}
													/>
													<Text
														fontSize={14}
														color={"#ffff"}
														ml={1}
														opacity={70}
													>
														{neighbourhood?.payload?.totalMembers} Members
													</Text>
												</View>
											</TouchableWithoutFeedback>

											<View style={styles.row}>
												{neighbourhood?.role === "ADMIN" || neighInfo ? null : (
													<Foundation
														name="clipboard-notes"
														size={18}
														color={"#ffff"}
													/>
												)}
												<TouchableWithoutFeedback
													onPress={() => {
														if (neighbourhood?.role === "ADMIN" || neighInfo) {
															handleBroadcast(neighbourhood?.payload);
														} else {
															navigateToDetailNHPage();
														}
													}}
												>
													<Text
														color={"#ffff"}
														ml={1}
														fontSize={14}
														opacity={70}
													>
														{neighbourhood?.role === "ADMIN"
															? neighInfo
																? "Join Live"
																: "Start Live"
															: neighInfo
															? "Join Live"
															: `${neighbourhood?.payload?.totalPosts} Posts`}
													</Text>
												</TouchableWithoutFeedback>
											</View>
											{/* <View style={styles.row}>
												<Foundation
													name="clipboard-notes"
													size={18}
													color={"#ffff"}
												/>
												<Text
													color={"#ffff"}
													ml={1}
													fontSize={14}
													opacity={70}
												>
													{neighbourhood?.payload?.totalPosts} Posts
												</Text>
											</View> */}
										</View>
									</View>
								</View>
							</View>

							<View style={{ width: "40%" }}>
								{weatherLoader ? (
									<View style={styles.loadingWeather}>
										<Text
											color={color?.black}
											opacity={50}
										>
											Loading...
										</Text>
									</View>
								) : (
									// <AppLoading visible={true} />
									<View style={{ flex: 1, alignSelf: "center" }}>
										<View style={styles.weather}>
											<Image
												source={{
													uri: `https:${weatherData?.current?.condition?.icon}`,
												}}
												style={{ height: 50, width: 50 }}
											/>

											<View style={{ alignItems: "center" }}>
												<Text
													onPress={() => setToggleDegree(!toggleDegree)}
													fontSize={20}
													color={"green.300"}
													fontWeight="medium"
												>
													{toggleDegree
														? `${weatherData?.current?.temp_f}°F`
														: `${weatherData?.current?.temp_c}°C`}
												</Text>
												<Text color={color?.black}>
													{weatherData?.current?.condition?.text}
												</Text>
											</View>
										</View>
									</View>
								)}

								<TouchableWithoutFeedback onPress={navigateToFilterNH}>
									<View style={styles.mapView}>
										<View style={styles.clickMap} />
										{neighbourhood?.payload?.geoLocation?.coordinates[1] && (
											<MapView
												mapType="hybrid"
												customMapStyle={darkMap}
												userInterfaceStyle={"dark"}
												minZoomLevel={0}
												initialRegion={{
													latitude: neighbourhood?.payload?.geoLocation?.coordinates[1],
													longitude: neighbourhood?.payload?.geoLocation?.coordinates[0],
													latitudeDelta: 0.001,
													longitudeDelta: 0.001,
												}}
												// initialCamera={{
												// 	center: {
												// 		latitude: neighbourhood?.payload?.geoLocation?.coordinates[1],
												// 		longitude: neighbourhood?.payload?.geoLocation?.coordinates[0],
												// 	},

												// 	pitch: 0,
												// 	heading: 0,
												// 	altitude: 0,
												// 	zoom: 17,
												// }}
												ref={mapRef}
												userLocationPriority="low"
												provider={PROVIDER_GOOGLE}
												style={styles.map}
											>
												<Marker
													coordinate={{
														latitude: neighbourhood?.payload?.geoLocation?.coordinates[1],
														longitude: neighbourhood?.payload?.geoLocation?.coordinates[0],
														latitudeDelta: 0.001,
														longitudeDelta: 0.001,
													}}
												>
													<Entypo
														name="home"
														size={25}
														color="red"
													/>
												</Marker>
											</MapView>
										)}

										<LinearGradient
											colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0)"].reverse()}
											style={styles.gradientMap}
											start={{ x: 0, y: 0 }}
											end={{ x: 0, y: 1 }}
										>
											<Text
												alignSelf={"center"}
												position={"absolute"}
												bottom={0}
												opacity={70}
												color={color.iosText}
											>
												Click to watch
											</Text>
										</LinearGradient>
									</View>
								</TouchableWithoutFeedback>
							</View>
						</View>
					</View>
				</View>
			) : (
				<>{emptyComponent()}</>
			)}

			{data?.pages?.length > 0 && (
				<CopilotStep
					text="Click to explore near by alerts"
					order={6}
					name="Nearby alerts"
				>
					<CopilotView style={{ flex: 1 }}>
						<MainPageStory />
					</CopilotView>
				</CopilotStep>
			)}
		</View>
		// </LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "102%",
		marginTop: -3,
		alignSelf: "center",
		paddingBottom: 20,
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
		backgroundColor: color?.gradientWhite,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	subView: {
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	imgView: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
		bordrRadius: 8,
		overflow: "hidden",
	},
	img: { height: 150, width: "100%", borderRadius: 8 },
	welcomeView: {
		marginVertical: 10,
		marginLeft: 5,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	postMemberView: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		flexWrap: "wrap",
		justifyContent: "space-between",
		// marginBottom: 10,
	},
	emptyComponent: {
		height: 270,
		backgroundColor: "rgba(255,255,255,0.1)",
		marginBottom: 20,
		borderWidth: 1,
		padding: 5,
		borderRadius: 16,
		borderColor: "#ffffff90",
		width: Dimensions.get("screen").width - 10,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
	},
	nhContainer: {
		width: Dimensions.get("screen").width - 10,
		backgroundColor: "rgba(255,255,255,0.1)",
		borderWidth: 1,
		padding: 5,
		borderRadius: 16,
		borderColor: "#ffffff90",
		marginHorizontal: 15,
		alignSelf: "center",
	},
	exploreIcons: {
		paddingVertical: 10,
		paddingHorizontal: 5,
		borderRadius: 8,
		alignItems: "center",
		width: 90,
		height: 80,
	},
	exploreBtn: {
		borderWidth: 1,
		paddingRight: 10,
		paddingLeft: 20,
		paddingVertical: 8,
		borderColor: "#ffffff90",
		borderTopLeftRadius: 16,
		borderBottomLeftRadius: 16,
	},
	watchBtn: {
		marginLeft: 0,
		borderTopRightRadius: 16,
		borderBottomRightRadius: 16,
		borderWidth: 1,
		paddingRight: 20,
		paddingLeft: 10,
		paddingVertical: 8,
		borderColor: "#ffffff90",
	},
	iconImg: { height: 40, width: 40, borderRadius: 8, zIndex: 99 },
	gradient: {
		width: "100%",
		height: 70,
		zIndex: 9999,
		position: "absolute",
		bottom: 0,
		borderRadius: 8,
	},
	postMember: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 10,
	},
	loadingWeather: {
		height: 65,
		marginBottom: 10,
		width: "100%",
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		borderColor: color?.border,
	},
	weather: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		width: "100%",
		flex: 1,
	},
	mapView: {
		borderRadius: 16,
		overflow: "hidden",
		borderRadius: 8,
		alignSelf: "center",
		width: "100%",
		zIndex: 9,
		height: "65%",
	},
	clickMap: {
		position: "absolute",
		zIndex: 99999,
		top: 0,
		height: "100%",
		width: "100%",
	},
	gradientMap: {
		width: "100%",
		height: "50%",
		zIndex: 9999,
		position: "absolute",
		bottom: 0,
	},
	map: {
		height: "100%",
		width: "100%",
		borderRadius: 16,
		zIndex: -9999,
		alignSelf: "center",
	},
});

export default MainHeader;

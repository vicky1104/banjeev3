// import React, {
// 	useCallback,
// 	useEffect,
// 	useRef,
// 	useState,
// 	Fragment,
// 	useContext,
// } from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import MapView, { Marker } from "react-native-maps";
// import { StyleSheet, View } from "react-native";
// import * as Location from "expo-location";
// import { updateUser } from "../../../helper/services/SettingService";
// import { getUserProfileDataFunc } from "../../../helper/services/SplashService";
// // import { getAllUser } from "../../../helper/services/WelcomeService";
// import AppLoading from "../../../constants/components/ui-component/AppLoading";
// import AppFabButton from "../../../constants/components/ui-component/AppFabButton";
// import color from "../../../constants/env/color";
// import { Text } from "native-base";
// import {
// 	useFocusEffect,
// 	useIsFocused,
// 	useNavigation,
// } from "@react-navigation/native";
// import SearchMapLocation from "./MapComponents/SearchMapLocation";
// import { useDispatch, useSelector } from "react-redux";
// import { setMapData } from "../../../redux/store/action/mapAction";
// import RenderMarker from "./MapComponents/RenderMarker";
// import _ from "underscore";
// import { listProfileUrl } from "../../../utils/util-func/constantExport";
// import { Entypo } from "@expo/vector-icons";
// import FastImage from "react-native-fast-image";
// import { AppContext } from "../../../Context/AppContext";

// const initialRegion = {
// 	longitude: 40.7831,
// 	latitude: 73.9712,
// 	latitudeDelta: 0.001,
// 	longitudeDelta: 0.001,
// };

// export default function Map() {
// 	const mapRef = useRef(null);
// 	const markerRef = useRef(null);

// 	const dispatch = useDispatch();

// 	const [region, setRegion] = useState(initialRegion);

// 	const { navigate } = useNavigation();
// 	const {
// 		registry: { systemUserId: id },
// 	} = useContext(AppContext);

// 	const { userLocation: loc, searchData, banjeeUsers } = map;

// 	const userHandler = useCallback((data) => {
// 		updateUser(data, "PUT")
// 			.then((res) => {
// 				console.warn("updateUSER................");
// 			})
// 			.catch((err) => {
// 				console.warn(err);
// 			});
// 	}, []);

// 	const getUser = useCallback(
// 		(origin) => {
// 			const { longitude, latitude } = origin;
// 			console.warn("GetUser....");
// 			getUserProfileDataFunc(id)
// 				.then((res) => {
// 					if (res) {
// 						console.warn("response");
// 						userHandler({
// 							...res,
// 							currentLocation: { lat: latitude, lon: longitude },
// 						});
// 					} else {
// 						console.warn("NOresponse");

// 						userHandler({
// 							systemUserId: id,
// 							connections: [],
// 							pendingConnections: [],
// 							blockedList: [],
// 							currentLocation: { lat: latitude, lon: longitude },
// 						});
// 					}
// 				})
// 				.catch((err) => {
// 					console.warn(err);
// 				});
// 		},
// 		[userHandler, id]
// 	);

// 	// const listAllUser = useCallback((point) => {
// 	// 	getAllUser({
// 	// 		distance: "100",
// 	// 		point,
// 	// 		page: 0,
// 	// 		pageSize: 20,
// 	// 		blockedList: null,
// 	// 		connections: null,
// 	// 		pendingConnections: null,
// 	// 	})
// 	// 		.then((res) => {
// 	// 			dispatch(setMapData({ banjeeUsers: res.content }));
// 	// 		})
// 	// 		.catch((err) => {
// 	// 			console.warn(err);
// 	// 		});
// 	// }, []);

// 	const getLocation = useCallback(async () => {
// 		let locationAsync = await Location.getCurrentPositionAsync({});
// 		const { longitude, latitude } = locationAsync.coords;
// 		console.warn(longitude + " warn data" + latitude);
// 		const { latitudeDelta, longitudeDelta } = initialRegion;
// 		if (longitude && latitude) {
// 			dispatch(
// 				setMapData({
// 					userLocation: {
// 						longitude,
// 						latitude,
// 						latitudeDelta,
// 						longitudeDelta,
// 					},
// 				})
// 			);

// 			getUser({ longitude, latitude });

// 			let point = {};
// 			if (searchData.open) {
// 				point = {
// 					lat: searchData.loc.latitude,
// 					lon: searchData.loc.longitude,
// 				};
// 			} else {
// 				point = {
// 					lon: longitude,
// 					lat: latitude,
// 				};
// 			}
// 			console.log("point", point);
// 			setRegion({
// 				longitude,
// 				latitude,
// 				latitudeDelta,
// 				longitudeDelta,
// 			});
// 			// listAllUser(point);
// 		}
// 	}, [
// 		dispatch,
// 		initialRegion,
// 		//  listAllUser,
// 		getUser,
// 		searchData,
// 	]);

// 	useFocusEffect(
// 		useCallback(() => {
// 			getLocation();
// 			return () => {};
// 		}, [getLocation])
// 	);

// 	return (
// 		<Fragment>
// 			<AppFabButton
// 				style={{
// 					height: 60,
// 					zIndex: 1,
// 					position: "absolute",
// 					right: 10,
// 					bottom: 10,
// 					width: 60,
// 					borderRadius: 30,
// 					backgroundColor: color.primary,
// 					alignItems: "center",
// 					justifyContent: "center",
// 				}}
// 				size={24}
// 				onPress={() => navigate("ProfileCards")}
// 				icon={
// 					<FastImage
// 						source={require("../../../../assets/EditDrawerIcon/ic_explore.png")}
// 						style={{ height: 24, width: 24 }}
// 					/>
// 				}
// 			/>
// 			<AppFabButton
// 				onPress={() => {
// 					dispatch(setMapData({ refRBSheet: { open: true, screen: "Maps" } }));
// 				}}
// 				style={{ position: "absolute", top: 50, right: 10, zIndex: 1 }}
// 				size={30}
// 				icon={
// 					<MaterialCommunityIcons
// 						name="magnify"
// 						size={24}
// 						color={color.black}
// 					/>
// 				}
// 			/>
// 			<MapView mapType="hybrid"
// 				// liteMode={true}
// 				ref={mapRef}
// 				showsCompass={false}
// 				maxZoomLevel={13}
// 				region={region}
// 				userLocationPriority="low"
// 				provider={"google"}
// 				onRegionChange={() => {}}
// 				style={styles.map}
// 			>
// 				<View>
// 					{searchData && searchData.open ? (
// 						<MapView mapType="hybrid".Marker
// 							ref={markerRef}
// 							coordinate={{ ...searchData.loc }}
// 							style={{
// 								display: "flex",
// 								flexDirection: "column",
// 								alignItems: "center",
// 							}}
// 						>
// 							<View>
// 								<Text style={{ backgroundColor: "white" }}>
// 									{searchData.title}
// 								</Text>
// 								<Entypo name="location-pin" size={24} color="red" />
// 							</View>
// 						</MapView.Marker>
// 					) : (
// 						<MapView mapType="hybrid".Marker ref={markerRef} coordinate={{ ...loc }}>
// 							<FastImage
// 								style={{
// 									width: 50,
// 									height: 60,
// 								}}
// 								source={require("../../../../assets/EditDrawerIcon/ic_me.png")}
// 							/>
// 							<FastImage
// 								style={{
// 									width: 40,
// 									height: 40,
// 									position: "absolute",
// 									top: 4,
// 									left: 5,
// 									borderRadius: 50,
// 									zIndex: 1,
// 								}}
// 								source={{
// 									uri: listProfileUrl(id),
// 								}}
// 							/>
// 						</MapView.Marker>
// 					)}

// 					<RenderMarker />
// 				</View>
// 			</MapView>
// 			<AppFabButton
// 				size={30}
// 				onPress={() => {
// 					getLocation();
// 					dispatch(
// 						setMapData({
// 							searchData: {
// 								loc: {
// 									longitude: loc.longitude,
// 									latitude: loc.latitude,
// 									latitudeDelta: initialRegion.latitudeDelta,
// 									longitudeDelta: initialRegion.longitudeDelta,
// 								},
// 								open: false,
// 								title: "",
// 							},
// 						})
// 					);
// 				}}
// 				style={styles.mapIcon}
// 				icon={
// 					<FastImage
// 						style={{
// 							width: 40,
// 							height: 40,
// 						}}
// 						source={require("../../../../assets/EditDrawerIcon/ic_loc_center.png")}
// 					/>
// 				}
// 			/>
// 			<SearchMapLocation />
// 		</Fragment>
// 	);
// }
// const styles = StyleSheet.create({
// 	map: {
// 		width: "100%",
// 		height: "100%",
// 		position: "absolute",
// 		top: 0,
// 		left: 0,
// 	},
// 	mapIcon: {
// 		position: "absolute",
// 		bottom: 20,
// 		left: "43%",
// 		elevation: 0,
// 		shadowOffset: {
// 			height: 0,
// 			width: 0,
// 		},
// 	},
// });

import { View, Text } from "react-native";
import React from "react";

export default function Map() {
	return (
		<View>
			<Text>Map</Text>
		</View>
	);
}

import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { AppContext } from "../../../../Context/AppContext";
import { darkMap } from "../../../../utils/util-func/constantExport";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import color from "../../../../constants/env/color";
import RNLocation from "react-native-location";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import { mapService } from "../../../../helper/services/SettingService";

function SelectAlertLocation(props) {
	const { setLocation } = useContext(AppContext);
	const [loader, setLoader] = useState(true);
	const [currentLocation, setCurrentLocation] = useState();

	const { navigate } = useNavigation();

	useEffect(() => {
		RNLocation.getLatestLocation({ timeout: 2000 })
			.then((pos) => {
				const { longitude, latitude } = pos;
				mapService([latitude, longitude]).then((address) => {
					setLoader(false);
					setCurrentLocation({
						longitude,
						latitude,
						latitudeDelta: 0.001,
						longitudeDelta: 0.001,
					});
					setLocation({
						location: { longitude, latitude },
						address: address.data.results[0],
					});
				});
			})
			.catch((err) => console.warn(err));
	}, []);
	return (
		<>
			{loader ? (
				<AppLoading visible={true} />
			) : (
				<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
					<View
						style={{
							alignSelf: "center",
							width: "70%",
							justifyContent: "center",
							// justifyContent: "space-between",
							flexDirection: "row",
							position: "absolute",
							bottom: 20,
							zIndex: 11,
						}}
					>
						<AppButton
							style={{ width: 130 }}
							title={"Current location"}
							onPress={() => {
								navigate("ViewAlert", {
									alertLocation: currentLocation,
								});
							}}
						/>
					</View>

					<MapView
						mapType="hybrid"
						showsUserLocation={true}
						customMapStyle={darkMap}
						userInterfaceStyle={"dark"}
						// liteMode={true}
						// showsCompass={true}
						maxZoomLevel={22}
						// onPress={(e) => {
						// 	setCurrentLoc(e.nativeEvent.coordinate);
						// }}
						needsOffscreenAlphaCompositing={true}
						initialRegion={currentLocation}
						userLocationPriority="low"
						provider={PROVIDER_GOOGLE}
						// onRegionChange={(e) => {
						// 	// console.warn(e);
						// 	setCurrentLoc(e);
						// }}
						style={{
							height: "100%",
							width: "100%",
							alignSelf: "center",
						}}
					>
						<Marker
							draggable
							// onDragEnd={(e) => setCurrentLoc(e.nativeEvent.coordinate)}
							coordinate={currentLocation}
							tracksViewChanges={false}
							style={{ alignItems: "center", flex: 1 }}
						>
							<FontAwesome5
								name="map-pin"
								size={30}
								color={color?.black}
							/>
						</Marker>
					</MapView>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
});

export default SelectAlertLocation;

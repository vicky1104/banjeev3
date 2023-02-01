import React, { useCallback, useContext, useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { Text } from "native-base";
import color from "../../../../constants/env/color";
import { useNavigation } from "@react-navigation/native";
import { MainContext } from "../../../../../context/MainContext";
import { darkMap } from "../../../../utils/util-func/constantExport";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { AppContext } from "../../../../Context/AppContext";
import SearchLocationInputComp from "./SearchLocationInputComp";
import AppButton from "../../../../constants/components/ui-component/AppButton";

function SearchLocation(props) {
	const { createFeedData } = useContext(MainContext);
	const { setOptions, goBack } = useNavigation();
	const { location } = useContext(AppContext);

	const [ourLoc, setOurLoc] = useState(location?.location);
	const [locationName, setLocationName] = useState(
		location?.address?.address_components[0]?.short_name
	);

	const mapRef = useRef();

	const getOurLocation = useCallback(
		(searchLat, searchLon, searchName) => {
			if (searchLat) {
				setLocationName(searchName);
				setOurLoc({
					longitude: searchLon,
					latitude: searchLat,
				});
			} else {
				setLocationName(location?.address?.address_components[0]?.short_name);
				setOurLoc(location.location);
			}
		},
		[location]
	);

	React.useEffect(
		() =>
			setOptions({
				headerLeft: () => (
					<View
						style={{
							// marginTop: 30,
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-evenly",
							flex: 1,
							width: Dimensions.get("screen").width,
						}}
					>
						<MaterialIcons
							name="arrow-back"
							size={24}
							onPress={() => {
								createFeedData((pre) => ({ ...pre, locData: null }));
								goBack();
							}}
							color={color?.black}
						/>
						<SearchLocationInputComp
							textInputProps={{
								placeholderTextColor: "grey",
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
									const { name } = data;
									getOurLocation(lat, lng, name);

									mapRef.current.animateToRegion(
										{
											latitude: lat,
											longitude: lng,
											latitudeDelta: 0.001,
											longitudeDelta: 0.001,
										},
										1000
									);
								} else {
									getOurLocation();
									mapRef.current.animateToRegion(
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
						<MaterialIcons
							name="gps-fixed"
							size={24}
							onPress={() => {
								getOurLocation();

								mapRef.current.animateToRegion(
									{
										latitude: location.location.latitude,
										longitude: location.location.longitude,
										latitudeDelta: 0.001,
										longitudeDelta: 0.001,
									},
									1000
								);
							}}
							style={{ marginLeft: 5 }}
							color={color?.black}
						/>
					</View>
				),
			}),
		[]
	);
	return (
		<View style={{ flex: 1 }}>
			<MapView
				mapType="hybrid"
				onPress={(e) => {
					// setOurLoc({
					// 	latitude: e.nativeEvent.coordinate.latitude,
					// 	longitude: e.nativeEvent.coordinate.longitude,
					// });
				}}
				loadingIndicatorColor="red"
				customMapStyle={darkMap}
				userInterfaceStyle={"dark"}
				showsCompass={false}
				spiderLineColor={false}
				initialRegion={{
					...ourLoc,
					latitudeDelta: 0.001,
					longitudeDelta: 0.001,
				}}
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
				<Marker
					title={locationName}
					coordinate={ourLoc}
					tracksViewChanges={false}
					style={{ alignItems: "center", flex: 1 }}
				>
					<Entypo
						name="location-pin"
						size={35}
						color={color?.black}
					/>
					<Text
						color={color?.black}
						zIndex={99}
					>
						{locationName}
					</Text>
				</Marker>
			</MapView>
			<View
				style={{
					zIndex: 9,
					position: "absolute",
					bottom: 20,
					width: 120,
					alignSelf: "center",
				}}
			>
				<AppButton
					title={"Select"}
					onPress={() => {
						createFeedData((pre) => ({ ...pre, locData: { ourLoc, locationName } }));
						goBack();
					}}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		height: 70,

		zIndex: 0,
	},
});

export default SearchLocation;

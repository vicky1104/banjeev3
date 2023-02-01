import {
	useFocusEffect,
	useNavigation,
	useRoute,
} from "@react-navigation/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { AppContext } from "../../../../../Context/AppContext";

import RNLocation from "react-native-location";
import MapboxNavigation from "@harshpatel2125/react-native-mapbox-navigation";

function TrackDirection(props) {
	const [liveLocation, setLiveLocation] = useState();
	const { goBack } = useNavigation();
	const { location } = useContext(AppContext);
	const {
		params: { data },
	} = useRoute();

	useFocusEffect(
		useCallback(() => {
			RNLocation.getLatestLocation()
				.then((res) => {
					setLiveLocation({
						longitude: res.longitude,
						latitude: res.latitude,
					});
				})
				.catch((err) => console.warn(err));
			return () => {};
		}, [])
	);

	return (
		<View style={styles.container}>
			{liveLocation?.latitude && (
				<MapboxNavigation
					// origin={Object.values(location.location)}
					origin={Object.values(liveLocation)}
					destination={data?.location?.coordinates}
					// shouldSimulateRoute
					// hideStatusView
					showsEndOfRouteFeedback={false}
					onLocationChange={(event) => {
						const { latitude, longitude } = event.nativeEvent;
					}}
					onRouteProgressChange={(event) => {
						const {
							distanceTraveled,
							durationRemaining,
							fractionTraveled,
							distanceRemaining,
						} = event.nativeEvent;
					}}
					onError={(event) => {
						const { message } = event.nativeEvent;
					}}
					onCancelNavigation={() => {
						// User tapped the "X" cancel button in the nav UI
						// or canceled via the OS system tray on android.
						// Do whatever you need to here.
						// setModalVisible(false);
						goBack();
					}}
					onArrive={() => {
						// Called when you arrive at the destination.
						alert("You have reached");
					}}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, marginTop: Constants.statusBarHeight },
});

export default TrackDirection;

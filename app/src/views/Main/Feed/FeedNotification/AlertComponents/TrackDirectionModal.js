import { Modal, Text } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import { View, StyleSheet, Alert, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
import color from "../../../../../constants/env/color";
import RNLocation from "react-native-location";
import MapboxNavigation from "@harshpatel2125/react-native-mapbox-navigation";

function TrackDirectionModal({ setModalVisible, modalVisible, data }) {
	const [liveLocation, setLiveLocation] = useState();

	console.warn(data);

	useEffect(() => {
		// setInterval(() => {
		// console.warn("called");
		if (modalVisible) {
			RNLocation.getLatestLocation()
				.then((pos) => {
					const { longitude, latitude } = pos;

					setLiveLocation({
						longitude,
						latitude,
					});
				})
				.catch((err) => console.warn(err));
		}
		// }, 1000);
	}, [modalVisible]);

	// 23.05296890569825 72.50387170985722  enableHighAccuracy: false
	// 23.05882336 72.51905678 enableHighAccuracy: true
	// 23.0498357,	 72.50143, new package
	return (
		<Modal
			animationPreset="slide"
			closeOnOverlayClick={false}
			isOpen={modalVisible}
			onClose={() => setModalVisible(!modalVisible)}
			size={"full"}
			backdropVisible={true}
		>
			<Modal.Content
				justifyContent={"flex-end"}
				style={styles.content}
				minH={Dimensions.get("screen").height - Constants.statusBarHeight}
				maxH={Dimensions.get("screen").height - Constants.statusBarHeight}
			>
				<Modal.Body padding={0}>
					<View
						style={{
							flex: 1,
							height: Dimensions.get("screen").height - Constants.statusBarHeight,
						}}
					>
						{liveLocation && (
							<MapboxNavigation
								origin={Object.values(liveLocation)}
								destination={data?.location?.coordinates}
								// shouldSimulateRoute
								// hideStatusView
								// showsEndOfRouteFeedback
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
									setModalVisible(false);
								}}
								onArrive={() => {
									// Called when you arrive at the destination.
									alert("You have reached");
								}}
							/>
						)}
					</View>
				</Modal.Body>
			</Modal.Content>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {},
	content: {
		marginBottom: 0,
		marginTop: "auto",
		backgroundColor: color?.gradientWhite,
	},
});

export default TrackDirectionModal;

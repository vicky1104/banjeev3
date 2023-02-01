import { Text } from "native-base";
import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import color from "../../../constants/env/color";
import OtherRoom from "./OtherRoom";
import Room from "./Room";

function Rooms(props) {
	const [room, setRoom] = React.useState(false);
	const [otherRoom, setOtherRoom] = React.useState(true);

	// function onSwipeLeft() {
	// 	console.log("you swiped left");
	// 	setOtherRoom(false), setRoom(true);
	// }

	// function onSwipeRight() {
	// 	console.log("you swiped right");
	// 	setRoom(false), setOtherRoom(true);
	// }

	const styles = StyleSheet.create({
		container: {
			width: "100%",
			height: 50,
			backgroundColor: "white",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-around",
			paddingBottom: 10,
			zIndex: 3,
		},
		roomStyle: {
			width: "40%",
			alignItems: "center",
			justifyContent: "center",
			borderBottomWidth: room ? 2 : 0,
			borderColor: Room ? color.primary : "white",
			height: "100%",
		},
		otherRoomStyle: {
			borderBottomWidth: otherRoom ? 2 : 0,
			borderColor: otherRoom ? color.primary : "white",
			width: "40%",
			alignItems: "center",
			justifyContent: "center",
			height: "100%",
		},
	});

	const config = {
		needVerticalScroll: true,
		velocityThreshold: 0.5,
		directionalOffsetThreshold: 80,
	};

	return (
		// <GestureRecognizer
		// 	// onSwipe={(direction, state) => onSwipe(direction, gestureName)}
		// 	onSwipeLeft={(gestureName) => onSwipeLeft(gestureName)}
		// 	onSwipeRight={(gestureName) => onSwipeRight(gestureName)}
		// 	config={config}
		// 	style={{ flex: 1 }}
		// >
		<View style={{ flex: 1 }}>
			<View style={styles.container}>
				{/* `````````````````````````` OTHER ROOM */}

				<TouchableWithoutFeedback
					onPress={() => {
						setOtherRoom(true), setRoom(false);
					}}
				>
					<View style={styles.otherRoomStyle}>
						<Text
							style={{
								fontWeight: "bold",
								color: otherRoom ? color.black : color.greyText,
							}}
							onPress={() => {
								setOtherRoom(true), setRoom(false);
							}}
						>
							All Rooms
						</Text>
					</View>
				</TouchableWithoutFeedback>

				{/* ````````````````````ROOM */}

				<TouchableWithoutFeedback
					onPress={() => {
						setRoom(true), setOtherRoom(false);
					}}
				>
					<View style={styles.roomStyle}>
						<Text
							style={{
								fontWeight: "bold",
								color: room ? color.black : color.greyText,
							}}
							onPress={() => {
								setRoom(true), setOtherRoom(false);
							}}
						>
							My Room
						</Text>
					</View>
				</TouchableWithoutFeedback>
			</View>

			{room && <Room />}
			{otherRoom && <OtherRoom />}
			{/* {otherRoom && <OtherRoom onSwipeRight={onSwipeRight} />} */}
		</View>
		// </GestureRecognizer>
	);
}

export default Rooms;

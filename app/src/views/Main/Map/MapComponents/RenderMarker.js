// import { useNavigation } from "@react-navigation/native";
// import React, { Fragment, useRef } from "react";
// import { View } from "react-native";
// import FastImage from "react-native-fast-image";
// import { Marker } from "react-native-maps";
// import { useSelector } from "react-redux";
// import {
// 	listProfileUrl,
// 	profileUrl,
// } from "../../../../utils/util-func/constantExport";

// export default function RenderMarker() {
// 	const { navigate } = useNavigation();
// 	const {
// 		registry: { systemUserId: mySysId },
// 		map,
// 	} = useSelector((state) => state);

// 	const { banjeeUsers } = map;
// 	console.log("banjee users", banjeeUsers);
// 	return (
// 		<Fragment>
// 			{banjeeUsers?.length > 0 &&
// 				banjeeUsers.map((user, i) => {
// 					const {
// 						id: banjeeId,
// 						age,
// 						online,
// 						avtarUrl,
// 						existsInContact,
// 						name,
// 						gender,
// 						systemUserId,
// 						email,
// 						userObject: { mobile },
// 						currentLocation: { lon: longitude, lat: latitude },
// 					} = user;
// 					return (
// 						<Fragment
// 							key={Math.random()}
// 							// style={{
// 							// 	display: "flex",
// 							// 	position: "relative",
// 							// 	justifyContent: "center",
// 							// 	alignItems: "center",
// 							// 	zIndex: 99999,
// 							// }}
// 						>
// 							{mySysId !== systemUserId && !existsInContact ? (
// 								<Marker
// 									onPress={() =>
// 										navigate("ProfileCards", {
// 											userLocation: {
// 												userLatitude: latitude,
// 												userLongitude: longitude,
// 											},
// 										})
// 									}
// 									key={Math.random()}
// 									coordinate={{
// 										longitude,
// 										latitude,
// 										latitudeDelta: 1,
// 										longitudeDelta: 1,
// 									}}
// 								>
// 									<FastImage
// 										style={{
// 											width: 40,
// 											height: 60,
// 											top: 0,
// 											left: 0,
// 											zIndex: 99999,
// 										}}
// 										source={require("../../../../../assets/EditDrawerIcon/ic_map_blue.png")}
// 									/>
// 									<FastImage
// 										style={{
// 											width: 33,
// 											height: 33,
// 											position: "absolute",
// 											top: 1,
// 											left: 4,
// 											borderRadius: 50,
// 											zIndex: 1,
// 										}}
// 										source={{
// 											uri: profileUrl(avtarUrl),
// 										}}
// 									/>
// 								</Marker>
// 							) : mySysId === systemUserId ? null : (
// 								<Marker
// 									onPress={() =>
// 										navigate("BanjeeProfile", {
// 											item: {
// 												age: age,
// 												avtarUrl: avtarUrl,
// 												birthDate: "",
// 												chatroomId: "",
// 												connectedUserOnline: online,
// 												domain: null,
// 												email: email,
// 												firstName: name,
// 												gender: gender,
// 												id: systemUserId,
// 												lastName: null,
// 												locale: null,
// 												mcc: null,
// 												mobile: mobile,
// 												name: null,
// 												realm: null,
// 												ssid: null,
// 												systemUserId: systemUserId,
// 												timeZoneId: null,
// 												userId: banjeeId,
// 												// userId: "6257f7879e27bd1e9593dda5", jigabhai ka userId hey
// 												userLastSeen: null,
// 												username: null,
// 											},
// 										})
// 									}
// 									key={Math.random()}
// 									coordinate={{
// 										longitude,
// 										latitude,
// 										latitudeDelta: 1,
// 										longitudeDelta: 1,
// 									}}
// 								>
// 									<FastImage
// 										style={{
// 											width: 40,
// 											height: 60,
// 											top: 0,
// 											left: 0,
// 											zIndex: 99999,
// 										}}
// 										source={require("../../../../../assets/EditDrawerIcon/ic_map_yellow.png")}
// 									/>
// 									<FastImage
// 										style={{
// 											width: 33,
// 											height: 33,
// 											position: "absolute",
// 											top: 1,
// 											left: 4,
// 											borderRadius: 50,
// 											zIndex: 1,
// 										}}
// 										source={{
// 											uri: profileUrl(avtarUrl),
// 										}}
// 									/>
// 								</Marker>
// 							)}
// 						</Fragment>
// 					);
// 				})}
// 		</Fragment>
// 	);
// }

import { View, Text } from "react-native";
import React from "react";

export default function RenderMarker() {
	return (
		<View>
			<Text>RenderMarker</Text>
		</View>
	);
}

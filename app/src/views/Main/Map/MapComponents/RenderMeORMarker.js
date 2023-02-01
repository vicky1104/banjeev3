import { Text } from "native-base";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { Marker } from "react-native-maps";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import { Entypo } from "@expo/vector-icons";
export default function RenderMeORMarker() {
	const { searchData, userLocation: loc } = useSelector((state) => state.map);

	if (searchData.open) {
		return (
			<Marker
				coordinate={{ ...searchData.loc }}
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Text style={{ backgroundColor: "white" }}>{searchData.title}</Text>
				<Entypo
					name="location-pin"
					size={24}
					color="red"
				/>
			</Marker>
		);
	} else {
		return (
			<Marker coordinate={{ ...loc }}>
				<FastImage
					style={{
						width: 50,
						height: 60,
					}}
					source={require("../../../../../assets/EditDrawerIcon/ic_me.png")}
				/>
				<FastImage
					style={{
						width: 40,
						height: 40,
						position: "absolute",
						top: 4,
						left: 5,
						borderRadius: 50,
						zIndex: 1,
					}}
					source={{
						uri: listProfileUrl(rtegistry?.systemUserId),
					}}
				/>
			</Marker>
		);
	}
}

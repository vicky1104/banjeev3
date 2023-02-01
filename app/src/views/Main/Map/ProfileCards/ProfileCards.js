import React from "react";

import { LinearGradient } from "expo-linear-gradient";

import { useRoute } from "@react-navigation/native";
import SwipeAnimation from "./SwipeAnimation";

function ProfileCards() {
	const [userLocation, setUserLocation] = React.useState(false);

	const { params } = useRoute();
	React.useEffect(() => {
		if (params) {
			setUserLocation(params?.userLocation);
		}
	}, [params]);

	return (
		<React.Fragment>
			<LinearGradient
				style={{ flex: 1 }}
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 0 }}
				colors={["#ED475C", "#A93294"]}
			>
				<SwipeAnimation userLocation={userLocation} />
			</LinearGradient>
		</React.Fragment>
	);
}

export default ProfileCards;

import { View } from "react-native";
import React, { useState, useEffect, forwardRef } from "react";
import { travelDistance } from "../../utils/util-func/constantExport";
import { Text } from "native-base";
import color from "../env/color";
import { useImperativeHandle } from "react";

function GetDistance({ lat1, lon1, lat2, lon2 }, ref) {
	const [distance, setDistance] = useState();

	useImperativeHandle(
		ref,
		() => ({
			current: distance,
		}),
		[distance]
	);

	useEffect(() => {
		if (lat1 && lon1 && lat2 && lon2) {
			travelDistance(lat1, lon1, lat2, lon2)
				.then((res) => {
					setDistance(res);
				})
				.catch((err) => console.warn(err));
		}

		return () => {};
	}, [lat1, lon1, lat2, lon2]);

	return (
		<View>
			{distance?.text && (
				<Text
					fontSize={12}
					color={color?.black}
					opacity={70}
				>
					{`${(distance.value / 1000).toFixed(
						distance.value / 1000 > 1 ? 2 : 3
					)}km away`}

				</Text>
			)}
		</View>
	);
}

export default GetDistance = forwardRef(GetDistance);

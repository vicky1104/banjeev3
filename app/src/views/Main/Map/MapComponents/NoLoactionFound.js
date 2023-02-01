import { Text } from "native-base";
import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import FastImage from "react-native-fast-image";
import { useDispatch } from "react-redux";
import AppBorderButton from "../../../../constants/components/ui-component/AppBorderButton";
import color from "../../../../constants/env/color";
import { setMapData } from "../../../../redux/store/action/mapAction";
import SearchMapLocation from "./SearchMapLocation";

function NoLoactionFound() {
	const dispatch = useDispatch();
	return (
		<React.Fragment>
			<View
				style={{
					height: "100%",
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text
					fontSize={30}
					style={{
						height: 100,
						textAlign: "center",
						color: color.white,
					}}
				>
					Oops !!
				</Text>

				<View
					style={{
						height: 200,
						width: 200,
						backgroundColor: color.white,
						borderRadius: 100,
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
					}}
				>
					<View
						style={{
							position: "absolute",
							top: -20,
							right: 20,
							backgroundColor: color.white,
							height: 26,
							width: 26,
							borderRadius: 13,
						}}
					/>
					<FastImage
						source={require("../../../../../assets/EditDrawerIcon/dog.png")}
						style={{ width: 144, height: 148 }}
					/>
					<View
						style={{
							position: "absolute",
							bottom: 0,
							left: 20,
							backgroundColor: color.white,
							height: 17,
							width: 17,
							borderRadius: 8,
						}}
					/>
				</View>

				<View style={{ width: "80%", padding: 20 }}>
					<Text style={{ textAlign: "center", color: color.white }}>
						There are no more banjees available at this location!
					</Text>
					<Text
						style={{
							textAlign: "center",
							color: color.white,
							marginTop: 20,
						}}
					>
						Please select different locations to explore more.
					</Text>
				</View>
				<View style={{ alignSelf: "center" }}>
					<AppBorderButton
						width={194}
						title="Search more Locations"
						onPress={() =>
							dispatch(setMapData({ refRBSheet: { open: true, screen: "Cards" } }))
						}
					/>
				</View>
			</View>

			<SearchMapLocation />
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default NoLoactionFound;

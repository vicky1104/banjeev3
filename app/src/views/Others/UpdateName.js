import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, Text } from "native-base";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../../constants/components/ui-component/AppButton";
import color from "../../constants/env/color";
import { setLocalStorage } from "../../utils/Cache/TempStorage";

function UpdateName(props) {
	const { params } = useRoute();
	const { navigate, setOptions, goBack } = useNavigation();

	useEffect(() => {
		setOptions({
			headerTitle: params?.updateName ? "Update Name" : "Emergency Contact",
		});
	}, [params]);

	return (
		<>
			{params?.updateName ? (
				<View
					style={{
						flex: 1,
						backgroundColor: color?.gradientWhite,
						justifyContent: "center",
					}}
				>
					<Image
						source={require("../../../assets/nodata.png")}
						style={{ width: "80%", alignSelf: "center", height: "40%" }}
					/>
					<View style={{ alignItems: "center" }}>
						<Text color={color?.black}>Welcome back...!</Text>
						<Text color={color?.black}>It looks like your profile is incomplete</Text>
						<Text color={color?.black}>
							Click button below to complete it Complete Profile
						</Text>

						<View style={{ width: 140, marginTop: 20 }}>
							<AppButton
								title={"Complete Profile"}
								onPress={() => navigate("UpdateDetail")}
							/>
						</View>
					</View>
				</View>
			) : (
				<View
					style={{
						flex: 1,
						backgroundColor: color?.gradientWhite,
						justifyContent: "center",
					}}
				>
					<Image
						source={require("../../../assets/emergencyContact.png")}
						style={{ width: "80%", alignSelf: "center", height: "40%" }}
					/>
					<View style={{ alignItems: "center" }}>
						<Text color={color?.black}>Update your emergency contact.</Text>
						<Text
							color={color?.black}
							textAlign="center"
							px={5}
						>
							In case of emergency ,we will notify your emergency contact with your
							location details
						</Text>
						{/* <Text color={color?.black}>
							Click button below to complete it Complete Profile
						</Text> */}
						<View style={{ width: 200, marginTop: 20 }}>
							<AppButton
								title={"Add Emergency Contact"}
								onPress={() => navigate("EmergencyContact", { goToFeed: true })}
							/>
						</View>
						<View style={{ width: 200, marginTop: 20 }}>
							<AppButton
								title={"Skip"}
								onPress={() => {
									setLocalStorage("EmptyEmergencyContact", false)
										.then(() => goBack())
										.catch((err) => console.warn(err));
								}}
							/>
						</View>
					</View>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default UpdateName;

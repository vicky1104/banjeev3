import { Entypo, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Text } from "native-base";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { getLocalStorage } from "../../../../utils/Cache/TempStorage";
import {
	checkGender,
	listProfileUrl,
	profileUrl,
} from "../../../../utils/util-func/constantExport";
import SettingBottomSheet from "../SettingBottomSheet";

export default function ProfileCard({}) {
	const { navigate } = useNavigation();

	const { location, profile: p } = useContext(AppContext);

	const [profile, setProfile] = useState(null);

	const sheetRef = useRef(null);
	const [imageError, setImageError] = useState();

	useEffect(() => {
		getLocalStorage("profile")
			.then((res) => {
				setProfile(JSON.parse(res));
			})
			.catch((err) => console.warn(err));
	}, [p]);

	return (
		<View
			style={{
				width: "95%",
				alignSelf: "center",
				height: 180,
				alignItems: "center",
				justifyContent: "center",
				padding: 1,
				borderRadius: 12,
			}}
		>
			<LinearGradient
				style={{
					width: "100%",
					height: "100%",
					borderRadius: 12,
					opacity: 1,
					backgroundColor: color?.gradientWhite,
				}}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				colors={["rgba(237, 69, 100, 0.9 )", "rgba(169, 50, 148, 0.9 )"]}
			>
				{/* <View
				style={{
					width: "100%",
					height: "100%",
					borderRadius: 12,
					opacity: 1,
					borderWidth: 1,
					borderColor: color?.border,
					backgroundColor: "rgba(255,255,255,0.2)",
				}}
			> */}
				<View style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
					<View
						style={{
							flexDirection: "row",
							width: "100%",
							alignItems: "center",
						}}
					>
						<View
							style={{
								justifyContent: "center",
								padding: 16,
								width: "36%",
							}}
						>
							<View
								style={{
									position: "relative",
									width: "100%",
									justifyContent: "center",
								}}
							>
								<TouchableWithoutFeedback
									onPress={() => navigate("UpdateAvatar", { update: true })}
								>
									<Avatar
										borderColor={color?.border}
										borderWidth={1}
										onPress={() => navigate("UpdateAvatar", { update: true })}
										// loadingIndicatorSource={require("../../../../../assets/EditDrawerIcon/neutral_placeholder.png")}
										onError={({ nativeEvent: { error } }) => {
											setImageError(error);
										}}
										source={
											imageError
												? checkGender(profile?.gender)
												: {
														uri: profileUrl(profile?.avtarUrl),
												  }
										}
										style={{
											width: 100,
											height: 100,
											borderRadius: 50,
											borderColor: "#565E6C",
											borderWidth: 1,
										}}
									>
										{profile?.username?.[0]}
									</Avatar>
								</TouchableWithoutFeedback>
							</View>
						</View>

						<View
							style={{
								display: "flex",

								justifyContent: "center",
								padding: 16,
							}}
						>
							<Text
								fontWeight={"extrabold"}
								fontSize={20}
								color={color?.white}
							>
								{profile?.firstName} {profile?.lastName}
							</Text>
							<Text
								fontSize={16}
								color={color?.white}
							>
								{location?.address?.address_components?.[1]?.short_name}
							</Text>
							<Text
								fontSize={14}
								color={color?.white}
							>
								{`${new Date().getFullYear() - profile?.birthDate.split("-")[0]}, ${
									profile?.gender
								}`}
							</Text>
						</View>
					</View>
					<View style={{ width: "100%" }}>
						<View
							style={{
								display: "flex",
								flex: 1,
								alignItems: "flex-end",
								width: "100%",
							}}
						>
							<View
								style={{
									marginTop: -10,
									width: "30%",
									height: 40,
									alignItems: "center",
									backgroundColor: "#000",
									// backgroundColor: "#DEE1E6FF",
									display: "flex",
									flexDirection: "row",
									paddingLeft: 10,
									justifyContent: "space-evenly",
									// paddingVertical: 5,
									borderBottomStartRadius: 20,
									borderTopStartRadius: 20,
								}}
							>
								<AppFabButton
									onPress={() => navigate("UpdateDetail")}
									size={20}
									icon={
										<Feather
											name="edit"
											size={22}
											color={color?.black}
										/>
									}
								/>

								<AppFabButton
									onPress={() => {
										sheetRef?.current?.open();
									}}
									size={20}
									icon={
										<Feather
											name="settings"
											size={22}
											color={color?.black}
										/>
									}
								/>
							</View>
							{/* </LinearGradient> */}
						</View>
					</View>
				</View>

				<View
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "row",
						width: "37%",
					}}
				>
					<Text
						style={{
							textAlign: "left",
							flexWrap: "wrap",
						}}
						fontSize={16}
						color={color?.white}
					>
						{`Since`}
					</Text>
					<Entypo
						name="dot-single"
						size={16}
						color={color?.white}
					/>
					<Text
						style={{
							textAlign: "left",
							flexWrap: "wrap",
						}}
						fontSize={15}
						color={color?.white}
					>
						{`${profile?.createdOn?.split("-")[0]}`}
					</Text>
				</View>
				{/* </View> */}
			</LinearGradient>
			<SettingBottomSheet
				refRBSheet={sheetRef}

				// setDeleteAccountModal={setDeleteAccountModal}
			/>
		</View>
	);
}

const styles = StyleSheet.create({});

import { Foundation, Ionicons } from "@expo/vector-icons";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useContext, useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { showToast } from "../../../../constants/components/ShowToast";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import {
	leaveNeighbourhoodService,
	listMyNeighbourhood,
} from "../../../../helper/services/ListOurNeighbourhood";
import {
	removeMyDefaultNeighbourhood,
	setMyDefaultNeighbourhood,
} from "../../../../utils/Cache/TempStorage";

export default function NeighbourhoodCard() {
	const { dispatch } = useNavigation();
	const [loader, setLoader] = useState(false);
	const { neighbourhood, setNeighbourhood } = useContext(AppContext);

	const leaveNH = async (id) => {
		setLoader(true);

		if (neighbourhood.cloudId === id) {
			console.warn("cloudIds are same,,,,");
			leaveNeighbourhoodService(id).then((res) => {
				showToast(`You left ${res?.payload?.name}...!`);

				listMyNeighbourhood()
					.then(async (res) => {
						if (res.length === 0) {
							setLoader(false);
							dispatch(StackActions.replace("MyCloud"));
							await removeMyDefaultNeighbourhood("neighbourhood");
						} else {
							setNeighbourhood(res[0]);
							await setMyDefaultNeighbourhood("neighbourhood", res?.[0]);
						}
					})
					.catch((err) => {
						console.error(err);
					});
			});
		}
		//  else {
		// 	leaveNeighbourhoodService(id).then((res) => {
		// 		let x = myNH.filter((ele) => ele.cloudId !== id);
		// 		setmyNH(x);
		// 		setLoader(false);
		// 		listMyNeighbourhood()
		// 			.then((res) => {
		// 				if (res.length === 0) {
		// 					setLoader(false);
		// 					dispatch(StackActions.replace("MyCloud"));
		// 				}
		// 				// else {
		// 				// 	dispatch(StackActions.replace("MyCloud"));
		// 				// }
		// 			})
		// 			.catch((err) => {
		// 				console.error(err);
		// 			});
		// 	});
		// }
	};

	return (
		<>
			{neighbourhood !== "loading" && neighbourhood && (
				<>
					<View
						style={{
							height: 50,
							// borderBottomWidth: 1,

							display: "flex",
							justifyContent: "center",
						}}
					>
						<Text
							fontWeight={"bold"}
							color={color?.black}
							fontSize={16}
							paddingLeft={"2.5%"}
						>
							My Neighborhood
						</Text>
					</View>

					<View style={{ paddingLeft: "2.5%" }}>
						<View
							style={{
								width: 250,
								backgroundColor: color?.gradientWhite,
								borderRadius: 8,
								borderWidth: 1,
								borderColor: color?.border,
								borderStyle: "solid",
								position: "relative",
								padding: 10,
							}}
						>
							<View
								style={{
									position: "absolute",
									top: 0,
									right: -1,
									padding: 5,
									backgroundColor: "#8D6E08FF",
									borderBottomLeftRadius: 8,
									borderTopRightRadius: 8,
								}}
							>
								<Text
									fontSize={10}
									color={color?.white}
									fontWeight={"bold"}
								>
									{`${
										neighbourhood?.payload?.cloudType[0]
									}${neighbourhood?.payload?.cloudType
										.slice(1, neighbourhood?.payload?.cloudType?.length)
										.toLowerCase()}`}
								</Text>
							</View>
							<Text
								fontWeight={"extrabold"}
								textAlign={"left"}
								color={color?.black}
								numberOfLines={1}
							>
								{neighbourhood?.payload?.name}
							</Text>

							<View>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										marginVertical: 5,
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											marginRight: 20,
										}}
									>
										<Foundation
											name="clipboard-notes"
											size={18}
											color="grey"
										/>
										<Text
											color="grey"
											ml={1}
										>
											{neighbourhood?.payload?.totalPosts}
										</Text>
									</View>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											marginRight: 20,
										}}
									>
										<Ionicons
											name="people"
											size={18}
											color="grey"
										/>
										<Text
											color="grey"
											ml={1}
										>
											{neighbourhood?.payload?.totalMembers}
										</Text>
									</View>
								</View>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "flex-end",
									}}
								>
									{loader ? (
										<View
											style={{
												width: 60,
												height: 30,
												marginTop: 10,
												zIndex: 9999,
											}}
										>
											<AppLoading
												visible={loader}
												size={10}
											/>
										</View>
									) : (
										<View style={{ width: 60 }}>
											<AppButton
												title={"Leave"}
												titleFontSize={13}
												width={60}
												style={{
													width: 60,
													height: 30,
													marginTop: 10,
													zIndex: 9999,
												}}
												onPress={() => {
													Alert.alert(
														"Leave Neighbourhood",
														"Are you sure,\n you want to leave neighbourhood",
														[
															{
																text: "Cancel",
																onPress: () => console.log("Cancel Pressed"),
																style: "default",
															},
															{
																text: "Leave",
																style: "destructive",
																onPress: () => {
																	leaveNH(neighbourhood.cloudId);
																},
															},
														]
													);
												}}
											/>
										</View>
									)}
									<View style={{ position: "absolute", bottom: -15, right: -10 }}>
										<Image
											style={{ height: 70, width: 70, tintColor: color?.black }}
											source={require("../../../../../assets/home2.png")}
										/>
									</View>
								</View>
							</View>
						</View>
					</View>
				</>
			)}
		</>
	);
}

const styles = StyleSheet.create({});

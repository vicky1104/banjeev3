import React from "react";
import {
	View,
	Image,
	StyleSheet,
	TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import color from "../../../constants/env/color";
import { StackActions, useNavigation } from "@react-navigation/native";
import { cloudinaryFeedUrl } from "../../../utils/util-func/constantExport";
import { joinNeighbourhoodService } from "../../../helper/services/ListOurNeighbourhood";
import { setMyDefaultNeighbourhood } from "../../../utils/Cache/TempStorage";
import { useContext } from "react";
import { AppContext } from "../../../Context/AppContext";
import { showToast } from "../../../constants/components/ShowToast";
import { CopilotStep, walkthroughable } from "react-native-copilot";
import { Text } from "native-base";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import { useState } from "react";
import SwitchNeighbourhood from "./SwitchNeighbourhood";

const CopilotView = walkthroughable(View);

function NeighbourhoodItem({ item, currentIndex, index }) {
	const { navigate, dispatch } = useNavigation();
	const { setNeighbourhood, setIsLoaded } = useContext(AppContext);
	const [loader, setLoader] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [toBeJoinNH, setTobeJoinNH] = useState();

	return (
		<View
			// h={160}
			w={"100%"}
			shadow={2}
			style={{
				// marginTop: currentIndex !== index ? 80 : 0,
				zIndex: 1,
				borderRadius: 20,
				backgroundColor: color?.gradientWhite,
				borderColor: color?.border,
				borderWidth: 1,
				paddingHorizontal: 10,
				paddingVertical: 10,
				elevation: 3,
				marginBottom: 20,
			}}
		>
			<View>
				<TouchableWithoutFeedback
					onPress={() => {
						navigate("DetailNeighbourhood", {
							cloudId: item.id,
							cloudName: item.name,
						});
					}}
				>
					<View
						style={{
							elevation: 3,
							shadowColor: color?.grey,
							shadowRadius: 1,
							shadowOpacity: 0.5,
							shadowOffset: {
								height: 1,
								width: 1,
							},
						}}
					>
						<Image
							source={{ uri: cloudinaryFeedUrl(item.imageUrl, "image", "1:1") }}
							resizeMode="cover"
							style={{
								aspectRatio: 16 / 9,
								borderRadius: 20,
								zIndex: 1,
							}}
						/>
					</View>
				</TouchableWithoutFeedback>

				<TouchableWithoutFeedback
					onPress={() => {
						navigate("DetailNeighbourhood", {
							cloudId: item.id,
							cloudName: item.name,
						});
					}}
				>
					<View style={{ alignItems: "center", marginTop: 10 }}>
						<Text
							fontWeight={"semibold"}
							fontSize={18}
							color={color?.black}
						>
							{item.name}
						</Text>
					</View>
				</TouchableWithoutFeedback>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-around",
						marginTop: 10,
					}}
				>
					<View style={{ alignItems: "center" }}>
						<Text
							color={color?.black}
							fontWeight={"normal"}
						>
							Posts
						</Text>
						<Text
							fontSize={12}
							color={color.grey}
						>
							{item.totalPosts}
						</Text>
					</View>
					<View style={{ alignItems: "center" }}>
						<Text
							color={color?.black}
							fontWeight={"normal"}
						>
							Members
						</Text>
						<Text
							fontSize={12}
							color={color.grey}
						>
							{item.totalMembers}
						</Text>
					</View>
				</View>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-around",
						marginTop: 10,
						width: "100%",
					}}
				>
					{/* {currentIndex === index && ( */}
					<TouchableWithoutFeedback
						onPress={() =>
							joinNeighbourhoodService(item?.id)
								.then((res) => {
									setIsLoaded(true);
									setTobeJoinNH({ name: item.name, id: item.id });
									setMyDefaultNeighbourhood("neighbourhood", res).then((res) => {
										setNeighbourhood(res);
										showToast(`Welcome to ${item.name}`);
										setTimeout(() => {
											dispatch(
												StackActions.replace("Bottom", {
													neighbourhood: item,
												})
											);
										}, 5000);
									});
								})
								.catch((err) => {
									setIsLoaded(false);
									setLoader(false);
									setOpenModal(true);
									// showToast("You cannot join more than 1 neighbourhood."),
									console.warn(err);
								})
						}
					>
						{index === 0 ? (
							<CopilotStep
								order={6}
								text={"Click to join this Neighbourhoods"}
								name="Click to join this Neighbourhoods"
							>
								<CopilotView
									style={{
										backgroundColor: color?.primary,
										width: "100%",
										borderRadius: 90,
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
										padding: 10,
									}}
								>
									<Text
										color={color?.white}
										fontWeight={"bold"}
										ml={3}
										fontSize={16}
									>
										Join
									</Text>
									<View
										style={{
											backgroundColor: "rgba(0,0,0,0.5)",
											padding: 10,
											borderRadius: 50,
										}}
									>
										{loader ? (
											<AppLoading
												size="small"
												visible={true}
											/>
										) : (
											<MaterialIcons
												name="arrow-forward"
												size={24}
												onPress={() => {
													setLoader(true);
													setTobeJoinNH({ name: item.name, id: item.id });
													joinNeighbourhoodService(item?.id)
														.then(async (res) => {
															setLoader(false);
															await setMyDefaultNeighbourhood("neighbourhood", res);
															setNeighbourhood(res);
															showToast(`Welcome to ${item.name}`);
															dispatch(
																StackActions.replace("Bottom", {
																	neighbourhood: item,
																})
															);
														})
														.catch((err) => {
															setLoader(false);

															setLoader(false);
															setOpenModal(true);

															// showToast("You cannot join more than 1 neighbourhood."),
															console.warn(err);
														});
												}}
												color={"#fff"}
											/>
										)}
									</View>
								</CopilotView>
							</CopilotStep>
						) : (
							<View
								style={{
									backgroundColor: color?.primary,
									width: "100%",
									borderRadius: 90,
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									padding: 10,
								}}
							>
								<Text
									color={color?.white}
									fontWeight={"bold"}
									ml={3}
									fontSize={16}
								>
									Join
								</Text>
								<View
									style={{
										backgroundColor: "rgba(0,0,0,0.5)",
										padding: 10,
										borderRadius: 50,
									}}
								>
									{loader ? (
										<View style={{ height: 25, width: 25 }}>
											<AppLoading
												size={25}
												color="white"
												visible={true}
											/>
										</View>
									) : (
										<MaterialIcons
											name="arrow-forward"
											size={24}
											onPress={() => {
												setLoader(true);
												console.warn({ name: item.name, id: item.id }, "itememeemememem");
												setTobeJoinNH({ name: item.name, id: item.id });

												joinNeighbourhoodService(item?.id)
													.then(async (res) => {
														setLoader(false);
														await setMyDefaultNeighbourhood("neighbourhood", res);
														setNeighbourhood(res);
														showToast(`Welcome to ${item.name}`);
														dispatch(
															StackActions.replace("Bottom", {
																neighbourhood: item,
															})
														);
													})
													.catch((err) => {
														setLoader(false);
														setOpenModal(true);

														// showToast("You cannot join more than 1 neighbourhood."),
														console.warn(err);
													});
											}}
											color={"#fff"}
										/>
									)}
								</View>
							</View>
						)}
					</TouchableWithoutFeedback>
					{/* )} */}
				</View>
			</View>
			{/* <Text>{item.name}</Text> */}
			<SwitchNeighbourhood
				openModal={openModal}
				setOpenModal={setOpenModal}
				toBeJoinNH={toBeJoinNH}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default NeighbourhoodItem;

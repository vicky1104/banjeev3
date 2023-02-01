import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import React, { useState } from "react";
import { Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { convertTime } from "../../../utils/util-func/convertTime";
import { joinNeighbourhoodService } from "../../../helper/services/ListOurNeighbourhood";
import { Foundation, Ionicons } from "@expo/vector-icons";
import color from "../../../constants/env/color";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import { showToast } from "../../../constants/components/ShowToast";

export default NighbourhoodElement = ({
	item,
	setAllNeighbourhood,
	listMyAllNeighbourhood,
}) => {
	const { navigate } = useNavigation();

	function navigateToDetailPage() {
		navigate("DetailNeighbourhood", {
			cloudId: item.id,
		});
	}

	const [loader, setLoader] = useState(false);

	return (
		<View style={{ position: "relative" }}>
			{
				<TouchableWithoutFeedback onPress={navigateToDetailPage}>
					<View>
						{item?.totalPostsUpdatedOn && (
							<View
								style={{
									position: "absolute",
									backgroundColor: "salmon",
									width: "94%",
									zIndex: 1,
									left: 10,
									padding: 1,
									borderTopRightRadius: 8,
									height: 20,
									borderTopLeftRadius: 8,
								}}
							>
								{item?.totalPostsUpdatedOn && (
									<View
										style={{
											height: 20,
											display: "flex",
											justifyContent: "center",
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										{/* <EvilIcons name="clock" color="white" size={18} /> */}

										<Text
											fontSize={12}
											color={color?.white}
										>
											Active {`${convertTime(item?.totalPostsUpdatedOn)}`}
										</Text>
									</View>
								)}
							</View>
						)}

						<View
							style={{
								// height: 150,
								width: 150,
								borderRadius: 8,
								backgroundColor: "#F2BE184D",
								marginLeft: 10,
								paddingHorizontal: 10,
								paddingTop: 20,
								paddingBottom: 10,

								// justifyContent: "space-between",
							}}
						>
							<Text
								fontSize={16}
								style={{
									height: 60,
									color: color?.black,
								}}
								numberOfLines={2}
							>
								{item.name}
							</Text>
							<View>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										marginBottom: 10,
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
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
											{item.totalPosts}
										</Text>
									</View>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
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
											{item.totalMembers}
										</Text>
									</View>
								</View>

								<TouchableWithoutFeedback
									onPress={() => {
										setLoader(true);
										joinNeighbourhoodService(item.id)
											.then(async (res) => {
												setLoader(false);
												setAllNeighbourhood((prev) =>
													prev.filter((ele) => ele.id !== item.id)
												);

												showToast(`Thank you for joining ${item.name}`);
												await listMyAllNeighbourhood();

												// navigate("DetailNeighbourhood", {
												// 	cloudId: item.id,
												// })
											})
											.catch((err) => {
												console.error(err);
											});
									}}
								>
									<View
										style={{
											alignSelf: "center",
											alignItems: "center",
											width: "100%",
											backgroundColor: color.primary,
											borderRadius: 8,
											display: "flex",
											justifyContent: "center",
										}}
									>
										{loader ? (
											<View
												style={{
													height: 31,
													display: "flex",
													justifyContent: "center",
													width: "100%",
												}}
											>
												<AppLoading
													size={15}
													visible={loader}
												/>
											</View>
										) : (
											<Text
												style={{
													paddingVertical: 5,
													color: color.white,
												}}
											>
												Join
											</Text>
										)}
									</View>
								</TouchableWithoutFeedback>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			}
		</View>
	);
};

const styles = StyleSheet.create({});

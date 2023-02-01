import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { Fragment, useEffect, useState } from "react";

import { Foundation, Ionicons } from "@expo/vector-icons";
import {
	Dimensions,
	Image,
	TouchableWithoutFeedback,
	View,
	VirtualizedList,
} from "react-native";
import AppBorderButton from "../../../../constants/components/ui-component/AppBorderButton";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import { listMyNHService } from "../../../../helper/services/ListOurNeighbourhood";
import { cloudinaryFeedUrl } from "../../../../utils/util-func/constantExport";
import color from "../../../../constants/env/color";

function MyNeighbourhoodList(props) {
	const [data, setData] = useState([]);
	const { navigate } = useNavigation();

	const [visible, setVisible] = useState(true);

	useEffect(() => {
		listMyNHService()
			.then((res) => {
				setVisible(false), setData(res);
			})
			.catch((err) => console.warn(err));
	}, []);

	return (
		<View style={{ backgroundColor: color?.gradientWhite, flex: 1 }}>
			{visible ? (
				<AppLoading visible={true} />
			) : (
				<Fragment>
					<View
						style={{
							position: "absolute",
							bottom: 20,
							justifyContent: "center",
							alignSelf: "center",
							width: 120,
							zIndex: 11,
						}}
					>
						<AppButton
							title={"Create"}
							onPress={() => {
								navigate("CreateGroup");
							}}
						/>
					</View>

					<VirtualizedList
						data={data}
						keyExtractor={(data) => data?.id}
						getItem={(data, index) => data[index]}
						getItemCount={(data) => data.length}
						renderItem={({ item }) => {
							return (
								<TouchableWithoutFeedback
									onPress={() => navigate("DetailNeighbourhood", { cloudId: item.id })}
								>
									<View style={{ width: "95%", alignSelf: "center" }}>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												backgroundColor: color?.gradientWhite,
												borderColor: color?.border,
												borderWidth: 1,
												elevation: 5,
												borderRadius: 8,
												shadowOffset: { width: 1, height: 1 },
												shadowOpacity: 0.4,
												shadowRadius: 3,
												marginVertical: 5,
											}}
										>
											<View style={{ padding: 10 }}>
												<Image
													source={{
														uri: cloudinaryFeedUrl(item?.imageUrl, "image"),
													}}
													style={{
														height: 100,
														width: 100,
														borderRadius: 50,
													}}
												/>
											</View>

											<View
												style={{
													paddingLeft: 10,
													// height: 70,
													justifyContent: "space-around",
													width: "65%",
												}}
											>
												<Text
													fontSize={16}
													color={color?.black}
													fontWeight="medium"
													numberOfLines={1}
												>
													{item.name}
												</Text>

												<View
													style={{
														flexDirection: "row",
														alignItems: "center",
														justifyContent: "space-between",
														marginBottom: 10,
														width: "50%",
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
															color={color?.black}
														/>
														<Text
															color={color?.black}
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
															color={color?.black}
														/>
														<Text
															color={color?.black}
															ml={1}
														>
															{item.totalMembers}
														</Text>
													</View>
												</View>

												{/* <View style={{ alignSelf: "center" }}> */}

												<AppBorderButton
													width={120}
													title={"Update"}
													onPress={() => {
														navigate("CreateGroup", { item });
													}}
												/>

												{/* </View> */}
											</View>
										</View>
									</View>
								</TouchableWithoutFeedback>
							);
						}}
						ListEmptyComponent={() => {
							return (
								<View
									style={{
										height: Dimensions.get("screen").height - 100,
										width: "100%",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Text color={color?.black}>You haven't created any neighbouhood.</Text>
								</View>
							);
						}}
					/>
				</Fragment>
			)}
		</View>
	);
}

export default MyNeighbourhoodList;

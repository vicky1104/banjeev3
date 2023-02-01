import { Text } from "native-base";
import React, { Fragment } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import color from "../../../constants/env/color";
import { useContext } from "react";
import { AppContext } from "../../../Context/AppContext";

function SelectedNeighbourhood({ refRBSheetController }) {
	const { neighbourhood } = useContext(AppContext);
	return (
		<View style={{ backgroundColor: color?.gradientWhite }}>
			{neighbourhood ? (
				<Fragment>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							// marginTop: 5,
							borderBottomWidth: 1,
							borderColor: color?.gradientBlack,

							width: "100%",
							paddingHorizontal: 10,
							justifyContent: "space-between",
							height: 50,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								// marginTop: 15,
							}}
						>
							<MaterialCommunityIcons
								name="home-circle"
								size={25}
								color={color?.black}
							/>
							{/* <Entypo name="location-pin" size={20} color="black" /> */}

							<Text
								fontWeight={"medium"}
								// fontSize={18}
								numberOfLines={1}
								style={{ color: color?.black, marginLeft: 5, width: "78%" }}
							>
								{neighbourhood?.payload?.name}
							</Text>
						</View>

						<TouchableWithoutFeedback
							// disabled={!disableBtnMyCloud}
							onPress={() => {
								refRBSheetController();
							}}
						>
							<View>
								<AntDesign
									style={{ padding: 10 }}
									name="downcircle"
									size={22}
									color={color.primary}
								/>
							</View>
						</TouchableWithoutFeedback>
					</View>

					{/* <View style={{ width: "98%", alignSelf: "center", marginTop: 10 }}>
						<AppInput placeholder={"Search any area, neighbourhood"} />
					</View> */}
					{/* <View
						style={{
							height: 200,
							backgroundColor: "white",
							borderBottomWidth: 1,
							borderColor: "lightgrey",
						}}
					>
						<Text
							fontSize={16}
							fontStyle="italic"
							fontWeight={"medium"}
							style={{ marginBottom: 20, paddingLeft: "2.5%" }}
						>
							Nearby Neighbourhood
						</Text>

						<FlatList
							data={data}
							horizontal
							showsHorizontalScrollIndicator={false}
							keyExtractor={() => Math.random()}
							renderItem={({ item, index }) => {

								return (
									<TouchableWithoutFeedback
										onPress={() =>
											navigate("DetailNeighbourhood", {
												cloudId: item.id,
											})
										}
									>
										<View
											style={{
												height: 136,
												width: 132,
												borderRadius: 8,
												backgroundColor:
													index % 2 === 0 ? "#F1548B40" : "#F2BE184D",
												marginLeft: 10,
												padding: 5,
												justifyContent: "space-between",
											}}
										>
											<Text fontSize={16}>{item.name}</Text>
											<View style={{ marginBottom: 5 }}>
												<View
													style={{
														flexDirection: "row",
														alignItems: "center",
														justifyContent: "space-around",
														marginVertical: 10,
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
															color="black"
														/>
														<Text ml={1}>100</Text>
													</View>
													<View
														style={{
															flexDirection: "row",
															alignItems: "center",
														}}
													>
														<Ionicons name="people" size={18} color="black" />
														<Text ml={1}>{item.totalMembers}</Text>
													</View>
												</View>
												<TouchableWithoutFeedback
													onPress={() => console.warn("join")}
												>
													<View
														style={{
															alignSelf: "center",
															alignItems: "center",
															width: "50%",

															backgroundColor: color.primary,
															borderRadius: 8,
														}}
													>
														<Text
															style={{
																paddingVertical: 5,
																color: color.white,
															}}
														>
															Join
														</Text>
													</View>
												</TouchableWithoutFeedback>
											</View>
										</View>
									</TouchableWithoutFeedback>
								);
							}}
						/>
					</View> */}
				</Fragment>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({});

export default SelectedNeighbourhood;

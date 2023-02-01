import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Avatar, FlatList, Text } from "native-base";
import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import color from "../../../constants/env/color";
import { listProfileUrl } from "../../../utils/util-func/constantExport";
import { convertTime } from "../../../utils/util-func/convertTime";
export default function BlogCarousal({ data }) {
	const { navigate } = useNavigation();
	return (
		<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
			<View
				style={{
					flexDirection: "row",
					width: "95%",
					alignSelf: "center",
					justifyContent: "space-between",
					alignItems: "center",
					marginVertical: 10,
				}}
			>
				<Text
					fontWeight={"medium"}
					fontSize="16"
					color={color?.black}
				>
					Popular Blogs
				</Text>
				{data?.length > 0 && (
					<Text
						fontWeight={"medium"}
						onPress={() => {
							navigate("Blogs");
						}}
						color={color?.black}
						style={{
							// backgroundColor: "lightgrey",
							paddingHorizontal: 10,
							paddingVertical: 5,
							borderRadius: 48,
						}}
					>
						View all
					</Text>
				)}
			</View>
			<FlatList
				horizontal
				showsHorizontalScrollIndicator={false}
				data={data}
				keyExtractor={() => Math.random()}
				ListEmptyComponent={() => {
					return (
						<View style={styles.container}>
							<Text color={color?.black}>No Blogs</Text>
						</View>
					);
				}}
				renderItem={({ item }) => {
					return (
						<TouchableWithoutFeedback
							onPress={() => navigate("ViewBlog", { id: item?.id })}
						>
							<View style={{ paddingBottom: 5 }}>
								<View
									style={{
										// height: 124,
										width: 350,
										paddingHorizontal: 20,
										paddingVertical: 15,
										borderWidth: 1,
										marginLeft: 10,
										borderColor: color?.border,
										overflow: "hidden",
										borderRadius: 8,
										elevation: 3,
										shadowOffset: { width: 1, height: 1 },
										shadowOpacity: 0.4,
										shadowRadius: 3,
										backgroundColor: color.gradientWhite,
										// padding: 10,
										justifyContent: "space-between",
									}}
								>
									<View>
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<Avatar
												borderColor={color?.border}
												borderWidth={1}
												bgColor={color.gradientWhite}
												style={{ height: 40, width: 40, borderRadius: 50 }}
												source={{
													uri: listProfileUrl(item?.authorId),
												}}
											>
												{item?.authorName[0].toUpperCase()}
											</Avatar>
											<View style={{ paddingLeft: 10 }}>
												<Text
													fontSize={14}
													numberOfLines={2}
													fontWeight="bold"
													color={color.black}
												>
													{item?.authorName}
												</Text>
												<Text color={color.black}>{convertTime(item?.createdOn)}</Text>
											</View>
										</View>

										<View
											style={{
												// height: "50%",
												width: "100%",
												paddingHorizontal: 5,
												paddingVertical: 3,
											}}
										>
											<Text
												// fontSize={12}
												color={color.black}
												numberOfLines={2}
											>
												{item.title}
											</Text>
										</View>
									</View>

									<View
										style={{
											marginVertical: 5,
										}}
									>
										{/* <Divider backgroundColor={color.black} /> */}
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												// marginTop: 10,
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<View style={{ flexDirection: "row" }}>
												<View
													style={{
														display: "flex",
														flexDirection: "row",
														alignItems: "center",
													}}
												>
													<AntDesign
														name="like2"
														size={16}
														color={color?.black}
													/>
													<Text
														textAlign={"center"}
														color={color?.black}
														style={{ marginLeft: 5 }}
													>
														{item?.totalReactions || 0}
													</Text>
												</View>
												<View
													style={{
														display: "flex",
														flexDirection: "row",
														alignItems: "center",
														marginLeft: 20,
													}}
												>
													<Ionicons
														name="chatbox-outline"
														size={16}
														color={color?.black}
													/>
													<Text
														textAlign={"center"}
														color={color?.black}
														style={{ marginLeft: 5 }}
													>
														{item?.totalComments || 0}
													</Text>
												</View>
											</View>

											<View
												style={{
													display: "flex",
													flexDirection: "row",
													alignItems: "center",
												}}
											>
												<AntDesign
													name="eyeo"
													size={16}
													color={color?.black}
												/>
												<Text
													textAlign={"center"}
													color={color?.black}
													style={{ marginLeft: 5 }}
												>
													{item?.totalViews || 0}
												</Text>
											</View>
										</View>
									</View>
								</View>
							</View>
						</TouchableWithoutFeedback>
					);
				}}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		paddingBottom: 20,
		// marginTop: 0,
		marginBottom: 20,
	},
});

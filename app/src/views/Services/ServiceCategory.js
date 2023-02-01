import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Box, Text } from "native-base";
import React, { Fragment, useState } from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import color from "../../constants/env/color";
import { cloudinaryFeedUrl } from "../../utils/util-func/constantExport";

const card_width = Dimensions.get("screen").width / 6 + 2.3;

function ServiceCategory({ data: category }) {
	const { navigate } = useNavigation();
	const [categoryLength, setCategoryLength] = useState(9);
	if (category.length > 0) {
		return (
			<View style={styles.container}>
				<Box
					style={{
						width: "95%",
						padding: 15,
						alignSelf: "center",
						elevation: 0,
						borderWidth: 1,
						borderColor: color?.gradientBlack,
						borderRadius: 10,
						backgroundColor: color?.gradientWhite,
						justifyContent: "flex-start",
					}}
				>
					<Text
						style={{
							color: "grey",
							fontWeight: "600",
							marginBottom: 5,
							color: color?.black,
						}}
					>
						Service Provider nearby
					</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "flex-start",
							flexWrap: "wrap",
							alignItems: "center",
							width: "100%",
							// borderWidth: 1,
							// marginLeft: -5,
						}}
					>
						{category.map((ele, i) => {
							return i < categoryLength ? (
								<TouchableWithoutFeedback
									key={i}
									onPress={() => {
										navigate("BusinessService", { categoryID: ele.id });
									}}
								>
									<View
										style={{
											height: card_width,
											width: card_width,
											borderRadius: 10,
											alignItems: "center",
											justifyContent: "center",
											overflow: "hidden",
										}}
									>
										<Fragment>
											<Image
												resizeMode="cover"
												source={{
													uri: cloudinaryFeedUrl(ele.image, "image"),
												}}
												style={{
													height: 25,
													width: 25,
													marginBottom: 5,
													tintColor: color?.black,
												}}
											/>
											<Text
												fontSize={10}
												color={color?.black}
												numberOfLines={1}
											>
												{ele.name}
											</Text>
										</Fragment>
									</View>
								</TouchableWithoutFeedback>
							) : null;
						})}
						<TouchableWithoutFeedback
							onPress={() =>
								categoryLength === 9
									? setCategoryLength(category.length)
									: setCategoryLength(9)
							}
						>
							<View
								style={{
									height: card_width,
									width: card_width,
									borderRadius: 10,
									alignItems: "center",
									justifyContent: "center",
									overflow: "hidden",
								}}
							>
								<Fragment>
									<AntDesign
										name={categoryLength === 9 ? "plus" : "minus"}
										size={24}
										color={color?.black}
									/>
									{/* <Image
										resizeMode="cover"
										source={require("../../../assets/EditDrawerIcon/ic_add_plus.png")}
										style={{
											height: 25,
											width: 25,
											marginBottom: 5,
											tintColor: color?.black,
										}}
									/> */}
									<Text
										fontSize={10}
										color={color?.black}
										numberOfLines={1}
									>
										{categoryLength === 9 ? "View More" : "View Less"}
									</Text>
								</Fragment>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</Box>
			</View>
		);
	} else {
		return null;
	}
}

const styles = StyleSheet.create({
	container: {},
});

export default ServiceCategory;

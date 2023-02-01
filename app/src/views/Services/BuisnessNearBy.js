import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { Fragment, memo } from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	FlatList,
	TouchableWithoutFeedback,
} from "react-native";
import ProductSkeleton from "../../constants/components/ui-component/Skeleton/ProductSkeleton";
import color from "../../constants/env/color";
import BusinessNearByItem from "./BusinessNearByItem";

function BuisnessNearBy({ data, loader }) {
	const { navigate } = useNavigation();

	return (
		<Fragment>
			{loader ? (
				<ProductSkeleton name={"Business nearby"} />
			) : (
				<View style={styles.container}>
					<View style={styles.view}>
						{data?.content?.length > 0 && (
							<Fragment>
								<Text
									color={color?.black}
									fontWeight={"medium"}
									fontSize="16"
								>
									Business Nearby
								</Text>

								<Text
									fontWeight={"medium"}
									color={color?.black}
									onPress={() => navigate("BusinessService")}
									style={styles.viewAll}
								>
									View all
								</Text>
							</Fragment>
						)}
					</View>

					{/* {productloader && <ProductSkeleton name={"Business Nearby"} />} */}

					{/* ````````````````````` dataaaa */}

					<FlatList
						ListFooterComponent={() => <View style={{ marginLeft: 5 }} />}
						data={data.content}
						horizontal
						snapToAlignment="start"
						showsHorizontalScrollIndicator={false}
						keyExtractor={(e) => Math.random()}
						renderItem={({ item, index }) => {
							return <BusinessNearByItem item={item} />;
						}}
						ListEmptyComponent={() => (
							<View style={styles.emptycomp}>
								<Text
									fontSize={20}
									fontWeight="medium"
									color={color?.black}
								>
									Are you a business owner?
								</Text>
								<Text
									fontSize={16}
									textAlign={"center"}
									color={color?.black}
								>
									Register your business on app to get more local customers.
								</Text>

								<TouchableWithoutFeedback onPress={() => navigate("CreateBusiness")}>
									<View style={styles.register}>
										<Text
											fontSize={16}
											color={color?.white}
										>
											Register
										</Text>
									</View>
								</TouchableWithoutFeedback>
							</View>
						)}
					/>
				</View>
			)}
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 0,
		backgroundColor: color?.gradientWhite,
		// paddingBottom: 20,
		// marginTop: 0,
		marginBottom: 0,
	},
	view: {
		flexDirection: "row",
		width: "95%",
		alignSelf: "center",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
		paddingTop: 10,
	},
	viewAll: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 48,
	},
	emptycomp: {
		height: 200,
		// width: "85%"
		flex: 1,
		alignItems: "center",
		paddingHorizontal: "2%",
		alignSelf: "center",
		// width: CARD_WIDTH,
		borderWidth: 1,
		borderColor: "lightgrey",
		borderRadius: 8,
		shadowColor: "#470000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		elevation: 2,
		shadowRadius: 8,
		// marginLeft: 10,
		// marginRight: 0,
		overflow: "hidden",
		backgroundColor: color.gradientWhite,
		padding: 5,
		justifyContent: "space-around",
	},
	register: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		width: "30%",
		alignSelf: "center",
		borderWidth: 1,
		borderColor: color.white,
		borderRadius: 8,
		alignItems: "center",
		elevation: 5,
		backgroundColor: color.primary,
	},
});

export default memo(BuisnessNearBy);

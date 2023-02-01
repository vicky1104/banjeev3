import { useNavigation, useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { showToast } from "../../../../constants/components/ShowToast";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import AllProduct from "./AllProduct/AllProduct";
import OurProduct from "./AllProduct/OurProduct";

function AllProductList(props) {
	const [myListing, setMyListing] = useState(false);
	const { navigate } = useNavigation();
	const { params } = useRoute();
	const { neighbourhood } = useContext(AppContext);

	return (
		// <LinearGradient
		// 	style={styles.container}
		// 	start={{ x: 0, y: 0 }}
		// 	end={{ x: 1, y: 1 }}
		// 	color={
		// 		darkMode === "dark" ? ["#ffffff", "#eeeeff"] : ["#1D1D1F", "#201F25"]
		// 	}
		// >
		<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					marginVertical: 10,
					paddingHorizontal: "2.5%",
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						width: "35%",
						justifyContent: "space-between",
					}}
				>
					<Text
						fontWeight={myListing ? "normal" : "bold"}
						onPress={() => setMyListing(false)}
						style={{
							borderBottomWidth: myListing ? 0 : 3,
							borderColor: color.grey,
							fontSize: 16,
							paddingBottom: 3,
							color: color?.black,
							padding: 5,
						}}
					>
						All
					</Text>

					<Text
						onPress={() => setMyListing(true)}
						fontWeight={myListing ? "bold" : "normal"}
						style={{
							borderBottomWidth: myListing ? 3 : 0,
							borderColor: color.grey,
							fontSize: 16,
							paddingBottom: 3,
							padding: 5,
							color: color?.black,
						}}
					>
						My Listing
					</Text>
				</View>

				{!myListing && (
					<Text
						fontSize={16}
						style={{ color: color?.black }}
						onPress={() =>
							navigate("FilterProduct", {
								categoryID: params?.categoryID,
								categoryName: params?.categoryName,
							})
						}
					>
						Filter
					</Text>
				)}
				{myListing && (
					<Text
						fontSize={16}
						style={{ color: color?.black }}
						onPress={() => {
							neighbourhood
								? navigate("CreateListing")
								: showToast("Plase join neighbourhood to list product.");
						}}
					>
						Create
					</Text>
				)}
			</View>
			<View style={{ paddingBottom: 53 }}>
				{myListing ? <OurProduct /> : <AllProduct />}
			</View>
			{/* 
			<View
				style={{
					position: "absolute",
					bottom: 10,
					width: "60%",
					alignSelf: "center",
					borderRadius: 100,
					overflow: "hidden",
				}}
			>
				<AppButton
					// titleFontSize={16}
					title={"Start listing your products"}
					onPress={() => navigate("CreateListing")}
				/>
			</View> */}
		</View>
		// </LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
});

export default AllProductList;

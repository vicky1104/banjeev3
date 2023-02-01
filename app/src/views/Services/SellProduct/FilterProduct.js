import { useNavigation, useRoute } from "@react-navigation/native";
import { Radio, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { showToast } from "../../../constants/components/ShowToast";
import AppBorderButton from "../../../constants/components/ui-component/AppBorderButton";
import AppButton from "../../../constants/components/ui-component/AppButton";
import AppLoading from "../../../constants/components/ui-component/AppLoading";
import color from "../../../constants/env/color";
import { BusinessCategoryService } from "../../../helper/services/BusinessCategory";

function FilterProduct(props) {
	const { params } = useRoute();
	const [filterData, setFilterData] = useState(
		JSON.stringify({
			id: params?.categoryID,
			name: params?.categoryName,
		})
	);

	const { navigate } = useNavigation();
	const [category, setCategory] = useState([]);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		BusinessCategoryService({
			categoryId: null,
			categoryName: null,
			description: null,
			name: null,
			type: "BUYANDSELL",
		})
			.then((res) => {
				setCategory(res.content);
				setVisible(false);
			})
			.catch((err) => console.warn(err));
	}, []);

	function applyFilter() {
		if (filterData.length > 0) {
			let { id: categoryID, name: categoryName } = JSON?.parse(filterData);

			navigate("AllProductList", { categoryID, categoryName });
			showToast("Filter applied " + categoryName);
		} else {
			navigate("AllProductList", { categoryID: "", categoryName: "" });
		}
	}
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
			{/* <View
				style={{
					flexDirection: "row",
					alignItems: "center",
					alignSelf: "flex-end",
					paddingRight: 20,
					paddingTop: 10,
				}}
			>
				<MaterialCommunityIcons
					name="filter-outline"
					size={24}
					color="#171A1F"
				/>
				<Text fontSize={16} fontWeight="medium">
					Filter
				</Text>
			</View> */}

			{visible ? (
				<AppLoading visible={visible} />
			) : (
				<View
					style={{
						borderRadius: 8,
						marginHorizontal: 20,
						marginTop: 10,
						marginBottom: 20,
						flex: 1,
					}}
				>
					<View style={{ padding: 10, position: "relative" }}>
						<Text
							fontSize={16}
							marginBottom={5}
							fontWeight="medium"
							color={color?.black}
						>
							Select Category
						</Text>

						{category.map((ele, i) => {
							return (
								<View
									key={i}
									style={{ paddingVertical: 5, flexDirection: "row" }}
								>
									<Radio.Group
										name="myRadioGroup"
										value={filterData}
										onChange={(nextValue) => {
											setFilterData(nextValue);
										}}
									>
										<Radio
											accessibilityLabel={ele.name}
											value={JSON.stringify({ id: ele.id, name: ele.name })}
										/>

										{/* {ele.name} */}

										{/* <Radio
											accessibilityLabel={ele.name}
											onPress={(e) => console.warn(e)}
											
											// value={filterData}
											// onPress={(isChecked) =>
											// 	isChecked
											// 		? setFilterData((prev) => [
											// 				...prev,
											// 				{ name: ele.name, id: ele.id },
											// 		  ])
											// 		: setFilterData((prev) =>
											// 				prev.filter((el) => el.id !== ele.id)
											// 		  )
											// }
											// selected={filterData.filter((prev) => prev === ele.id)[0]}
										/> */}
									</Radio.Group>

									<Text
										color={color?.black}
										px={3}
									>
										{ele.name}
									</Text>
								</View>
							);
						})}
					</View>

					<View
						style={{
							flexDirection: "row",
							alignSelf: "center",
							position: "absolute",
							bottom: 20,
							width: "55%",
							justifyContent: "space-between",
						}}
					>
						<AppBorderButton
							title="Apply"
							width={80}
							onPress={applyFilter}
						/>
						<AppButton
							title="Reset"
							style={{ width: 80 }}
							onPress={() => setFilterData([])}
						/>
					</View>
				</View>
			)}
		</View>
		// </LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
});

export default FilterProduct;

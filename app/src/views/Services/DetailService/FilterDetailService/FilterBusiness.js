import { useRoute } from "@react-navigation/native";
import { Radio, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { BusinessCategoryService } from "../../../../helper/services/BusinessCategory";

function FilterBusiness({ refRBSheet, setFilterData }) {
	const { params } = useRoute();
	const [data, setData] = useState();
	const [category, setCategory] = useState([]);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		BusinessCategoryService({
			categoryId: null,
			categoryName: null,
			description: null,
			name: null,
			type: "LOCALBUSINESS",
		})
			.then((res) => {
				setCategory(res.content);
				setVisible(false);
			})
			.catch((err) => console.warn(err));
	}, [params]);

	return (
		<View style={styles.container}>
			{visible ? (
				<AppLoading visible={visible} />
			) : (
				<>
					<View style={styles.subContainer}>
						<RBSheet
							customStyles={{
								container: { borderRadius: 10, backgroundColor: color.drawerGrey },
							}}
							height={520}
							ref={refRBSheet}
							dragFromTopOnly={true}
							closeOnDragDown={true}
							closeOnPressMask={true}
							draggableIcon
						>
							<>
								<View style={styles.rbView}>
									<Text
										color={color.black}
										onPress={() => {
											setFilterData();
											refRBSheet?.current?.close();
										}}
									>
										Cancel
									</Text>
									<Text
										fontSize={16}
										fontWeight="medium"
										color={color?.black}
									>
										Select Category
									</Text>
									<Text
										color={color.iosText}
										onPress={() => {
											data ? setFilterData(JSON.parse(data)) : setFilterData();
											refRBSheet?.current?.close();
										}}
									>
										Apply
									</Text>
								</View>

								<ScrollView showsVerticalScrollIndicator={false}>
									{category.map((ele, i) => {
										return (
											<View
												key={i}
												style={{ paddingVertical: 5, flexDirection: "row", marginLeft: 10 }}
											>
												<Radio.Group
													name="myRadioGroup"
													value={data}
													onChange={(nextValue) => setData(nextValue)}
												>
													<Radio
														accessibilityLabel={ele.name}
														value={JSON.stringify({ id: ele.id, name: ele.name })}
													/>
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
								</ScrollView>
							</>
						</RBSheet>
					</View>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: color?.gradientWhite },
	subContainer: {
		padding: 10,
		position: "relative",
		marginLeft: 20,
		marginTop: 10,
		marginBottom: 50,
		flex: 1,
	},
	rbView: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginHorizontal: 20,
		marginBottom: 10,
	},
});

export default FilterBusiness;

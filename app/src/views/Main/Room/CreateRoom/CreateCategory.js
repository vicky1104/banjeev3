import { Text } from "native-base";
import React, { Fragment } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import OverlayDrawer from "../../../../constants/components/ui-component/OverlayDrawer";
import { createCategoryService } from "../../../../helper/services/CategoryService";

function CreateCategory({
	createCategory,
	setCreateCategory,
	category: subCategory,
	mainCategoryName,
	mainCategoryId,
	subCategoryFunc,
}) {
	const [txt, setText] = React.useState("");
	const [category, setCategory] = React.useState(subCategory[0]?.name);
	const [open, setOpen] = React.useState(false);

	const submitCategory = React.useCallback(() => {
		if (txt.length > 0) {
			if (category === subCategory[0].name) {
				createCategoryService({
					categoryId: mainCategoryId,
					categoryName: mainCategoryName,
					description: txt,
					name: txt,
				})
					.then((res) => {
						subCategoryFunc(mainCategoryId);
						setCreateCategory(false);
					})
					.catch((err) => console.warn(err));
			} else {
				createCategoryService({
					categoryId: category.id,
					categoryName: category.name,
					description: txt,
					name: txt,
				})
					.then((res) => {
						subCategoryFunc(category.id);
						setCreateCategory(false);
					})
					.catch((err) => console.warn(err));
			}
		}
	}, [txt, category, mainCategoryName, mainCategoryId]);

	const handleClick = () => {
		submitCategory();
	};

	return (
		<React.Fragment>
			<OverlayDrawer
				transparent
				visible={createCategory}
				onClose={() => {
					setCreateCategory(false);
				}}
				closeOnTouchOutside
				animationType="fadeIn"
				containerStyle={{
					backgroundColor: "rgba(0, 0, 0, 0.4)",
					padding: 0,
					height: "100%",
					width: "100%",
				}}
				childrenWrapperStyle={{
					width: 328,
					alignSelf: "center",
					borderRadius: 4,
				}}
				animationDuration={100}
			>
				{(hideModal) => (
					<View style={styles.container}>
						<Text style={{ fontSize: 14, marginBottom: -10 }}>
							Category name should not exceed 50 Characters
						</Text>
						<TextInput
							style={{
								borderWidth: 1,
								height: 40,
								borderRadius: 6,
								paddingLeft: 10,
								marginTop: 20,
							}}
							maxLength={50}
							placeholder={"Romance"}
							onChangeText={(e) => setText(e)}
							//   onChangeText={(e) => console.log(e)}
						/>
						<Text style={{ fontSize: 14, marginTop: 20, marginBottom: 10 }}>
							Please select the main categoty from the list
						</Text>

						<DropDownPicker
							open={open}
							items={subCategory.map((ele) => {
								return {
									label: ele.name,
									value: ele.id,
									...ele,
								};
							})}
							value={category.id}
							onPress={() => setOpen(true)}
							setOpen={setOpen}
							setValue={(item) => {
								setCategory(subCategory.filter((el, i) => item() === el.id)[0]);
							}}
							showArrowIcon={false}
							placeholder={mainCategoryName}
						/>

						<View style={{ marginTop: 22, zIndex: -1 }}>
							<AppButton
								disabled={txt.length === 0}
								title={"Proceed"}
								onPress={() => handleClick()}
							/>
						</View>
					</View>
				)}
			</OverlayDrawer>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 43,
		marginBottom: 36,
		width: "90%",
	},
});

export default CreateCategory;

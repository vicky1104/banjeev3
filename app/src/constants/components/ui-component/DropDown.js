import { Text } from "native-base";
import React, { Fragment } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Platform,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { Entypo, AntDesign } from "@expo/vector-icons";
import color from "../../env/color";
import DropDownPicker from "react-native-dropdown-picker";

function DropDown({
	refRBSheet,
	data,
	iosHeight,
	placeholder,
	selectedItem,
	setSelectedItem,
	openModal,
	setOpenModal,
}) {
	return (
		<View>
			{/* ````````````````````````````````````` ANDROID */}

			{Platform.OS === "android" ? (
				<DropDownPicker
					open={openModal}
					value={selectedItem}
					items={data.map((ele) => {
						return {
							label: ele,
							value: ele,
						};
					})}
					containerStyle={{
						width: "100%",
						height: 40,
						padding: 0,
						marginBottom: 10,
						zIndex: 999,
						marginTop: 20,
					}}
					setOpen={setOpenModal}
					dropDownContainerStyle={{
						borderWidth: 1,
						padding: 0,
						borderColor: color.greyText,
						zIndex: 1,
					}}
					showTickIcon={false}
					showArrowIcon={true}
					setValue={(data) => {
						let val = data();
						setSelectedItem(val);
					}}
					selectedItemContainerStyle={{
						height: 40,
					}}
					style={{
						height: 40,
						width: "100%",
						padding: 0,
						marginBottom: 10,
						borderWidth: 1,
						borderRadius: 8,
						zIndex: 0,
						borderColor: color.greyText,
					}}
					placeholder={placeholder}
					closeOnBackPressed={true}
				/>
			) : (
				// ```````````````````````````````````````` IOS

				<Fragment>
					<TouchableWithoutFeedback onPress={() => refRBSheet.current.open()}>
						<View
							style={{
								height: 40,
								width: "100%",
								justifyContent: "center",
								alignItems: "center",
								borderWidth: 1,
								borderRadius: 8,
								borderColor: color.lightGrey,
								flexDirection: "row",
							}}
						>
							<Text color={!selectedItem ? color.greyText : color.black}>
								{selectedItem ? selectedItem : placeholder}
							</Text>

							{!selectedItem && (
								<AntDesign
									name="down"
									size={16}
									color={color.greyText}
									style={{ marginLeft: 5 }}
								/>
							)}
						</View>
					</TouchableWithoutFeedback>

					<RBSheet
						customStyles={{
							container: {
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								// backgroundColor: color.drawerGrey,       //OPTIONAL
								paddingLeft: 20,
								paddingTop: 15,
							},
						}}
						height={iosHeight} // require
						ref={refRBSheet}
						// dragFromTopOnly={true}
						// closeOnDragDown={true}
						// closeOnPressMask={true}
						draggableIcon={false}
					>
						{data.map((ele, i) => (
							<TouchableWithoutFeedback
								key={i}
								onPress={() => {
									setSelectedItem(ele);
									refRBSheet.current.close();
								}}
							>
								<View style={{ height: 50, justifyContent: "center" }}>
									<Text>{ele}</Text>
								</View>
							</TouchableWithoutFeedback>
						))}
					</RBSheet>
				</Fragment>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default DropDown;

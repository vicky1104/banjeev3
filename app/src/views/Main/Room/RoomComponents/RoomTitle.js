import { Text } from "native-base";
import React, { useContext } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { MainContext } from "../../../../../context/MainContext";
import AppBorderButton from "../../../../constants/components/ui-component/AppBorderButton";
import AppButton from "../../../../constants/components/ui-component/AppButton";
import AppInput from "../../../../constants/components/ui-component/AppInput";
import OverlayDrawer from "../../../../constants/components/ui-component/OverlayDrawer";

function RoomTitle({ openGroupModal, setOpenGroupModal }) {
	const [txt, setTxt] = React.useState("");
	const { setRoom: setRoomData } = useContext(MainContext);

	const getText = (e) => {
		if (e === "" || e === null) {
			console.warn("Empty Title");
		} else {
			setTxt(e);
		}
	};
	const setTitle = (hideModal) => {
		Keyboard.dismiss();
		hideModal();

		setRoomData((pre) => ({
			...pre,
			groupName: txt,
		}));
	};

	//   const inputRef = React.createRef(null);

	//   React.useEffect(() => inputRef.current.focus(), []);
	return (
		<React.Fragment>
			<OverlayDrawer
				transparent
				visible={openGroupModal}
				onClose={() => setOpenGroupModal(!openGroupModal)}
				closeOnTouchOutside
				animationType="fadeIn"
				containerStyle={{
					backgroundColor: "rgba(0, 0, 0, 0.4)",
					padding: 0,
					height: "100%",
					width: "100%",
				}}
				childrenWrapperStyle={{
					width: "80%",
					alignSelf: "center",
					borderRadius: 4,
				}}
				animationDuration={100}
			>
				{(hideModal) => (
					<View style={styles.container}>
						<Text style={{ fontSize: 20, marginBottom: 20 }}>
							Add Room Title
						</Text>
						<AppInput
							//   ref={inputRef}
							onChangeText={(e) => getText(e)}
							autoFocus={true}
							textAlignVertical={"top"}
							placeholder={"Your title should be in 70 Characters!"}
							numberOfLines={4}
							maxLength={70}
							multiline={true}
							style={styles.txtInput}
						/>

						<View style={styles.btnView}>
							<AppBorderButton
								width={115}
								onPress={hideModal}
								title={"Cancel"}
							/>

							<AppButton
								style={{ width: 115 }}
								title={"Save Title"}
								disabled={!txt}
								onPress={() => setTitle(hideModal)}
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
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 25,
	},
	txtInput: {
		width: 240,
		height: 66,
		borderRadius: 6,
		paddingVertical: 7,
		paddingHorizontal: 10,
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#c1c1c1",
	},
	btnView: {
		marginTop: 40,
		width: 240,
		justifyContent: "space-between",
		flexDirection: "row",
	},
});

export default RoomTitle;

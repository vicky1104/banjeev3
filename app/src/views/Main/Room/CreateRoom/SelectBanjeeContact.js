import { Text, Checkbox } from "native-base";
import React, { useContext } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	TouchableHighlight,
	TouchableOpacity,
} from "react-native";
import FastImage from "react-native-fast-image";
import color from "../../../../constants/env/color";
import { profileUrl } from "../../../../utils/util-func/constantExport";
import checkUserStatus from "../../../Other/checkUserStatus";
import AppRadioButtons from "../../../../constants/components/ui-component/AppRadioButtons";
import { MainContext } from "../../../../../context/MainContext";

function SelectBanjeeContact({
	item,
	contact,
	setContact,
	setSingleUser,
	singleUser,
	//   isRoom,
	editBanjeeContact,
	selectedUserArray,
	setSelectedUserArray,
}) {
	const [load, setLoad] = React.useState(false);
	const {
		room: { addMemberInCall },
	} = useContext(MainContext);

	React.useEffect(() => {
		if (editBanjeeContact && editBanjeeContact.length > 0) {
			setContact(() =>
				editBanjeeContact.map((ele) => {
					return { name: ele?.firstName, id: ele?.id };
				})
			);
		}
		setLoad(true);
	}, [item, editBanjeeContact]);

	if (load) {
		return (
			<TouchableHighlight
				style={{
					height: 72,
					width: "100%",
				}}
				underlayColor={"lightgrey"}
			>
				<TouchableOpacity activeOpacity={1}>
					<View style={styles.container}>
						<TouchableWithoutFeedback style={{ zIndex: 999999 }}>
							<View style={styles.imgView}>
								<FastImage
									style={styles.img}
									source={{ uri: profileUrl(item?.avtarUrl) }}
								/>

								{/* ````````````````````````` ACTIVE STATUS OF USER */}

								{item.connectedUserOnline && <View style={styles.status} />}
							</View>
						</TouchableWithoutFeedback>

						<View style={styles.txtView}>
							<Text numberOfLines={1}>{item.firstName}</Text>

							<Text
								numberOfLines={1}
								style={{ fontSize: 14, fontWeight: "300" }}
							>
								{item.connectedUserOnline
									? "Online"
									: checkUserStatus(item.userLastSeen, true)}
							</Text>
						</View>

						<View
							style={{
								alignSelf: "center",
								justifyContent: "flex-end",
								flexDirection: "row",
								width: "25%",
							}}
						>
							{addMemberInCall ? (
								<View
									style={{
										alignItems: "flex-end",
										width: "30%",
									}}
								>
									<AppRadioButtons
										style={{
											paddingTop: 14,
										}}
										PROP={[{ key: item.id, name: item.firstName, id: item.id }]}
										value={singleUser?.key}
										onChange={(e) => {
											setSingleUser(e);
										}}
									/>
								</View>
							) : (
								<View style={{}}>
									<Checkbox
										accessibilityLabel={item.firstName}
										// colorScheme={"black"}

										onChange={(isChecked) => {
											isChecked
												? setSelectedUserArray((pre) => [
														...pre,
														{ name: item.firstName, id: item.id },
												  ])
												: setSelectedUserArray((pre) =>
														pre.filter((ele) => ele.id !== item.id)
												  );
										}}
										isChecked={
											selectedUserArray?.filter((ele) => ele?.id === item.id)
												.length > 0
										}
									/>
								</View>
							)}
						</View>
					</View>

					{/*````````````````````` ITEM SEPERATOR */}

					<View style={styles.border} />
				</TouchableOpacity>
			</TouchableHighlight>
		);
	} else return <React.Fragment></React.Fragment>;
}
const styles = StyleSheet.create({
	container: {
		height: "100%",
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		position: "relative",
	},
	img: {
		height: "100%",
		width: "100%",
		borderRadius: 20,
	},
	icons: {
		position: "absolute",
		right: 0,
		justifyContent: "space-between",
		flexDirection: "row",
	},
	status: {
		height: 8,
		width: 8,
		borderRadius: 4,
		backgroundColor: color.activeGreen,
		position: "absolute",
		bottom: 0,
		left: "10%",
		zIndex: 1,
	},
	imgView: {
		position: "relative",
		elevation: 10,
		height: 40,
		width: 40,
		borderRadius: 20,
		marginLeft: 16,
		shadowColor: color.black,
		shadowOffset: { width: 2, height: 6 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		zIndex: 99,
	},
	border: {
		height: 1,
		position: "absolute",
		right: 0,
		bottom: 0,
		width: "82%",
		borderBottomColor: "lightgrey",
		borderBottomWidth: 1,
	},
	txtView: {
		flexDirection: "column",
		marginLeft: 15,
		width: "49%",
	},
});

export default SelectBanjeeContact;

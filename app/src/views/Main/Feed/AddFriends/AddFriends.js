import React, { Fragment } from "react";
import { StyleSheet } from "react-native";
import color from "../../../../constants/env/color";
import AddFriendItem from "./AddFriendItem";
import LiveRoom from "../LiveRooms/LiveRoom";

function AddFriends(props) {
	const renderItem = ({ item, index }) => {
		return <AddFriendItem item={item} index={index} />;
	};

	return (
		<Fragment>
			<LiveRoom />
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 227,
		width: "100%",
		borderColor: "lightgrey",
		borderWidth: 1,
		borderTopWidth: 0,
		marginBottom: 19,
		backgroundColor: color.white,
	},
	header: {
		height: 51,
		width: "100%",
		alignItems: "center",
		justifyContent: "space-between",
		borderColor: "lightgrey",
		borderWidth: 1,
		alignSelf: "center",
		flexDirection: "row",
		borderLeftWidth: 0,
		borderRightWidth: 0,
	},
	viewMap: {
		height: 34,
		borderWidth: 1,
		width: 118,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderColor: color.primary,
		borderRadius: 17,
		marginRight: "2%",
	},
});

export default AddFriends;

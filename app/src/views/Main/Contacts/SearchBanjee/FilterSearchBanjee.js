import React, { useContext } from "react";
import { View, StyleSheet, VirtualizedList } from "react-native";
import BanjeeContacts from "../BanjeeContacts";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
function FiltersearchBanjee(props) {
	const { profile } = useContext(AppContext);

	function renderItem({ item }) {
		if (profile?.systemUserId === item.id) {
			return null;
		} else {
			return <BanjeeContacts item={item} />;
		}
	}

	return (
		<>
			{/* {visible && <AppLoading visible={visible} />} */}

			<View style={styles.container}>
				<VirtualizedList
					getItemCount={(data) => data.length}
					getItem={(data, index) => data[index]}
					showsVerticalScrollIndicator={false}
					data={props.item}
					keyExtractor={(item) => Math.random()}
					renderItem={renderItem}
				/>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		zIndex: -2,
	},
	img: {
		borderWidth: 1,
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
		width: "100%",
		borderBottomColor: "lightgrey",
		borderBottomWidth: 1,
	},
	txtView: {
		flexDirection: "column",
		width: "49%",
	},
});

export default FiltersearchBanjee;

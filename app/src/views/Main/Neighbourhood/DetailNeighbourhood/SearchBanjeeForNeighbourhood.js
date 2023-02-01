import { Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import {
	FlatList,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { showToast } from "../../../../constants/components/ShowToast";
import AppInput from "../../../../constants/components/ui-component/AppInput";
import color from "../../../../constants/env/color";
import { AddMemberInCommunityService } from "../../../../helper/services/Community";
import { findBanjeeContacts } from "../../../../helper/services/FindContacts";
import SearchBanjeeForNeighbourhoodItem from "./SearchBanjeeForNeighbourhoodItem";

function SearchBanjeeForNeighbourhood(props) {
	const [banjeeContacts, setBanjeeContacts] = useState([]);
	const [keyWord, setKeyWord] = useState("");
	const [groupValues, setGroupValues] = React.useState([]);
	const { params } = useRoute();
	const { goBack } = useNavigation();
	const [visible, setVisible] = useState(false);

	function addMember() {
		setVisible(true);

		if (groupValues.length > 0) {
			AddMemberInCommunityService({
				cloudId: params?.cloudId,
				userIds: groupValues,
				// .map((ele) => {
				// 	return {
				// 		avtarUrl: ele.avtarUrl,
				// 		email: ele.email,
				// 		firstName: ele.firstName,
				// 		id: ele.systemUserId,
				// 		lastName: ele.lastName,
				// 		mcc: ele.mcc,
				// 		mobile: ele.mobile,
				// 		systemUserId: ele.systemUserId,
				// 		username: ele.username,
				// 	};
				// }),
			})
				.then((res) => {
					setVisible(false);
					goBack();
					showToast(`${groupValues.length} member added`);
				})
				.catch((err) => {
					setVisible(false);
					showToast(err?.message);
					console.warn(err);
				});
		} else {
			showToast("Select atleast 1 member to add.");
		}
	}

	const apicall = useCallback(() => {
		if (keyWord.length > 0) {
			findBanjeeContacts({
				deleted: "false",
				keywords: keyWord,
				page: 0,
				pageSize: 20,
			})
				.then((res) => {
					setBanjeeContacts(res.content);
				})
				.catch((err) => console.warn(err));
		}
	}, [keyWord]);

	useEffect(() => {
		apicall();
	}, [apicall]);

	return (
		<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
			<View
				keyboardShouldPersistTaps="always"
				style={styles.inputView}
			>
				{keyWord.length > 0 && (
					<View style={[styles.crossIcon, { borderColor: color?.lightWhite }]}>
						<Entypo
							name="cross"
							size={20}
							color={color.black}
							onPress={() => {
								setKeyWord("");
								setBanjeeContacts([]);
							}}
						/>
					</View>
				)}

				<AppInput
					autoFocus={true}
					value={keyWord}
					onChangeText={(e) => {
						setKeyWord(e);
					}}
					style={{
						color: color.black,
						height: 40,
						width: "100%",
						borderRadius: 8,
						padding: 10,
						backgroundColor: color?.lightWhite,
					}}
					placeholder={"Search Banjee"}
					placeholderTextColor="grey"
				/>
			</View>

			<View style={{ flex: 1 }}>
				{groupValues.length > 0 && keyWord.length === 0 && (
					<FlatList
						data={groupValues}
						keyExtractor={(data) => data.id}
						renderItem={({ item }) => {
							return (
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										borderBottomWidth: 1,
										borderColor: color?.gradientBlack,
										width: "100%",
									}}
								>
									<SearchBanjeeForNeighbourhoodItem
										item={item}
										setGroupValues={setGroupValues}
										selectedMembers={true}
									/>
								</View>
							);
						}}
					/>
				)}
				{keyWord.length > 0 && (
					<FlatList
						data={banjeeContacts}
						keyExtractor={(data) => data.id}
						renderItem={({ item }) => {
							return (
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										borderBottomWidth: 1,
										borderColor: color?.gradientBlack,
										width: "100%",
									}}
								>
									<SearchBanjeeForNeighbourhoodItem
										item={item}
										setGroupValues={setGroupValues}
										selectedMembers={false}
									/>
								</View>
							);
						}}
					/>
				)}
			</View>

			{groupValues.length > 0 && (
				<TouchableWithoutFeedback
					onPress={addMember}
					disabled={visible}
				>
					<View style={[styles.txtView, { backgroundColor: color.white }]}>
						<Text style={styles.txt}>{`Add ${groupValues.length} Members`}</Text>
					</View>
				</TouchableWithoutFeedback>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	inputView: {
		position: "relative",
		width: "100%",
		paddingHorizontal: "2.5%",
		alignSelf: "center",
		marginTop: 10,
		alignItems: "center",
		marginBottom: 10,
	},
	crossIcon: {
		borderRadius: 50,
		height: 25,
		width: 25,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		right: 20,
		zIndex: 99,
		top: 7,
	},
	txtView: {
		height: 40,
		alignSelf: "center",
		alignItems: "center",

		borderRadius: 20,
		marginTop: 10,
		justifyContent: "center",
		elevation: 5,
		marginBottom: 10,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 3,
	},
	txt: {
		textAlign: "center",
		fontSize: 16,
		color: color.black,
		fontWeight: "400",
		paddingHorizontal: 20,
	},
});

export default SearchBanjeeForNeighbourhood;

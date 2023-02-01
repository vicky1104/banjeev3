import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	SafeAreaView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import FiltersearchBanjee from "./FilterSearchBanjee";
import { searchMyBanjee } from "../../../../helper/services/SearchMyBanjee";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import AppInput from "../../../../constants/components/ui-component/AppInput";
import { Text } from "native-base";
import OtherBanjee from "./OtherBanjee";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";

function SearchBanjee(props) {
	const { goBack } = useNavigation();
	const [banjee, setBanjee] = React.useState(true);
	const [otherBanjee, setOtherBanjee] = React.useState(false);
	const [searchBanjee, setSearchBanjee] = React.useState([]);
	const [keyword, setKeyword] = useState("");

	const { profile } = useContext(AppContext);

	const callApiOfSearching = useCallback(() => {
		let url = `https://gateway.banjee.org/services/userprofile-service/api/userKeyword/${profile?.systemUserId}/${keyword}`;
		if (banjee) {
			// setSearchBanjee(false);
			searchMyBanjee({
				blocked: "false",
				circleId: null,
				connectedUserId: null,
				fromUserId: null,
				id: null,
				keyword,
				page: 0,
				pageSize: 0,
				toUserId: null,
				userId: profile?.systemUserId,
			})
				.then((res) => {
					if (res?.content?.length > 0) {
						let x = res?.content?.map((ele) => {
							return {
								age: ele?.user?.age,
								avtarUrl: ele?.user?.avtarUrl,
								chatroomId: ele?.chatroomId,
								connectedUserOnline: ele?.connectedUserOnline,
								domain: "208991",
								email: ele?.user?.email,
								firstName: ele?.user?.firstName,
								gender: ele?.user?.gender,
								id: ele?.user?.id,
								lastName: ele?.user?.lastName,
								locale: "eng",
								mcc: ele?.user?.mcc,
								mobile: ele?.user?.mobile,
								name: ele?.user?.name,
								realm: "banjee",
								ssid: null,
								systemUserId: ele?.user?.id,
								timeZoneId: "GMT",
								userId: ele?.userId,
								userLastSeen: ele?.userLastSeen,
								username: ele?.user?.firstName,
							};
						});

						console.log(x.map((ele) => ele.username));
						setSearchBanjee(x);
					} else {
						ToastMessage("No user found");
					}
				})
				.catch((err) => console.log(err));
		} else if (otherBanjee) {
			setSearchBanjee([]);

			if (keyword.length > 2) {
				axios
					.get(url)
					.then((res) => setSearchBanjee(res.data))
					.catch((err) => console.log(err));
			}
		}
	}, [keyword, otherBanjee, profile, banjee]);

	useEffect(() => {
		callApiOfSearching();
	}, [callApiOfSearching]);

	const handleChange = (e) => {
		console.log("keyword", e);
		setKeyword(e);
	};

	// console.warn("searchBanjee.length", searchBanjee?.length);

	return (
		<SafeAreaView>
			<View style={{ height: "100%", width: "100%" }}>
				<LinearGradient
					style={styles.container}
					start={{ x: 1, y: 0 }}
					end={{ x: 0, y: 0 }}
					colors={["#ED475C", "#A93294"]}
				>
					<AppFabButton
						onPress={() => goBack()}
						size={24}
						icon={
							<MaterialCommunityIcons
								size={24}
								name="arrow-left"
								color={color.white}
							/>
						}
					/>
					<View
						style={{
							position: "relative",
							width: "80%",
							alignItems: "center",
						}}
					>
						{keyword.length > 0 && (
							<View
								style={{
									borderRadius: 50,
									height: 25,
									width: 25,
									borderWidth: 1,
									alignItems: "center",
									justifyContent: "center",
									borderColor: "black",
									position: "absolute",
									right: 10,
									zIndex: 99,
									top: 7,
								}}
							>
								<Entypo
									name="cross"
									size={20}
									color={color.black}
									onPress={() => setKeyword("")}
								/>
							</View>
						)}
						<AppInput
							// height={10}
							value={keyword}
							onChangeText={handleChange}
							placeholder={"Search Banjee"}
						/>
					</View>
					<View style={styles.container}></View>
				</LinearGradient>

				{/* navigation */}
				<View style={styles.subContainer}>
					{/* ```````````````````` BANJEE */}

					<TouchableWithoutFeedback
						onPress={() => {
							setSearchBanjee([]), setBanjee(true), setOtherBanjee(false);
						}}
					>
						<View
							style={[
								styles.banjeeStyle,
								{
									borderBottomWidth: banjee ? 2 : 0,
									borderColor: banjee ? color.primary : "white",
								},
							]}
						>
							<Text
								style={{
									fontWeight: "500",
									color: banjee ? color.black : color.greyText,
								}}
								onPress={() => {
									setBanjee(true), setSearchBanjee([false]), setOtherBanjee(false);
								}}
							>
								Banjee
							</Text>
						</View>
					</TouchableWithoutFeedback>

					{/* `````````````````````````` OTHER BANJEE */}

					<TouchableWithoutFeedback
						onPress={() => {
							setSearchBanjee([]), setOtherBanjee(true), setBanjee(false);
						}}
					>
						<View
							style={[
								styles.otherBanjeeStyle,
								{
									borderBottomWidth: otherBanjee ? 2 : 0,
									borderColor: otherBanjee ? color.primary : "white",
								},
							]}
						>
							<Text
								style={{
									fontWeight: "500",
									color: otherBanjee ? color.black : color.greyText,
								}}
								onPress={() => {
									setSearchBanjee([]);
									setOtherBanjee(true), setBanjee(false);
								}}
							>
								Other Banjee
							</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>

				{/* 
      {banjee && (searchBanjee?.length === 0 || keyword.length === 0) && (
        <MyBanjee />
      )} */}

				{searchBanjee?.length > 0 && otherBanjee && keyword.length > 0 && (
					<OtherBanjee item={searchBanjee} />
				)}
				{searchBanjee?.length > 0 && banjee && (
					<FiltersearchBanjee item={searchBanjee} />
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		height: 70,
	},
	subContainer: {
		width: "100%",
		height: 50,
		backgroundColor: "white",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		// paddingBottom: 10,
	},
	banjeeStyle: {
		width: "40%",
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
	},
	otherBanjeeStyle: {
		width: "40%",
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
	},
});

export default SearchBanjee;

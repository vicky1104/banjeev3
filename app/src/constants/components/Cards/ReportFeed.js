import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import React, { useContext, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import RBSheet from "react-native-raw-bottom-sheet";
import { MainContext } from "../../../../context/MainContext";
import { deleteAlertService } from "../../../helper/services/CreateAlertService";
import {
	ReportFeedService,
	ReportGroupService,
	ReportNeighbourhoodService,
} from "../../../helper/services/SearchFeedbyId";
import color from "../../env/color";
import { showToast } from "../ShowToast";
import AppButton from "../ui-component/AppButton";
import AppInput from "../ui-component/AppInput";
import { Entypo } from "@expo/vector-icons";
function ReportFeed({
	setModalVisible,
	feedId,
	reportType,
	onPress,
	refRBSheet,
}) {
	const [otherActive, setOtherActive] = useState(false);
	const [reportMsg, setReportMsg] = React.useState("");
	const [selectedIndex, setSelectedIndex] = useState();

	const submitPostReport = () => {
		if (reportMsg?.length > 0) {
			let payload = {
				feedId: feedId,
				remark: reportMsg,
			};
			let payload2 = {
				alertId: feedId,
				comment: reportMsg,
			};
			switch (reportType) {
				case "feed":
					ReportFeedService(payload)
						.then((res) => {
							showToast("Post reported ..!!");
							// setModalVisible(false);
							refRBSheet?.current?.close();
							onPress();
						})
						.catch((err) => console.warn(err));

					break;

				case "alert":
					deleteAlertService(payload2)
						.then((res) => {
							showToast("Alert reported ..!!");
							refRBSheet?.current?.close();
							// setModalVisible(false);
							onPress();
						})
						.catch((err) => console.warn(err));

					break;

				case "group":
					ReportGroupService(payload)
						.then((res) => {
							showToast("Group reported successfully ..!!");
							refRBSheet?.current?.close();
							// setModalVisible(false);
							onPress();
						})
						.catch((err) => console.warn(err));

					break;

				case "neighbourhood":
					ReportNeighbourhoodService(payload)
						.then((res) => {
							showToast("Neighbourhood reported successfully ..!!");
							refRBSheet?.current?.close();
							// setModalVisible(false);
							onPress();
						})
						.catch((err) => console.warn(err));

					break;

				default:
					console.warn("default is executing......");
					break;
			}
		} else {
			showToast("please give reason to report");
		}
	};

	const handleModelVisible = () => setModalVisible(false);

	const feedArray = [
		{ name: "Irrelavent Content" },
		{ name: "Have Unappropriate Language" },
		{ name: "Contaning nudity or sexual activity" },
		{ name: "Encouraging Violence" },
		{ name: "Harassment" },
		{ name: "Hate Speech" },
		{ name: "Other" },
	];
	const neighbourhoodArray = [
		{ name: "Fake" },
		{ name: "Have Unappropriate Language" },
		{ name: "Contaning nudity or sexual activity" },
		{ name: "Encouraging Violence" },
		{ name: "Harassment" },
		{ name: "Hate Speech" },
		{ name: "Other" },
	];
	const alertArray = [
		{ name: "Irrelavent Content" },
		{ name: "Misleading" },
		{ name: "Fake or Incorrect" },
		{ name: "Encouraging Violence" },
		{ name: "Other" },
	];

	function getData() {
		switch (reportType) {
			case "feed":
				return feedArray;
			case "neighbourhood":
				return neighbourhoodArray;
			case "alert":
				return alertArray;

			default:
				break;
		}
	}

	function renderText() {
		switch (reportType) {
			case "feed":
				return "Please tap the option that better explains why you reporting this feed. I find this feed to be:";
			case "neighbourhood":
				return "Please tap the option that better explains why you reporting this neighborhood. I find this neighborhood to be:";
			case "alert":
				return "Please tap the option that better explains why you reporting this Alert. I find this alert to be:";
			default:
				break;
		}
	}
	return (
		<RBSheet
			customStyles={{
				container: { borderRadius: 10, backgroundColor: color.drawerGrey },
			}}
			height={420}
			// height={520}
			onClose={() => {
				setSelectedIndex(""), setReportMsg(""), setOtherActive(false);
			}}
			ref={refRBSheet}
			dragFromTopOnly={true}
			closeOnDragDown={true}
			closeOnPressMask={true}
			draggableIcon
		>
			{/* <View style={{ height: "100%" }}> */}
			<View style={[styles.container, { paddingHorizontal: 10 }]}>
				<Text
					color={color?.black}
					fontWeight="medium"
					textAlign={"center"}
					fontSize="16"
				>
					Report
				</Text>

				<ScrollView showsVerticalScrollIndicator={false}>
					<Text
						color={color?.black}
						mt={2}
						mb={4}
					>
						{renderText()}
					</Text>

					{getData()?.map((ele, i) => {
						return (
							<TouchableWithoutFeedback
								key={i}
								onPress={() => {
									setSelectedIndex(i);
									ele.name === "Other"
										? (setReportMsg(""), setOtherActive(!otherActive))
										: setReportMsg(ele.name);
								}}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										borderBottomWidth: 1,
										borderColor: color?.border,
										height: 40,
									}}
								>
									<Text
										color={color?.black}
										opacity={selectedIndex === i ? 100 : 80}
									>
										{ele.name}
									</Text>

									{selectedIndex === i && (
										<Entypo
											name="check"
											size={24}
											color="white"
											style={{ marginRight: 10 }}
										/>
									)}
								</View>
							</TouchableWithoutFeedback>
						);
					})}

					{otherActive && (
						<AppInput
							multiline={true}
							numberOfLines={4}
							textAlignVertical={"top"}
							placeholder={"Please Type...."}
							style={styles.input}
							onChangeText={(e) => setReportMsg(e)}
						/>
					)}

					<View style={styles.btn}>
						<AppButton
							onPress={submitPostReport}
							style={{ width: 120, borderRadius: 20 }}
							title={"Report"}
						/>
					</View>
				</ScrollView>
			</View>
			{/* </View> */}
		</RBSheet>
	);
}

const styles = StyleSheet.create({
	container: {},
	input: {
		color: "white",
		height: 86,
		textAlignVertical: "top",
		padding: 9,
		borderWidth: 1,
		borderColor: color.greyText,
		borderRadius: 4,
		marginTop: 10,
	},
	btn: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "center",
		marginTop: 20,
		marginBottom: 60,
	},
});

export default ReportFeed;

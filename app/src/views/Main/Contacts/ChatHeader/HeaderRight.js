import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { showToast } from "../../../../constants/components/ShowToast";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import AppMenu from "../../../../constants/components/ui-component/AppMenu";
import color from "../../../../constants/env/color";
import CallRtcEngine from "../../../../Context/CallRtcEngine";
export default function HeaderRight({
	chatUser,
	setReportModal,
	setBlockModal,
	setUnfriendModal,
}) {
	const { navigate } = useNavigation();
	const _rtcEngine = useContext(CallRtcEngine)?._rtcEngine;

	const handleCallFunc = (callType) => {
		if (_rtcEngine) {
			showToast("Can't place a new call while you're already in a call");
		} else {
			navigate("OneToOneCall", {
				...chatUser,
				callType: callType,
				initiator: true,
			});
		}
	};

	return (
		<React.Fragment>
			{!chatUser?.group && (
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<AppFabButton
						onPress={() => handleCallFunc("video")}
						size={20}
						icon={
							<Image
								style={{ height: 20, width: 20, tintColor: color?.black }}
								source={require("../../../../../assets/EditDrawerIcon/ic_video_call.png")}
							/>
						}
					/>

					<AppFabButton
						onPress={() => handleCallFunc("audio")}
						size={20}
						icon={
							<Image
								style={{ height: 20, width: 20, tintColor: color?.black }}
								source={require("../../../../../assets/EditDrawerIcon/ic_call_black.png")}
							/>
						}
					/>
					<View
						style={{
							// borderWidth: 1,
							// alignItems: "center",
							// justifyContent: "center",
							marginTop: -2,
						}}
					>
						<AppMenu
							menuColor={color?.black}
							menuContent={[
								{
									icon: "block-helper",
									label: "Block ",
									onPress: () => setBlockModal(true),
								},
								{
									icon: "flag",
									label: "Report",
									onPress: () => setReportModal(true),
								},
							]}
						/>
					</View>
				</View>
			)}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({});

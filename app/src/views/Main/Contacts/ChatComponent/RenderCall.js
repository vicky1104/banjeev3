import { View } from "react-native";
import FastImage from "react-native-fast-image";
import React, { useContext } from "react";
import { Text } from "native-base";
import { setDateFormat } from "./checkUserStatus";
import { AppContext } from "../../../../Context/AppContext";

export default function RenderCall({ chatContent }) {
	const { profile } = useContext(AppContext);

	const {
		content: { description },
	} = chatContent;
	const parseDesc = JSON.parse(description);

	const renderPill = (image, text) => (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
			}}
		>
			<FastImage
				style={{ width: 22, height: 22, marginRight: 5 }}
				source={image}
			/>
			<Text style={{ fontSize: 12, fontWeight: "bold" }}>{text}</Text>
		</View>
	);

	const renderOtherTypes = (data) => {
		const { incomingCall, outgoingCall, callDuration, missedCall } = data;
		if (data?.callType === "Video") {
			if (incomingCall) {
				return renderPill(
					require("../../../../../assets/EditDrawerIcon/call_icon/incoming_video_call.png"),
					`Video call ${callDuration ? `for ${callDuration} min` : ""}`
				);
			}
			if (outgoingCall) {
				return renderPill(
					require("../../../../../assets/EditDrawerIcon/call_icon/outgoing_video_call.png"),
					`Video call ${callDuration ? `for ${callDuration} min` : ""}`
				);
			}
			if (missedCall) {
				return renderPill(
					require("../../../../../assets/EditDrawerIcon/call_icon/missed_video_call.png"),
					`Missed Video Call`
				);
			}
		} else if (data?.callType === "Voice") {
			if (incomingCall) {
				return renderPill(
					require("../../../../../assets/EditDrawerIcon/call_icon/incoming_call.png"),
					`Voice call ${callDuration ? `for ${callDuration} min` : ""}`
				);
			}
			if (outgoingCall) {
				return renderPill(
					require("../../../../../assets/EditDrawerIcon/call_icon/outgoing_voice_call.png"),
					`Voice call ${callDuration ? `for ${callDuration} min` : ""}`
				);
			}
			if (missedCall) {
				return renderPill(
					require("../../../../../assets/EditDrawerIcon/call_icon/missed_call.png"),
					`Missed Voice Call`
				);
			}
		}
	};

	return (
		<React.Fragment>
			{profile?.systemUserId === parseDesc?.userId && (
				<View style={{ marginVertical: 5 }}>
					<Text
						style={{
							fontSize: 12,
							marginVertical: 5,
							fontWeight: "bold",
							textAlign: "center",
						}}
					>
						{setDateFormat(parseDesc?.createdOn).split(", ")[1]}
					</Text>
					<View
						style={{
							backgroundColor: !parseDesc?.missedCall ? "#e3ffe9" : "#d8f1ff",
							padding: 10,
							display: "flex",
							flexDirection: "row",
							borderRadius: 50,
						}}
					>
						{renderOtherTypes(parseDesc)}
					</View>
				</View>
			)}
		</React.Fragment>
	);
}

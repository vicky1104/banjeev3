import { Avatar, Text } from "native-base";
import React from "react";
import { Image, View, VirtualizedList } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { MainContext } from "../../../../../context/MainContext";

import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../utils/util-func/convertTime";
import BroadcastContext from "../Context";

function ChatScreen(props) {
	const { openChat } = props;

	const scrollViewRef = React.useRef(null);

	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const members = React.useContext(BroadcastContext)?.members || [];
	const chat = React.useContext(BroadcastContext)?.chat || [];
	const hostId = React.useContext(BroadcastContext)?.host.id || [];

	const renderItem = (type, src) => {
		switch (type) {
			case "RAISE_HAND":
				return (
					<MaterialCommunityIcons
						name="hand-back-left"
						size={16}
						color={"#fcd200"}
					/>
				);
			case "EMOJI":
				return (
					<Image
						source={{
							uri: "http://media1.giphy.com/media/" + src + "/giphy.gif",
						}}
						style={{ height: 30, width: 30 }}
					/>
				);
			case "TEXT":
				return (
					<Text
						color="#FFF"
						fontSize={12}
						maxWidth="95%"
					>
						{src}
					</Text>
				);
			case "ALERT":
				return (
					<Text
						color="#FFF"
						fontSize={12}
					>
						{src}
					</Text>
				);
			default:
				break;
		}
	};

	const renderComponent = ({ item }) => {
		const {
			memberId,
			createdOn,
			content: { src, type },
			memberObj,
		} = item;

		// if (memberId === systemUserId) {
		// 	return (
		// 		<View
		// 			style={{
		// 				width: "100%",
		// 				display: "flex",
		// 				flexDirection: "column",
		// 				alignItems: "flex-end",
		// 				justifyContent: "center",
		// 				borderBottomWidth: 0.5,
		// 				borderBottomColor: "#FFF",
		// 				paddingHorizontal: 10,
		// 				paddingVertical: 2,
		// 			}}
		// 		>
		// 			{renderItem(type, src)}
		// 		</View>
		// 	);
		// } else {
		return (
			<View
				style={{
					width: "100%",
					paddingVertical: 2,
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					justifyContent: "center",
					paddingHorizontal: 10,
					backgroundColor: "rgba(0,0,0,0.35)",
				}}
			>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Avatar
						borderColor={color?.border}
						borderWidth={1}
						bgColor={color.gradientWhite}
						style={{
							height: 30,
							width: 30,
							borderRadius: 60,
						}}
						source={{ uri: listProfileUrl(memberId) }}
					>
						{memberObj?.firstName.charAt(0).toUpperCase() || ""}
					</Avatar>
					<View style={{ marginHorizontal: 5 }}>
						<Text
							color={color?.black}
							fontSize={10}
						>
							{memberObj?.firstName} {memberObj?.lastName}{" "}
							{memberId === systemUserId
								? "(You)"
								: hostId === systemUserId || hostId === "63a97673e6d4f71ef6e4cca5"
								? "(Admin)"
								: ""}
						</Text>
						{renderItem(type, src)}
					</View>
				</View>
			</View>
		);
		// }
	};

	if (!openChat) return null;

	return (
		<VirtualizedList
			ref={scrollViewRef}
			data={chat}
			renderItem={renderComponent}
			keyExtractor={(item) => item.id}
			style={{ width: "100%" }}
			getItemCount={(chatData) => chatData.length}
			getItem={(data, index) => data[index]}
			showsVerticalScrollIndicator={false}
			onContentSizeChange={() =>
				scrollViewRef.current.scrollToEnd({ animated: true })
			}
		/>
	);
}

export default ChatScreen;

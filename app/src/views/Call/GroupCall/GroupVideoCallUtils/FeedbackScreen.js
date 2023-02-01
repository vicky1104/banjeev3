import { Avatar, Text } from "native-base";
import React from "react";
import { Image, SafeAreaView, View, VirtualizedList } from "react-native";

import color from "../../../../constants/env/color";
import { listProfileUrl } from "../../../../utils/util-func/constantExport";
import { convertTime } from "../../../../utils/util-func/convertTime";
import CallContext from "../Context";

function FeedbackScreen(props) {
	const { systemUserId } = props;

	const members = React.useContext(CallContext)?.members || [];
	const feedback = React.useContext(CallContext)?.feedback || [];

	console.log("feedback, ", feedback);

	const renderComponent = ({ item }) => {
		console.warn("item", item, systemUserId);
		const {
			userId,
			createdOn,
			content: { src, type },
			userObject,
		} = item;

		if (userId === systemUserId) {
			return (
				<View
					style={{
						width: "100%",
						paddingVertical: 10,
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						justifyContent: "center",
						borderBottomWidth: 1,
						borderBottomColor: color?.border,
						paddingHorizontal: 10,
						backgroundColor: color?.gradientWhite,
					}}
				>
					{type === "raiseHand" ? (
						<Image
							source={{
								uri: "https://gateway.banjee.org//services/media-service/iwantcdn/resources/61e7d352374f282c5b4caba9?actionCode=ACTION_DOWNLOAD_RESOURCE",
							}}
							style={{ height: 30, width: 30 }}
						/>
					) : (
						<Image
							source={{
								uri: "http://media1.giphy.com/media/" + src + "/giphy.gif",
							}}
							style={{ height: 30, width: 30 }}
						/>
					)}
					{/* <Text style={{ fontSize: 12, marginTop: 7 }}>
            {setDateFormat(createdOn)}
          </Text> */}
				</View>
			);
		} else {
			return (
				<View
					style={{
						width: "100%",
						paddingVertical: 10,
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						justifyContent: "center",
						borderBottomWidth: 1,
						borderBottomColor: color?.border,
						paddingHorizontal: 10,
						backgroundColor: color?.gradientWhite,
					}}
				>
					{/* <Text style={{ fontSize: 12, marginBottom: 7 }}>
            {`${userName}   ${setDateFormat(createdOn)}`}
          </Text> */}
					<View
						style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
					>
						<Avatar
							borderColor={color?.border}
							borderWidth={1}
							bgColor={color.gradientWhite}
							style={{
								height: 30,
								width: 30,
								borderRadius: 50,
							}}
							source={{ uri: listProfileUrl(userId) }}
						>
							{members
								.filter((ele) => ele.id === userId)?.[0]
								?.firstName?.charAt(0)
								.toUpperCase() || ""}
						</Avatar>
						<View style={{ marginHorizontal: 10 }}>
							<Text
								color={color?.black}
								fontSize={12}
							>
								{userObject?.firstName} {userObject?.lastName}
							</Text>
							<Text
								color={color?.black}
								fontSize={10}
							>
								{convertTime(createdOn)}
							</Text>
						</View>
						{type === "raiseHand" ? (
							<Image
								source={{
									uri: "https://gateway.banjee.org//services/media-service/iwantcdn/resources/61e7d352374f282c5b4caba9?actionCode=ACTION_DOWNLOAD_RESOURCE",
								}}
								style={{ height: 30, width: 30, marginLeft: 10 }}
							/>
						) : (
							<Image
								source={{
									uri: "http://media1.giphy.com/media/" + src + "/giphy.gif",
								}}
								style={{ height: 30, width: 30, marginLeft: 10 }}
							/>
						)}
					</View>
				</View>
			);
		}
	};

	return (
		<SafeAreaView
			style={{
				width: "100%",
				height: "100%",
				marginTop: 85,
			}}
		>
			<View
				style={{
					paddingBottom: 175,
				}}
			>
				<VirtualizedList
					data={feedback}
					renderItem={renderComponent}
					keyExtractor={(item) => item.id}
					style={{ width: "100%" }}
					getItemCount={(feedbackData) => feedbackData.length}
					getItem={(data, index) => data[index]}
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</SafeAreaView>
	);
}

export default FeedbackScreen;

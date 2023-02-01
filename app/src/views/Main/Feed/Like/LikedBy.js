import { Avatar, Text } from "native-base";
import React, { Fragment, useContext } from "react";
import { View, StyleSheet } from "react-native";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { profileUrl } from "../../../../utils/util-func/constantExport";

function LikedBy({ item, increementLike }) {
	const { profile } = useContext(AppContext);

	let ourId = item?.reactions?.filter(
		(ele) => ele?.userId === profile?.systemUserId
	)?.[0]?.userId;

	// let ourId = ourData[0]?.userId;
	return (
		<Fragment>
			{item?.reactions?.length === 1 ? (
				<View style={[styles.container, { marginTop: 5 }]}>
					<Avatar
						borderColor={color?.border}
						borderWidth={1}
						size={"xs"}
						source={{ uri: profileUrl(item?.reactions?.[0]?.avtarUrl) }}
						style={{
							borderRadius: 50,
						}}
					>
						<Text>{item?.reactions?.[0]?.user?.username}</Text>
					</Avatar>
					<Text style={{ fontSize: 14, marginLeft: 8, color: color?.black }}>
						Liked by{" "}
						<Text fontWeight={"bold"}>
							{" "}
							{ourId === profile?.systemUserId
								? "you"
								: item?.reactions?.[0]?.user?.username}{" "}
						</Text>
					</Text>
				</View>
			) : (
				item?.totalReactions > 0 && (
					<View style={[styles.container, { marginBottom: -15, marginTop: -5 }]}>
						<Avatar.Group
							key={Math.random()}
							_avatar={{ size: "xs" }}
							h={"12"}
							max={3}
							style={styles.grp}
						>
							{item?.reactions?.map((img, i) => {
								return (
									<Avatar
										key={i}
										source={{ uri: listProfileUrl(img.userId) }}
										style={{
											borderWidth: 1,
										}}
									>
										<Text key={i}>{img?.user?.username?.charAt(0).toUpperCase()}</Text>
									</Avatar>
								);
							})}
						</Avatar.Group>

						<Text style={{ fontSize: 14, marginLeft: 8 }}>
							Liked by{" "}
							<Text fontWeight={"bold"}>
								{" "}
								{increementLike !== 0 ? "You" : item?.reactions?.[0]?.user?.username}
							</Text>{" "}
							&{" "}
							{increementLike !== 0
								? item?.reactions?.length
								: item?.reactions?.length - 1}{" "}
							other.
						</Text>
					</View>
				)
			)}
		</Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: "5%",
		flexDirection: "row",
		width: "95%",
		alignItems: "center",
	},
	grp: {
		position: "relative",
		borderRadius: 50,
		alignItems: "center",
	},
});

export default LikedBy;

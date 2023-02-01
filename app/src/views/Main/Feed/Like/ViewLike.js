import { useRoute } from "@react-navigation/native";
import { Avatar, Text } from "native-base";
import React, { Fragment, useContext, useState } from "react";
import { useEffect } from "react";
import { StyleSheet, View, VirtualizedList } from "react-native";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { AppContext } from "../../../../Context/AppContext";
import { getBlogReaction } from "../../../../helper/services/Blogs";
import { getPostReaction } from "../../../../helper/services/Reaction";
import { profileUrl } from "../../../../utils/util-func/constantExport";
import { emojies } from "../../../../utils/util-func/emojies";

function ViewLike() {
	const {
		params: { userReaction, increementLike, fromBlog },
	} = useRoute();

	const { params } = useRoute();
	const [loading, setLoading] = useState(true);

	const [data, setData] = React.useState(userReaction ? userReaction : []);
	const { profile } = useContext(AppContext);

	useEffect(() => {
		if (fromBlog) {
			if (params?.blogLikeID) {
				getBlogReaction(params.blogLikeID)
					.then((res) => {
						setLoading(false);
						console.log(res);
					})
					.catch((err) => console.warn(err));
			}
		} else if (params?.blogLikeID) {
			getPostReaction(params?.blogLikeID)
				.then((res) => {
					setLoading(false);
					setData(res);
				})
				.catch((err) => console.warn(err));
		}
		// if (params?.blogLikeID) {
		// 	console.warn("first", params?.blogLikeID);
		// 	getBlogReaction(params.blogLikeID)
		// 		.then((res) => console.log(res))
		// 		.catch((err) => console.warn(err));
		// }
	}, [params]);
	console.warn(loading, "loading");
	function renderItem({ item, index }) {
		const { username, id, avtarUrl, firstName, lastName } = item.user;
		const { reactionType } = item;

		return (
			<Fragment>
				{loading ? (
					<AppLoading visible={true} />
				) : (
					<View
						style={[styles.container, { backgroundColor: color?.gradientWhite }]}
					>
						<View style={styles.subContainer}>
							<Avatar
								borderColor={color?.border}
								borderWidth={1}
								bgColor={color.gradientWhite}
								style={styles.img}
								source={{ uri: profileUrl(avtarUrl) }}
							>
								{item?.username?.charAt(0).toUpperCase() || ""}
							</Avatar>

							{emojies(reactionType, false, 18)}
						</View>

						<View style={styles.name}>
							<Text
								style={{ width: "80%" }}
								color={color?.black}
								numberOfLines={3}
							>
								{firstName} {lastName}
							</Text>
						</View>
					</View>
				)}
			</Fragment>
		);
	}

	return (
		<View
			style={{
				height: "100%",
				width: "100%",
				backgroundColor: color?.gradientWhite,
			}}
		>
			{data.length === 0 && !increementLike && (
				<View
					style={{
						height: "100%",
						width: "100%",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: color?.gradientWhite,
					}}
				>
					<Text color={color?.black}>
						{fromBlog
							? "Be the first to like this blog"
							: "Be the first to like this post"}
					</Text>
				</View>
			)}

			<Fragment>
				{increementLike && increementLike?.like !== data?.length ? (
					<View style={styles.container}>
						<View style={styles.subContainer}>
							<Avatar
								borderColor={color?.border}
								borderWidth={1}
								bgColor={color.gradientWhite}
								style={styles.img}
								source={{ uri: profileUrl(profile?.avtarUrl) }}
							>
								{profile?.firstName?.charAt(0).toUpperCase() || ""}
							</Avatar>
							{emojies(increementLike?.type, false, 18)}
						</View>
						<View style={styles.name}>
							<Text
								style={{ width: "80%" }}
								color={color?.black}
								numberOfLines={3}
							>
								{profile?.firstName} {profile?.lastName}
							</Text>
						</View>
					</View>
				) : null}
			</Fragment>

			<VirtualizedList
				howsVerticalScrollIndicator={false}
				getItemCount={(data) => data.length}
				getItem={(data, index) => data[index]}
				data={data}
				keyExtractor={(data) => data.id}
				renderItem={renderItem}
				removeClippedSubviews={true}
				initialNumToRender={10}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: 70,
		alignItems: "center",
		flexDirection: "row",
	},
	subContainer: {
		height: 40,
		width: 40,
		marginLeft: 10,
		marginRight: 20,
		position: "relative",
	},

	img: { height: 40, width: 40, borderRadius: 20 },
	name: {
		width: "100%",
		borderBottomWidth: 1,
		borderColor: color.grey,
		height: 70,
		justifyContent: "center",
	},
});

export default ViewLike;

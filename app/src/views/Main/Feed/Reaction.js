import { EvilIcons } from "@expo/vector-icons";
import React, { useContext, useEffect } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Menu, MenuItem } from "react-native-material-menu";
import Sound from "react-native-sound";
import ringtone from "../../../../assets/ringtones/reaction.mp3";
import color from "../../../constants/env/color";
import { AppContext } from "../../../Context/AppContext";
import { createBlogLike } from "../../../helper/services/Blogs";
import { postReaction } from "../../../helper/services/Reaction";
import { emojies } from "../../../utils/util-func/emojies";

function Reaction({
	nodeType,
	postId,
	size,
	ourLike,
	setIncreementLike,
	likeOnOurPost,
	setLikeOnOurPost,
	marginLeft,
	defLike,
	reactBlogComment,
	reaction,
}) {
	const [showReaction, setShowReaction] = React.useState(false); //fr reaction
	const [selectedReaction, setSelectedReaction] = React.useState();
	const { profile } = useContext(AppContext);

	// console.warn("----------->`", ourLike?.[0]?.reactionType);

	let y = ourLike?.[0]?.reactionType;

	useEffect(() => {
		if (defLike) {
			submitReaction("LIKE");
			setSelectedReaction(require("../../../../assets/emoji/LIKE.png"));
		}
	}, [defLike, reaction]);

	const playMusic = () => {
		Sound.setCategory("Playback");
		var ding = new Sound(ringtone, (error) => {
			if (error) {
				console.log("failed to load the sound", error);
				return;
			} else {
				ding.play();
			}
			//console.log("when loaded successfully");
		});
		ding.setVolume(1);
	};
	const submitReaction = (action) => {
		if (reactBlogComment) {
			createBlogLike({
				postId: postId,
				postType: "COMMENT",
				reactionType: action,
			})
				.then(() => {
					playMusic();
					setShowReaction(false);
					y ? setIncreementLike(0) : setIncreementLike((pre) => pre + 1);
				})
				.catch((err) => console.warn(err));
		} else {
			postReaction({
				nodeId: postId,
				nodeType: nodeType,
				reactionType: action,
				userId: profile?.systemUserId,
			})
				.then(async (res) => {
					setLikeOnOurPost(false);
					playMusic();
					setShowReaction(false);
					y
						? undefined
						: !likeOnOurPost
						? undefined
						: setIncreementLike((pre) => pre + 1);
				})

				.catch((err) => {
					console.warn("Post Reaction ", err);
				});
		}
	};

	const reactions = [
		{
			emoji: require("../../../../assets/emoji/LIKE.png"),
			text: "like",
			onPress: () => {
				submitReaction("LIKE");
				setSelectedReaction(require("../../../../assets/emoji/LIKE.png"));
			},
		},
		{
			emoji: require("../../../../assets/emoji/LOVE.png"),
			text: "love",
			onPress: () => {
				submitReaction("LOVING");
				setSelectedReaction(require("../../../../assets/emoji/LOVE.png"));
			},
		},
		{
			emoji: require("../../../../assets/emoji/CELEBRATING.png"),
			text: "laugh",
			onPress: () => {
				submitReaction("CELEBRATING");
				setSelectedReaction(require("../../../../assets/emoji/CELEBRATING.png"));
			},
		},
		{
			emoji: require("../../../../assets/emoji/NICE.png"),
			text: "Wow",
			onPress: () => {
				submitReaction("NICE");

				setSelectedReaction(require("../../../../assets/emoji/NICE.png"));
			},
		},
		{
			emoji: require("../../../../assets/emoji/SAD.png"),
			text: "sad",
			onPress: () => {
				submitReaction("SAD");
				setSelectedReaction(require("../../../../assets/emoji/SAD.png"));
			},
		},

		{
			emoji: require("../../../../assets/emoji/ANGRY.png"),
			text: "angry",
			onPress: () => {
				submitReaction("ANGRY");

				setSelectedReaction(require("../../../../assets/emoji/ANGRY.png"));
			},
		},
	];

	// let x = !selectedReaction && ourLike?.[0]?.reactionType === undefined;

	return (
		<View style={styles.container}>
			<View
				style={{
					alignItems: "center",
					flexDirection: "row",
				}}
			>
				<Menu
					visible={showReaction}
					style={{ borderRadius: 50 }}
					anchor={
						<View style={{}}>
							{selectedReaction ? (
								<TouchableWithoutFeedback onLongPress={() => setShowReaction(true)}>
									<FastImage
										source={selectedReaction}
										style={{
											height: size,
											width: size,
											padding: 5,
											marginLeft: 5,
										}}
									/>
								</TouchableWithoutFeedback>
							) : y ? (
								<TouchableWithoutFeedback onLongPress={() => setShowReaction(true)}>
									<View style={{ marginLeft: marginLeft ? marginLeft : 0 }}>
										{emojies(y, true, size)}
									</View>
								</TouchableWithoutFeedback>
							) : !selectedReaction ? (
								<EvilIcons
									name={"like"}
									style={{
										padding: 5,
										marginRight: -5,
									}}
									onPress={() => {
										submitReaction("LIKE");
										setSelectedReaction(require("../../../../assets/emoji/LIKE.png"));
									}}
									onLongPress={() => setShowReaction(true)}
									color={color?.subTitle}
									size={size + 7}
								/>
							) : (
								<TouchableWithoutFeedback onLongPress={() => setShowReaction(true)}>
									<FastImage
										source={selectedReaction}
										style={{
											height: size,
											width: size,
											padding: 5,
											marginLeft: 5,
										}}
									/>
								</TouchableWithoutFeedback>
							)}
						</View>
					}
					onRequestClose={() => setShowReaction(false)}
				>
					<MenuItem
						android_ripple={true}
						android_disableSound={false}
						style={{}}
					>
						<TouchableWithoutFeedback onPress={() => setShowReaction(false)}>
							<View style={styles.menu}>
								{reactions.map((ele, i) => (
									<TouchableWithoutFeedback
										key={i}
										onPress={() => ele.onPress()}
									>
										<FastImage
											source={ele.emoji}
											style={styles.emoji}
										/>
									</TouchableWithoutFeedback>
								))}
							</View>
						</TouchableWithoutFeedback>
					</MenuItem>
				</Menu>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	grid: {
		paddingLeft: "5%",
		width: "100%",
		flexDirection: "row",
		height: 56,
		alignItems: "center",
	},
	emoji: {
		height: 30,
		width: 30,
		borderRadius: 15,
		marginHorizontal: 3,
	},
	header: {
		flexDirection: "row",
		height: "100%",
		width: "87%",
		borderBottomColor: color.greyText,
		justifyContent: "space-between",
		marginLeft: 20,
	},
	menu: {
		borderRadius: 20,
		flexDirection: "row",
		width: "100%",
		// width: 230,
		// justifyContent: "space-between",
		alignItems: "center",
		height: "100%",
		// paddingTop: 5,
		// paddingLeft: 15,
	},
});

export default Reaction;

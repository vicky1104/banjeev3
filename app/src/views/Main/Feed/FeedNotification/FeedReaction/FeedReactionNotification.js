import React from "react";
import { View, StyleSheet } from "react-native";
import NewComment from "./NewComment";
import FriendReq from "./AcceptRequest";
import CommentReaction from "./CommentReaction";
import FeedReaction from "./FeedReaction";
import FeedRemove from "./FeedRemove";
import Replied from "./Replied";
import AdminNotificaton from "./AdminNotificaton";
import AlertCommentNotification from "./AlertCommentNotification";
import BlogCommentNotification from "./BlogCommentNotification";
import BlogReactionNotification from "./BlogReactionNotification";

function FeedReactionNotification({ item, index }) {
	const { eventName } = item;

	const checkAllNotification = () => {
		switch (eventName) {
			case "NEW_COMMENT":
				return (
					<NewComment
						item={item}
						index={index}
					/>
				);

			case "FEED_REACTION":
				return (
					<FeedReaction
						item={item}
						index={index}
					/>
				);

			case "COMMENT_REACTION":
				return (
					<CommentReaction
						item={item}
						index={index}
					/>
				);

			case "REPLIED":
				return (
					<Replied
						item={item}
						index={index}
					/>
				);

			case "ACCEPT_REQUEST":
				return (
					<FriendReq
						item={item}
						index={index}
					/>
				);

			case "FEED_REMOVED":
				return (
					<FeedRemove
						item={item}
						index={index}
					/>
				);

			case "ADMIN_NOTIFICATION":
				return (
					<AdminNotificaton
						item={item}
						index={index}
					/>
				);

			case "NEW_BLOG_COMMENT":
				return (
					<BlogCommentNotification
						item={item}
						index={index}
					/>
				);

			case "NEW_ALERT_COMMENT":
				return (
					<AlertCommentNotification
						item={item}
						index={index}
					/>
				);

			case "REACTION_BLOG":
				return (
					<BlogReactionNotification
						item={item}
						index={index}
					/>
				);

			default:
				break;
		}
	};

	return <View style={styles.container}>{checkAllNotification()}</View>;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: 5,
		width: "100%",
		justifyContent: "center",
	},
});

export default FeedReactionNotification;

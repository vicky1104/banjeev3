import { Share } from "react-native";
import * as RNShare from "react-native-share";

// import Share from "react-native-share";

import * as FileSystem from "expo-file-system";
import { cloudinaryFeedUrl } from "../../utils/util-func/constantExport";

export const onShare = () => {
	try {
		const result = Share.share({
			message:
				"Hey check out banjee app at https://play.google.com/store/apps/details?id=com.banjee.customer",
		});
		if (result.action === Share.sharedAction) {
			if (result.activityType) {
				// shared with activity type of result.activityType
			} else {
				// shared
			}
		} else if (result.action === Share.dismissedAction) {
			// dismissed
		}
	} catch (error) {
		alert(error.message);
	}
};

export const sharePost = async (url, mimeType, text, FeedId, postId) => {
	let newUrl = `https://res.cloudinary.com/banjee/video/upload/${postId}.jpg`;

	switch (mimeType) {
		case "video":
			FileSystem.downloadAsync(newUrl, FileSystem.cacheDirectory + "image.png")
				.then(async ({ uri }) => {
					await RNShare.default.open({
						url: uri,
						message:
							text?.length > 0
								? text + `${"\n"}https://www.banjee.org/feed/${FeedId}`
								: `${"\n"}https://www.banjee.org/feed/${FeedId}`,
					});

					// console.log("Finished downloading to ", uri);
				})
				.catch((error) => {
					console.error(error);
				});
			break;

		case "image":
			FileSystem.downloadAsync(url, FileSystem.cacheDirectory + "image.png")
				.then(async ({ uri }) => {
					{
						uri &&
							(await RNShare.default.open({
								url: uri,
								message:
									text?.length > 0
										? text + `${"\n"}https://www.banjee.org/feed/${FeedId}`
										: `${"\n"}https://www.banjee.org/feed/${FeedId}`,
							}));
					}
				})
				.catch((error) => {
					console.error(error);
				});
			break;

		case "audio":
			RNShare.default.open({
				message:
					text?.length > 0
						? text + `${"\n"}https://www.banjee.org/feed/${FeedId}`
						: `${"\n"}https://www.banjee.org/feed/${FeedId}`,
			});
			break;
		default:
			RNShare.default.open({
				message: text + `${"\n"}https://www.banjee.org/feed/${FeedId}`,
			});

			break;
	}
};

export const shareRoom = (roomId) => {
	const text =
		"Checkout more exciting content,connect with people around the world with similar interest and talk to them in numerous voice changing filters in Bnajee App.";
	RNShare.default.open({
		message: text + `${"\n"}https://www.banjee.org/room/${roomId}`,
	});
};

export const shareNeighbourhood = (data) => {
	const text = `Hi There! Come Join my Neighborhood ${data.name} on Banjee.`;

	RNShare.default.open({
		message: text + `${"\n"}https://www.banjee.org/neighborhood/${data.id}`,
	});
};

export const shareGroup = (groupId) => {
	const text =
		"Checkout more exciting content,connect with people around the world with similar interest and talk to them in numerous voice changing filters in Bnajee App.";
	RNShare.default.open({
		message: text + `${"\n"}https://www.banjee.org/community/${groupId}`,
	});
};

export const shareClassifieds = (classifiedId) => {
	const text =
		"Checkout more exciting content,connect with people around the world with similar interest and talk to them in numerous voice changing filters in Bnajee App.";
	RNShare.default.open({
		message: text + `${"\n"}https://www.banjee.org/classifieds/${classifiedId}`,
	});
};

export const shareBusiness = (data) => {
	const text = `Hi There! I invite you to visit and explore a business called ${data?.name} on Banjee. Click on the link below to get more information.`;
	RNShare.default.open({
		message: text + `${"\n"}https://www.banjee.org/business/${data?.id}`,
	});
};

export const shareAlert = (data, type) => {
	// data?.imageUrl

	if (data?.imageUrl.length > 0) {
		FileSystem.downloadAsync(
			cloudinaryFeedUrl(data.imageUrl[0], "image"),
			FileSystem.cacheDirectory + "image.png"
		)
			.then(async ({ uri }) => {
				{
					uri &&
						(await RNShare.default.open({
							url: uri,
							message: `${data?.eventName} ${"\n"} ${
								data?.description ? data?.description + "\n" : ""
							} https://www.banjee.org/alert/${data.id}?=${type}`,
						}));
				}
			})
			.catch((error) => {
				console.error(error);
			});
	} else {
		RNShare.default.open({
			message: `${data?.eventName} ${"\n"} ${
				data?.description ? data?.description + "\n" : ""
			} https://www.banjee.org/alert/${data.id}?=${type}`,
		});
	}
};

export const shareBlog = (blogId, userData) => {
	const text = `Checkout this blog by ${userData.authorName}.${"\n"}${
		userData.title
	}`;

	FileSystem.downloadAsync(
		cloudinaryFeedUrl(userData.bannerImageUrl, "image"),
		FileSystem.cacheDirectory + "image.png"
	)
		.then(async ({ uri }) => {
			{
				uri &&
					(await RNShare.default.open({
						url: uri,
						message: text + `${"\n"}https://www.banjee.org/blog/${blogId}`,
					}));
			}
		})
		.catch((error) => {
			console.error(error);
		});
};

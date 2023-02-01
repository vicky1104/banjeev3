import Lottie from "lottie-react-native";
import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ShowVideo from "../../../../constants/components/ShowVideo";
import AppFabButton from "../../../../constants/components/ui-component/AppFabButton";
import OverlayDrawer from "../../../../constants/components/ui-component/OverlayDrawer";
import color from "../../../../constants/env/color";

export default function VideoComp({ isSender, src, mimeHandler, chatContent }) {
	const [showVideo, setShowVideo] = React.useState(false);

	const [localUri, setLocalUri] = React.useState(false);
	const [downloading, setDownloading] = React.useState(false);

	// console.warn("videooooooooo", isSender, src, mimeHandler);

	// const getLocalFileFunc = React.useCallback(() => {
	// 	CameraRoll.getPhotos({
	// 		first: 200,
	// 		groupTypes: "Album",
	// 		groupName: "Banjee Videos",
	// 		assetType: "Videos",
	// 	}).then((getAllPhotos) => {
	// 		const localUriFile =
	// 			getAllPhotos &&
	// 			getAllPhotos?.edges?.length > 0 &&
	// 			getAllPhotos?.edges?.filter(
	// 				(ele) =>
	// 					ele?.node?.image?.uri
	// 						?.split("/")
	// 						?.[ele?.node?.image?.uri?.split("/")?.length - 1]?.split(".")?.[0] ===
	// 						`BANJEE_${chatContent?.id}` ||
	// 					ele?.node?.image?.uri
	// 						?.split("/")
	// 						?.[ele?.node?.image?.uri?.split("/")?.length - 1]?.split(".")?.[0] ===
	// 						`BANJEE_${chatContent?.content?.caption}`
	// 			);
	// 		console.warn("localUriFile------------", localUriFile);
	// 		if (localUriFile === false || localUri?.length === 0) {
	// 			console.log("nottttt founddddd--->");
	// 			if (isSender) {
	// 				fetchBlob();
	// 			}
	// 		} else {
	// 			console.log("founddddd");
	// 			setLocalUri(localUriFile?.[0]?.node?.image?.uri);
	// 		}
	// 	});
	// }, [fetchBlob]);

	// React.useEffect(() => {
	// 	getLocalFileFunc();
	// }, [getLocalFileFunc]);

	// const fetchBlob = React.useCallback(() => {
	// 	setDownloading(true);
	// 	if (src && src?.includes("https")) {
	// 		console.warn(
	// 			"fetch config ---> ",
	// 			RNFetchBlob.fs.dirs.CacheDir +
	// 				`/BANJEE_${chatContent?.id}.${mimeHandler?.[1]}`,
	// 			"GET",
	// 			src,
	// 			{}
	// 		);
	// 		RNFetchBlob.config({
	// 			// add this option that makes response data to be stored as a file,
	// 			// this is much more performant.
	// 			fileCache: true,
	// 			path:
	// 				RNFetchBlob.fs.dirs.CacheDir +
	// 				`/BANJEE_${chatContent?.id}.${mimeHandler?.[1]}`,
	// 		})
	// 			.fetch("GET", src, {})
	// 			.then(async (res) => {
	// 				// the temp file path

	// 				console.log("The file saved to ", res.path());
	// 				const blobPath = res.path();
	// 				if (blobPath) {
	// 					console.warn("save payload --->", `file://${blobPath}`, {
	// 						type: "video",
	// 						album: "Banjee Videos",
	// 					});
	// 					const saveResult = await CameraRoll.save(`file://${blobPath}`, {
	// 						type: "video",
	// 						album: "Banjee Videos",
	// 					});
	// 					// if (saveResult) {
	// 					getLocalFileFunc();
	// 					setDownloading(false);
	// 					// }
	// 					console.warn("saveResult", saveResult);
	// 				}
	// 			});
	// 	}
	// }, [src]);

	const renderImage = () => {
		if (!chatContent?.loader) {
			return (
				<View
					style={{
						backgroundColor: "grey",
						borderRadius: 8,
					}}
				>
					<Image
						style={{
							width: 220,
							height: 200,
							borderRadius: 8,
						}}
						resizeMode="cover"
						source={{
							uri: src,
						}}
					/>
					{
						downloading ? (
							<View
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									height: "100%",
									width: "100%",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Lottie
									source={require("../../../../../assets/loader/loader.json")}
									autoPlay
									style={{
										height: 40,
									}}
								/>
							</View>
						) : (
							// localUri || isSender ?
							<View
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									height: "100%",
									width: "100%",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<AppFabButton
									onPress={() => setShowVideo(true)}
									size={32}
									icon={
										<AntDesign
											name="play"
											size={40}
											color="#FFF"
										/>
									}
								/>
							</View>
						)
						// ) : (
						// 	<View
						// 		style={{
						// 			position: "absolute",
						// 			top: 0,
						// 			left: 0,
						// 			height: "100%",
						// 			width: "100%",
						// 			justifyContent: "center",
						// 			alignItems: "center",
						// 		}}
						// 	>
						// 		<TouchableOpacity
						// 			style={{
						// 				backgroundColor: "rgba(0,0,0,0.5)",
						// 				// padding: 10,
						// 				height: 30,
						// 				paddingHorizontal: 10,
						// 				borderRadius: 8,
						// 				flexDirection: "row",
						// 				alignItems: "center",
						// 			}}
						// 			onPress={fetchBlob}
						// 		>
						// 			<AntDesign
						// 				name="download"
						// 				size={16}
						// 				color="#FFF"
						// 			/>
						// 			<Text
						// 				color="#FFF"
						// 				ml={1.5}
						// 			>
						// 				Download
						// 			</Text>
						// 		</TouchableOpacity>
						// 	</View>
						// )
					}
				</View>
			);
		} else {
			return (
				<ImageBackground
					imageStyle={{
						opacity: 0.4,
						borderRadius: 8,
					}}
					source={{
						uri: src,
					}}
					style={{
						width: 220,
						height: 200,
						borderRadius: 8,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#FFF",
						borderRadius: 8,
					}}
				>
					<Lottie
						source={require("../../../../../assets/loader/loader.json")}
						autoPlay
						style={{
							height: 40,
						}}
					/>
				</ImageBackground>
			);
		}
	};
	return (
		<React.Fragment>
			<View
				style={{
					display: "flex",
					flexDirection: !isSender ? "row-reverse" : "row",
				}}
			>
				{isSender ? (
					<View
						style={{
							backgroundColor: color?.primary,
							borderRadius: 10,
							padding: 4,
						}}
					>
						{renderImage()}
					</View>
				) : (
					<View
						style={{
							backgroundColor: "#505050",
							borderRadius: 10,
							padding: 4,
						}}
					>
						{renderImage()}
					</View>
				)}
			</View>

			{showVideo && (
				<OverlayDrawer
					transparent
					visible={showVideo}
					onClose={() => setShowVideo(false)}
					closeOnTouchOutside
					animationType="fadeIn"
					containerStyle={{
						flex: 1,
						backgroundColor: color.gradientWhite,
						padding: 0,
						height: "100%",
						width: "100%",
					}}
					childrenWrapperStyle={{
						flex: 1,
						width: "100%",
						padding: 0,
						height: "100%",
					}}
					animationDuration={100}
				>
					<ShowVideo
						showBtn={false}
						hideModal={() => setShowVideo(false)}
						closeModal={() => setShowVideo(false)}
						video={localUri ? localUri : src}
					/>
				</OverlayDrawer>
			)}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({});

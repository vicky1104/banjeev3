import Lottie from "lottie-react-native";
import React from "react";
import {
	Image,
	ImageBackground,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import FastImage from "react-native-fast-image";
import ShowImage from "../../../../constants/components/ShowImage";
import OverlayDrawer from "../../../../constants/components/ui-component/OverlayDrawer";
import color from "../../../../constants/env/color";

export default function ImageComp({ isSender, src, mimeHandler, chatContent }) {
	const [showImag, setShowImage] = React.useState(false);

	const width = 220;
	// const height = 200;
	const [height, setHeight] = React.useState(200);
	const [loadEnd, setLoadEnd] = React.useState(true);
	const [localUri, setLocalUri] = React.useState(false);
	const [downloading, setDownloading] = React.useState(false);

	const imageSource =
		mimeHandler[1] === "gif"
			? "http://media1.giphy.com/media/" + src + "/giphy.gif"
			: localUri
			? localUri
			: src
			? src
			: `data:image/png;base64,${chatContent?.content?.base64Content}`;

	React.useEffect(() => {
		Image.getSize(imageSource, (width, height) => {
			height = parseInt(height);
			width = parseInt(width);
			setHeight((220 / width) * height);
		});
	}, [imageSource]);

	// console.warn("videooooooooo", isSender, src, mimeHandler);

	// const getLocalFileFunc = React.useCallback(() => {
	// 	CameraRoll.getPhotos({
	// 		first: 200,
	// 		groupTypes: "Album",
	// 		groupName: "Banjee Images",
	// 		assetType: "Photos",
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
	// 			Image.getSize(localUriFile?.[0]?.node?.image?.uri, (width, height) => {
	// 				height = parseInt(height);
	// 				width = parseInt(width);
	// 				setHeight((220 / width) * height);
	// 			});
	// 		}
	// 	});
	// }, [fetchBlob]);

	// React.useEffect(() => {
	// 	if (mimeHandler[1] === "jpg" || mimeHandler[1] === "jpeg") {
	// 		getLocalFileFunc();
	// 	}
	// }, [getLocalFileFunc]);

	// const fetchBlob = React.useCallback(() => {
	// 	setDownloading(true);
	// 	if (src && src?.includes("https") && chatContent && chatContent.id) {
	// 		// console.warn(
	// 		// 	"fetch config ---> ",
	// 		// 	RNFetchBlob.fs.dirs.CacheDir +
	// 		// 		`/BANJEE_${chatContent?.id}.${mimeHandler?.[1]}`,
	// 		// 	"GET",
	// 		// 	src,
	// 		// 	{}
	// 		// );
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
	// 						type: "photo",
	// 						album: "Banjee Images",
	// 					});
	// 					const saveResult = await CameraRoll.save(`file://${blobPath}`, {
	// 						type: "photo",
	// 						album: "Banjee Images",
	// 					});
	// 					if (saveResult) {
	// 						getLocalFileFunc();
	// 						setDownloading(false);
	// 						res.flush();
	// 					}
	// 					// console.warn("saveResult", saveResult);
	// 				}
	// 			});
	// 	}
	// }, [src]);

	const renderImage = () => {
		if (!chatContent?.loader || downloading) {
			if (mimeHandler[1] === "jpg") {
				return (
					<TouchableWithoutFeedback onPress={() => setShowImage(true)}>
						<ImageBackground
							imageStyle={{
								opacity: 1,
								borderRadius: 8,
								overflow: "hidden",
							}}
							style={{
								width: width,
								height: height,
								borderRadius: 8,
								justifyContent: "center",
								alignItems: "center",
								backgroundColor: "#FFF",
								overflow: "hidden",
							}}
							onLoadEnd={() => setLoadEnd(false)}
							resizeMode="contain"
							source={{
								uri: localUri ? localUri : imageSource,
							}}
							// blurRadius={localUri || isSender ? 0 : 15}
						>
							{
								// isSender ? null : !localUri ? (
								// 	<TouchableOpacity
								// 		style={{
								// 			backgroundColor: "rgba(0,0,0,0.5)",
								// 			// padding: 10,
								// 			height: 30,
								// 			paddingHorizontal: 10,
								// 			borderRadius: 8,
								// 			flexDirection: "row",
								// 			alignItems: "center",
								// 		}}
								// 		onPress={fetchBlob}
								// 	>
								// 		<AntDesign
								// 			name="download"
								// 			size={16}
								// 			color="#FFF"
								// 		/>
								// 		<Text
								// 			color="#FFF"
								// 			ml={1.5}
								// 		>
								// 			Download
								// 		</Text>
								// 	</TouchableOpacity>
								// ) :

								loadEnd && (
									<Lottie
										source={require("../../../../../assets/loader/loader.json")}
										autoPlay
										style={{
											height: 40,
										}}
									/>
								)
							}
						</ImageBackground>
					</TouchableWithoutFeedback>
				);
			} else {
				return (
					<TouchableWithoutFeedback onPress={() => setShowImage(true)}>
						<FastImage
							style={{
								width: width,
								height: height,
								borderRadius: 8,
							}}
							resizeMode="contain"
							source={{
								uri: localUri ? localUri : imageSource,
							}}
						/>
					</TouchableWithoutFeedback>
				);
			}
		} else {
			return (
				<ImageBackground
					imageStyle={{
						opacity: 0.4,
						borderRadius: 8,
					}}
					source={{
						uri: imageSource,
					}}
					style={{
						width: width,
						height: height,
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

			{showImag && (
				<OverlayDrawer
					transparent
					visible={showImag}
					onClose={() => setShowImage(false)}
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
					<ShowImage
						showBtn={false}
						hideModal={() => setShowImage(false)}
						closeModal={() => setShowImage(false)}
						image={imageSource}
					/>
				</OverlayDrawer>
			)}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({});

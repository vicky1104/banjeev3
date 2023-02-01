import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Divider, Text } from "native-base";
import React, { useContext } from "react";
import {
	Image,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { MainContext } from "../../../../context/MainContext";
import color from "../../../constants/env/color";
import { AppContext } from "../../../Context/AppContext";
import {
	BanjeeProfileId,
	cloudinaryFeedUrl,
} from "../../../utils/util-func/constantExport";
import { convertTime } from "../../../utils/util-func/convertTime";

function ListBlogItem({ item, setDeleteId, setConfirmDelete }) {
	const { navigate } = useNavigation();
	const { params } = useRoute();
	const { profile } = useContext(AppContext);

	return (
		<TouchableWithoutFeedback
			onPress={() => navigate("ViewBlog", { id: item.id })}
		>
			<View
				style={{
					width: "100%",
					alignSelf: "center",
					marginVertical: 5,
					borderRadius: 8,
					borderColor: "lightgrey",
					overflow: "hidden",
					padding: 10,
				}}
			>
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<Image
						source={{
							uri: item?.bannerImageUrl
								? cloudinaryFeedUrl(item?.bannerImageUrl, "image")
								: "https://www.pitman-training.com/media/6311/adobestock_225442477.jpeg",
						}}
						resizeMode="cover"
						style={{
							aspectRatio: 16 / 9,
							width: "50%",
							borderRadius: 8,
						}}
					/>
					<View
						style={{
							width: "50%",
							paddingHorizontal: 10,
							justifyContent: "space-evenly",
						}}
					>
						{/* {!params?.userId && ( */}
						<Text color={color.greyText}>
							<FontAwesome5
								name="clock"
								size={13}
								color={color.greyText}
							/>
							<View style={{ width: 10 }} />
							{convertTime(item?.createdOn?.split("+")[0])}
						</Text>
						{/* )} */}

						{!params?.userId && (
							<View
								style={{
									display: "flex",
									flexDirection: "row",
								}}
							>
								<Feather
									name="user"
									size={18}
									color={color?.black}
									style={{ marginRight: 5 }}
								/>
								<Text
									color={color?.black}
									onPress={() => {
										switch (true) {
											case profile?.systemUserId === item.authorId:
												navigate("Profile");
												break;

											case BanjeeProfileId === item.authorId:
												return null;

											default:
												navigate("BanjeeProfile", { profileId: item.authorId });
												break;
										}
									}}
									fontWeight={"bold"}
								>
									{item?.authorName}
								</Text>
							</View>
						)}
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Feather
								name="eye"
								size={16}
								color={color?.black}
							/>
							<View style={{ width: 5 }} />
							<Text
								textAlign={"center"}
								color={color?.black}
							>
								{item?.totalViews}
							</Text>
						</View>

						{params?.userId && (
							<View
								style={{
									zIndex: 1,
									display: "flex",
									flexDirection: "row",
								}}
							>
								<Feather
									name="edit-3"
									size={20}
									color="black"
									onPress={() => navigate("CreateBlog", { item })}
								/>
								<View style={{ width: 10 }} />
								<MaterialIcons
									name="delete-outline"
									style={{ color: "red" }}
									size={20}
									color={color?.black}
									onPress={() => {
										setConfirmDelete(true);
										setDeleteId(item?.id);
									}}
								/>
							</View>
						)}
					</View>
				</View>

				<Text
					fontSize={16}
					fontWeight="medium"
					numberOfLines={2}
					color={color?.black}
					style={{ paddingVertical: 10 }}
				>
					{item?.title}
				</Text>

				<Divider backgroundColor={color.lightGrey} />
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {},
});

export default ListBlogItem;

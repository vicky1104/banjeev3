import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import AppLoading from "../../../../constants/components/ui-component/AppLoading";
import color from "../../../../constants/env/color";
import { getAvatar } from "../../../../helper/services/SettingService";
import { profileUrl } from "../../../../utils/util-func/constantExport";

function PickAvatar({ navigation }) {
	const [avatar, setAvatar] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	React.useEffect(() => {
		setLoading(true);
		getAvatar({
			categoryId: null,
			categoryName: null,
			name: null,
			paid: null,
			type: "AVATARS",
		})
			.then((res) => {
				setLoading(false);
				setAvatar(res.content);
			})
			.catch((err) => console.warn("pic avatar error", err));
	}, []);

	// console.log("avatar", avatar);

	return (
		<React.Fragment>
			{loading && <AppLoading visible={loading} />}
			<ScrollView>
				<View style={[styles.container, { backgroundColor: color?.gradientWhite }]}>
					{avatar.length > 0 &&
						avatar.map((ele, index) => {
							let urlImage = ele?.content?.src;
							return (
								<TouchableOpacity
									style={styles.imgView}
									key={index}
									onPress={() =>
										navigation.navigate("UpdateAvatar", { urlImage: urlImage })
									}
								>
									<FastImage
										style={[styles.img, { borderColor: color?.border }]}
										source={{
											uri: profileUrl(urlImage),
										}}
									/>
								</TouchableOpacity>
							);
						})}
				</View>
			</ScrollView>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: "100%",
		display: "flex",
		flexWrap: "wrap",
		flexDirection: "row",
		justifyContent: "space-evenly",
		paddingBottom: 32,
		paddingTop: 36,
	},
	imgView: {
		height: 76,
		width: 76,
		margin: 8,
	},
	img: {
		height: 76,
		width: 76,
		borderWidth: 1,
	},
});

export default PickAvatar;

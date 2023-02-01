import { Text } from "native-base";
import React, { useContext } from "react";
import { View, StyleSheet, Image } from "react-native";
import color from "../../../../constants/env/color";
import { profileUrl } from "../../../../utils/util-func/constantExport";
import FastImage from "react-native-fast-image";
import PlayVoice from "./PlayVoice";
import { AppContext } from "../../../../Context/AppContext";

function UpdateVoice() {
	const { registry } = useContext(AppContext);
	// React.useEffect(
	//   () =>
	//     getAllUser({
	//       distance: "100",
	//       point: { lat: latitude, lon: longitude },
	//       page: 0,
	//       pageSize: 20,
	//     })
	//       .then((res) => console.log("voice urls->",res.content.map((ele) => ele.voiceIntroSrc)))
	//       .catch((err) => console.log("voice error", err)),
	//   []
	// );

	return (
		<React.Fragment>
			{registry?.voiceIntroSrc ? (
				<View style={styles.container}>
					<FastImage
						style={styles.img}
						source={
							registry?.avtarUrl
								? {
										uri: profileUrl(registry?.avtarUrl),
								  }
								: require("../../../../../assets/EditDrawerIcon/neutral_placeholder.png")
						}
					/>

					<PlayVoice />
				</View>
			) : (
				<Text>nnnnnnnnooooooo intro</Text>
			)}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: color.drawerDarkGrey,
		flex: 1,
	},
	img: {
		height: 150,
		width: 150,
		alignSelf: "center",
		marginTop: 20,
		borderRadius: 75,
		borderColor: color.white,
		borderWidth: 5,
	},
});

export default UpdateVoice;

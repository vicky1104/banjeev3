import React, { useContext } from "react";
import {
	View,
	StyleSheet,
	VirtualizedList,
	Dimensions,
	ScrollView,
} from "react-native";
import BanjeeProfileFriendListItem from "./BanjeeProfileFriendListItem";
import { findUserContact } from "../../../../helper/services/FindUserContact";
import { pendingConnection } from "../../../../redux/store/action/Profile/userPendingConnection";
import { Text } from "native-base";
import { useRoute } from "@react-navigation/native";
import { AppContext } from "../../../../Context/AppContext";

function BanjeeProfileFriendList({}) {
	const { params } = useRoute();
	const [data, setData] = React.useState([]);
	const { profile } = useContext(AppContext);
	const findUserContactFunc = React.useCallback(() => {
		findUserContact({
			id: params?.user,
			page: 0,
			pageSize: 0,
		})
			.then((res) => {
				let x = res.filter((ele) => ele.systemUserId === profile?.systemUserId);
				// dispatch(
				// 	pendingConnection({
				// 		mutualFriend: x.length > 0 ? true : false,
				// 		loading: false,
				// 	})
				// );
				let q = [];
				res.map((ele) =>
					ele.pendingConnections.map((id) => {
						id === profile?.systemUserId ? (q = [...q, ele.systemUserId]) : null;
						//   dispatch(pendingConnection({ pendingId: q })))
					})
				);

				const d = res.map((ele) => {
					if (ele.systemUserId === profile?.systemUserId) {
						return { ...ele, type: "YOU" };
					} else if (ele.mutual) {
						return { ...ele, type: "MUTUAL" };
					} else {
						return { ...ele, type: "UNKNOWN" };
					}
				});

				setData(d);
			})
			.catch((err) => console.warn(err));
		return () => {
			return null;
		};
	}, [params]);

	React.useEffect(() => {
		findUserContactFunc();
	}, [findUserContactFunc]);

	function renderItem({ item }) {
		return <BanjeeProfileFriendListItem item={item} />;
	}

	return (
		<React.Fragment>
			<View style={styles.container}>
				{data.length === 0 ? (
					<ScrollView>
						<View
							style={{
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text>No friends list.</Text>
						</View>
					</ScrollView>
				) : (
					<VirtualizedList
						getItemCount={(data) => data.length}
						getItem={(data, index) => data[index]}
						showsVerticalScrollIndicator={false}
						data={data}
						keyExtractor={(item) => item.id}
						renderItem={renderItem}
						removeClippedSubviews={true}
						initialNumToRender={10}
					/>
				)}
			</View>
		</React.Fragment>
	);
}
const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: "90%",
		// height: Dimensions.get("screen").height,
		// width: (Dimensions.get("window").width = "90%"),
		alignSelf: "center",
		marginTop: 5,
		paddingBottom: 20,
	},
});

export default BanjeeProfileFriendList;

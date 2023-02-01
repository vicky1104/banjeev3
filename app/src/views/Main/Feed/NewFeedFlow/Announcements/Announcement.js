import axios from "axios";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { getLocalStorage } from "../../../../../utils/Cache/TempStorage";

function Announcement(props) {
	const [page, setPage] = useState(0);
	const [announcementData, setAnnouncementData] = useState([]);
	const [hasData, setHasData] = useState(false);
	const [loading, setLoading] = useState(true);

	const callApis = React.useCallback(async () => {
		let token = await getLocalStorage("token");
		axios
			.post(
				"https://gateway.banjee.org/services/message-broker/api/message/delivery/filter",
				{
					all: true,
					eventName: ["ANNOUNCEMENTS"],
					page: page,
					pageSize: 15,
					sortby: "createdOn desc",
				},
				{
					headers: {
						Authorization: `Bearer ${JSON.parse(token)}`,
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				console.warn("Notification api called");
				if (res && res.data.content) {
					console.warn(res.data.content, "ddddddddd");
					setHasData(true);
					setLoading(false);
					setAnnouncementData((prev) => [...prev, ...res.data.content]);
				} else {
					setHasData(false);
					setLoading(false);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}, [page]);

	React.useEffect(() => {
		callApis();
	}, [callApis]);

	return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
	container: { flex: 1 },
});

export default Announcement;

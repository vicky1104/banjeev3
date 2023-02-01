import { useNavigation } from "@react-navigation/native";
import React from "react";
import SocketContext from "../Context/Socket";
import { getLocalStorage } from "../utils/Cache/TempStorage";
import InCallManager from "react-native-incall-manager";
import { AppContext } from "../Context/AppContext";

export default function SocketHandler() {
	const { setSocket } = React.useContext(SocketContext);
	const [socket, setSocketState] = React.useState(
		new WebSocket("wss://utb0hat9rd.execute-api.eu-central-1.amazonaws.com/dev", {
			maxAttempts: 100,
		})
	);

	const { navigate } = useNavigation();

	const { setEmergency } = React.useContext(AppContext);

	var inverval_timer;

	React.useEffect(() => {
		inverval_timer = setInterval(function () {
			socket.send(
				JSON.stringify({
					action: "ping",
					data: null,
				})
			);
		}, 120000);
		socket.onopen = () => {
			setSocket(socket);
			getLocalStorage("token")
				.then((res) => {
					socket.send(
						JSON.stringify({
							action: "auth",
							data: res,
						})
					);
				})
				.catch((err) => console.log(err));
		};
		socket.addEventListener("message", ({ data }) => {
			const { action, data: mData } = JSON.parse(data);
			switch (action) {
				case "AUTH":
					// alert("socket open & authenticated...");
					// console.warn("socket open & authenticated...");
					break;
				case "INCOMING_CALL":
					navigate("OneToOneCall", {
						...mData,
						...mData.sender,
						senderId: mData?.senderId,
						userId: mData.senderId,
						initiator: false,
					});
					InCallManager.startRingtone("_BUNDLE_");
					break;
				case "PING":
					console.log("socket ping...");
					clearInterval(inverval_timer);
					break;
				case "EMERGENCY":
					setEmergency({ open: true, ...mData });
					break;
				default:
					break;
			}
			// alert("receive" + action);
			console.log("addeventlistener");
		});
		socket.onclose = (e) => {
			alert("socket disconnected");
			// socket.onopen = () => {
			// 	setSocket(socket);
			// 	getLocalStorage("token")
			// 		.then((res) => {
			// 			socket.send(
			// 				JSON.stringify({
			// 					action: "auth",
			// 					data: res,
			// 				})
			// 			);
			// 		})
			// 		.catch((err) => console.log(err));
			// };
			// socket.send(
			// 	JSON.stringify({
			// 		action: "ping",
			// 		data: null,
			// 	})
			// );
		};
		socket.close();
		return () => {
			socket.close();
		};
	}, [socket]);

	return null;
}

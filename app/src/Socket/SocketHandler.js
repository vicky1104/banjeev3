import { useNavigation } from "@react-navigation/native";
import React from "react";
import SocketContext from "../Context/Socket";
import { getLocalStorage } from "../utils/Cache/TempStorage";
import InCallManager from "react-native-incall-manager";
import { AppContext } from "../Context/AppContext";
import { useNetInfo } from "@react-native-community/netinfo";
import { showToast } from "../constants/components/ShowToast";
import { Alert, NativeModules, Platform } from "react-native";
import CallRtcEngine from "../Context/CallRtcEngine";
export default function SocketHandler() {
	const netInfo = useNetInfo();
	const { setSocket } = React.useContext(SocketContext);
	const { setIncomingCallModal, token } = React.useContext(AppContext);
	const userFirstName = React.useContext(AppContext)?.profile?.firstName || "";
	const userLastName = React.useContext(AppContext)?.profile?.lastName || "";
	const systemUserId = React.useContext(AppContext)?.profile?.systemUserId || "";
	const [socket, setSocketState] = React.useState(
		new WebSocket("wss://utb0hat9rd.execute-api.eu-central-1.amazonaws.com/dev?1")
	);
	const { navigate } = useNavigation();
	var inverval_timer;
	const handleIncomingCall = React.useCallback(
		(mData) => {
			if (mData) {
				getLocalStorage("RtcEngine")
					.then((res) => {
						if (res) {
							getLocalStorage("CallType").then((res) => {
								const callType = JSON.parse(res);
								if (callType && (callType === "OneToOne" || callType === "Group")) {
									setIncomingCallModal({ open: true, data: mData });
								} else {
									socket.send(
										JSON.stringify({
											action: "REJECT_CALL",
											data: {
												sender: {
													firstName: userFirstName,
													lastName: userLastName,
												},
												senderId: systemUserId,
												receiver: {
													firstName: mData?.sender?.firstName,
													lastName: mData?.sender?.lastName,
												},
												receiverId: mData?.senderId,
												roomId: mData?.roomId,
												callType: mData?.callType,
											},
										})
									);
								}
							});
						} else {
							// showToast("navigate to call direct engine === false");
							navigate("OneToOneCall", {
								...mData,
								...mData.sender,
								senderId: mData?.senderId,
								userId: mData.senderId,
								initiator: false,
								callAccepted: false,
							});
						}
					})
					.catch(() => {
						// showToast("navigate to call direct engine === false");
						navigate("OneToOneCall", {
							...mData,
							...mData.sender,
							senderId: mData?.senderId,
							userId: mData.senderId,
							initiator: false,
							callAccepted: false,
						});
					});
			}
		},
		[userFirstName, userLastName, systemUserId]
	);
	const incomingCall = React.useCallback(async (uuid) => {
		console.warn("mData", uuid);
		// RNCallKeep.startCall(uuid);
		// if (Platform.OS === "android") {
		//  const { BanjeeCallKeepModule } = NativeModules;
		//  BanjeeCallKeepModule.startActivity();
		//  RNCallKeep.endCall(uuid);
		// }
		// navigate("OneToOneCall", {
		//  ...mData,
		//  ...mData.sender,
		//  senderId: mData?.senderId,
		//  userId: mData.senderId,
		//  initiator: true,
		// });
	}, []);
	const endCall = React.useCallback(() => {}, []);
	React.useEffect(() => {
		inverval_timer = setInterval(function () {
			socket.send(
				JSON.stringify({
					action: "ping",
					data: null,
				})
			);
		}, 60000);
		socket.onopen = () => {
			setSocket(socket);
			socket.send(
				JSON.stringify({
					action: "auth",
					data: token,
				})
			);
		};
		socket.readyState;
		socket.addEventListener("message", async ({ data }) => {
			const { action, data: mData } = JSON.parse(data);
			// console.log("socket res-------", JSON.parse(data));
			switch (action) {
				case "AUTH":
					// alert("socket open & authenticated...");
					// console.warn("socket open & authenticated...");
					break;
				case "INCOMING_CALL":
					handleIncomingCall(mData);
					// const uuid = "ce810e1e-fb86-4bcd-b7cc-665667b594e2";
					// const handle = mData?.sender?.mobile;
					// const localizedCallerName = `${mData?.sender?.firstName} ${mData?.sender?.lastName}`;
					// const handleType = "number";
					// const hasVideo = mData?.callType === "audio" ? false : true;
					// const options = mData;
					// RNCallKeep.displayIncomingCall(
					//  uuid,
					//  handle,
					//  localizedCallerName,
					//  handleType,
					//  hasVideo,
					//  options
					// );
					// // await RNCallKeep.answerIncomingCall(uuid);
					// RNCallKeep.addEventListener("answerCall", () => {
					//  RNCallKeep.backToForeground();
					//  RNCallKeep.rejectCall(uuid);
					// });
					// RNCallKeep.addEventListener("endCall", endCall);
					// InCallManager.startRingtone("_BUNDLE_");
					break;
				case "PING":
					console.log("socket ping...");
					clearInterval(inverval_timer);
					inverval_timer = setInterval(function () {
						socket.send(
							JSON.stringify({
								action: "ping",
								data: null,
							})
						);
					}, 60000);
					break;
				default:
					break;
			}
			// alert("receive" + action);
			console.log("addeventlistener");
		});
		socket.onclose = (e) => {
			if (netInfo.isConnected) {
				setSocketState(
					(prev) =>
						new WebSocket(
							"wss://utb0hat9rd.execute-api.eu-central-1.amazonaws.com/dev?" +
								prev.url.split("?")?.[1] +
								1
						)
				);
			} else {
				showToast("Please check network connection");
			}
			// socket.onopen = () => {
			//  setSocket(socket);
			//  getLocalStorage("token")
			//      .then((res) => {
			//          socket.send(
			//              JSON.stringify({
			//                  action: "auth",
			//                  data: res,
			//              })
			//          );
			//      })
			//      .catch((err) => console.log(err));
			// };
			// socket.send(
			//  JSON.stringify({
			//      action: "ping",
			//      data: null,
			//  })
			// );
		};
		// return () => {
		//  // console.warn("socket clse");
		//  socket.close();
		// };
	}, [socket, netInfo, endCall, handleIncomingCall, token]);
	return null;
}

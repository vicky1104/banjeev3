import React, { createContext, useState } from "react";
const BroadcastContext = createContext({
	cloudId: "",
	name: "",
	imageUri: "",
	memberId: "",
	memberObj: "",
	isHost: false,
	setConfigContext: () => {},
	callData: {},
	setCallData: () => {},
	remotes: [],
	setRemotes: () => [],
	host: {},
	setHost: () => {},
	coHosts: [],
	setCoHosts: () => [],
	members: [],
	setMembers: () => {},
	remoteVideo: [],
	setRemoteVideo: () => {},
	remoteAudio: [],
	setRemoteAudio: () => {},
	localVideo: true,
	setLocalVideo: () => {},
	localAudio: true,
	setLocalAudio: () => {},
	chat: [],
	setChat: () => [],
	raiseHand: [],
	setRaiseHand: () => [],
	emoji: [],
	setEmoji: () => [],
	switchCall: { receive: false, requesting: false },
	setSwitchCall: () => {},
	connectionState: 3,
	setConnectionState: () => {},
	callingTune: false,
	setCallingTune: () => {},
	loading: false,
	setLoading: () => {},
	actionLoading: [],
	setActionLoading: () => [],
	joinReqLoading: false,
	setJoinReqLoading: () => {},
	promoted: false,
	setPromoted: () => {},
});
export default BroadcastContext;
export function BroadcastContextProvider({ children }) {
	const {
		callData,
		cloudId,
		name,
		imageUri,
		memberId,
		memberObj,
		isHost,
		// _engine,
		remotes,
		host,
		coHosts,
		remoteVideo,
		remoteAudio,
		localVideo,
		localAudio,
		members,
		chat,
		raiseHand,
		emoji,
		switchCall,
		connectionState,
		callingTune,
		loading,
		promoted,
		actionLoading,
		joinReqLoading,
	} = React.useContext(BroadcastContext);
	const [cloudIdState, setCloudIdState] = useState(cloudId);
	const [nameState, setNameState] = useState(name);
	const [imageUriState, setImageUriState] = useState(imageUri);
	const [memberIdState, setMemberIdState] = useState(memberId);
	const [memberObjState, setMemberObjState] = useState(memberObj);
	const [isHostState, setIsHostState] = useState(isHost);
	const [callDataState, setCallDataState] = useState(callData);
	// const [engineState, setEngineState] = useState(_engine);
	const [remotesState, setRemotesState] = useState(remotes);
	const [remoteVideoState, setRemoteVideoState] = useState(remoteVideo);
	const [remoteAudioState, setRemoteAudioState] = useState(remoteAudio);
	const [localVideoState, setLocalVideoState] = useState(localVideo);
	const [localAudioState, setLocalAudioState] = useState(localAudio);
	const [membersState, setMembersState] = useState(members);
	const [hostState, setHostState] = useState(host);
	const [coHostsState, setCoHostsState] = useState(coHosts);
	const [chatState, setChatState] = useState(chat);
	const [raiseHandState, setRaiseHandState] = useState(raiseHand);
	const [emojiState, setEmojiState] = useState(emoji);
	const [switchCallState, setSwitchCallState] = useState(switchCall);
	const [connectionStateState, setConnectionStateState] =
		useState(connectionState);
	const [callingTuneState, setCallingTuneState] = useState(callingTune);
	const [loadingState, setLoadingState] = useState(loading);
	const [promotedState, setPromotedState] = useState(promoted);
	const [actionLoadingState, setActionLoadingState] = useState(actionLoading);
	const [joinReqLoadingState, setJoinReqLoadingState] = useState(joinReqLoading);
	const configContextHandler = React.useCallback((data) => {
		const { cloudId, name, imageUri, memberId, memberObj, isHost } = data;
		setCloudIdState(cloudId);
		setNameState(name);
		setImageUriState(imageUri);
		setMemberIdState(memberId);
		setMemberObjState(memberObj);
		setIsHostState(isHost);
	}, []);
	// const engineHandler = React.useCallback((data) => {
	//  setEngineState(data);
	// }, []);
	const callDataHandler = React.useCallback((data) => {
		setCallDataState(data);
	}, []);
	const remotesHandler = React.useCallback((data) => {
		setRemotesState(data);
	}, []);
	const remoteVideoHandler = React.useCallback((data) => {
		setRemoteVideoState(data);
	}, []);
	const remoteAudioHandler = React.useCallback((data) => {
		setRemoteAudioState(data);
	}, []);
	const localVideoHandler = React.useCallback((data) => {
		setLocalVideoState(data);
	}, []);
	const localAudioHandler = React.useCallback((data) => {
		setLocalAudioState(data);
	}, []);
	const membersHandler = React.useCallback((data) => {
		setMembersState(data);
	}, []);

	const hostHandler = React.useCallback((data) => {
		setHostState(data);
	}, []);
	const coHostsHandler = React.useCallback((data) => {
		setCoHostsState(data);
	}, []);

	const chatHandler = React.useCallback((data) => {
		setChatState(data);
	}, []);
	const raiseHandHandler = React.useCallback((data) => {
		setRaiseHandState(data);
	}, []);
	const emojiHandler = React.useCallback((data) => {
		setEmojiState(data);
	}, []);
	const switchCallHandler = React.useCallback((data) => {
		setSwitchCallState(data);
	}, []);
	const connectionStateHandler = React.useCallback((data) => {
		setConnectionStateState(data);
	}, []);
	const callingTuneHandler = React.useCallback((data) => {
		setCallingTuneState(data);
	}, []);
	const loadingHandler = React.useCallback((data) => {
		setLoadingState(data);
	}, []);
	const promoteHandler = React.useCallback((data) => {
		setPromotedState(data);
	}, []);
	const actionLoadingHandler = React.useCallback((data) => {
		setActionLoadingState(data);
	}, []);
	const joinReqLoadingHandler = React.useCallback((data) => {
		setJoinReqLoadingState(data);
	}, []);
	return (
		<BroadcastContext.Provider
			value={{
				cloudId: cloudIdState,
				name: nameState,
				imageUri: imageUriState,
				memberId: memberIdState,
				memberObj: memberObjState,
				isHost: isHostState,
				setConfigContext: configContextHandler,
				callData: callDataState,
				setCallData: callDataHandler,
				remotes: remotesState,
				setRemotes: remotesHandler,

				host: hostState,
				setHost: hostHandler,
				coHosts: coHostsState,
				setCoHosts: coHostsHandler,

				remoteVideo: remoteVideoState,
				setRemoteVideo: remoteVideoHandler,
				remoteAudio: remoteAudioState,
				setRemoteAudio: remoteAudioHandler,
				localVideo: localVideoState,
				setLocalVideo: localVideoHandler,
				localAudio: localAudioState,
				setLocalAudio: localAudioHandler,
				members: membersState,
				setMembers: membersHandler,
				chat: chatState,
				setChat: chatHandler,
				raiseHand: raiseHandState,
				setRaiseHand: raiseHandHandler,
				emoji: emojiState,
				setEmoji: emojiHandler,
				switchCall: switchCallState,
				setSwitchCall: switchCallHandler,
				connectionState: connectionStateState,
				setConnectionState: connectionStateHandler,
				callingTune: callingTuneState,
				setCallingTune: callingTuneHandler,

				loading: loadingState,
				setLoading: loadingHandler,

				promoted: promotedState,
				setPromoted: promoteHandler,

				actionLoading: actionLoadingState,
				setActionLoading: actionLoadingHandler,

				joinReqLoading: joinReqLoadingState,
				setJoinReqLoading: joinReqLoadingHandler,
			}}
		>
			{children}
		</BroadcastContext.Provider>
	);
}

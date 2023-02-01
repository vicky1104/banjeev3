import React, { createContext, useState } from "react";

const CallContext = createContext({
	cloudId: "",
	systemUserId: "",
	initiator: false,
	setCallContext: () => {},
	setCallType: () => {},
	// _engine: false,
	// setEngine: () => {},
	callData: {},
	setCallData: () => {},
	remoteUid: [],
	setRemoteUid: () => [],
	remoteVideo: [],
	setRemoteVideo: () => {},
	remoteAudio: [],
	setRemoteAudio: () => {},
	remoteAudioVolume: [],
	setRemoteAudioVolume: () => {},
	localVideo: true,
	setLocalVideo: () => {},
	localAudio: true,
	setLocalAudio: () => {},
	members: [],
	setMembers: () => {},
	feedback: [],
	setFeedback: () => [],
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
});

export default CallContext;

export function CallContextProvider({ children }) {
	const {
		callData,
		cloudId,
		systemUserId,
		initiator,
		// _engine,
		remoteUid,
		remoteVideo,
		remoteAudio,
		remoteAudioVolume,
		localVideo,
		localAudio,
		members,
		feedback,
		raiseHand,
		emoji,
		switchCall,
		connectionState,
		callingTune,
	} = React.useContext(CallContext);
	const [cloudIdState, setCloudIdState] = useState(cloudId);
	const [systemUserIdState, setSystemUserIdState] = useState(systemUserId);
	const [initiatorState, setInitiatorState] = useState(initiator);

	const [callDataState, setCallDataState] = useState(callData);

	// const [engineState, setEngineState] = useState(_engine);
	const [remoteUidState, setRemoteUidState] = useState(remoteUid);
	const [remoteVideoState, setRemoteVideoState] = useState(remoteVideo);
	const [remoteAudioState, setRemoteAudioState] = useState(remoteAudio);
	const [remoteAudioVolumeState, setRemoteAudioVolumeState] =
		useState(remoteAudioVolume);
	const [localVideoState, setLocalVideoState] = useState(localVideo);
	const [localAudioState, setLocalAudioState] = useState(localAudio);
	const [membersState, setMembersState] = useState(members);
	const [feedbackState, setFeedbackState] = useState(feedback);
	const [raiseHandState, setRaiseHandState] = useState(raiseHand);
	const [emojiState, setEmojiState] = useState(emoji);
	const [switchCallState, setSwitchCallState] = useState(switchCall);
	const [connectionStateState, setConnectionStateState] =
		useState(connectionState);
	const [callingTuneState, setCallingTuneState] = useState(callingTune);

	const callContextHandler = React.useCallback((data) => {
		const { cloudId, systemUserId, initiator } = data;
		setCloudIdState(cloudId);
		setSystemUserIdState(systemUserId);
		setInitiatorState(initiator);
	}, []);
	// const engineHandler = React.useCallback((data) => {
	// 	setEngineState(data);
	// }, []);
	const callDataHandler = React.useCallback((data) => {
		setCallDataState(data);
	}, []);

	const remoteUidHandler = React.useCallback((data) => {
		setRemoteUidState(data);
	}, []);
	const remoteVideoHandler = React.useCallback((data) => {
		setRemoteVideoState(data);
	}, []);
	const remoteAudioHandler = React.useCallback((data) => {
		setRemoteAudioState(data);
	}, []);
	const remoteAudioVolumeHandler = React.useCallback((data) => {
		setRemoteAudioVolumeState(data);
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
	const feedbackHandler = React.useCallback((data) => {
		setFeedbackState(data);
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
	// const callTypeHandler = React.useCallback((data) => {
	// 	setCallTypeState(data);
	// }, []);
	const connectionStateHandler = React.useCallback((data) => {
		setConnectionStateState(data);
	}, []);
	const callingTuneHandler = React.useCallback((data) => {
		setCallingTuneState(data);
	}, []);

	return (
		<CallContext.Provider
			value={{
				cloudId: cloudIdState,
				systemUserId: systemUserIdState,
				initiator: initiatorState,
				setCallContext: callContextHandler,
				// setCallType: callTypeHandler,
				// _engine: engineState,
				// setEngine: engineHandler,

				callData: callDataState,
				setCallData: callDataHandler,

				remoteUid: remoteUidState,
				setRemoteUid: remoteUidHandler,
				remoteVideo: remoteVideoState,
				setRemoteVideo: remoteVideoHandler,
				remoteAudio: remoteAudioState,
				setRemoteAudio: remoteAudioHandler,
				remoteAudioVolume: remoteAudioVolumeState,
				setRemoteAudioVolume: remoteAudioVolumeHandler,
				localVideo: localVideoState,
				setLocalVideo: localVideoHandler,
				localAudio: localAudioState,
				setLocalAudio: localAudioHandler,
				members: membersState,
				setMembers: membersHandler,
				feedback: feedbackState,
				setFeedback: feedbackHandler,
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
			}}
		>
			{children}
		</CallContext.Provider>
	);
}

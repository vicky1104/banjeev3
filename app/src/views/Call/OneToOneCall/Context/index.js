import React, { createContext, useState } from "react";

const CallContext = createContext({
	callerObj: {
		firstName: "",
		lastName: "",
	},
	callType: "audio",
	roomId: "",
	systemUserId: "",
	callerId: "",
	initiator: false,
	callId: "",
	setCallContext: () => {},
	setCallType: () => {},
	// _engine: false,
	// setEngine: () => {},
	remoteUid: false,
	setRemoteUid: () => {},
	videoMute: { remote: false, local: false },
	setVideoMute: () => {},
	audioMute: { remote: false, local: false },
	setAudioMute: () => {},
	switchCall: { receive: false, requesting: false },
	setSwitchCall: () => {},
	connectionState: 3,
	setConnectionState: () => {},
	callingTune: false,
	setCallingTune: () => {},
	timer: 0,
	setTimer: () => {},
	setAllCallContext: () => {},
});

export default CallContext;

export function CallContextProvider({ children }) {
	const {
		callerObj,
		callType,
		roomId,
		systemUserId,
		callerId,
		initiator,
		callId,
		// _engine,
		remoteUid,
		videoMute,
		audioMute,
		switchCall,
		connectionState,
		callingTune,
		timer,
	} = React.useContext(CallContext);
	const [callerObjState, setCallerObjState] = useState(callerObj);
	const [callTypeState, setCallTypeState] = useState(callType);
	const [roomIdState, setRoomIdState] = useState(roomId);
	const [systemUserIdState, setSystemUserIdState] = useState(systemUserId);
	const [callerIdState, setCallerIdState] = useState(callerId);
	const [initiatorState, setInitiatorState] = useState(initiator);
	const [callIdState, setCallIdState] = useState(callId);
	// const [engineState, setEngineState] = useState(_engine);
	const [remoteUidState, setRemoteUidState] = useState(remoteUid);
	const [videoMuteState, setVideoMuteState] = useState(videoMute);
	const [audioMuteState, setAudioMuteState] = useState(audioMute);
	const [switchCallState, setSwitchCallState] = useState(switchCall);
	const [connectionStateState, setConnectionStateState] =
		useState(connectionState);
	const [callingTuneState, setCallingTuneState] = useState(callingTune);
	const [timerState, setTimerState] = useState(timer);

	const callContextHandler = React.useCallback((data) => {
		const {
			callerObj,
			callType,
			roomId,
			systemUserId,
			callerId,
			initiator,
			callId,
		} = data;
		setCallerObjState(callerObj);
		setCallTypeState(callType);
		setRoomIdState(roomId);
		setSystemUserIdState(systemUserId);
		setCallerIdState(callerId);
		setInitiatorState(initiator);
		setCallIdState(callId);
	}, []);
	// const engineHandler = React.useCallback((data) => {
	// 	setEngineState(data);
	// }, []);
	const remoteUidHandler = React.useCallback((data) => {
		setRemoteUidState(data);
	}, []);
	const videoMuteHandler = React.useCallback((data) => {
		setVideoMuteState(data);
	}, []);
	const audioMuteHandler = React.useCallback((data) => {
		setAudioMuteState(data);
	}, []);
	const switchCallHandler = React.useCallback((data) => {
		setSwitchCallState(data);
	}, []);
	const callTypeHandler = React.useCallback((data) => {
		setCallTypeState(data);
	}, []);
	const connectionStateHandler = React.useCallback((data) => {
		setConnectionStateState(data);
	}, []);
	const callingTuneHandler = React.useCallback((data) => {
		setCallingTuneState(data);
	}, []);
	const timerHandler = React.useCallback((data) => {
		setTimerState(data);
	}, []);
	const allCallConntextHandler = React.useCallback((data) => {
		setCallerObjState({
			firstName: "",
			lastName: "",
		});
		setCallTypeState("audio");
		setRoomIdState("");
		setSystemUserIdState("");
		setCallerIdState("");
		setInitiatorState(false);
		setCallIdState("");

		// setEngineState(false);
		setRemoteUidState(false);
		setVideoMuteState({ remote: false, local: false });
		setAudioMuteState({ remote: false, local: false });
		setSwitchCallState({ receive: false, requesting: false });
		setConnectionStateState(3);
		setCallingTuneState(false);
		setTimerState(0);
	}, []);

	return (
		<CallContext.Provider
			value={{
				callerObj: callerObjState,
				callType: callTypeState,
				roomId: roomIdState,
				systemUserId: systemUserIdState,
				callerId: callerIdState,
				initiator: initiatorState,
				callId: callIdState,
				setCallContext: callContextHandler,
				setCallType: callTypeHandler,
				// _engine: engineState,
				// setEngine: engineHandler,
				remoteUid: remoteUidState,
				setRemoteUid: remoteUidHandler,
				videoMute: videoMuteState,
				setVideoMute: videoMuteHandler,
				audioMute: audioMuteState,
				setAudioMute: audioMuteHandler,
				switchCall: switchCallState,
				setSwitchCall: switchCallHandler,
				connectionState: connectionStateState,
				setConnectionState: connectionStateHandler,
				callingTune: callingTuneState,
				setCallingTune: callingTuneHandler,
				timer: timerState,
				setTimer: timerHandler,
				setAllCallContext: allCallConntextHandler,
			}}
		>
			{children}
		</CallContext.Provider>
	);
}

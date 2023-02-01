import React, { createContext, useState } from "react";
import {
	removeLocalStorage,
	setLocalStorage,
} from "../utils/Cache/TempStorage";

const CallRtcEngine = createContext({
	_rtcEngine: false,
	setRtcEngine: () => {},
});

export default CallRtcEngine;

export function CallRtcEngineProvider({ children }) {
	const { _rtcEngine } = React.useContext(CallRtcEngine);

	const [rtcEngineState, setRtcEngineState] = useState(_rtcEngine);

	const rtcEngineHandler = React.useCallback((data) => {
		if (data === false) {
			removeLocalStorage("RtcEngine").then().catch();
		} else {
			setLocalStorage("RtcEngine", "true").then().catch();
		}
		setRtcEngineState(data);
	}, []);

	return (
		<CallRtcEngine.Provider
			value={{
				_rtcEngine: rtcEngineState,
				setRtcEngine: rtcEngineHandler,
			}}
		>
			{children}
		</CallRtcEngine.Provider>
	);
}

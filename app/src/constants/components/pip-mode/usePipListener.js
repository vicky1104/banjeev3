import {useState, useEffect} from "react";
import {Platform, EmitterSubscription} from "react-native";

import PipHandler from "./pipHandler";

export function usePipModeListener() {
	const [isModeEnabled, setIsPipModeEnabled] = useState(false);

	useEffect(() => {
		let pipListener = EmitterSubscription;
		if (Platform.OS === "android") {
			pipListener = PipHandler.onPipModeChanged(setIsPipModeEnabled);
		}

		return () => {
			pipListener?.remove();
		};
	}, []);

	return isModeEnabled;
}

export default usePipModeListener;

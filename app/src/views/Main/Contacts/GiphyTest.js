import React, { useState, useEffect } from "react";
import { SafeAreaView, Button, ScrollView } from "react-native";
import {
	GiphyDialog,
	GiphyDialogEvent,
	GiphyDialogMediaSelectEventHandler,
	GiphyMedia,
	GiphyMediaView,
	GiphySDK,
} from "@giphy/react-native-sdk";

// Configure API keys
GiphySDK.configure({ apiKey: "BjrzaTUXMRi27xIRU0xZIGRrNztyuNT8" });

export default function GiphyTest() {
	const [media, setMedia] = useState();

	// Handling GIFs selection in GiphyDialog
	useEffect(() => {
		const handler = (e) => {
			setMedia(e.media);
			GiphyDialog.hide();
		};
		const listener = GiphyDialog.addListener(
			GiphyDialogEvent.MediaSelected,
			handler
		);
		return () => {
			listener.remove();
		};
	}, []);

	return (
		<SafeAreaView>
			<Button
				title="Show Giphy Dialog"
				onPress={() => GiphyDialog.show()}
			/>
			{media && (
				<ScrollView
					style={{
						aspectRatio: media.aspectRatio,
						maxHeight: 400,
						padding: 24,
						width: "100%",
					}}
				>
					<GiphyMediaView
						media={media}
						style={{ aspectRatio: media.aspectRatio }}
					/>
				</ScrollView>
			)}
		</SafeAreaView>
	);
}

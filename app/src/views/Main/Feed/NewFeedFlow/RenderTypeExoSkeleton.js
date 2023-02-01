import { View, Text } from "react-native";
import React, {
	forwardRef,
	Fragment,
	useImperativeHandle,
	useRef,
} from "react";
import VideoType from "../ViewTypes/VideoType";
import AudioTypes from "../ViewTypes/AudioTypes";
import FeedZoom from "../FeedZoom";

function RenderFeedType(
	{ item, id, localUrl, fullScreen, ratio, ...rest },
	ref
) {
	const itemRef = useRef();

	useImperativeHandle(
		ref,
		() => ({
			itemRef: itemRef.current,
		}),
		[itemRef]
	);

	const renderComp = () => {
		switch (item?.mimeType) {
			case "video/mp4":
				return (
					<VideoType
						fullScreen={fullScreen}
						localUrl={localUrl}
						ref={itemRef}
						id={id}
						src={item?.src}
						{...rest}
					/>
				);

			case "audio/mp3":
				return (
					<AudioTypes
						fullScreen={fullScreen}
						localUrl={localUrl}
						ref={itemRef}
						id={id}
						src={item?.src}
						{...rest}
					/>
				);
			case "image/jpg":
				return (
					<FeedZoom
						ratio={ratio}
						fullScreen={fullScreen}
						localUrl={localUrl}
						ref={itemRef}
						src={item?.src}
						id={id}
						{...rest}
					/>
				);
			default:
				break;
		}
	};
	return <Fragment>{renderComp()}</Fragment>;
}

export default RenderTypeExoSkeleton = forwardRef(RenderFeedType);

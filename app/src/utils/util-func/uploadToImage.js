import axios from "axios";

export const uploadToCloudinaryFunc = async (source, mime, mediaAssets) => {
	const uploadData = new FormData();
	uploadData.append("file", source);
	uploadData.append("cloud_name", "banjee");
	uploadData.append("upload_preset", mediaAssets);
	if (mime === "audio" || mime === "video") {
		uploadData.append("resource_type", "video");
	}
	let url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;

	// let x = await axios.post(
	// 	url,
	// 	{ uploadData },
	// 	{
	// 		onUploadProgress: (res) => {
	// 			console.warn(res);
	// 		},
	// 	}
	// );
	// return x.data;

	const d = await fetch(url, {
		method: "post",
		body: uploadData,
	});
	return d;
};

export const uploadToCloudinaryViaAxios = async (
	source,
	mime,
	mediaAssets,
	onUploadProgress
) => {
	const uploadData = new FormData();
	uploadData.append("file", source);
	uploadData.append("cloud_name", "banjee");
	uploadData.append("upload_preset", mediaAssets);
	if (mime === "audio" || mime === "video") {
		uploadData.append("resource_type", "video");
	}
	let url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;

	let x = await axios.post(url, uploadData, {
		headers: { "Content-Type": "multipart/form-data" },
		onUploadProgress,
	});
	return x.data;
};

const renderType = (type) => {
	switch (type) {
		case "image":
			return "image/jpg";

		case "video":
			return "video/mp4";

		case "audio":
			return "audio/mp3";

		default:
			return "image/jpg";
	}
};

export const returnSource = (result) => {
	const uri = result.uri;
	const type = `${result.type}/${
		result.uri.split(".")[result.uri.split(".").length - 1]
	}`;
	const name = result.uri.split("/")[result.uri.split("/").length - 1];
	const source = {
		uri,
		type: renderType(type.split("/")[0]),
		mimeType: renderType(type.split("/")[0]),
		name,
	};

	return source;
};

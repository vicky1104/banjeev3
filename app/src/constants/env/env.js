const host = "https://gateway.banjee.org";
// const host = "http://136.232.113.214:9180";
//  const host = "http://192.168.1.90:9180";
const gifUrl = "https://api.giphy.com/v1/gifs";

const banjeeAsset = "https://asset.banjee.org";

export const services = {
	HOST: host,
	USER_SYSTEM_API: host + "/services/system-service/api",
	USER__USER_API: host + "/services/userprofile-service/api",
	AUTH: host + "/services/system-service/oauth/token",
	ASSETS: `${host}/services/assets-service/api/`,
	SOCIAL_CONNECTION: host + "/services/social-connections/api",
	MESSAGE_BROKER: host + "/services/message-broker/api",
	GIF: gifUrl,
	POST: host + "/services/social-feeds/",
	CDN_SERVICE: host + "/services/media-service/api/",
	BANJEE_ASSET: banjeeAsset + "/api",
	GEO_CLOUD: host + "/services/geo-cloud",
	LOCAL_DISCOVERYS: host + "/services/local-discovery/api/",
	LOCAL_DISCOVERY: host + "/services/local-discovery/",
};

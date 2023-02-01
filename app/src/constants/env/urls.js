import { services } from "./env";

let urls = {
	headers: {
		"Content-Type": "application/json",
	},

	LOGIN: services.AUTH,
	BASIC_AUTH: "Basic aXRwbDppd2FudHVubGltaXRlZA==",
	ASSETS: {
		ASSETS: services.BANJEE_ASSET + "/assets/filter",
		CATEGORY: services.BANJEE_ASSET + "/category/filter",
		SUB_CATEGORY: services.BANJEE_ASSET + "/sub-category/filter",
		CREATE_SUB_CATEGORY: services.BANJEE_ASSET + "/sub-category",
	},
	CDN: {
		UPLOAD_SEND: services.CDN_SERVICE + "upload/send",
		UPLOAD_SESSION: services.CDN_SERVICE + "upload/session",
	},
	GIF: {
		SEARCH_GIF: services.GIF + "/search?api_key=",
		TRENDING_GIF: services.GIF + "/trending?api_key=",
		RANDOM_GIF: services.GIF + "/random?api_key=",
	},
	USER: {
		//`````````````````` SYSTEM USER API

		EXITS_USER: services.USER_SYSTEM_API + "/users/exits",
		OTP_SEND_REGISTER: services.USER_SYSTEM_API + "/otp",
		VALIDATE_OTP: services.USER_SYSTEM_API + "/otp/validate",
		FORGOTPASSWORD: services.USER_SYSTEM_API + "/users/forgotPassword",
		GET_COUNTRY_CODE:
			services.USER_SYSTEM_API + "/system/country/findAll/domain/banjee",
		GET_CITY: services.USER_SYSTEM_API + "/system/city/filter",

		//``````````````````    USER-PROFILE API

		REGISTRATION: services.USER__USER_API + "/profile",
		FIND_CONTACTS: services.USER__USER_API + "/profile/filter",
		GET_USER_PROFILE: services.USER__USER_API + "/profile/findById/",
		GET_USER_PROFILE_REMOTE:
			services.USER__USER_API + "/profile/findBySystemUserId/",
		GET_USER: services.USER__USER_API + "/registry/findBySystemUserId/",
		GET_ALL_USER: services.USER__USER_API + "/registry/filter",
		UPDATE_USER: services.USER__USER_API + "/registry",
		MODIFY: services.USER__USER_API + "/registry/modify",

		//`````````````````` SOCIAL CONNECTION

		CREATE_REPORT: services.SOCIAL_CONNECTION + "/report",
		FILTER_CONNECTION: services.USER__USER_API + "/users/block/my-list",
		UNBLOCK: services.USER__USER_API + "/users/unblock/",
		BLOCK: services.USER__USER_API + "/users/block/",
		PERMANENT_DELETE_ACCOUNT:
			services.USER__USER_API + "/profile/pernamantly-delete/",
		CREATE_ROOM: services.SOCIAL_CONNECTION + "/social-connection/create-group",
		UPDATE_ROOM: services.SOCIAL_CONNECTION + "/social-connection/update-group",
		DELETE_ROOM:
			services.SOCIAL_CONNECTION + "/social-connection/create-group/delete/",
		OUR_ROOM: services.SOCIAL_CONNECTION + "/social-connection/group/filter",
		ADD_MEMBER_IN_GROUP:
			services.SOCIAL_CONNECTION + "/group-connection-request/addMember",
		FRIEND_REQUEST: services.SOCIAL_CONNECTION + "/connection-request",
		FRIEND_REQUEST_NOTIFICAION:
			services.SOCIAL_CONNECTION + "/connection-request/filter",
		OTHER_ROOM:
			services.SOCIAL_CONNECTION + "/social-connection/group/other/filter",
		REMOVE_MEMBER_FROM_GROUP:
			services.SOCIAL_CONNECTION + "/social-connection/group/remove",
		ACCEPT_FRIEND_REQUEST:
			services.SOCIAL_CONNECTION + "/connection-request/accept/",
		REJECT_FRIEND_REQUEST:
			services.SOCIAL_CONNECTION + "/connection-request/reject/",
		UNFRIEND: services.SOCIAL_CONNECTION + "/social-connection/unfriend/",
		SEARCH_FRIEND: services.SOCIAL_CONNECTION + "/my-connections",
		OTHER_BANJEE_DETAIL: services.SOCIAL_CONNECTION + "/social-connection/filter",

		//``````````````````` USER API

		VOICE_INTRO: services.USER__USER_API + "/voiceintro/update",
		ACTION_CONTACTS_REGISTRY: services.USER__USER_API + "/registry/find-Contacts",

		// ADD_ADDRESS: services.USER__USER_API + "/address",
		// ALL_ADDRESS: services.USER__USER_API + "/address/findAll",
		// DELETE_ADDRESS: services.USER__USER_API + "/address/delete/",
		// LIST_CITY: services.USER_SYSTEM_API + "/system/city/filter",
		// LIST_STATE: services.USER_SYSTEM_API + "/system/states/filter",
		// LIST_COUNTRY: services.USER_SYSTEM_API + "/system/country/findAll",
	},
	// ````````````````````````` POST FEED || social feeds

	COMMENT: services.POST + "comments/byFeed/",
	POST_FEED: services.POST + "feeds/filter",
	CREATE_FEED: services.POST + "feeds",
	MYPOST: services.POST + "feeds/my",
	POST_COMMENTS: services.POST + "comments",
	POST_REACTION: services.POST + "reaction",
	GET_POST_REACTION: services.POST + "reaction/",
	OTHER_POST: services.POST + "feeds/other",
	FIND_POST: services.POST + "feeds/findById/",
	DELETE_POST: services.POST + "feeds/delete/",
	GET_COMMENT_LIKE: services.POST + "reaction/by-comment/",
	DELETE_COMMENT: services.POST + "comments/delete/",
	REPORT_POST: services.POST + "feeds/report",
	RTC: {
		CHAT: {
			HISTORY: services.MESSAGE_BROKER + "/chat-history/filter",
			UPDATE: services.MESSAGE_BROKER + "/chat-history/update",
			DELETE: services.MESSAGE_BROKER + "/chat-history/delete/",
			NOTIFICATION: services.MESSAGE_BROKER + "/message/delivery/filter",
			READ_NOTIFICATION: services.MESSAGE_BROKER + "/message/delivery/read/",
			DESTRUCT: services.MESSAGE_BROKER + "/chat-message/destruct/",
		},
	},
	ROOM: {
		CREATE: services.MESSAGE_BROKER + "/chat-room",
		GET_ALL: services.MESSAGE_BROKER + "/rooms/findByUserId",
		GET_ROOM: services.MESSAGE_BROKER + "/rooms/findByRoomId/",
	},

	GEO_CLOUD: {
		ASSIGN_ADMIN: services.GEO_CLOUD + "/api/assignAdmin",
		LISTMYNEIGHBOURHOOD: services.GEO_CLOUD + "/social-cloud/my-clouds",
		ADD_MEMBERS_IN_NEIGHBOURHOOD: services.GEO_CLOUD + "/social-cloud/addMembers",
		REPORT_GROUP: services.GEO_CLOUD + "/api/community/report",
		REPORT_NEIGHBOURHOOD: services.GEO_CLOUD + "/api/social-cloud/report",
		MY_CLOUD_LIST: services.GEO_CLOUD + "/social-cloud/MyCloudList",
		QUIT_NH: services.GEO_CLOUD + "/social-cloud/quit",
		CANCEL_MEMBER: services.GEO_CLOUD + "/social-cloud/cancel/",
		SWITCH_CLOUD: services.GEO_CLOUD + "/social-cloud/switch-cloud",

		LISTALLNEIGHBOURHOOD: services.GEO_CLOUD + "/social-cloud/filter",
		NEIGHBOURHOOD_DETAIL_PAGE: services.GEO_CLOUD + "/social-cloud/findById/",
		LIST_NEIGHBOURHOOD_MEMBER:
			services.GEO_CLOUD + "/social-cloud/members/filter",

		JOIN_NEIGHBOURHOOD: services.GEO_CLOUD + "/social-cloud/join/",
		LEAVE_NEIGHBOURHOOD: services.GEO_CLOUD + "/social-cloud/leave/",
		CREATE_ALERT: services.GEO_CLOUD + "/api/geo-alert",
		CREATE_NEIGHBOURHOOD: services.GEO_CLOUD + "/social-cloud",
		MY_ALERTS: services.GEO_CLOUD + "/api/geo-alert/my-alerts",
		GET_ALERT_BY_ID: services.GEO_CLOUD + "/api/geo-alert/my-alerts/",
		DELETE_MY_ALERTS: services.GEO_CLOUD + "/api/geo-alert/",
		REPORT_ALERT: services.GEO_CLOUD + "/api/geo-alert/report",
		UPDATE_USER_LOCATION: services.GEO_CLOUD + "/api/user-location",
		UPDATE_USER_ALERT_LOCATION: services.GEO_CLOUD + "/api/geo-alert/near-by",
		ADD_EMERGENCY_CONTACT: services.GEO_CLOUD + "/emergency-contacts",
		LIST_EMERGENCY_CONTACT: services.GEO_CLOUD + "/emergency-contacts/list",
		DELETE_EMERGENCY_CONTACT: services.GEO_CLOUD + "/emergency-contacts/",
		CONFIRM_INCIDENCE: services.GEO_CLOUD + "/api/geo-alert/confirm-incidence",
		GET_CITIES: services.GEO_CLOUD + "/api/alert-cities",
		COMMUNITY: {
			GROUP: services.GEO_CLOUD + "/community",
			MY_GROUP_LIST: services.GEO_CLOUD + "/community/MyCloudList",
			FILTER_GROUP: services.GEO_CLOUD + "/community/filter",
			JOIN: services.GEO_CLOUD + "/community/join/",
			LEAVE: services.GEO_CLOUD + "/community/leave/",
			FIND_BY_ID: services.GEO_CLOUD + "/community/findById/",
			ADD_MEMBER_GROUP: services.GEO_CLOUD + "/community/addMembers",
		},
		FILTER_ALERT: services.GEO_CLOUD + "/api/geo-alert/filter",
	},
	LOCAL_DISCOVERY: {
		CREATE_BUSINESS: services.LOCAL_DISCOVERYS + "business",
		LIST_BUSINESS: services.LOCAL_DISCOVERYS + "business/byUserId",
		FIND_BUSINESS: services.LOCAL_DISCOVERYS + "business/findById/",
		FILTER_BUSINESS: services.LOCAL_DISCOVERYS + "business/filter",
		CREATE_CLASSIFIEDS: services.LOCAL_DISCOVERYS + "classifieds",
		FILTER_CLASSIFIEDS: services.LOCAL_DISCOVERYS + "classifieds/filter",
		DELETE_PRODUCT: services.LOCAL_DISCOVERYS + "classifieds/",
		FIND_PRODUCT: services.LOCAL_DISCOVERYS + "classifieds/",
		ACTIVATE_PRODUCT: services.LOCAL_DISCOVERYS + "classifieds/activate/",
		DEACTIVATE_PRODUCT: services.LOCAL_DISCOVERYS + "classifieds/deactivate/",
		SELL_PRODUCT: services.LOCAL_DISCOVERYS + "classifieds/sell/",
		DELETE_BLOG_COMMENT: services.LOCAL_DISCOVERY + "/blog/comments/delete/",
		BLOG_COMMENT: services.LOCAL_DISCOVERY + "blog/comments",
		GET_BLOG_COMMENT: services.LOCAL_DISCOVERY + "blog/comments/byPost/",
		GET_BLOG_COMMENT_REACTION:
			services.LOCAL_DISCOVERY + "user-reaction/by-comment/",
		BLOG_LIKE: services.LOCAL_DISCOVERY + "user-reactions",
		BLOG_REACTION: services.LOCAL_DISCOVERY + "user-reactions/",
	},
	BLOGS: {
		LIST_BLOGS: services.LOCAL_DISCOVERYS + "blogs/filter",
		CREATE_BLOGS: services.LOCAL_DISCOVERYS + "blogs",
		UPDATE_BLOGS: services.LOCAL_DISCOVERYS + "blogs",
		GET_BLOGS: services.LOCAL_DISCOVERYS + "blogs/",
		DELETE_BLOGS: services.LOCAL_DISCOVERYS + "blogs/",
	},
};

export default urls;

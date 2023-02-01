import urls from '../../constants/env/urls';
import { executeGet } from '../apis/getORdelete';
import { executePost } from '../apis/postORput';

export const listBlogsApi = async (requestLoad) => {
	let url = urls.BLOGS.LIST_BLOGS;
	let actionCode = '';
	let payload = requestLoad;
	let method = 'POST';
	return await executePost(url, actionCode, payload, method, {});
};

export const createBlogApi = (payload) => {
	let url = urls.BLOGS.CREATE_BLOGS;
	let actionCode = '';
	let method = 'POST';
	return executePost(url, actionCode, payload, method, {});
};
export const updateBlogApi = (payload) => {
	let url = urls.BLOGS.UPDATE_BLOGS;
	let actionCode = '';
	let method = 'PUT';
	return executePost(url, actionCode, payload, method, {});
};

export const deleteBlogApi = (id) => {
	let url = urls.BLOGS.DELETE_BLOGS + id;
	let actionCode = '';
	let payload = '';
	let method = 'DELETE';
	return executeGet(url, actionCode, payload, method, {});
};

export const getBlogApi = (id) => {
	let url = urls.BLOGS.GET_BLOGS + id;
	let actionCode = '';
	let payload = '';
	let method = 'GET';
	return executeGet(url, actionCode, payload, method, {});
};
export const createBlogComment = (payload) => {
	let url = urls.LOCAL_DISCOVERY.BLOG_COMMENT;
	let actionCode = '';
	let method = 'POST';
	return executePost(url, actionCode, payload, method, {});
};

export const createBlogLike = (payload) => {
	let url = urls.LOCAL_DISCOVERY.BLOG_LIKE;
	let actionCode = '';
	let method = 'POST';
	return executePost(url, actionCode, payload, method, {});
};

export const getBlogComments = (id) => {
	let url = urls.LOCAL_DISCOVERY.GET_BLOG_COMMENT + id;
	let actionCode = '';
	let payload = '';
	let method = 'GET';
	return executeGet(url, actionCode, payload, method, {});
};
export const getBlogCommentReaction = (id) => {
	let url = urls.LOCAL_DISCOVERY.GET_BLOG_COMMENT_REACTION + id;
	let actionCode = '';
	let payload = '';
	let method = 'GET';
	return executeGet(url, actionCode, payload, method, {});
};
export const getBlogReaction = (id) => {
	let url = urls.LOCAL_DISCOVERY.BLOG_REACTION + id;
	let actionCode = '';
	let payload = '';
	let method = 'GET';
	return executeGet(url, actionCode, payload, method, {});
};

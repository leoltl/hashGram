import {
  attachPropAsArrayToMap, attachPropAsArrayToObject, createMapFromArray,
} from '../../lib/utils';

export function makePostAggregatorService(getAllCommentsFromDB, getLikesFromDB) {
  function mutatePostIfUserLiked(posts, authUserHandle) {
    if (!authUserHandle) return;
    let arr;
    if (!Array.isArray(posts)) {
      arr = [posts];
    } else {
      arr = posts;
    }
    arr.forEach((item) => {
      if (item.likes && item.likes.some((like) => like.handle === authUserHandle)) {
        item.liked = true;
      } else {
        item.liked = false;
      }
    });
  }

  async function aggregatePosts(posts, authUserHandle) {
    const postsMap = createMapFromArray(posts, (i) => i.postId);
    const postIds = Array.from(postsMap.keys());

    const [comments, likes] = await Promise.all([
      getAllCommentsFromDB(postIds),
      getLikesFromDB(postIds),
    ]);

    attachPropAsArrayToMap(postsMap, comments, (i) => i.postId, 'comments');
    attachPropAsArrayToMap(postsMap, likes, (i) => i.postId, 'likes');

    const resultPosts = Array.from(postsMap, (v) => v[1]);
    mutatePostIfUserLiked(resultPosts, authUserHandle);
    return resultPosts;
  }

  async function aggregatePost(post, authUserHandle) {
    const postCopy = { ...post };

    const [comments, likes] = await Promise.all([
      getAllCommentsFromDB({ post_id: post.postId }),
      getLikesFromDB(post.postId),
    ]);

    attachPropAsArrayToObject(postCopy, 'comments', comments);
    attachPropAsArrayToObject(postCopy, 'likes', likes);

    const resultPosts = [postCopy];
    mutatePostIfUserLiked(resultPosts, authUserHandle);
    return resultPosts;
  }

  return {
    aggregrate: async function aggregrate(dbResult, authUser) {
      const authUserHandle = authUser?.handle;
      if (dbResult.length === 0) {
        return [];
      }
      if (!Array.isArray(dbResult)) {
        return aggregatePost(dbResult, authUserHandle);
      }
      return aggregatePosts(dbResult, authUserHandle);
    },
  };
}

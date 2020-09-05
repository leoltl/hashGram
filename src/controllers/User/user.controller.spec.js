import { makeFollowUser, makeGetUserProfile } from './user.controller';

const mockRequest = (body, params) => ({
  session: {},
  body,
  params,
});
const mockResponse = (authUser) => {
  const res = {};
  res.locals = { authUser };
  res.status = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  return res;
};

describe('followUser', () => {
  const addFollowerInDB = jest.fn().mockReturnValue([]);
  const followUser = makeFollowUser(addFollowerInDB);
  it('happy path', async () => {
    const req = mockRequest({ userhandle: 'jaywonL' }); const res = mockResponse({ handle: 'nigelL' });
    await followUser(req, res);
    expect(addFollowerInDB).toBeCalledWith({ userhandle: 'jaywonL', followerhandle: 'nigelL' });
    expect(res.status).toBeCalledWith(200);
    expect(res.end).toBeCalled();
  });
});

describe('getUserProfile', () => {
  const user = { handle: 'test' };
  const posts = [];
  const followersCount = { count: 2 };
  const followingCount = { count: 3 };
  let mockGetUserInDB = jest.fn().mockReturnValue(user);
  const mockGetAllPostInDB = jest.fn().mockReturnValue(posts);
  const mockGetFollowerInDB = jest.fn().mockReturnValue(followersCount);
  const mockGetFollowingInDB = jest.fn().mockReturnValue(followingCount);
  it('happy path', async () => {
    const getUserProfile = makeGetUserProfile(
      mockGetUserInDB,
      mockGetAllPostInDB,
      mockGetFollowerInDB,
      mockGetFollowingInDB,
    );
    const req = mockRequest({}, { params: 'jaywonL' }); const res = mockResponse();
    await getUserProfile(req, res);
    expect(res.render).toBeCalledWith('profile', {
      posts,
      user: {
        ...user,
        followersCount: followersCount.count,
        followingCount: followingCount.count,
        isFollowing: false,
        postsCount: 0,
      },
    });
  });
  it('handles profile that does not exists', async () => {
    mockGetUserInDB = jest.fn().mockReturnValue(undefined);
    const getUserProfile = makeGetUserProfile(
      mockGetUserInDB,
      mockGetAllPostInDB,
      mockGetFollowerInDB,
      mockGetFollowingInDB,
    );
    const req = mockRequest({}, { params: 'notexist' }); const res = mockResponse();
    await getUserProfile(req, res);
    expect(res.render).toBeCalledWith('error', { error: 'Profile you are finding does not exists.' });
  });
});

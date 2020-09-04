import { makeGetAllPosts } from './post.controller';

const mockRequest = () => ({
  session: {},
});
const mockResponse = () => {
  const res = {};
  res.render = jest.fn().mockReturnValue(res);
  return res;
};

describe('getAllPosts', () => {
  const mockgetAll = jest.fn().mockReturnValue([]);
  const getAllPosts = makeGetAllPosts(mockgetAll);
  it('happy path', async () => {
    const req = mockRequest(); const res = mockResponse();
    await getAllPosts(req, res);
    expect(res.render).toBeCalledWith('index', { posts: [] });
  });
});

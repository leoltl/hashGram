import { makeNewComment } from './comment.controller';

const mockRequest = (body) => ({
  body,
});
const mockResponse = () => {
  const res = {};
  res.locals = { authUser: { id: 1 } };
  res.status = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

describe('newComment', () => {
  const createCommentInDB = jest.fn();
  const newComment = makeNewComment(createCommentInDB);
  it('happy path', async () => {
    const req = mockRequest({
      postId: 1,
      body: 'testing comment',
    }); const res = mockResponse();
    await newComment(req, res);
    expect(createCommentInDB).toBeCalledWith({ userId: 1, postId: 1, body: 'testing comment' });
    expect(res.status).toBeCalledWith(200);
    expect(res.end).toBeCalled();
  });
});

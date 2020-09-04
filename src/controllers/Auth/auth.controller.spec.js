import { signinPage, signupPage, makeSigninUser } from './auth.controller';

const mockRequest = (body) => ({
  body,
  session: {},
});
const mockResponse = (authUser) => {
  const res = {};
  res.redirect = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.locals = { authUser: authUser || undefined };
  return res;
};

/* TODO!!! */
xdescribe('makeCreateUser', () => {
  it('TODO', () => {});
});

describe('signinPage', () => {
  it('should render signin page if authUser is undefined', () => {
    const res = mockResponse();
    const req = mockRequest();
    signinPage(req, res);
    expect(res.render).toBeCalledWith('signin');
  });

  it('should redirect to index if authUser exists', () => {
    const res = mockResponse({ handler: 'user-1' });
    const req = mockRequest();
    signinPage(req, res);
    expect(res.redirect).toBeCalledWith('/');
  });
});

describe('signupPage', () => {
  it('should render signup page if authUser is undefined', () => {
    const res = mockResponse();
    const req = mockRequest();
    signupPage(req, res);
    expect(res.render).toBeCalledWith('signup');
  });

  it('should redirect to index if authUser exists', () => {
    const res = mockResponse({ handler: 'user-1' });
    const req = mockRequest();
    signupPage(req, res);
    expect(res.redirect).toBeCalledWith('/');
  });
});

describe('signInUser', () => {
  const getUser = jest.fn().mockReturnValue({ handle: 'test', password: '123' });
  const compareHash = (a, b) => a && b && a === b;
  const signInUser = makeSigninUser(getUser, compareHash);

  it('should redirect to index if authUser exists in res.locals (ie already authenticated)', () => {
    const res = mockResponse({ handler: 'user-1' });
    const req = mockRequest();
    const next = jest.fn();
    signInUser(req, res, next);
    expect(res.redirect).toBeCalledWith('/');
  });

  it('should set session user_handle prop to handle if the user credential is correct', async () => {
    const res = mockResponse();
    const req = mockRequest({ handle: 'test', password: '123' });
    const next = jest.fn();
    await signInUser(req, res, next);
    expect(req.session.user_handle).toBe('test');
  });

  it('should set a error_msg to session and redirect to signin if credentials is not correct', async () => {
    const res = mockResponse();
    const req = mockRequest({ handle: 'test', password: '234' });
    const next = jest.fn();
    await signInUser(req, res, next);
    expect(req.session.error_msg).toContain('Authentication failed');
  });
});

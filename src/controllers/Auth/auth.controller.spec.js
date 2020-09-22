import { signinPage, signupPage, makeSigninUser, makeCreateUser } from './auth.controller';

const mockRequest = (body) => ({
  body,
  session: { user_handle: undefined },
});
const mockResponse = (authUser) => {
  const res = {};
  res.redirect = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.locals = { authUser: authUser || undefined };
  return res;
};

describe('createuser', () => {
  const mockHashFn = (str) => str;
  const createUserInDB = jest.fn().mockReturnValue([{ handle: 'testhandle' }])
  const throwOnInvalidUserField = () => true;
  const emailVerificationService = { sendVerificationCode: jest.fn() };
  const createUser = makeCreateUser(createUserInDB, mockHashFn, throwOnInvalidUserField, emailVerificationService);

  it('should call createUserInDB function', async () => {
    const newuser = { email: 'test@email.com', full_name: 'test', handle: 'testhandle', password: '123', passwordConfirm: '123' }
    const req = mockRequest(newuser);
    const res = mockResponse();
    const next = jest.fn()

    await createUser(req, res, next);
    const {passwordConfirm, ...persistUser } = newuser
    expect(createUserInDB).toBeCalledWith(persistUser);
  });
  
  it('should call emailVerificationService.sendVerificationCode function', async () => {
    const newuser = { email: 'test@email.com', full_name: 'test', handle: 'testhandle', password: '123', passwordConfirm: '123' }
    const req = mockRequest(newuser);
    const res = mockResponse();

    await createUser(req, res);
    expect(emailVerificationService.sendVerificationCode).toBeCalledWith("test@email.com", "testhandle");
  });
  
  it('should set req session user_handle to newly created user\'s handle ', async () => {
    const newuser = { email: 'test@email.com', full_name: 'test', handle: 'testhandle', password: '123', passwordConfirm: '123' }
    const req = mockRequest(newuser);
    const res = mockResponse();
    const next = jest.fn()

    await createUser(req, res, next);
    expect(req.session.user_handle).toBe(newuser.handle);
  });
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

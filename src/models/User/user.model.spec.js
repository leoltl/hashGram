import makeUser from './user.model';
import db from '../../../knex/knex';
import baseModel from '../model';
import { DOAError } from '../../lib/errors';

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

const User = makeUser(db, baseModel);

describe('user model', () => {
  describe('getAll', () => {
    it('happy path', async () => {
      const users = await User.getAll();
      expect(users.length).not.toBe(0);
      expect(users[0].password).toBeUndefined();
    });
    it('should return user\'s required fields', async () => {
      const users = await User.getAll();
      expect(users[0].email).toBeDefined();
      expect(users[0].fullName).toBeDefined();
    });
    it('should not return user\'s credentials', async () => {
      const users = await User.getAll();
      expect(users[0].password).toBeUndefined();
    });
    it('should return empty array for an invalid column passed into columns of options', async () => {
      const users = await User.getAll({ columns: ['iddd'] });
      expect(users).toBeDefined();
      expect(users.length).toBe(0);
    });
  });
  describe('get', () => {
    it('happy path', async () => {
      const user = await User.get({ id: 1 });
      expect(user.email).toBe('nigel@email.com');
    });
    it('should not return user\'s credentials', async () => {
      const users = await User.get({ id: 1 });
      expect(users.password).toBeUndefined();
    });
    it('should return empty array for an invalid column passed into queryObject', async () => {
      const users = await User.get({ iddd: 1 });
      expect(users).toBeDefined();
      expect(users.length).toBe(0);
    });
    it('should return empty array for an invalid column passed into columns of options', async () => {
      const users = await User.get({ columns: ['idd'] });
      expect(users).toBeDefined();
      expect(users.length).toBe(0);
    });
  });
  describe('create', () => {
    const userObject = {
      email: 'test@gmail.com',
      fullName: 'first',
      password: 'hashedPassword',
      handle: 'testL',
    };
    it('happy path', async () => {
      const user = await User.create(userObject);
      expect(user).toBeDefined();
      expect(user.handle).toBe(userObject.handle);
    });
    it('handles missing required columns', async () => {
      const missingEmail = {
        fullName: 'first',
        password: 'hashedPassword',
        handle: 'testL',
      };
      await expect(User.create(missingEmail)).rejects.toThrow(new DOAError({ type: 'insert', message: 'Missing required field(s): email' }));
    });
    it('handles duplicating columns', async () => {
      const duplicateEmail = {
        email: 'nigel@email.com',
        fullName: 'first',
        password: 'hashedPassword',
        handle: 'testL',
      };
      await expect(User.create(duplicateEmail)).rejects.toThrow(new DOAError({ type: 'insert', message: 'Field(s) provided: (email) is duplicated' }));
    });
  });

  describe('getFollower', () => {
    it('happy path', async () => {
      const dataObj = { 'u.handle': 'nigelL' };
      const result = await User.getFollower(dataObj);
      expect(result[0].handle).toEqual('nakazL');
    });
    it('returns empty array for non-existence user handle ', async () => {
      const nonExistingUser = 'nonExistingUser';
      const result = await User.getFollower(nonExistingUser);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
    it('gets count of follower with aggration option set to count', async () => {
      const dataObj = { 'u.handle': 'nigelL' };
      const result = await User.getFollower(dataObj, { aggregration: 'count' });
      expect(result.count).toEqual(2);
    });
  });

  describe('follow', () => {
    it('happy path', async () => {
      const dataObj = { userhandle: 'nakazL', followerhandle: 'jaywonL' };
      await User.addFollower(dataObj);
      const result = await User.getFollower('nakazL');
      expect(result[1].handle).toBe('jaywonL');
    });
    it('handle duplicate following', async () => {
      const dataObj = { userhandle: 'nigelL', followerhandle: 'nakazL' };
      expect(() => User.addFollower(dataObj)).not.toThrow();
    });
    it('handle missing user handle', async () => {
      const dataObj = { followerhandle: 'nakazL' };
      await expect(User.addFollower(dataObj)).rejects.toThrow();
    });
  });
});

import makeUser from './user.model';
import db from '../../../knex/knex';

const User = makeUser(db);

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe('user model', () => {
  describe('getAll', () => {
    it('happy path', async () => {
      const users = await User.getAll();
      expect(users.length).not.toBe(0);
    });
  });
});

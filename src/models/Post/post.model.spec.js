import makePost from './post.model';
import db from '../../../knex/knex';
import baseModel, { DOAError } from '../model';

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

const Post = makePost(db, baseModel);

describe('Post model', () => {
  describe('getAll', () => {
    it('happy path', async () => {
      const posts = await Post.getAll();
      expect(posts.length).not.toBe(0);
      expect(posts[0].password).toBeUndefined();
    });
    it('should return empty array for an invalid column passed into columns of options', async () => {
      const posts = await Post.getAll({ columns: ['idd'] });
      expect(posts).toBeDefined();
      expect(posts.length).toBe(0);
    });
  });
  describe('get', () => {
    it('happy path', async () => {
      const post = await Post.get({ id: 1 });
      expect(post[0].userId).toBe(1);
      expect(post[0].caption).toBe('Have an amazing weekend #Toronto #TorontoWaterfront #CNTower #Night #nightTO - @thelandofdustin');
    });
    it('should return empty array for an invalid column passed into queryObject', async () => {
      const post = await Post.get({ iddd: 1 });
      expect(post).toBeDefined();
      expect(post.length).toBe(0);
    });
    it('should return empty array for an invalid column passed into columns of options', async () => {
      const post = await Post.get({ id: 1 }, { columns: ['idd'] });
      expect(post).toBeDefined();
      expect(post.length).toBe(0);
    });
    it('should return posts for a given user-id', async () => {
      const post = await Post.get({ 'users.id': 1 });
      expect(post.length).toBe(3);
    });
    it('should return posts for a given user email', async () => {
      const post = await Post.get({ 'users.email': 'nigel@email.com' });
      expect(post.length).toBe(3);
    });
  });
});

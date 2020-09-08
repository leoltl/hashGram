import makePost from './post.model';
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

const Post = makePost(db, baseModel);

describe('Post model', () => {
  describe('getAll', () => {
    it('happy path', async () => {
      const posts = await Post.getAll();
      expect(posts.length).toBe(5);
    });
    it('should return posts for given user', async () => {
      const posts = await Post.getAll({ handle: 'nigelL' });
      expect(posts.length).toBe(3);
    });
    it('should accepct string for querying given user', async () => {
      const posts = await Post.getAll('nigelL');
      expect(posts.length).toBe(3);
    });
    it('should return empty array for an invalid column passed into columns of options', async () => {
      const posts = await Post.getAll({}, { columns: ['idd'] });
      expect(posts).toBeDefined();
      expect(posts.length).toBe(0);
    });
  });
  describe('get', () => {
    it('happy path', async () => {
      const post = await Post.get({ id: 1 });
      expect(post.handle).toBe('nigelL');
      expect(post.caption).toBe('Have an amazing weekend #Toronto #TorontoWaterfront #CNTower #Night #nightTO - @thelandofdustin');
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
    it('should return first post for a given user-id', async () => {
      const post = await Post.get({ 'users.id': 1 });
      expect(post.imageUid).toBe('dd5cc1d86b82cd06738da3300bc1c8aa');
    });
    it('should return posts for a given user email', async () => {
      const post = await Post.get({ 'users.email': 'nigel@email.com' });
      expect(post.imageUid).toBe('dd5cc1d86b82cd06738da3300bc1c8aa');
    });
  });
  describe('create', () => {
    it('happy path', async () => {
      const newPost = {
        userId: 2,
        imageUid: 'd56c0cad6e9576b6104e1294a875ca0d',
        caption: 'This popular jerk chicken joint just opened a second Toronto location @coolrunningsres',
      };
      const post = await Post.create(newPost);
      expect(post.caption).toBe('This popular jerk chicken joint just opened a second Toronto location @coolrunningsres');
    });
    it('handles optional field', async () => {
      const optionCaption = {
        userId: 2,
        imageUid: 'd56c0cad6e9576b6104e1294a875ca0d',
      };
      const post = await Post.create(optionCaption);
      expect(post.caption).toBe(null);
    });
    it('handles missing required columns', async () => {
      const MissingURL = {
        userId: 2,
        caption: 'This popular jerk chicken joint just opened a second Toronto location @coolrunningsres',
      };
      await expect(Post.create(MissingURL)).rejects.toThrow(new DOAError({ type: 'insert', message: 'Missing required field(s): image_uid' }));
    });
  });
  describe('likePost', () => {
    it('happy path', async () => {
      const Likes = {
        user_id: 3,
        post_id: 2,
      };
      await Post.likePost(Likes);
      const results = await Post.getLikes(2);
      expect(results.length).toBe(2);
    });
    it('handle gracefully for duplicated likes', async () => {
      const Likes = {
        user_id: 1,
        post_id: 1,
      };
      expect(() => Post.likePost(Likes)).not.toThrow();
    });
  });
  describe('getLikes', () => {
    it('happy path with array of post_ids', async () => {
      const results = await Post.getLikes([1, 2]);
      expect(results.length).toBe(4);
      expect(results.find((r) => r.postId === 1).likeCount).toBe(3);
      expect(results.find((r) => r.postId === 2).likeCount).toBe(1);
    });
    it('happy path with string of post_id', async () => {
      const results = await Post.getLikes('1');
      expect(results.length).toBe(3);
      expect(results.find((r) => r.postId === 1).likeCount).toBe(3);
    });
  });
  describe('getLikeCount', () => {
    it('happy path with array of post_ids', async () => {
      const results = await Post.getLikeCount([1, 2]);
      expect(results.length).toBe(2);
      expect(results.find((r) => r.postId === 1).likeCount).toBe(3);
      expect(results.find((r) => r.postId === 2).likeCount).toBe(1);
    });
    it('happy path with string of post_id', async () => {
      const results = await Post.getLikeCount('1');
      expect(results.length).toBe(1);
      expect(results.find((r) => r.postId === 1).likeCount).toBe(3);
    });
  });
});

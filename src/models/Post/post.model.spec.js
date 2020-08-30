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
  describe('create', () => {
    it('happy path', async () => {
      const newPost = {
        userId: 2,
        imageUrl: 'https://instagram.fcxh3-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/118523282_121765046060913_5209181211252721492_n.jpg?_nc_ht=instagram.fcxh3-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=rs2Y-Y1V_vgAX_0X9cX&oh=d56c0cad6e9576b6104e1294a875ca0d&oe=5F7434D8',
        caption: 'This popular jerk chicken joint just opened a second Toronto location @coolrunningsres',
      };
      const post = await Post.create(newPost);
      expect(post[0].caption).toBe('This popular jerk chicken joint just opened a second Toronto location @coolrunningsres');
    });
    it('handles optional field', async () => {
      const optionCaption = {
        userId: 2,
        imageUrl: 'https://instagram.fcxh3-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/118523282_121765046060913_5209181211252721492_n.jpg?_nc_ht=instagram.fcxh3-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=rs2Y-Y1V_vgAX_0X9cX&oh=d56c0cad6e9576b6104e1294a875ca0d&oe=5F7434D8',
      };
      const post = await Post.create(optionCaption);
      expect(post[0].caption).toBe('');
    });
    it('handles missing required columns', async () => {
      const MissingURL = {
        userId: 2,
        caption: 'This popular jerk chicken joint just opened a second Toronto location @coolrunningsres',
      };
      await expect(Post.create(MissingURL)).rejects.toThrow(new DOAError({ type: 'insert', message: 'Missing required field(s): image_url' }));
    });
  });
});

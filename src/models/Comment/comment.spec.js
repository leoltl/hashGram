import makeComment from './comment.model';
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

const Comment = makeComment(db, baseModel);

describe('Comment model', () => {
  describe('getAll', () => {
    it('happy path', async () => {
      const comments = await Comment.getAll(1);
      expect(comments.length).toBe(3);
    });
    it('should accepct string for querying given post', async () => {
      const comments = await Comment.getAll('1');
      expect(comments.length).toBe(3);
    });
  });
  describe('get', () => {
    it('happy path', async () => {
      const comments = await Comment.get({ post_id: 1 });
      expect(comments.length).toBe(3);
    });
  });
  describe('create', () => {
    it('happy path', async () => {
      const newComment = {
        userId: 2,
        postId: 1,
        body: 'This popular jerk chicken joint just opened a second Toronto location @coolrunningsres',
      };
      const comments = await Comment.create(newComment);
      expect(comments[0].body).toBe('This popular jerk chicken joint just opened a second Toronto location @coolrunningsres');
    });
    it('handles optional field', async () => {
      const MissingBody = {
        userId: 2,
        postId: 1,
      };
      const comment = await Comment.create(MissingBody);
      expect(comment[0].body).toBe('');
    });
    it('handles missing required columns', async () => {
      const MissingPostID = {
        userId: 2,
        body: 'This popular jerk chicken joint just opened a second Toronto location @coolrunningsres',
      };
      await expect(Comment.create(MissingPostID)).rejects.toThrow(new DOAError({ type: 'insert', message: 'Missing required field(s): post_id' }));
    });
  });
});

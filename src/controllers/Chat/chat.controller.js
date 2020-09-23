import { authenticationRequired } from '../../middlewares/loadAuthUser';

export function makeGetChatHistory(getChatHistoryInDB) {
  return async function getChatHistory(req, res, next) {
    const { user } = req.query;
    const { handle } = res.locals.authUser;
    try {
      const messages = await getChatHistoryInDB(handle, user);
      res.json(messages);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

export function makeGetChats(getChatsInDB) {
  return async function getChats(req, res, next) {
    const { handle } = res.locals.authUser;

    try {
      const chats = await getChatsInDB(handle);
      res.json(chats);
    } catch(e) {
      console.log(e)
      next(e)
    }
  }
}

export default function installCommentController(router, chatModel) {
  router.get('/api/chat/history', authenticationRequired, makeGetChatHistory(chatModel.get));
  router.get('/api/chats', authenticationRequired, makeGetChats(chatModel.getChats));
  return router;
}

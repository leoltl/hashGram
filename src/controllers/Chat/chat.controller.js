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

export function chatApp(req, res) {
  if (!res.locals.authUser) {
    req.session.error_msg = 'Authentication required for this route. Please signin to access this feature';
    res.redirect('/signin');
    return
  }
  
  res.render('chat')
}

export default function installCommentController(router, chatModel) {
  router.get('/api/chat/history', authenticationRequired, makeGetChatHistory(chatModel.get));
  router.get('/api/chats', authenticationRequired, makeGetChats(chatModel.getChats));
  router.get('/chat', chatApp)
  return router;
}

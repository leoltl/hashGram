function makeChat(db) {
  
  async function get(user, to) {

    const chat = await db('chat_user')
        .select('chat_id')
        .whereIn('user_handle', [user, to])
        .groupBy('chat_id')
        .havingRaw('count(user_handle) > 1')
        .first()
    
    if (!chat) return [];

    const messages = await db('messages')
      .select('id', 'chat_id', 'from_user as from', 'to_user as to', 'body', 'created_at')
      .where('chat_id', chat.chat_id)
      .orderBy('created_at', 'desc')
      .limit(30);

    return messages;
  }

  function getChats(user) {
    return db('chat_user')
      .select('user_handle', 'avatar')
      .whereIn('chat_id',
        db('chat_user').select('chat_id').where({ user_handle: user })
      )
      .whereNot({ user_handle: user })
      .join('users', 'chat_user.user_handle', 'users.handle')
  }

  return {
    get,
    getChats,
  };
}

export default makeChat;

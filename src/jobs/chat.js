import db from '../../knex/knex';

export default function handler(ack) {
  return function handler(message) {
    if (message !== null) {
      const { type, ...rest } = JSON.parse(message.content.toString());

      if (type === 'newMessage') {
        persistMessage(rest.from, rest.to, rest.body)
        .then(() => ack(message))
        .catch(console.log)
      }
    }
  }
 
};

async function persistMessage(from, to, body) {
  if (from === to) return;
  if (!from || !to) return;
  async function genUUID() {
    const { rows: [{ uuid_generate_v4 }]} = await db.raw('select uuid_generate_v4()')
    return uuid_generate_v4;
  }
  
  try {
    await db.transaction(async (trx) => {
      // get previous chat
      const chat = await trx('chat_user')
          .select('chat_id')
          .whereIn('user_handle', [from, to])
          .groupBy('chat_id')
          .havingRaw('count(user_handle) > 1')
          .first()
      
      let chat_id = chat?.chat_id;

      if (!chat) {
        // create new 'chatroom' (chat_id in chat_user table) if previous chat does not exist
        chat_id = await genUUID();
        await trx('chat_user')
          .insert([{ chat_id, user_handle: from, }, { chat_id, user_handle: to } ])
      } else {
        await trx('chat_user')
          .update('last_chat', db.fn.now())
          .where('chat_id', chat_id)
      }

      // insert message with the chatroom id
      await trx('messages')
        .insert({
          from_user: from,
          to_user: to,
          body,
          chat_id,
        })
    });


  } catch (e) {
    console.log(e);
    throw Error('Transaction not completed.')
  }
}
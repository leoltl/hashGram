
exports.up = function (knex) {
  return knex.schema.table('chat_user', (table) => {
    table.timestamp('last_chat').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.table('chat_user', (table) => {
    table.dropColumn('last_chat');
  });
};

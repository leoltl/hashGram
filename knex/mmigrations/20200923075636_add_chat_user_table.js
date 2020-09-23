
exports.up = function(knex) {
  return knex.schema.createTable('chat_user', (table) => {
    table.uuid('chat_id');
    table.string('user_handle', 128);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('user_handle').references('handle').inTable('users').onDelete('SET NULL');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('chat_user');
};

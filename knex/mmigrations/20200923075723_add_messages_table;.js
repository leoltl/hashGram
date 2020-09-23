
exports.up = function(knex) {
  return knex.schema.createTable('messages', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('chat_id');
    table.string('from_user', 128);
    table.string('to_user', 128);
    table.text('body');
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('from_user').references('handle').inTable('users').onDelete('SET NULL');
    table.foreign('to_user').references('handle').inTable('users').onDelete('SET NULL');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('messages');
};

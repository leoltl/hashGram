

exports.up = function(knex) {
  // sql uuid hack https://stackoverflow.com/questions/41518695/add-function-to-sqlite3-using-knex-bookshelf -__-
  let uuidGenerationRaw = knex.client.config.client === 'sqlite3' ? 
  `(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))` :
  `uuid_generate_v4()`;

  return knex.schema.createTable('messages', (table) => {
    table.uuid('id').defaultTo(knex.raw(uuidGenerationRaw));
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

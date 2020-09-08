exports.up = function (knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.varchar('image_uid', 32).notNullable();
    table.text('caption').defaultTo(null);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('posts');
};

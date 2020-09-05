exports.up = function (knex) {
  return knex.schema.createTable('comments', (table) => {
    table.increments().primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('post_id').unsigned().notNullable();
    table.text('body').defaultTo('');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('comments');
};

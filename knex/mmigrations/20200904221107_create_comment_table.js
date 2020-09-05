
exports.up = function(knex) {
  return knex.schema.createTable('comments', (table) => {
    table.increments().primary();
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.integer('post_id').references('id').inTable('posts').onDelete('CASCADE');
    table.text('body').defaultTo('');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('comments');
};

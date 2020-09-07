
exports.up = function(knex) {
  return knex.schema.createTable('likes', (table) => {
    table.integer('post_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.unique(['post_id', 'user_id']);
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('likes');
};


exports.up = function(knex) {
  return knex.schema.createTable('following', (table) => {
    table.integer('user_id')
      .references('id').inTable('users').onDelete('CASCADE')
      .notNullable();
    table.integer('follower_id')
      .references('id').inTable('users').onDelete('CASCADE')
      .notNullable();
    table.unique(['user_id', 'follower_id']);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('following');
};

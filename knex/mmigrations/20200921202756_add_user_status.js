
exports.up = function (knex) {
  return knex.schema.table('users', (table) => {
    table.boolean('active').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('active');
  });
};

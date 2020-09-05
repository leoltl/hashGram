
exports.up = function (knex) {
  return knex.schema.table('following', (table) => {
    table.boolean('is_active').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.table('following', (table) => {
    table.dropColumn('is_active');
  });
};

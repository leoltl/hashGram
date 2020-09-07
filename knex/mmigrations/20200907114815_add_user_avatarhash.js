
exports.up = function (knex) {
  return knex.schema.table('users', (table) => {
    table.varchar('avatar', 32);
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('avatar');
  });
};

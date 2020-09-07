
exports.up = function (knex) {
  return knex.schema.table('users', (table) => {
    table.varchar('avatar', 32);
    table.text('bio');
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('avatar');
    table.dropColumn('bio');
  });
};

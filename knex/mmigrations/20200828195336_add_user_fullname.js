
exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    table.string('first_name', 128);
    table.string('last_name', 128);
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('first_name');
    table.dropColumn('last_name');
  });
};

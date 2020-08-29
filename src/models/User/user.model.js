function makeUser(db) {
  function getAll() {
    return db('users').select('id', 'email', 'first_name');
  }

  function get(id) {
    return db('users').select('email', 'first_name').where({ id });
  }

  return {
    getAll,
    get,
  };
}

export default makeUser;

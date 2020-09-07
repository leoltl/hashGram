
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(() => knex('posts').insert([
      {
        user_id: 1,
        image_uid: 'dd5cc1d86b82cd06738da3300bc1c8aa',
        caption: 'Have an amazing weekend #Toronto #TorontoWaterfront #CNTower #Night #nightTO - @thelandofdustin',
      },
      {
        user_id: 1,
        image_uid: 'c2867ccc879fe72a1400ca62e02cef85',
        caption: 'Quack quack #Toronto #CNTower #Summer #Ducks #skylineTO #summerTO #animalsTO - @argenel',
      },
      {
        user_id: 1,
        image_uid: 'd8db28b62176291f7ce5be08d9efa35e',
        caption: 'Not your average corn maze #Caledon #Ontario #ExploreOntario #DixieOrchards #CornMaze #Canada #ExploreCanada #travelTO - @aryanmojiri',
      },
      {
        user_id: 2,
        image_uid: '95d0171a91b02dd95c34bb3be23206bc',
        caption: 'Not your average corn maze #Caledon #Ontario #ExploreOntario #DixieOrchards #CornMaze #Canada #ExploreCanada #travelTO - @aryanmojiri',
      },
      {
        user_id: 3,
        image_uid: '4aa01b559bef19bfb33330412703d045',
        caption: 'Good times',
      },
    ]));
};

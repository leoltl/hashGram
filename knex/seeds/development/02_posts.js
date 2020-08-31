
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(() => knex('posts').insert([
      {
        id: 1,
        user_id: 1,
        image_url: 'https://instagram.fyvr1-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/118575704_128879185235227_6311767588435757593_n.jpg?_nc_ht=instagram.fyvr1-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=igQQAZ529_sAX8J_6er&oh=92d0555d2fd5c8f446c0c0c33eabd88e&oe=5F756EEE',
        caption: 'Have an amazing weekend #Toronto #TorontoWaterfront #CNTower #Night #nightTO - @thelandofdustin',
      },
      {
        id: 2,
        user_id: 1,
        image_url: 'https://instagram.fyvr1-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/118308115_762818907608657_8813286399163646952_n.jpg?_nc_ht=instagram.fyvr1-1.fna.fbcdn.net&_nc_cat=105&_nc_ohc=lELg0RLhxFkAX-H91EP&oh=eb5f3b5efb2ab61718b4f24c44d75a2c&oe=5F759A52',
        caption: 'Quack quack #Toronto #CNTower #Summer #Ducks #skylineTO #summerTO #animalsTO - @argenel',
      },
      {
        id: 3,
        user_id: 2,
        image_url: 'https://instagram.fyvr1-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/118368984_905904556563839_1739735206128910038_n.jpg?_nc_ht=instagram.fyvr1-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=fcpycqEGqDAAX_hA3EQ&oh=195bb200e21b8a43f5c275efaca6f320&oe=5F74E716',
        caption: 'Not your average corn maze #Caledon #Ontario #ExploreOntario #DixieOrchards #CornMaze #Canada #ExploreCanada #travelTO - @aryanmojiri',
      },
    ]));
};


exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(() => knex('posts').insert([
      {
        user_id: 1,
        image_uid: 'c2867ccc879fe72a1400ca62e02cef85',
        caption: 'Quack quack #Toronto #CNTower #Summer #Ducks #skylineTO #summerTO #animalsTO - @argenel',
      },
      {
        user_id: 1,
        image_uid: 'd8db28b62176291f7ce5be08d9efa35e',
        caption: 'Verified Good morning #Toronto #Summer #Morning #Sunrise #skylineTO #summerTO #sunriseTO ',
      },
      {
        user_id: 1,
        image_uid: 'e919d2cad572258e554cf21bebcc739b',
        caption: 'Down the rabbit hole 🕳 #Toronto #TTC #StAndrewStation #Subway #transitTO #nightTO',
      },
      {
        user_id: 2,
        image_uid: 'ab45c3e8630b39faf99e65a6f879638c',
        caption: 'Good times',
      },
      {
        user_id: 2,
        image_uid: '95d0171a91b02dd95c34bb3be23206bc',
        caption: 'Not your average corn maze',
      },
      {
        user_id: 3,
        image_uid: '037009ebdd20b138482fa90b9564a27e',
      },
      {
        user_id: 3,
        image_uid: '08e30f537ce46b8486ef1bb5f0d91eff',
      },
      {
        user_id: 4,
        image_uid: '2419ef4eb282eb53d3ef7746de3d3c4f',
        caption: 'Science World, Vancouver',
      },
      {
        user_id: 4,
        image_uid: '49283085647d9136784297ecccd2a339',
        caption: 'BC Place, Vancouver',
      },
      {
        user_id: 4,
        image_uid: 'c80432384c31c8e76b388afa4e0f3d30',
        caption: 'A light in the darkness 💫 Photo by @joshtyyc #dailyhivevan',
      },
      {
        user_id: 5,
        image_uid: '1b399851deb8d378d13401ab8d0ebbb9',
        caption: 'night tram #hongkong #discoverhongkong #nightshooters #streetphotography #theimaged #香港',
      },
      {
        user_id: 5,
        image_uid: '0a0ab5be636f521d65592711ffba396b',
        caption: '夜攝繁忙公路，車軌長長份外有現代感！ #DiscoverHongKong',
      },
      {
        user_id: 5,
        image_uid: '75ac7ecce85e470a361e0619d2a85d26',
        caption: 'Route 28. These trams were built in the 1930s and are still in operation. This route is very narrow and steep, which is simply not suitable for modern trams #living_europe #europestyle_ #culturetrip #searcheandercollect #bbctravel #theprettycities #suitcasetravels #justgoshoot',
      },
      {
        user_id: 6,
        image_uid: '7c463b51c19e640604a2ee8ff4ea1feb',
      },
      {
        user_id: 6,
        image_uid: '7e7ceb912f43a0d06b73aeec22f8d009',
        caption: 'Verified Shine bright ✨ #Toronto #CNTower #Night #nightTO - 📸 @ryan.geric',
      },
      {
        user_id: 7,
        image_uid: '2504557eb570e5d0b3e662de934656f0',
        caption: '雷が鳴り出したので近くの鳥居へ。',
      },
      {
        user_id: 7,
        image_uid: '3ec4192852a20b5a19b1fe082af84d23',
        caption: 'Make sure to #tankensurujapan and check our blog for JAPAN TRAVEL AND SCENERY #Japan #tokyo #kyoto #osaka #shrine #nippon #japan🇯🇵 #富士山 #japantour #japanstyle #kyotojapan ',
      },
      {
        user_id: 7,
        image_uid: 'c3ab1265d55bb2c0561b6f57688532c1',
        caption: '［南丹の旅］ おはようございます✨ ストーリーの返信ありがとうございました🎶 他の方がアイコンを見ると、お地蔵さんではないのですが',
      },
      {
        user_id: 8,
        image_uid: 'db2e744e77f825aeacd3f0b5c8a47792',
      },
      {
        user_id: 8,
        image_uid: '0c921d0388c206ecc253abebd8f9c202',
      },
    ]));
};

# hashGram

![hashGram](public/screenshot-1.png )

hashGram is a full stack Instagram clone. It's the result of exercising with Node, Postgres and its frameworks.
The goal was to build a functional clone of some Internet-based photo-sharing application.

The product is fully responsive.

![hashGram](public/screenshot-2.png )
![hashGram](public/screenshot-3.png )


## The stack
- **Server side**: Node with Express (ES2017 async/await)
- **Database**: Knex, Postgres: prod/development, sqlite3: test
- **Photo Storage**: Amazon Web Service S3 bucket
- **Templates**: Pug
- **Authentication**: express session
- **Client side**: ES6 vanilla Javascript and Sass

## Live App
**View it on [here](https://leoltl-hashgram.herokuapp.com/)**

You can create your own account or login in with one of the following accounts:

**Populated profiles**

|username|password|
|---|---|
|nigelL|123|
|ErvinH|123|
|jaywonL|123|

**Sample profiles**

|username|password|
|---|---|
|guest1|123|
|guest2|123|


## Features
**As an unauthenticated user**:
- I can see a feed of posts from all users.
- I can login with username and password.
- I can create a new account.
- I can browse other users' feed.

**As authenticated user**:
- I can edit my profile info.
- I can follow other users.
- I have a Home page showing all of my friends' recent images.
- I can share an image with a caption.
- I can comment and like/unlike an image. My liked images will be stored in my Likes page.
- I can discover other users via suggestions.


#### TODO
- Hashtags
- Linking users (\@username)
- Socket.io

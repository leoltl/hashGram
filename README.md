# hashGram

![hashGram](public/screenshot-1.png )

hashGram is a full stack Instagram clone. It's the result of exercising with Node, Postgres and its frameworks.
The goal was to build a functional clone of some Internet-based photo-sharing application in TDD manner.

It has a chat app embeded (built with react), users can send direct messages to each other in real time via websocket connection. All the messages are persisted to database so users can go back and see the chat history.

It has a separate process running for handling asynchronous tasks such as email sending, and persisting chat messages. It is communicating with the main app via a message queue (rabbitMQ). Redis is also used in the project to persist short lived data (e.g. store of user sessions and email verification code which is valid for 15 mins). It is my first attempt to build a distributed styled system.

The product is fully responsive.

![hashGram](public/hashgram.gif )

Apply image filter (only blur filter for now)

*image filter is apply on server side with python image-processing app (https://github.com/leoltl/hashGram-image-process)*
![hashGram](public/screenshot-4.JPG )

## The stack
- **Server side**: Node with Express (ES2017 async/await), WebSocket
- **Database**: Knex, Postgres: prod/development, sqlite3: test, Redis
- **Message Queue**: RabbitMQ, amqplib
- **Photo Storage**: Amazon Web Service S3 bucket
- **Templates**: Pug
- **Testing**: jest, TDD
- **Client side**: ES6 vanilla Javascript, Sass, WebSocket, React
- other tools: eslint, babel, webpack, express session, nodemailer

## Live App
**View it on [here](https://leoltl-hashgram.herokuapp.com/)**

**The App is hosted on Heroku, it might take some time to spin up the deno*

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
- I will receive an email on signup to with a confirmation code to verifiy my email address later in the app
- I can send other users real time direct messages.
- I can see the messages persisted to database and view the history at later time.
- I can apply simple filter to the photos that I share

#### TODO
- add notifications via WebSocket
- set up database query cache with redis
- support multiples images per post


<img src="https://user-images.githubusercontent.com/24300420/92531178-a74d8600-f1e2-11ea-9dd0-723a196e27ca.png" alt="hashGram" style="max-width:200px;">
<img src="https://user-images.githubusercontent.com/24300420/92531195-ae749400-f1e2-11ea-9877-1c93d87b4931.png" alt="hashGram" style="max-width:200px;">

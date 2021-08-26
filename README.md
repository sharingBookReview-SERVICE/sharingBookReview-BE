# DIVER BACKEND

A Node.js + Express based backend project.

Click [Frontend side](https://github.com/sharingBookReview-SERVICE/sharingBookReview-FE) to go to corresponding React.js
based frontend project.


---

## Table of Contents

1. Dependencies
2. Sample Codes

## Dependencies

- Node.js@16.6.2
- aws-sdk@2.975.0
- axios@0.21.1
- cheerio@1.0.0-rc.10
- cors@2.8.5
- cross-env@7.0.3
- dotenv@10.0.0
- express@4.17.1
- jsonwebtoken@8.5.1
- moment-timezone@0.5.33
- mongoose@5.13.8
- multer@1.4.3
- node-schedule@2.0.0
- passport-kakao@1.0.1
- passport@0.4.1
- path@0.12.7
- puppeteer@10.2.0
- xml2js@0.4.23

## Sample Codes

### 1. Routing / API Structuring

- All routes are served in a single module to achieve low maintenance effort.

```javascript
// app.js
// ...
import router from './routes/index.js'

app.use(router)
// ...
```

```javascript
// /routes/index.js
import express from 'express'
import usersRouter from './users.js'
import reviewsRouter from './reviews.js'
// ...

const router = express.Router()
router.use('/api/users', usersRouter)
router.use('/api/books/:bookId/reviews', reviewsRouter)
// ...
```

- API has highly hierarchical structure to make it REST-ful.

  Of course, there was an idea of shortening URL, however, as no such a route that serves for _'all reviews of all books'_
  or _'all comments of all reviews'_ exists, we decided to keep the structure.

  Moreover, the former already has a similar route called _'/feeds'_: a route serving recent and unread reviews with few more tweaks.
  
  Details of feeds router will be further discussed later

```javascript
// /routes/index.js

// router for comments on reviews
// ...
router.use('/api/books/:bookId/reviews/:reviewId/comments')
// ...
```

- Reduced duplicate codes by abstraction.

  Both '/api/books/:bookId/reviews/:reviewId/comments' and '/api/collections/:collectionId/comments' routes serve for comments.

  In order to remove redundancy, callbacks for both routes become abstract.

```javascript
// Previously
// reviews.js 의 post 첨부하기

```
### 2. Error Handling

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer. Also, be sure to have `git`
  available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and
  the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open
again the command line and be happy.

    $ npm install npm -g

###

### Yarn installation

After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone https://github.com/YOUR_USERNAME/PROJECT_TITLE
    $ cd PROJECT_TITLE
    $ yarn install

## Configure app

Open `a/nice/path/to/a.file` then edit it with your settings. You will need:

- A setting;
- Another setting;
- One more setting;

## Running the project

    $ yarn start

## Simple build for production

    $ yarn build
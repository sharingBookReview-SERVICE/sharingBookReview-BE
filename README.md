# DIVER BACKEND

A Node.js + Express based backend project.


Click [Frontend side](https://github.com/sharingBookReview-SERVICE/sharingBookReview-FE) to go to corresponding React.js
based frontend project.

---

## Table of Contents / 목차

1. Goal · 목표
2. Dependencies · 의존성
3. Sample Codes · 코드 예시 

## Goal / 목표

At the beginning of the project, deciding which part to focus and which part to discard &ndash; in terms of the tech
stack &ndash; was the most difficult task.

During previous projects and tutorials, we could glimpse several basic techs including Application, Database, DevOps
and/or Business tools.

Yet, with not enough time to master everything that we learned, here are the things that we wanted to put an emphasis
on.

---
프로젝트를 시작할 때 어떤 기술 스택에 집중하고 어떤 것을 제쳐둘지 정하는 것이 가장 어려웠습니다.

이전의 프로젝트들과 튜토리얼에서 몇가지 어플리케이션, 데이터베이스, 데브옵스 그리고 비즈니스 툴들을 접할 수 있었습니다만,

배운 것들을 모두 숙달하기에는 짧은 시간이었기 때문에 아래의 목록에 주안점을 두기로 하였습니다.

* * *

### Javascript/ES6+

Not only using basics of ES6 superficially, we tried to implement syntactic sugars of recent versions of ECMAScript.

---

ES6+ 의 기본뿐만 아니라 최신 버전 ECMAScript 의 문법적 설탕을 적용하기 위해서 노력했습니다.

---

#### Promise.allSettled
To reduce time consumption on crawling, we implemented [Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled).

Because we can query on anytime later, being rejected on some requests was not a big deal &ndash; and this DOES happen due to advertisement in source URL.

---

크롤링 시 시간 소요를 줄이기 위해 [Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) 를 사용하였습니다.

나중에라도 다시 받아오면 되기 때문에 몇개 실패한다고 하더라도 큰 문제가 아니었기 때문입니다. 크롤링 대상의 예기치 못한 광고 때문이었습니다.

```javascript
// ./controllers/crawl.js

const getBestsellers = async () => {
	const BESTSELLER_URL = 'https://www.kyobobook.co.kr/bestSellerNew/bestseller.laf'
	const query = 'ul > input[name=barcode]'
	const page = await launchBrowserAndGotoURL(BESTSELLER_URL)
    
	const isbnArr = await page.$$eval(query, (inputList) => inputList.map((input) => input.value))
	await (await page.browser()).close()
	const top10 = isbnList.slice(0, 9)
	const promises = top10.map((isbn) => searchBooks('isbn', isbn))
	return [...await Promise.allSettled(promises)].filter((p) => p.status === 'fulfilled').map((p) => p.value)
}
```
#### Optional Chaining

#### Nullish Coalescing


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

  Of course, there was an idea of shortening URL, however, as no such a route that serves for _'all reviews of all
  books'_
  or _'all comments of all reviews'_ exists, we decided to keep the structure.

  Moreover, the former already has a similar route called _'/feeds'_: a route serving recent and unread reviews with few
  more tweaks.

  Details of feeds router will be further discussed later

```javascript
// /routes/index.js

// router for comments on reviews
// ...
router.use('/api/books/:bookId/reviews/:reviewId/comments')
// ...
```

- Reduced duplicate codes by abstraction.

  Both '/api/books/:bookId/reviews/:reviewId/comments' and '/api/collections/:collectionId/comments' routes serve for
  comments.

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
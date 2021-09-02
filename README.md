# 🌊 DIVER BACKEND 🌊

❓ <b>Business Model</b> - Diver provides collections and reviews of books and users can share them like a social network.

🌌 <b>Base</b> - A Node.js + Express based backend project.

🔗 <b>Our frontend</b> - Click [Frontend side](https://github.com/sharingBookReview-SERVICE/sharingBookReview-FE) to go to corresponding React.js
based frontend project.

---

## Table of Contents / 목차

0. Get Started · 시작하기
1. Goal · 목표
2. Architecture · 구조
3. Dependencies · 의존성
4. Sample Codes · 샘플 코드
5. Contributors · 인원

# 0. Get Started · 시작하기

## Node

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

    ---

    If the installation was successful, you should be able to run the following command.

        $ node --version
        v8.11.3

        $ npm --version
        6.1.0

    If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open
    again the command line and be happy.

        $ npm install npm -g

---
## Yarn installation

After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone https://github.com/YOUR_USERNAME/PROJECT_TITLE
    $ cd PROJECT_TITLE
    $ yarn install

---
## Configure app

Open `a/nice/path/to/a.file` then edit it with your settings. You will need:

- A setting;
- Another setting;
- One more setting;
---
## Running the project

    $ yarn start
---
## Simple build for production

    $ yarn build



# 1. Goal / 목표 🥅

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

### 1.1 Javascript/ES6+ ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

Not only using basics of ES6 superficially, we tried to implement syntactic sugars of recent versions of ECMAScript.

---

ES6+ 의 기본뿐만 아니라 최신 버전 ECMAScript 의 문법적 설탕을 적용하기 위해서 노력했습니다.

---

#### 1.1.1 [Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
To reduce time consumption on crawling, we implemented **Promise.allSettled()**.

Because we can query on anytime later, being rejected on some requests was not a big deal &ndash; and this DOES happen due to advertisement in source URL.

---

크롤링 시 시간 소요를 줄이기 위해 **Promise.allSettled()** 를 사용하였습니다.

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
#### 1.1.2 [Optional Chaining (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

When saving an image, we used optional chaining to avoid returning errors even if we did not register the picture. It is shorter than using the if statement and can be expressed in a simple expression.

---

이미지 저장 시, 사진을 등록하지 않더라도 오류를 반환하지 않기 위해, optional chaining을 사용했습니다. if문을 사용하는 것 보다 짧고, 단순한 표현식으로 표현 할 수 있습니다.

```javascript
router.post('/', upload.single('image'), ImageUpload.uploadImage, async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const { bookId } = req.params
	const image = res.locals?.url
	const { quote, content } = req.body
	const hashtags = JSON.parse(req.body.hashtags)

	try {
		// Add document to Review collection
		let review = await Review.create({
			quote,
			content,
			hashtags,
			image,
		})
        review = await review.populate('book').populate({path: 'user', select:'_id level nickname profileImage' }).execPopulate()

		// Update reviews property of corresponding book document.
		const book = await Book.findById(bookId)
		book.reviews.push(review._id)
		await book.save()

		return res.json({ review })
	} catch (e) {
		console.error(e)
		return next(new Error('리뷰작성을 실패했습니다.'))
	}
})
```

#### 1.1.3 [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
When the return value of the collection does not exist, it can be returned with a simple, simple expression. Since the left operand value should contain the false value, nullish coalescing was used without using the OR operator.

---

collection의 반환값이 존재 하지 않을때, 간편하고, 단순한 표현식으로 다른 값을 반환 할 수 있다. 왼쪽 피연산자값은 falsy값은 포함해야하므로 OR연산자를 사용하지 않고 Nullish Coalescing을 사용했다.


```javascript
const updateCollection = async (tag) => {
	if (!tag) return

	const collection =
		// Check if collection exists. Otherwise create new one.
		(await Collection.findOne({ name: tag, type: 'tag' })) ??
		(await Collection.create({ name: tag, type: 'tag' }))

	/**
	 * Books having the tag in topTags property.
	 * @type {Document[]}
	 */
	const books = await Book.find({ topTags: tag })
	collection.contents = books.map((book) => {
		return { book: book.isbn }
	})
	console.log(`${collection.name} 컬렉션이 업데이트 되었습니다.`)
	await collection.save()
}
```

#### 1.1.4 [Async / Await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)

```javascript
const saveBook = async (searchResult) => {
	const newBook = new Book()
    
	for (const [key, value] of Object.entries(searchResult)) {
		if (key === 'description') {
			newBook[key] = await getBookDescription(searchResult.link)
		} else {
			newBook[key] = value
		}
	}
	return await newBook.save()
}
```

#### 1.1.5 [Import (ESModule)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
when we use 'require', we can't selectively load only the pieces we need. But with imports, we can selectively load only the pieces I need. That can save memory.

Loading is synchronous for require. On the other hand, import can be asynchronous. so it can perform better than require.

---
'require'를 사용했을 때 우리는 선택적으로 우리가 필요한 부분들을 불러올 수 없다. 하지만 'import'를 사용한다면 우리는 선택적으로 우리가 필요한 부분만을 선택할 수있고, memory를 아낄 수 있다.

require은 비동기적으로 작동하지만, import는 동기적으로 작동하므로 수행 능력이 뛰어날 수 있다.


```javascript
import express from 'express'
import config from './config.js'
import cors from 'cors'
import './models/index.js'
import './controllers/schedule_job.js'
import router from './routes/index.js'
import kakaoPassportConfig from "./routes/kakao_passport.js";
import googlePassportConfig from './routes/google_passport.js'
import { Server } from 'socket.io'
import { createServer } from "http";
import helmet from 'helmet'
```

---

### 1.2 Version Control 	![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

[배달의 민족 Git-flow](https://techblog.woowahan.com/2553/)

[Our Git Flow]()

# 2. Architecture 👷

```js
.
├── ...
├── controllers
|   ├── crawl.js 
|   ├── get_collection_image.js
|   ├── get_trending_review.js
|   ├── image_upload.js
|   ├── index_top_tags.js
|   ├── schedule_job.js
|   ├── searchbooks.js
|   └── utilities.js
|
├── middleware
|   └── auth_middleware.js
|          
├── models
|   ├── alert.js 
|   ├── book.js
|   ├── changes_index.js
|   ├── collection.js
|   ├── comment.js
|   ├── follow.js
|   ├── index.js
|   ├── review.js
|   ├── suggestion.js
|   ├── trend.js
|   ├── user.js
|   └── utilities.js
| 
├── models
|   ├── alert.js 
|   ├── book.js
|   ├── changes_index.js
|   ├── collection.js
|   ├── comment.js
|   ├── follow.js
|   ├── index.js
|   ├── review.js
|   ├── suggestion.js
|   ├── trend.js
|   ├── user.js
|   └── utilities.js
| 
├── routes
|   ├── book.js 
|   ├── collection.js
|   ├── comments.js
|   ├── feeds.js
|   ├── follow.js
|   ├── google_passport.js
|   ├── index.js
|   ├── kakao_passport.js
|   ├── review.js
|   ├── search.js
|   ├── suggestion.js
|   └── user.js
| 
├── app.js
├── config.js
├── exp_list.js
├── s3.js
├── server.js
├── socket.js
├── ...


# 3. Dependencies 🤝

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

# 4. Sample Codes 💡

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

# 5. Contributors 🧑‍🤝‍🧑 

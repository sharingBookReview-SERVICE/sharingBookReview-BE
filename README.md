# 🌊 DIVER BACKEND 🌊

❓ <b>Business Model</b> - Diver provides collections and reviews of books and users can share them like in a social
network.

🌌 <b>Base</b> - A Node.js + Express based backend project.

🔗 <b>Our frontend</b> - Click [Frontend side](https://github.com/sharingBookReview-SERVICE/sharingBookReview-FE) to go
to corresponding React.js based frontend project.

---

## Table of Contents / 목차

1. Goal · 목표
2. Architecture · 구조
3. Main features · 주요 기능
4. Sample Codes · 샘플 코드
5. Dependencies · 의존성
6. Contributors · 인원

---

# 1. Goal · 목표 🥅

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

# 2. Architecture · 구조 👷

```
.
├── ...
├── controllers
|   ├── book.controller.js
|   ├── collection.controller.js
|   ├── crawl.controller.js
|   ├── get_collection_image.js
|   ├── get_trending_review.js
|   ├── image_upload.controller.js
|   ├── review.controller.js
|   ├── schedule.controller.js
|   ├── super.controller.js
|   ├── tag.controller.js
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
├── server.js
├── socket.js
├── ...
```

---

## 3. Main features · 주요 기능 💡
### 3.1 Basic Features
* Sign up / Sing in : Users can create an account using Kakao's API. No vulnerable information is saved on the server or the DB.
* Search books
    * Users can search books by one of title, author, publisher, isbn, and tag. Uses Naver's book API.
    * Once a review is posted on a book, or a book is included in a user made collection, the book's data is saved on the DB. Thus accelerating access speed on frequently used books.
* Share reviews: Create, read, update, and delete reviews on a book. A review includes book info, content, a quote, an image, and book describing hashtags.
* Share collections
    * Users can make a collection of books with short description and an optional image.
    * Users can read collections of other users, and find out new books to read.
* More on collections
    * The server automatically created several collections.
    * Tag collection, for example, is made by topTag field of books.
* Profile icons
    * By numerous actions in Diver, a user can gain exp points!
    * With a certain amount of exp points, a user dives deeper into the ocean of books, and sometimes can find treasure boxes!
    * Users can change profile images with cute sea creature icons from the treasure boxes.

### 3.1 Feeds

<details>
Users can read others' reviews through the feed. Unlike ordinary projects with basic CRUD, **DIVER** provides a complex Read experience with following algorithm.

The feed is consisted of 3 different stages, each offering a set of reviews based on different algorithm

<!--suppress ALL -->
<table>
<thead>
<th>Stage</th>
<th>Within 7 days</th>
<th>Followed User's review</th>
<th>Likes</th>
</thead>
<tr>
<td>1. Recent unread reviews of following users.</td>
<td>🟢</td>
<td>🟢</td>
<td>❌</td>
</tr>
<tr>
<td>2. Trending reviews (reviews with high trending point, in other words, recent review with lots of likes)</td>
<td>🟢</td>
<td>❌</td>
<td>🟢</td>
</tr>
<tr>
<td>3. All recent unread reviews regardless of following.</td>
<td>🟢</td>
<td>❌</td>
<td>❌</td>
</tr>
<tr>
<td>Extra: Show all reviews (Provided on a different tab)</td>
<td>❌</td>
<td>❌</td>
<td>🟢</td>
</tr>
</table>

```javascript
// ./routes/feeds.js
// ...
router.get('/', authMiddleware(false), async (req, res, next) => {
	/**
	 * Number of reviews to send per request.
	 * @type {number}
	 */
	const userId = res.locals.user?._id

	try {
		// 0. Declare constants to query.

		const user = await User.findById(userId)
		/**
		 * Array of ObjectId of read reviews of user. If user is null (i.e. not logged in) assigned as undefined.
		 *  @type {ObjectId[]}
		 */
		const readReviews = user?.read_reviews.map((element) => element._id)
		/**
		 * Query statement for reviews: unread and created within one week
		 *  @type {Object}
		 */
		const query = {
			_id: { $nin: readReviews },
			created_at: { $gte: new Date() - 1000 * 60 * 60 * 24 * 7 },
		}

		// 1. Return recent unread reviews of following users.

		/**
		 * Array of user IDs that the the user in parameter is following.
		 * @type {ObjectId[]}
		 */
		const followees = (await Follow.find({ sender: userId })).map(
			(follow) => follow.receiver
		)
		/**
		 * Array of reviews of following users
		 *  @type {Document[]}
		 */
		const followingReviews = await Review.find({
			...query,
			user: { $in: [...followees, userId] },
		})
			.sort({ created_at: -1 })
			.limit(SCROLL_SIZE)
			.populate({ path: 'user', select: '_id profileImage nickname' })
			.populate({ path: 'book', select: '_id title author' })


		// If no documents found with query, continue until next if statement. This keep goes on.
		if (followingReviews.length) {
			return res.json(await showLikeFollowBookMarkStatus(followingReviews, userId))
		}

		// 2. Return trending reviews (reviews with high trending point, in other words, recent review with lots of likes)
		const trend = await Trend.findOne({}, {}, { sort: { created_at: -1 } })
		const trendingReviewIdArr = trend.trendingReviews.map(review => review._id)
		const trendingReviews = await Review.find({
			_id: { $in: trendingReviewIdArr, $nin: readReviews },
		})
			//todo: $sample 넣기
			.limit(SCROLL_SIZE)
			.populate({ path: 'user', select: '_id profileImage nickname' })
			.populate({ path: 'book', select: '_id title author' })

		if (trendingReviews.length) {
			return res.json(await showLikeFollowBookMarkStatus(trendingReviews, userId))
		}
		// 3. Return all recent unread reviews regardless of following.

		const recentReviews = await Review.find(query)
			.sort({ created_at: -1 })
			.limit(SCROLL_SIZE)
			.populate({ path: 'user', select: '_id profileImage nickname' })
			.populate({ path: 'book', select: '_id title author' })

		if (recentReviews.length) {
			return res.json(await showLikeFollowBookMarkStatus(recentReviews, userId))
		}
		// 4. If no reviews are found by all three queries.
		return res.sendStatus(204)

	} catch (e) {
		console.error(e)
		return next(new Error('피드 불러오기를 실패했습니다.'))
	}
})

// ...
```

</details>

### 3.2 Tags

<details>

1. Update topTags field of books everyday
2. Top 10 most used tags of one book is saved
3. When writing reviews, exposes the top 10 frequent tags to users to reuse other users' tags

```js
export default class tagController {
	static async updateTopTags() {
		console.log('updateTopTags 를 실행합니다.')
		try {
			const updatedBooks = await tagController.#getUpdatedBooks()
			const updatedTags = await tagController.#updateTopTags(updatedBooks)
			const numOfUpdatedTags = await tagController.#updateTagCollection(updatedTags)
			console.log(`updateTopTags 가 성공적으로 완료되었으며, 총 ${numOfUpdatedTags} 개의 태그가 생성 또는 수정되었습니다.`)
		} catch (err) {
			console.error(err)
		}
	}

	/**
	 * Returns array of isbn of which updateOnTag field is true. And set updateOnTag field to false.
	 * @returns {Promise<Document<>[]>} Array of mongodb documents with id and reviews field.
	 */
	static async #getUpdatedBooks() {
		const books = await Book.find({ updateOnTag: true }, { reviews: 1, topTags: 1 }).populate({
			path: 'reviews',
			select: 'hashtags',
		})
		await Book.updateMany({ updateOnTag: true }, { updateOnTag: false })
		return books
	}

	/**
	 * For each book in books, calculate most used hashtags of its reviews. Then save them as topTags field in the book.
	 * @param books Array of book documents.
	 * @returns {Promise<string[]>} Array of updated tags.
	 */
	static async #updateTopTags(books) {
		const updatedTags = new Set()
		const promises = books.map(book => {
			const allTagsOfOneBook = book.reviews.reduce((acc, review) => {
				if (!review.hashtags) return acc
				return [...acc, ...review.hashtags]
			}, [])
			const uniqueTagsOfOneBook = [...new Set(allTagsOfOneBook)]
			book.topTags = getMostUsedTagsForOneBook(allTagsOfOneBook, uniqueTagsOfOneBook)
			updatedTags.add(...uniqueTagsOfOneBook)
			return book.save()
		})
		await Promise.allSettled(promises)

		return [...updatedTags]

		function getMostUsedTagsForOneBook(allTags, uniqueTags) {
			return uniqueTags.map((tag) => {
				return {
					name: tag,
					occurrence: allTags.filter((_tag) => tag === tag).length,
				}
			}).sort((a, b) => b.occurrence - a.occurrence).slice(0, 9).map((tag) => tag.name)
		}
	}

	/**
	 * Update tag collection's contents field with books having the tag in its topTags field.
	 * @param tags {string[]}
	 * @returns {Promise<number>} Number of tag documents that successfully updated.
	 */
	static async #updateTagCollection(tags) {
		const promises = tags.map(async tag => {
			const tagDocument = { name: tag, type: 'tag' }
			const collection = await Collection.findOne(tagDocument) ?? await Collection.create(tagDocument)
			const booksContainingTag = await Book.find({ topTags: tag })
			collection.contents = booksContainingTag.map((book) => {
				return { book: book.isbn }
			})
			return collection.save()
		})
		const result = await Promise.allSettled(promises)
		return result.filter(res => res.status === 'fulfilled').length
	}
}

```

</details>

---

# 4. Sample Codes: Improvements by Refactoring · 샘플 코드 : 리팩토링을 통한 개선

### 4.1 Javascript/ES6+ ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

Not only using basics of ES6 superficially, we tried to implement syntactic sugars of recent versions of ECMAScript.

Here are some codes that went through refactoring to apply ES6+

---

ES6+ 의 기본뿐만 아니라 최신 버전 ECMAScript 의 문법적 설탕을 적용하기 위해서 노력했습니다.

아래는 ES6+ 적용을 하여 리팩토링을 진행한 코드입니다.

---

#### 4.1.1 [Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

To reduce time consumption on crawling, we implemented **Promise.allSettled()**.

Because we can query on anytime later, being rejected on some requests was not a big deal &ndash; and this DOES happen
due to advertisement in source URL.

---

크롤링 시 시간 소요를 줄이기 위해 **Promise.allSettled()** 를 사용하였습니다.

나중에라도 다시 받아오면 되기 때문에 몇개 실패한다고 하더라도 큰 문제가 아니었기 때문입니다. 실패는 대상 페이지에 삽입된 예기치 못한 광고 때문이었습니다.

```javascript
// ./controllers/crawl.js
// todo Deprecated example

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

#### 4.1.2 [Optional Chaining (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

Optional Chaining was powerful and simple operator to process optional parameters. It created more readable code
than `if` statement.

---

옵셔널 체이닝은 선택적인 매개변수를 처리하기에 강력하고 간결한 연산자입니다.`if`문에 비해 더 읽기 좋은 코드가 되었습니다.

```javascript
// Saving a review with / without an image.

// Previously
let image
if (res.locals) image = res.locals.url
await Review.create({ content, quote, image })

// Refactored
const image = res.locals?.url
await Review.create({ content, quote, image })


```

#### 4.1.3 [Nullish Coalescing (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)

`??` operator also helped to simply a complex `if` statement and reduce use of `let`.

---

`??` 연산자 역시 복잡한 `if`문을 간단하게 해주고 `let`을 덜 사용하게 해주었습니다.

```javascript
// Find a collection document by its name.
// If such document doesn't exist, create one.

// Previously
const updateCollection = async (tag) => {
	let collection
	collection = await Collection.findOne({ name: tag, type: 'tag' })
	if (!collection) collection = await Collection.create({ name: tag, type: 'tag ' })

	//...
}

// Refactored
const updateCollection = async (tag) => {
	const collection = await Collection.findOne({ name: tag, type: 'tag' }) ?? await Collection.create({
		name: tag,
		type: 'tag'
	})

	//...
}
```

#### 4.1.4 [Async / Await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)

By using `async/await`, it was possible to avoid complex call backs and use `try/catch` to handle errors.

---

`async/await`을 사용하여 복잡한 콜백 구조를 피하고 `try/catch`로 에러를 처리할 수 있었습니다.

```javascript
export default class ReviewController extends SuperController {
	//...
	static async apiDeleteReview(req, res, next) {
		const { _id: userId } = res.locals.user

		try {
			const { reviewId } = ReviewController._getIds(req)
			const review = await Review.findById(reviewId)

			if (!review) return next({ message: '존재하지 않는 리뷰 아이디 입니다.', status: 400 })
			ReviewController._validateAuthor(review.user, userId)

			await review.deleteOne()

			return res.sendStatus(202)
		} catch (err) {
			console.error(err)
			if (err.status) next(err)
			return next({ message: '리뷰 삭제를 실패했습니다.', status: 500 })
		}
	}
}
```

#### 4.1.5 [Import (ESModule)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)

By adopting ESModule, modules are loaded both asynchronously and partially. Thus saving memory and time.

---

ES 모듈을 사용하여 모듈을 비-동기적 그리고 부분적으로 불러온다. 따라서 메모리를 아끼고 속도를 향상시킬 수 있다.

---

#### 4.1.6 [Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

Object-oriented programming is possible with `class` in some degree. In Diver backend, both reviews and collections
share common features: they need a user to be logged in to post, they are MongoDB documents, they are both related to
book and so on.

Therefore, Super class inherits shared common static methods &ndash; which I wish to be protected methods but current JS
doesn't support such feature &ndash; to ReviewController and CollectionController classes.

And controllers related to the same MongoDB collections &ndash; Review and Collection &ndash; are grouped into each
class.

```javascript
export default class SuperController {
	static _getIds(req) {
		//...
	}

	static _validateAuthor(author, currentUserId) {
		//...
	}
}

// review.controller.js
import SuperController from './super.controller.js'

export default class ReviewController extends SuperController {
	static async apiPostReview(req, res, next) {
		//...
	}

	//...
}

// routes/reviews.js
//...
import ReviewCtrl from './review.controller.js'

router.route('/')
	.post(upload.single('image'), ImageUpload.uploadImage, ReviewCtrl.apiPostReview)
	.get(ReviewCtrl.apiGetReviews)

router.route('/:reviewId')
	.get(ReviewCtrl.apiGetReview)
	.put(ReviewCtrl.apiPutReview)
	.delete(ReviewCtrl.apiDeleteReview)
//...
```

### 4.2 MongoDB / Mongoose

#### 4.2.1 [Aggregation](https://docs.mongodb.com/manual/aggregation/)

Formerly, complex document manipulation was done in Node.js server.

```javascript
router.get('/feeds', async (req, res, next) => {
	const { _id: userId } = res.locals.user

	try {
		let user = await User.findById(userId)
		// User .followCount method to create .followingCount and .followerCount properties.
		user = await user.followCount()
		const reviews = await Review.find({ user: userId }).populate('book').sort('-created_at')
		const collections = await Collection.find({ user: userId }).sort('-created_at')

		return res.json({ user, reviews, collections })
	} catch (e) {
		console.error(e)
		return next(new Error('개인 피드 불러오기를 실패했습니다.'))
	}
})
```

Later, the code was refactored by using aggregation pipelines. So the process is now done in MongoDB server (Mongo
Atlas).

```javascript
router.get('/feeds', async (req, res, next) => {
	const { _id: userId } = res.locals.user
	const query = {
		//...
	}
	const projection = {
		//...
	}
	// Using $lookup to calculate follower / following counts.
	const followAggregation = [
		{
			'$lookup': {
				'from': 'follows',
				'let': { 'id': '$_id' },
				'pipeline': [
					{
						'$match': {
							'$expr': { '$eq': ['$$id', '$sender'] },
						},
					},
					{ '$count': 'count' },
				],
				'as': 'followerCount',
			},
		}, {
			'$lookup': {
				'from': 'follows',
				'let': { 'id': '$_id' },
				'pipeline': [
					{
						'$match': {
							'$expr': { '$eq': ['$$id', '$receiver'] },
						},
					},
					{ '$count': 'count' },
				],
				'as': 'followingCount',
			},
		}, {
			'$addFields': {
				'followerCount': {
					'$sum': '$followerCount.count',
				},
				'followingCount': {
					'$sum': '$followingCount.count',
				},
			},
		},
	]
	try {
		// Simpler code with aggregation.
		const user = await User.aggregate([query, projection, ...followAggregation])
		const reviews = await Review.find({ user: userId }).populate('book').sort('-created_at')
		const collections = await Collection.find({ user: userId }).sort('-created_at')

		return res.json({ user, reviews, collections })
	} catch (e) {
		console.error(e)
		return next(new Error('개인 피드 불러오기를 실패했습니다.'))
	}
})
```

# 5. Dependencies 🤝

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
- passport-kakao@1.0.1
- passport@0.4.1
- path@0.12.7
- puppeteer@10.2.0
- xml2js@0.4.23

# 6. Contributors 🧑‍🤝‍🧑

<table>
<tr>
    <td align="center"><a href="https://github.com/seungbin0508"><img src="https://avatars.githubusercontent.com/u/24871719?v=4" width="100px;" alt=""/><br /><sub><b>김승빈</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/ohbin-kwon"><img src="https://avatars.githubusercontent.com/u/77604219?v=4" width="100px;" alt=""/><br /><sub><b>권오빈</b></sub></a><br /></td>
</tr>
</table>

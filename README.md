# π DIVER BACKEND π

β <b>Business Model</b> - Diver provides collections and reviews of books and users can share them like in a social
network.

π <b>Base</b> - A Node.js + Express based backend project.

π <b>Our frontend</b> - Click [Frontend side](https://github.com/sharingBookReview-SERVICE/sharingBookReview-FE) to go
to corresponding React.js based frontend project.

---

## Table of Contents / λͺ©μ°¨

1. Goal Β· λͺ©ν
2. Architecture Β· κ΅¬μ‘°
3. Main features Β· μ£Όμ κΈ°λ₯
4. Sample Codes Β· μν μ½λ
5. Dependencies Β· μμ‘΄μ±
6. Contributors Β· μΈμ

---

# 1. Goal Β· λͺ©ν π₯

At the beginning of the project, deciding which part to focus and which part to discard &ndash; in terms of the tech
stack &ndash; was the most difficult task.

During previous projects and tutorials, we could glimpse several basic techs including Application, Database, DevOps
and/or Business tools.

Yet, with not enough time to master everything that we learned, here are the things that we wanted to put an emphasis
on.

---
νλ‘μ νΈλ₯Ό μμν  λ μ΄λ€ κΈ°μ  μ€νμ μ§μ€νκ³  μ΄λ€ κ²μ μ μ³λμ§ μ νλ κ²μ΄ κ°μ₯ μ΄λ €μ μ΅λλ€.

μ΄μ μ νλ‘μ νΈλ€κ³Ό νν λ¦¬μΌμμ λͺκ°μ§ μ΄νλ¦¬μΌμ΄μ, λ°μ΄ν°λ² μ΄μ€, λ°λΈμ΅μ€ κ·Έλ¦¬κ³  λΉμ¦λμ€ ν΄λ€μ μ ν  μ μμμ΅λλ€λ§,

λ°°μ΄ κ²λ€μ λͺ¨λ μλ¬νκΈ°μλ μ§§μ μκ°μ΄μκΈ° λλ¬Έμ μλμ λͺ©λ‘μ μ£Όμμ μ λκΈ°λ‘ νμμ΅λλ€.

* * *

# 2. Architecture Β· κ΅¬μ‘° π·

```
.
βββ ...
βββ controllers
|   βββ book.controller.js
|   βββ collection.controller.js
|   βββ crawl.controller.js
|   βββ get_collection_image.js
|   βββ get_trending_review.js
|   βββ image_upload.controller.js
|   βββ review.controller.js
|   βββ schedule.controller.js
|   βββ super.controller.js
|   βββ tag.controller.js
|   βββ utilities.js
|
βββ middleware
|   βββ auth_middleware.js
|          
βββ models
|   βββ alert.js 
|   βββ book.js
|   βββ changes_index.js
|   βββ collection.js
|   βββ comment.js
|   βββ follow.js
|   βββ index.js
|   βββ review.js
|   βββ suggestion.js
|   βββ trend.js
|   βββ user.js
|   βββ utilities.js
| 
βββ models
|   βββ alert.js 
|   βββ book.js
|   βββ changes_index.js
|   βββ collection.js
|   βββ comment.js
|   βββ follow.js
|   βββ index.js
|   βββ review.js
|   βββ suggestion.js
|   βββ trend.js
|   βββ user.js
|   βββ utilities.js
| 
βββ routes
|   βββ book.js 
|   βββ collection.js
|   βββ comments.js
|   βββ feeds.js
|   βββ follow.js
|   βββ google_passport.js
|   βββ index.js
|   βββ kakao_passport.js
|   βββ review.js
|   βββ search.js
|   βββ suggestion.js
|   βββ user.js
| 
βββ app.js
βββ config.js
βββ exp_list.js
βββ server.js
βββ socket.js
βββ ...
```

---

## 3. Main features Β· μ£Όμ κΈ°λ₯ π‘
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
<td>π’</td>
<td>π’</td>
<td>β</td>
</tr>
<tr>
<td>2. Trending reviews (reviews with high trending point, in other words, recent review with lots of likes)</td>
<td>π’</td>
<td>β</td>
<td>π’</td>
</tr>
<tr>
<td>3. All recent unread reviews regardless of following.</td>
<td>π’</td>
<td>β</td>
<td>β</td>
</tr>
<tr>
<td>Extra: Show all reviews (Provided on a different tab)</td>
<td>β</td>
<td>β</td>
<td>π’</td>
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
			//todo: $sample λ£κΈ°
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
		return next(new Error('νΌλ λΆλ¬μ€κΈ°λ₯Ό μ€ν¨νμ΅λλ€.'))
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
		console.log('updateTopTags λ₯Ό μ€νν©λλ€.')
		try {
			const updatedBooks = await tagController.#getUpdatedBooks()
			const updatedTags = await tagController.#updateTopTags(updatedBooks)
			const numOfUpdatedTags = await tagController.#updateTagCollection(updatedTags)
			console.log(`updateTopTags κ° μ±κ³΅μ μΌλ‘ μλ£λμμΌλ©°, μ΄ ${numOfUpdatedTags} κ°μ νκ·Έκ° μμ± λλ μμ λμμ΅λλ€.`)
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

# 4. Sample Codes: Improvements by Refactoring Β· μν μ½λ : λ¦¬ν©ν λ§μ ν΅ν κ°μ 

### 4.1 Javascript/ES6+ ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

Not only using basics of ES6 superficially, we tried to implement syntactic sugars of recent versions of ECMAScript.

Here are some codes that went through refactoring to apply ES6+

---

ES6+ μ κΈ°λ³ΈλΏλ§ μλλΌ μ΅μ  λ²μ  ECMAScript μ λ¬Έλ²μ  μ€νμ μ μ©νκΈ° μν΄μ λΈλ ₯νμ΅λλ€.

μλλ ES6+ μ μ©μ νμ¬ λ¦¬ν©ν λ§μ μ§νν μ½λμλλ€.

---

#### 4.1.1 [Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

To reduce time consumption on crawling, we implemented **Promise.allSettled()**.

Because we can query on anytime later, being rejected on some requests was not a big deal &ndash; and this DOES happen
due to advertisement in source URL.

---

ν¬λ‘€λ§ μ μκ° μμλ₯Ό μ€μ΄κΈ° μν΄ **Promise.allSettled()** λ₯Ό μ¬μ©νμμ΅λλ€.

λμ€μλΌλ λ€μ λ°μμ€λ©΄ λκΈ° λλ¬Έμ λͺκ° μ€ν¨νλ€κ³  νλλΌλ ν° λ¬Έμ κ° μλμκΈ° λλ¬Έμλλ€. μ€ν¨λ λμ νμ΄μ§μ μ½μλ μκΈ°μΉ λͺ»ν κ΄κ³  λλ¬Έμ΄μμ΅λλ€.

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

μ΅μλ μ²΄μ΄λμ μ νμ μΈ λ§€κ°λ³μλ₯Ό μ²λ¦¬νκΈ°μ κ°λ ₯νκ³  κ°κ²°ν μ°μ°μμλλ€.`if`λ¬Έμ λΉν΄ λ μ½κΈ° μ’μ μ½λκ° λμμ΅λλ€.

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

`??` μ°μ°μ μ­μ λ³΅μ‘ν `if`λ¬Έμ κ°λ¨νκ² ν΄μ£Όκ³  `let`μ λ μ¬μ©νκ² ν΄μ£Όμμ΅λλ€.

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

`async/await`μ μ¬μ©νμ¬ λ³΅μ‘ν μ½λ°± κ΅¬μ‘°λ₯Ό νΌνκ³  `try/catch`λ‘ μλ¬λ₯Ό μ²λ¦¬ν  μ μμμ΅λλ€.

```javascript
export default class ReviewController extends SuperController {
	//...
	static async apiDeleteReview(req, res, next) {
		const { _id: userId } = res.locals.user

		try {
			const { reviewId } = ReviewController._getIds(req)
			const review = await Review.findById(reviewId)

			if (!review) return next({ message: 'μ‘΄μ¬νμ§ μλ λ¦¬λ·° μμ΄λ μλλ€.', status: 400 })
			ReviewController._validateAuthor(review.user, userId)

			await review.deleteOne()

			return res.sendStatus(202)
		} catch (err) {
			console.error(err)
			if (err.status) next(err)
			return next({ message: 'λ¦¬λ·° μ­μ λ₯Ό μ€ν¨νμ΅λλ€.', status: 500 })
		}
	}
}
```

#### 4.1.5 [Import (ESModule)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)

By adopting ESModule, modules are loaded both asynchronously and partially. Thus saving memory and time.

---

ES λͺ¨λμ μ¬μ©νμ¬ λͺ¨λμ λΉ-λκΈ°μ  κ·Έλ¦¬κ³  λΆλΆμ μΌλ‘ λΆλ¬μ¨λ€. λ°λΌμ λ©λͺ¨λ¦¬λ₯Ό μλΌκ³  μλλ₯Ό ν₯μμν¬ μ μλ€.

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
		return next(new Error('κ°μΈ νΌλ λΆλ¬μ€κΈ°λ₯Ό μ€ν¨νμ΅λλ€.'))
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
		return next(new Error('κ°μΈ νΌλ λΆλ¬μ€κΈ°λ₯Ό μ€ν¨νμ΅λλ€.'))
	}
})
```

# 5. Dependencies π€

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

# 6. Contributors π§βπ€βπ§

<table>
<tr>
    <td align="center"><a href="https://github.com/seungbin0508"><img src="https://avatars.githubusercontent.com/u/24871719?v=4" width="100px;" alt=""/><br /><sub><b>κΉμΉλΉ</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/ohbin-kwon"><img src="https://avatars.githubusercontent.com/u/77604219?v=4" width="100px;" alt=""/><br /><sub><b>κΆμ€λΉ</b></sub></a><br /></td>
</tr>
</table>

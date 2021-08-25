/**
 * Returns set of isbns which changed since last run
 * @returns {Promise<Set<number>>}
 */
const getChangedISBNs = async () => {
	const changes = await ChangesIndex.find()

	return new Set(changes.map((change) => change.isbn))
}
const getChangedTags = async (isbnArr) => {
	const result = new Set()

	/**
	 *  Books to be updated on their topTags property.
	 * @type {Document[]}
	 */
	const books = await Book.find({
		_id: {
			$in: [...isbnArr],
		},
	}).populate('reviews')

	for (const book of books) {
		/**
		 * Array of all tags from hashtags of reviews of book
		 * @type {string[]}
		 */
		const allTags = book.reviews.reduce((acc, review) => {
			return [...acc, ...review.hashtags]
		}, [])
		/**
		 * Array of unique tags from allTags.
		 * @type {string[]}
		 */
		const uniqueTags = [...new Set(allTags)]

		// Update topTags property of book.
		book.topTags = uniqueTags
			.map((tag) => {
				return {
					name: tag,
					occurrence: allTags.filter((_tag) => _tag === tag).length,
				}
			})
			.sort((a, b) => b.occurrence - a.occurrence)
			.slice(0, 9)
			.map((tag) => tag.name)

		await book.save()
		result.add(...book.topTags)
	}

	return result
}

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
	await collection.save()
}
export default indexTopTags = async () => {
	try {
		const changedISBNs = await getChangedISBNs()
		const changedTags = await getChangedTags(changedISBNs)
		changedTags.forEach(await updateCollection)
		await ChangesIndex.deleteMany()
	} catch (e) {
		console.error(e)
	}
}

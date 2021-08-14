/**
 * Check if the document with given id exists in the Collection of the Model
 * @param Model {mongoose.Model}
 * @param id {mongoose.Schema.Types.ObjectId}
 * @returns {Promise<Document>} Document found by id. If doesn't exist, throws an error.
 */
async function validateId(Model, id) {
	const document = await Model.findById(id)

	if (!document) throw new Error('주어진 아이디와 일치하는 대상이 없습니다.')

	return document
}

export { validateId }
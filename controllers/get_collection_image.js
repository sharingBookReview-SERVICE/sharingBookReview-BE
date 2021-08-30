import mongoose from 'mongoose'

/**
 * Converts ObjectId to an image url from unsplash.com
 * @param ID {ObjectId}
 * @returns {string}
 */
const getCollectionImage = (ID) => {
	if (!mongoose.Types.ObjectId.isValid(ID))
		throw new Error('잘못된 ID 입니다.')
	const imageURLs = [
		'https://images.unsplash.com/photo-1630278107980-46fde63cdc12?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
		'https://images.unsplash.com/photo-1630209642854-432d7f3f0e52?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
		'https://images.unsplash.com/photo-1630170140267-c90fd88ee26c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
		'https://images.unsplash.com/photo-1630254675923-bc18e567326a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=633&q=80',
		'https://images.unsplash.com/photo-1630149462155-e55ba22ca36e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=633&q=80',
		'https://images.unsplash.com/photo-1630149461875-233003e5cbb7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=633&q=80',
		'https://images.unsplash.com/photo-1610151642964-cafd5a955564?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
		'https://images.unsplash.com/photo-1629994562870-75d504fc02a1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=808&q=80',
		'https://images.unsplash.com/photo-1630173772589-33c849c0d058?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=564&q=80',
		'https://images.unsplash.com/photo-1630048911157-66276d027a31?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
	]

	const lastDigit = getRandomInt(10)

	return imageURLs[lastDigit]
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default getCollectionImage

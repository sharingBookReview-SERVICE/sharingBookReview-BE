import { Book, ChangeIndex } from '../models/index.js'
import schedule from 'node-schedule'

const getChanges = async () => {

	const changes = await ChangeIndex.find({})

	await Promise.allSettled([...changes.map(change => {
		change.indexed = true
		return change.save()
	})])

	return new Set(changes.map(change => change.isbn))
}

const job = schedule.scheduleJob('0 * * * * *', async () => {
	await ChangeIndex.create({isbn: '1234'}) // temporary document.
	const changedISBNs = await getChanges()
	await ChangeIndex.deleteMany({indexed: true})
	console.log(changedISBNs)
})


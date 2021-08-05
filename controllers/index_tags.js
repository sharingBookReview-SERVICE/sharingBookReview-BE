import { ChangeIndex } from '../models/index.js'
import schedule from 'node-schedule'

const job = schedule.scheduleJob('0 * * * * *', () => {
	console.log('Hello World!')
})
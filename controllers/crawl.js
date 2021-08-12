import puppeteer from 'puppeteer'
import searchBooks from './searchbooks.js'

/**
 * Crawl 10 bestsellers from 'kyobobook'
 * @returns {Promise<*[String]>} Array of bestseller isbn
 */
const getBestsellers = async () => {
	const BESTSELLER_URL = 'https://www.kyobobook.co.kr/bestSellerNew/bestseller.laf'
	
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
		headless: true,
		defaultViewport: null,
	})

	const [page] = await browser.pages()

	await page.goto(BESTSELLER_URL)

	const isbnList = await page.$$eval(
		'ul > input[name=barcode]',
		(inputList) =>
			inputList.map((input) => {
				return input.value
			})
	)

	await browser.close()

	const top10 = isbnList.slice(0,9)
	const promises = top10.map((isbn) => searchBooks('isbn', isbn))
	return [...await Promise.allSettled(promises)]
		.filter((p) => p.status === 'fulfilled')
		.map((p)=>p.value)
}

export { getBestsellers }
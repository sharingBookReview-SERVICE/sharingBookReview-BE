import puppeteer from 'puppeteer'
import searchBooks from './searchbooks.js'
import axios from 'axios'
import cheerio from 'cheerio'


/**
 * Launch browser and goto given url
 * @returns {Promise<Page>}
 */
const launchBrowserAndGotoURL = async (URL) => {
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
		headless: true,
		defaultViewport: null,
	})

	const [page] = await browser.pages()

	await page.goto(URL)

	return page
}

/**
 * Crawl 10 bestsellers from 'kyobobook'
 * @returns {Promise<*[String]>} Array of bestseller isbn
 */
const getBestsellers = async () => {
	const BESTSELLER_URL = 'https://www.kyobobook.co.kr/bestSellerNew/bestseller.laf'
	
	const page = await launchBrowserAndGotoURL(BESTSELLER_URL)

	const isbnList = await page.$$eval(
		'ul > input[name=barcode]',
		(inputList) =>
			inputList.map((input) => {
				return input.value
			})
	)

	await (await page.browser()).close()

	const top10 = isbnList.slice(0,9)
	const promises = top10.map((isbn) => searchBooks('isbn', isbn))
	return [...await Promise.allSettled(promises)]
		.filter((p) => p.status === 'fulfilled')
		.map((p)=>p.value)
}

const getBookDescription = async (link) => {
    const data = await axios.get(link)
    const $ = cheerio.load(data.data)
    const text = $('#bookIntroContent').text()
    return text
};

export { getBestsellers, getBookDescription }
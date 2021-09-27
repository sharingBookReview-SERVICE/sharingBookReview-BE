import puppeteer from 'puppeteer'
import axios from 'axios'
import cheerio from 'cheerio'
import crawlController from './crawl.controller.js'


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
	const promises = top10.map((isbn) => crawlController.searchBooks('isbn', isbn))
	return [...await Promise.allSettled(promises)]
		.filter((p) => p.status === 'fulfilled')
		.map((p)=>p.value)
}

/**
 * Get detailed book description from link
 * @param {string} link - Naver Books URL
 * @returns {Promise<string>} Text - Detailed description of book
 */

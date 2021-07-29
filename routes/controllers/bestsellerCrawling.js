import puppeteer from 'puppeteer'
import searchBooks from './searchbooks.js'

const getBestsellers = async () => {
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
	})

	const [page] = await browser.pages() // page는 tap을 의미함

	await page.goto('https://www.kyobobook.co.kr/bestSellerNew/bestseller.laf')

	const isbnList = await page.$$eval(
		'ul > input[name=barcode]',
		(inputList) =>
			inputList.map((input) => {
				return input.value
			}),
	)

	await browser.close()


	//Due to naver dev api's request limit, only request 10 items
	return Promise.allSettled(isbnList.slice(0,9).map(isbn => searchBooks('isbn', isbn)))

}

export default getBestsellers
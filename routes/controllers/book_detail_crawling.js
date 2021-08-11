import puppeteer from 'puppeteer'

// todo puppeteer 하나로 합치기
const getDescription = async(link) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
		headless: true,
		defaultViewport: null,
	})

	const [page] = await browser.pages() // page는 tap을 의미함

	await page.goto(link)
    
	const bookDescription = await page.$eval(
		'#bookIntroContent',
        element => {
            return element.textContent
        }
	)
	await browser.close()

	return bookDescription
}

export default getDescription
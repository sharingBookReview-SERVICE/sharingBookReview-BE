import puppeteer from 'puppeteer'

const URL = 'https://www.kyobobook.co.kr/bestSellerNew/bestseller.laf'

const getBestsellerISBNs = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    })

    const [page] = await browser.pages() // page는 tap을 의미함

    await page.goto(URL)

    const isbnList = await page.$$eval('ul > input[name=barcode]',
        inputList => inputList.map(input => {
            return input.value
        }))

    await browser.close()

    return isbnList
}

export default getBestsellerISBNs
import puppeteer from 'puppeteer';





const getTextContent = async (page, selector) => {
  const nameValue = await page.waitForSelector(selector);
  var text = await page.evaluate(
    (nameValue) => nameValue.textContent,
    nameValue
  );
  return text;
};

const getAmenities = async (page) => {
  await page.waitForSelector(
    '#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._16e70jgn > div > div:nth-child(5) > div > div:nth-child(2) > section > div.c16f2viy.dir.dir-ltr > div:nth-child(1)'
  );

  const length = await page.evaluate(() => {
    return Array.from(
      document.querySelector('div[class="c16f2viy dir dir-ltr"]').children
    ).length;
  });

  const data = [];
  for (var i = 1; i < length; i++) {
    var element = await page.waitForSelector(
      '#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._16e70jgn > div > div:nth-child(5) > div > div:nth-child(2) > section > div.c16f2viy.dir.dir-ltr > div:nth-child(' +
        i +
        ')'
    );
    var text2 = await page.evaluate((element) => element.textContent, element);

    data.push(text2);
  }
  return data;
};

async function scrape(url) {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'load', timeout: 0 });
    console.log(url);
    const property_name = await getTextContent(
      page,
      '#site-content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div > div > section > div._b8stb0 > span > h1'
    );
    const property_type = await getTextContent(
      page,
      '#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._16e70jgn > div > div:nth-child(1) > div > div > section > div > div > div._tqmy57 > div > h2'
    );

    const bedrooms = await getTextContent(
      page,
      '#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._16e70jgn > div > div:nth-child(1) > div > div > section > div > div > div._tqmy57 > ol > li:nth-child(2) > span:nth-child(2)'
    );

    const bathrooms = await getTextContent(
      page,
      '#site-content > div > div:nth-child(1) > div:nth-child(3) > div > div._16e70jgn > div > div:nth-child(1) > div > div > section > div > div > div._tqmy57 > ol > li:nth-child(4) > span:nth-child(2)'
    );

    const amenities = await getAmenities(page);

    browser.close();

    return {
      property_name,
      property_type,
      bedrooms,
      bathrooms,
      amenities,
    };
  } catch (error) {
    return {
      property_name: 'NA',
      property_type: 'NA',
      bedrooms: 'NA',
      bathrooms: 'NA',
      amenities: 'NA',
    };
  }
}

const urls = [
  'https://www.airbnb.co.uk/rooms/33571268',
  'https://www.airbnb.co.uk/rooms/20669368',
  'https://www.airbnb.co.uk/rooms/50633275',
];

async function scrapeProperties() {
  const propertyDetails = [];
  for (const url of urls) {
    const details = await scrape(url);
    if (details) {
      propertyDetails.push(details);
    }
  }

  for (const details of propertyDetails) {
    console.log('Property Name:', details.property_name);
    console.log('Property Type:', details.property_type);
    console.log('Bedrooms:', details.bedrooms);
    console.log('Bathrooms:', details.bathrooms);
    console.log('Amenities:', details.amenities);
    console.log('-----------------------');
  }
}

scrapeProperties();
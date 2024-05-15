// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const { createObjectCsvWriter } = require("csv-writer");

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // Wait for the list of articles to load
  await page.waitForSelector(".athing");

  // Extract top 10 articles
  const articles = await page.evaluate(() => {
    const articles = [];
    const items = document.querySelectorAll(".athing");
    for (let i = 0; i < items.length && i < 10; i++) {
      const titleElement = items[i].querySelector(".storylink");
      const title = titleElement ? titleElement.textContent.trim() : "N/A";
      const url = titleElement ? titleElement.href : "N/A";
      articles.push({ title, url });
    }
    return articles;
  });

  // Save articles to CSV
  const csvWriter = createObjectCsvWriter({
    path: "hacker_news_top_10.csv",
    header: [
      { id: "title", title: "Title" },
      { id: "url", title: "URL" },

    ],
  });
  await csvWriter.writeRecords(articles);

  console.log("Top 10 articles saved to hacker_news_top_10.csv");

  // Close the browser
  await browser.close();

}


(async () => {
  await saveHackerNewsArticles();
})();

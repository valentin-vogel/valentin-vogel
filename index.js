require('dotenv').config();
const RSSParser = require('rss-parser');
const Mustache = require('mustache');
const fs = require('fs');

const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
  refresh_date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Berlin',
  }),
  medium_posts: []
};

async function setMediumPosts() {
  const parser = new RSSParser();
  await parser.parseURL(`https://medium.com/feed/${process.env.MEDIUM_USERNAME}`).then(feed => feed.items.forEach(item => {
     DATA.medium_posts.push({title: item.title, link: item.link.split('?')[0]});
  }));
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function run() {
  /**
   * Get medium posts
   */
  await setMediumPosts();

  /**
   * Generate README
   */
  await generateReadMe();
}

run();
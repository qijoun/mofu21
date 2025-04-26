const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get('https://animag.ru/news');
    const html = response.data;
    const $ = cheerio.load(html);

    const newsItems = [];

    $('.elementor-post').each((i, elem) => {
      const title = $(elem).find('.elementor-post__title a').text().trim();
      const link = $(elem).find('.elementor-post__title a').attr('href');
      const date = $(elem).find('.elementor-post__meta-data').text().trim();
      const image = $(elem).find('.elementor-post__thumbnail img').attr('src');

      if (title && link && date && image) {
        newsItems.push({ title, link, date, image });
      }
    });

    res.json(newsItems);
  } catch (error) {
    console.error('Ошибка при парсинге новостей:', error);
    res.status(500).send('Ошибка загрузки новостей');
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

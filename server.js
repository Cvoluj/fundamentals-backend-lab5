require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');
const methodOverride = require('method-override');
const hbs = require('hbs');

const app = express();
app.use(express.static("public"));

const PORT = process.env.PORT || 3030;

hbs.registerHelper('formatDate', (date) => {
  return moment(date).locale('uk').format('DD.MM.YYYY HH:mm');
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('view options', { layout: 'layouts/main' })
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

const postsRouter = require('./routes/posts');
app.use('/posts', postsRouter);

app.get('/', (req, res) => {
  res.redirect('/posts');
});

app.use((req, res) => {
  res.status(404).send('Сторінку не знайдено');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

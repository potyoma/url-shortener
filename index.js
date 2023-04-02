require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {resolve} = require("node:dns")
const bodyparser = require("body-parser")
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const urls = []

app.use(cors());

app.use(bodyparser.urlencoded({extended: false}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const ind = req.params.short_url
  const originalUrl = urls[ind]
  res.redirect(301, originalUrl)
})

app.post("/api/shorturl", (req, res) => {
  const {url} = req.body
  const isValid = url.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)

  if (!isValid) {
    res.json({error: "invalid url"})
    return
  }
  
    urls.push(url)
    res.json({original_url: url, short_url: urls.length - 1})
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

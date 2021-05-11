const http = require('http');
const qs = require('querystring');
const download = require('./index');

const app = http.createServer();
app.on('request', (req, res) => {
  res.writeHeader(200, {
    "Content-Type" : "text/plain"
  });
  const urls = req.url.split('?');
  const query = qs.parse(urls[1]);
  
  if (query.url) {
    download(query.url, query.name);
  }
  
  res.write('success');
  res.end();
});

app.listen(18080);
console.log('http server');
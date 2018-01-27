const express = require('express')
const app = express()

var port = process.env.PORT || 8080;

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/main.html");
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
})
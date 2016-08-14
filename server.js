var express = require('express');
var app = express();

var port = "process.env.PORT || 3000"

app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) { 
    res.sendFile('index.html');
});


app.listen(port, function () {
    console.log('app is up and running at port ' + port);
});

var express = require('express');
var app = express();

var port = "process.env.PORT || 3030"

app.use(express.static(__dirname + '/'));


app.listen(port, function () {
    console.log('app is up and running at port ' + port);
});

var express = require('express');
var path = require("path");
var jsonfile = require('jsonfile');
var bodyParser = require('body-parser');



var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/content', express.static('./public'));
app.use('/json_data', express.static('./json_file'));

app.get('/', function (req, res) {
    console.log(" --> " + path.join(__dirname + '/MonthlyView.html'));
    //res.sendFile(path.join(__dirname + '/MonthlyView.html'));
    res.render('pages/MonthlyView');
});

app.get('/dailyView', function(req, res){
    //res.sendFile(path.join(__dirname + '/DailyView.html'));
    //console.log("-->" + req.query["date"]);
    //console.log("Redirecting to daily View");
    res.render('pages/DailyView', {date: req.query['date']}); 
});

app.get('/getWholeData', function (req, res) {
    //console.log("Server: getting whole data");
    var file = 'json_file/event.json'
    jsonfile.readFile(file, function (err, obj) {
        res.send(obj);
    });
});

app.post('/saveWholeData', function (req, res) {
    //console.log("Server: Saving whole data");
    //console.log(req.body);
    
    var file = 'json_file/event.json'
    jsonfile.writeFile(file, req.body, { spaces: 2 }, function (err) {
        res.send({received : 'yes'});
    })
});
const electronApp = require("./electron-app");
app.listen(3000, function () {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
    electronApp();
});
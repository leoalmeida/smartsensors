'use strict'

const debug = require('debug')('smartsensors');
const http = require('http');
const https = require('https');

//const port = process.env.PORT || 8080;

const app = require('../app');

app.set('port', process.env.PORT || 3001);
app.set('httpsport', process.env.PORT || 3002);


//const httpServer = http.createServer(app);

https.createServer(options, app).listen(app.get('httpsport'), function(){
  console.log('Listen Https on port ' + app.get('httpsport'));
});

/* socket usage
    const getDecorateIO = require('./devices');
    const io = require('socket.io')(httpServer);
    var startBoard = getDecorateIO();
    startBoard(io);


const server = httpServer.listen(port, function(){
    console.log('Listen on port ' + port);
});
*/
const server = app.listen(app.get('port'), function() {
  console.log('Express server is in '+process.env.NODE_ENV+' mode and listening on port ' + server.address().port);

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

/*
const actionsObj = require('./nodeactions');

let sensorsActionProcess = function () {
    console.log(actionsObj.runactions());
    if (!actionsObj.runactions()) return;
    actionsObj.generateLog("Iniciando processamento de ações");

    if(!actionsOnj.processAllRecipes()) return;

    actionsObj.generateLog("Fim do processamento de ações");

    setTimeout(sensorsActionProcess, 10000);
    //setTimeout(sensorsActionProcess,450000);
};

sensorsActionProcess();
*/
/*const externalActionsObj = require('./externalactions');

let twitterActionTrends = function () {
    console.log("Verificando Trends");

    let params = {
        requestedApi: 'trends',
        apiService: 'twitter',
        parameters: {
            id: 1
        }
    };

    if (externalActionsObj.apiRequest(params))
        setTimeout(twitterActionTrends,1800000);
    else
        setTimeout(twitterActionTrends,5000);
};

//twitterActionTrends();

let twitterActionSearch = function () {
    console.log("Verificando Tweets");

    let params = {
        requestedApi: 'search',
        apiService: 'twitter',
        parameters: {
            q: "#cacaushow"
        }
    };

    if (externalActionsObj.apiRequest(params))
        setTimeout(twitterActionSearch,1800000);
    else
        setTimeout(twitterActionSearch,5000);
};

//twitterActionSearch();

let googleActionTrends = function () {
    console.log("Verificando Google Trends");

    let params = {
        requestedApi: 'interestByRegion',
        apiService: 'google',
        parameters: {
            keyword: "cacau show",
            geo: "BR-SP"
        }
    };

    if (externalActionsObj.apiRequest(params))
        setTimeout(googleActionTrends,1800000);
    else
        setTimeout(googleActionTrends,5000);
};



googleActionTrends();
*/
/*const facebookActionsObj = require('./facebookactions');
const twitterActionsObj = require('./twitteractions');

let facebookActionTrends = function () {
    console.log("Verificando Face");

    facebookActionsObj.verifyFacebookInfo("topic", "cacaushow");

    setTimeout(facebookActionTrends,1800000);
};

let twitterActionTrends = function () {
    console.log("Verificando Trends");

    twitterActionsObj.verifyTweets();

    setTimeout(twitterActionTrends,1800000);
};

let twitterActionSearch = function () {
    console.log("Verificando Tweets");

    twitterActionsObj.searchTweets("#cacaushow");

    setTimeout(twitterActionSearch,1800000);
};

//facebookActionTrends();
//twitterActionTrends();
//twitterActionSearch();
*/

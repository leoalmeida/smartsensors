'use strict'

const http = require('http');
const port = process.env.PORT || 8080;
const app = require('../app');
const httpServer = http.createServer(app);

/* socket usage
    const getDecorateIO = require('./devices');
    const io = require('socket.io')(httpServer);
    var startBoard = getDecorateIO();
    startBoard(io);
*/

const server = httpServer.listen(port, function(){
    console.log('Listen on port ' + port);
});

const actionsObj = require('./nodeactions');

let sensorsActionProcess = function () {
    console.log(actionsObj.runactions());
    if (!actionsObj.runactions()) return;
    actionsObj.generateLog("Iniciando processamento de ações");

    if(!actionsOnj.processAllRecipes()) return;

    actionsObj.generateLog("Fim do processamento de ações");

    //setTimeout(sensorsActionProcess, 1000);
    setTimeout(sensorsActionProcess,450000);
};

sensorsActionProcess();

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


'use strict';

const funclist = require('express').Router();
const db = require('../db');

const googleTrends = require('google-trends-api');
const FB = require('fb');
const OAuth2 = require('oauth').OAuth2;
const Twitter = require('twitter');

let twitterClient = null;

let externalApis = [];
let connecting = false;

db.ref('configurations/externalAPIs')
    .on("value", function (snapshot) {
        let values = snapshot.val();

        for (let item of Object.keys(values)){
            externalApis[item]= {
                clientInfo: values[item].clientInfo,
                apis: values[item].apis,
                url: values[item].url
            }
        }

        externalApis['google'].executeFunction = function(fullurl, options, params, cb){
            console.log('Executando: ' + fullurl);
            console.log('Options: ' + JSON.stringify(options));
            return  googleTrends[fullurl](options)
                .then(function(data){
                    let results = JSON.parse(data);
                    //console.log(results.default);
                    updateExternalInfo(params, results.default[externalApis[params.apiService].apis[params.requestedApi].root]);
                    cb(params, results.default[externalApis[params.apiService].apis[params.requestedApi].root]);
                })
                .catch(function(err){
                    console.error(err);
                });
        };

        externalApis['facebook'].executeFunction = function(fullurl, options, params, cb){
            console.log('Executando: ' + fullurl);
            console.log('Options: ' + options);
            return FB.api(fullurl, options, function (response) {
                if (response && !response.error) {
                    console.log("Response: " + JSON.stringify(response) );
                    console.log(response.id);
                    console.log(response.name);
                    updateExternalInfo(params, response);
                    cb(params, response);
                }else{
                    console.log(!response ? 'error occurred' : response.error);
                }
            });
        };

        externalApis['twitter'].executeFunction = function(fullurl, options, params, cb){
            console.log('Executando: ' + fullurl);
            console.log('Options: ' + JSON.stringify(options));
            if (!twitterClient)
                twitterClient = new Twitter({
                    //consumer_key: process.env.TWITTER_CONSUMER_KEY,
                    //consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                    consumer_key: externalApis['twitter'].clientInfo.appId,
                    consumer_secret: externalApis['twitter'].clientInfo.appSecret,
                    bearer_token: externalApis['twitter'].clientInfo.clientToken
                });
            return twitterClient.get(fullurl, options, function(error, tweets, response) {
                //if(error) console.log(util.inspect(error, false, null));
                if(error) console.log(JSON.stringify(error));
                console.log("tweets: " + JSON.stringify(tweets) );
                updateExternalInfo(params, tweets);
                cb(params, tweets);
                //console.log("response: " + JSON.stringify(response));
            });
        };
    });

funclist.apiServiceAppAuth = function (params, cb) {

    if (connecting) {
        console.log("conectando ...");
        return;
    }

    connecting = true;

    switch (params.apiService) {
        case 'google':
            break;
        case 'facebook':
            //Facebook AUTHENICATION
            console.
                log("Conectando Facebook");
                FB.api('oauth/access_token', {
                    client_id: 'facebookAppId',
                    client_secret: 'facebookAppSecret',
                    grant_type: 'client_credentials'
                }, function (res) {
                    console.log(JSON.stringify(res));
                    if (!res || res.error) {
                        console.log(!res ? 'error occurred' : res.error);
                        return;
                    }

                    console.log(JSON.stringify(res));

                    externalApis['facebook'].clientInfo.clientToken = res.access_token;

                    funclist.apiRequest(params, cb);

                    connecting = false;
                });
            break;
        case 'twitter':

            //TWITTER AUTHENICATION
            var oauth2 = new OAuth2(externalApis['twitter'].clientInfo.appId,
                                    externalApis['twitter'].clientInfo.appSecret,
                                    externalApis['twitter'].url ,
                                    null, 'oauth2/token', null);
            oauth2.getOAuthAccessToken('', {
                'grant_type': 'client_credentials'
            }, function (e, access_token) {
                externalApis['twitter'].clientInfo.clientToken = access_token;
                console.log("token: " + externalApis['twitter'].clientToken );
                funclist.apiRequest(params, cb);
                connecting = false;
            });

            break;
        case 'google':
            break;

        default:
            return false;
    }
    return true;
};

funclist.apiRequest = function (params, cb) {

    if ((!externalApis[params.apiService]) ||
        (!params.attributes && externalApis[params.apiService].apis[params.requestedApi].attributes && externalApis[params.apiService].apis[params.requestedApi].attributes.length > 0) ||
        (params.attributes && !externalApis[params.apiService].apis[params.requestedApi].attributes) ||
        (params.attributes && externalApis[params.apiService].apis[params.requestedApi].attributes && params.attributes.length < externalApis[params.apiService].apis[params.requestedApi].attributes.length)) return false;

    if (!externalApis[params.apiService].clientInfo.clientToken) {
        return funclist.apiServiceAppAuth(params, cb);
    }

    params.parameters.access_token = externalApis[params.apiService].clientInfo.clientToken;

    let options = {};

    for (let key of externalApis[params.apiService].apis[params.requestedApi].parameters){
        options[key] = params.parameters[key];
    }

    let fullurl = externalApis[params.apiService].apis[params.requestedApi].path;
    for (let attr of externalApis[params.apiService].apis[params.requestedApi].attributes){
        fullurl = fullurl + params.attributes[attr];
    }

    externalApis[params.apiService].executeFunction(fullurl, options, params, cb);

    return true;
};

let updateExternalInfo = function (params, values) {
    console.log(values);
    db.ref("external/" + params.apiService + "/" + params.requestedApi).child(Date.now()).set(values).then(function() {
        console.log('Serviço externo' + params.apiService + "/" + params.requestedApi + ' sincronizado.');
    });
};

/**
 * Remove acentos de caracteres
 * @param  {String} stringComAcento [string que contem os acentos]
 * @return {String}                 [string sem acentos]
 */
funclist.removeEspecialChars = function(newString){
    let string = newString.trim();
    string = string.replace(/^\s+|\s+$/g, "");
    let mapaAcentosHex 	= {
        a : /[\xE0-\xE6]/g,
        A : /[\xC0-\xC6]/g,
        e : /[\xE8-\xEB]/g,
        E : /[\xC8-\xCB]/g,
        i : /[\xEC-\xEF]/g,
        I : /[\xCC-\xCF]/g,
        o : /[\xF2-\xF6]/g,
        O : /[\xD2-\xD6]/g,
        u : /[\xF9-\xFC]/g,
        U : /[\xD9-\xDC]/g,
        c : /\xE7/g,
        C : /\xC7/g,
        n : /\xF1/g,
        N : /\xD1/g
    };

    for ( let letra in mapaAcentosHex ) {
        let expressaoRegular = mapaAcentosHex[letra];
        string = string.replace( expressaoRegular, letra );
    }

    string = string.toLowerCase();
    string = string.replace(/[^a-z0-9\-]/g, " ");

    string = string.replace(/ {2,}/g, " ");

    return string;
}

module.exports = funclist;

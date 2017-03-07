'use strict';

const funclist = require('express').Router();
const db = require('../db');
const OAuth2 = require('oauth').OAuth2;
const Twitter = require('twitter');

let consumer_key = 'qakPneDrG2qino1ln5BhXVEMv';
let consumer_secret = 'tQBwsjedD3jMbiwnGrvL2u9ywQxNvMGvtQg1dinzHVg8DvpBoJ';
let client = null;

funclist.authApp = function (callback, params) {
    //TWITTER AUTHENICATION
    var oauth2 = new OAuth2(consumer_key, consumer_secret, 'https://api.twitter.com/', null, 'oauth2/token', null);
    oauth2.getOAuthAccessToken('', {
        'grant_type': 'client_credentials'
    }, function (e, access_token) {
        let token = access_token;
        console.log("token: " + token );
        client = new Twitter({
            //consumer_key: process.env.TWITTER_CONSUMER_KEY,
            //consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            consumer_key: consumer_key,
            consumer_secret: consumer_secret,
            bearer_token: token
        });

        callback(params);
    });
};

funclist.searchTweets = function (hashtag) {
    if (!client) {
        funclist.authApp(funclist.searchTweets, hashtag);
        return;
    }
    client.get('search/tweets', {q: hashtag}, function(error, tweets, response) {
        //if(error) console.log(util.inspect(error, false, null));
        if(error) console.log(JSON.stringify(error));
        console.log("tweets: " + JSON.stringify(tweets) );
        updateTweets(hashtag, tweets);
        //console.log("response: " + JSON.stringify(response));
    });
}

funclist.verifyTweets = function () {
    if (!client) {
        funclist.authApp(funclist.verifyTweets);
        return;
    }

    client.get('trends/place', {id: 23424768}, function(error, trends, response) {
        //if(error) console.log(util.inspect(error, false, null));
        if(error) console.log(JSON.stringify(error));
        //console.log("trends: " + JSON.stringify(trends) );

        updateTrends(trends);
    });
};

let updateTweets = function (hashtag, tweets) {
    db.ref('tweets').child(funclist.removeEspecialChars(hashtag)).set(tweets).then(function() {
        console.log('Tweets sincronizado.');
    });
};

let updateTrends = function (trends) {
    db.ref('trends').set(trends).then(function() {
        console.log('Trends sincronizado.');
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

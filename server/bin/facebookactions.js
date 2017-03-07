'use strict';

const funclist = require('express').Router();
const db = require('../db');

let mngSecret = 'EAADaTArFoYYBACJxvDf21BbVnFHedoWGXTuUuNZAVe8dhGj79N2dVOGsALq3BKJcWIHLXXZAHwq4qNUQV0JMHJwnovn3obOgQxoM6YZAVxpc8h5V9T9ZC7IFfJZBMLffrsAeEZCkgi5FjSTmhxrQ3UZBkq4tgEmfl8mcDFpThk3dgZDZD';
let facebookAppId = '240020133093766';
let facebookAppSecret = '414408bd3b2f6ecaa63f689142ca3def';
let facebookClientToken = '4254a25dca55dfdc3b4e1301450c5115';

let FB = require('fb');

let token = facebookAppId + '|' + facebookAppSecret;

funclist.authApp = function (callback, topic, hashtag) {
    //Facebook AUTHENICATION
    console.log("Conectando Facebook");
    FB.api('oauth/access_token', {
        client_id: 'facebookAppId',
        client_secret: 'facebookAppSecret',
        grant_type: 'client_credentials'
    }, function (res) {
        console.log(JSON.stringify(res));
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }

        console.log(JSON.stringify(res));

        token = res.access_token;
        callback(topic, hashtag);
    });
};

funclist.verifyFacebookInfo = function (topic, hashtag) {

    /*if (!token) {
        funclist.authApp(funclist.searchTweets, topic, hashtag);
        return;
    }*/

    let options = {type: topic, q: hashtag , fields: ['id', 'name', 'page'], access_token: token };

    FB.api("/malware_analyses", options,
        function (response) {
            if (response && !response.error) {
                console.log("Response: " + JSON.stringify(response) );
                console.log(response.id);
                console.log(response.name);
                updateFacebookInfo(topic, hashtag, response);
            }else{
                console.log(!response ? 'error occurred' : response.error);
            }
        }
    );
};

let updateFacebookInfo = function (topic, hashtag, values) {
    db.ref('facebook').child(funclist.removeEspecialChars(topic)).set(values).then(function() {
        console.log('Facebook sincronizado.');
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

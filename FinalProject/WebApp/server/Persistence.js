const request = require('request')
const superagent = require('superagent')
const http = require('http');
var synq = require('sync-request');

exports.get_request = (url) => {
    var res = synq('GET', url);
    return JSON.parse(res.getBody('utf8'))
}

exports.put_request = (url, obj) => {
    request(
        {
            url: url,
            method: 'PUT',
            json: obj
        }, (error, response, body) => {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode)
        })
}
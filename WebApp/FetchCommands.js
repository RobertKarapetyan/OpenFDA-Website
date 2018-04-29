const superagent = require('superagent')
const config = require('./config')

const _fetch = (search = '', limit = 1) => {
    return superagent.get(config.url +
        `search=${search}&limit=${limit}`)
        .then(response => response.body)
        .catch(error => error.response.body)
}

exports.records = (drug, record_count = 5) => {
    return _fetch(drug, record_count).then((response) => {
        return response.results
    })
}
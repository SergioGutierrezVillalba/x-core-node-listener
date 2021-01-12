const axios = require('axios').default;

class ContactService {
    constructor (requester = axios) {
        this._requester = requester;
        this._endpoint = 'https://api.internxt.com/contacts';
    }

    getById ({id}) {
        return this._requester.get(`${this._endpoint}/${id}`);
    }
}

module.exports = ContactService;
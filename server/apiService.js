const SoundCloud = require('soundcloud-api-client');
const promisify = require('util.promisify');
require('dotenv').config()

const client_id = process.env.CLIENT_ID
const hostname = process.env.HOSTNAME
const soundcloud = new SoundCloud({ client_id, hostname });

async function getUser(username) {
    let url = `https://soundcloud.com/${username}`
    let result = await soundcloud.get(`/resolve`, { url })
    return result; 
}

async function getFollowings(userId) {
    let result = await soundcloud.get(`/users/${userId}/followings`)
    return result; 
}

async function getFavorites(userId) {
    let result = await soundcloud.get(`/users/${userId}/likes`, {
        limit: 20
    })
    return result; 
}

module.exports = {
    getUser,
    getFollowings, 
    getFavorites
}
const SoundCloud = require('soundcloud-api-client');
const promisify = require('util.promisify');
require('dotenv').config()

const client_id = process.env.CLIENT_ID
const hostname = process.env.SC_HOSTNAME
let soundcloud = new SoundCloud({ client_id, hostname });

function updateClientId(client_id) {
    soundcloud = new SoundCloud({ client_id, hostname })
}

async function getUser(username) {
    let url = `https://soundcloud.com/${username}`
    let result = await soundcloud.get(`/resolve`, { url })
    return result; 
}

// limit: 200, use offset
async function getFollowings(userId, limit) {
    let result = await soundcloud.get(`/users/${userId}/followings`, {
        limit
    })
    return result; 
}

// limit: 200 
async function getFavorites(userId, limit) {
    let result = await soundcloud.get(`/users/${userId}/likes`, {
        limit
    })
    return result; 
}

module.exports = {
    updateClientId,
    getUser,
    getFollowings, 
    getFavorites
}
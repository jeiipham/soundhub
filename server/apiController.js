const router = require('express').Router()
const apiService = require('./apiService')

// session variables 
let scanCount = 0
let uniqueUsers = new Set();

function postProcessing(user) {
    scanCount++;
    uniqueUsers.add(user.permalink)
    console.log('[USER]\x1b[36m', user.permalink, user.username, user.full_name,
        user.followers_count, user.followings_count, '\x1b[0m')
    console.log('[SYSTEM]', scanCount, uniqueUsers.size)
}

router.get('/', (req, res, next) => {
    res.send({ sound: "hub" })
    if (req.query.client_id) {
        console.log("[SYSTEM] updating client_id: " + req.query.client_id)
        apiService.updateClientId(req.query.client_id);
    } 
})

router.get('/users/:username', async (req, res, next) => {
    try {
        let user = await apiService.getUser(req.params.username)
        res.send(user)
        postProcessing(user)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.get('/followings/:userId', async (req, res, next) => {
    try {
        let followings = await apiService.getFollowings(req.params.userId, 200)
        // console.log("followings", followings.collection.length)
        res.send(followings)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.get('/favorites/:userId', async (req, res, next) => {
    try {
        let limit = req.query.limit ? req.query.limit : 200;
        let favorites = await apiService.getFavorites(req.params.userId, limit)
        // console.log("favorites", favorites.collection.length)
        res.send(favorites)
    } catch (error) {
        console.error(error)
        next(error)
    }
})


module.exports = router 
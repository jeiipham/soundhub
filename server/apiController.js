const router = require('express').Router() 
const apiService = require('./apiService')

router.get('/', (req, res, next) => {
    res.send({ hello: "world" })
})

router.get('/users/:username', async (req, res, next) => {
    try {
        let user = await apiService.getUser(req.params.username)
        console.log("USER", user.permalink, user.full_name)
        res.send(user)
    } catch (error) {
        console.error(error)
        next(error) 
    }
})

router.get('/followings/:userId', async (req, res, next) => {
    try {
        let followings = await apiService.getFollowings(req.params.userId, 200)
        console.log("followings", followings.collection.length)
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
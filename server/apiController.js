const router = require('express').Router() 
const apiService = require('./apiService')

router.get('/', (req, res, next) => {
    res.send({ hello: "world" })
})

router.get('/users/:username', async (req, res, next) => {
    try {
        let user = await apiService.getUser(req.params.username)
        console.log(user)
        res.send(user)
    } catch (error) {
        console.error(error)
        next(error) 
    }
})

router.get('/followings/:userId', async (req, res, next) => {
    try {
        let followings = await apiService.getFollowings(req.params.userId)
        console.log(followings)
        res.send(followings)
    } catch (error) {
        console.error(error)
        next(error) 
    }
})

router.get('/favorites/:userId', async (req, res, next) => {
    try { 
        let favorites = await apiService.getFavorites(req.params.userId)
        console.log(favorites)
        res.send(favorites) 
    } catch (error) {
        console.error(error)
        next(error) 
    }
})


module.exports = router 
export async function getUserAsync(username) {
    let res = await fetch(`/api/users/${username}`)
    let json = await res.json()
    return json
}

export async function getFollowingsAsync(userId) {
    let res = await fetch(`/api/followings/${userId}`)
    let json = await res.json()
    return json.collection
}

export async function getFavoritesAsync(userId) {
    let res = await fetch(`/api/favorites/${userId}`)
    let json = await res.json()
    return json.collection
}

// module.exports = {
//     getUserIdAsync,
//     getFollowingsAsync,
//     getFavoritesAsync
// }
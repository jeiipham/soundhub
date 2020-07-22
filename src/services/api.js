const serverHost = `http://${window.location.hostname}:3001`

export function getUserAsync(username) {
    return fetch(`${serverHost}/api/users/${username}`)
        .then(res => {
            if (res.status === 404) throw new Error("Username doesn't exist.")
            return res.json()
        })
}

export function getFollowingsAsync(userId) {
    return fetch(`${serverHost}/api/followings/${userId}`)
        .then(res => res.json())
        .then(json => json.collection)
}

export function getFavoritesAsync(userId, limit, abortController) {
    let params = new URLSearchParams()
    if (limit) params.append("limit", limit)
    return fetch(`${serverHost}/api/favorites/${userId}?${params.toString()}`, {
        signal: abortController.signal
    })
        .then(res => res.json())
        .then(json => json.collection)
}

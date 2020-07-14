import React from 'react';
import { Box, Grid, TextField, Typography, Button, Paper, LinearProgress } from '@material-ui/core';
import Loading from "./Loading"
import { sizing } from '@material-ui/system';


const SC = require('soundcloud');
const promisify = require('util.promisify');
const api = require('../services/api')


class Scan extends React.Component {

  constructor() {
    super();
    this.state = {
      username: null,
      userId: null,

      // loading 
      processed: 0,
      numFollowings: null,
      loadingText: null,
      imageUrl: null, 

      // results 
      details: [],
    };
  }

  async componentDidMount() {
    let username = this.props.match.params.username
    let userId = await api.getUserIdAsync(this.props.match.params.username)
    this.setState({ username, userId })
    // let test = await api.getFavoritesAsync(userId)
    // console.log(test)

    this.setState({ loading: "Fetching network" })
    await this.doScan(userId)

  }

  // user: username, permalink, full_name, avatar_url
  // track: id
  async doScan(userId) {
    let followings = await api.getFollowingsAsync(userId)
    this.setState({ numFollowings: followings.length })
    console.log("followings", followings)

    // trackId => [users]
    let trackMap = {};
    for (let user of followings) {
      this.handleFollowingAsync(user, trackMap)
    }
    return trackMap;
  }

  async handleFollowingAsync(user, trackMap) {
    let favorites = await api.getFavoritesAsync(user.id)
    this.setState({ 
      loading: `Processing ${user.permalink}`,
      imageUrl: user.avatar_url
     })

    for (let item of favorites) {
      if (!('track' in item)) continue;
      let track = item.track;
      if (track.id in trackMap) trackMap[track.id].users.push(user.username)
      else trackMap[track.id] = { track, users: [user.username] };
    }

    // all promises fulfilled
    this.setState({ processed: this.state.processed + 1 })
    if (this.state.processed === this.state.numFollowings) {
      await this.sort(trackMap)
      this.setState({ loading: null })
    }
  }

  async sort(trackMap) {
    let details = Object.values(trackMap)
    details.sort((a, b) => b.users.length - a.users.length)
    console.log(details)
    this.embed(details, 10)
  }

  async embed(collection, limit) {
    // only auto play one song
    let auto_play = false;
    collection = collection.slice(0, limit)

    for (let item of collection) {
      const track = item.track

      let embed = await SC.oEmbed(track.uri, {
        auto_play: auto_play,
        maxheight: 250,
      })

      // hack but works since states are immutable 
      this.state.details.push({
        track: track,
        users: item.users,
        embed: embed,
        __html: embed.html
      })
      this.setState({ details: this.state.details })

      auto_play = false;
    }
    console.log(this.state.details)
  }

  render() {
    return (
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <Typography variant='h2' align="center">soundhub</Typography>
        </Grid>

        <Grid container item xs={12} justify="center">
          <Paper component="form">
            <TextField variant="filled" label="username"></TextField>
            <TextField variant="filled" label="type"></TextField>
            <Button variant="contained" color="primary" type="submit">Search</Button>

            <Typography>
              username: {this.state.username} <br />
              userId: {this.state.userId} <br />
              network size: {this.state.numFollowings}
            </Typography>
          </Paper>
        </Grid>


        {this.state.loading && this.state.numFollowings 
          && <Loading done={this.state.processed} total={this.state.numFollowings} text={this.state.loading} imageUrl={this.state.imageUrl}/>} 

        
        {this.state.details && this.state.details.map(item =>
          <Grid container item xs={11} key={item.track.id}>
            <Grid item xs={12} dangerouslySetInnerHTML={item}></Grid>
            <Grid item xs={12}>
              ({item.users.length}) 
              {item.users.map(user =>
              <span key={user}>{user} | </span>
            )}
            </Grid>

          </Grid>
        )}

      </Grid>
    );
  }
}

export default Scan;

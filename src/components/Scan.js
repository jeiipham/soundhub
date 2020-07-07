import React from 'react';
import { Grid, TextField, Typography, Button } from '@material-ui/core';
const SC = require('soundcloud');

class Scan extends React.Component {

  constructor() {
    super();
    this.state = {
      username: null,
      userId: null,
      details: []
    };
  }

  embed(collection) {
    // only auto play one song
    let auto_play = true;
    for (let item of collection) {
      const track = item.track
      SC.oEmbed(track.uri, {
        auto_play: auto_play,
        maxheight: 250,
      }).then(embed => {
        let newDetails = this.state.details;
        newDetails.push({
          track: track,
          embed: embed,
          __html: embed.html
        })
        this.setState({ details: newDetails })
      });
      auto_play = false;
    }
    // console.log(this.state.details)
  }

  async getUserIdAsync(username) {
    let res = await fetch(`/api/users/${username}`)
    let json = await res.json()
    return json.id
  }
  
  async getFavoritesAsync(userId) {
    let res = await fetch(`/api/favorites/${userId}`)
    let json = await res.json()
    return json.collection
  }

  async componentDidMount() {
    let username = this.props.match.params.username
    this.setState({ username })

    let userId = await this.getUserIdAsync(this.props.match.params.username)
    this.setState({ userId })

    let tracks = await this.getFavoritesAsync(userId)
    this.setState({ tracks })

    console.log(tracks)
    this.embed(tracks)
  }

  render() {
    return (
      <div>
        username: {this.state.username} <br />
        userId: {this.state.userId} <br />
        <form>
          <Grid container>
            <Grid item xs={12}>
              <TextField variant="filled" label="username"></TextField>
              <TextField variant="filled" label="type"></TextField>
              <Button variant="contained" color="primary">Search</Button>
            </Grid>
          </Grid>
        </form>
        
        <ul>
          {this.state.details.map(item =>
            <div key={item.track.id}
              dangerouslySetInnerHTML={item}>
            </div>
          )}
        </ul>
      </div>
    );
  }
}

export default Scan;

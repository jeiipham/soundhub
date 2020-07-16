import React from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import Track from "./Track"
const SC = require('soundcloud');

class Results extends React.Component {

  constructor() {
    super();
    this.state = {
      results: []
    };
  }

  componentDidMount() {
    this.embed(this.props.details, 10);
  }

  componentDidUpdate(prevProps) {
    if (this.props.details !== prevProps.details) {
      this.setState({ results: [] })
      this.embed(this.props.details, 10);
    }
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
      // hacky but works since states are immutable 
      this.state.results.push({
        track: track,
        users: item.users,
        embed: embed,
        __html: embed.html
      })
      this.setState({ details: this.state.results })
      auto_play = false;
    }
    console.log(this.state.results)
  }

  render() {
    return (
      <Grid container spacing={2} justify="center">
        {this.state.results.map((item, idx) =>
          <Grid item xs={11}>
            <Track key={item.track.id} item={item} idx={idx} />
          </Grid>
        )}
      </Grid>
    );
  }
}

Results.propTypes = {
  details: PropTypes.array
}

export default Results;

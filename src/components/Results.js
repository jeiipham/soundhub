import React from 'react';
import { Box, Typography } from '@material-ui/core';
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
        // color: "#00ffff"
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
      <Box mx={0.5}>
        <Typography align="left">{`About 1,337 results (24 seconds) `}</Typography>
        {this.state.results.map((item, idx) =>
          <Box my={2}>
            <Track key={item.track.id} item={item} idx={idx} />
          </Box>
        )}
      </Box>
    );
  }
}

Results.propTypes = {
  details: PropTypes.array
}

export default Results;

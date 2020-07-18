import React from 'react';
import { Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import Track from "./Track"
const SC = require('soundcloud');

class Results extends React.Component {

  state = {
    results: []
  };

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
    collection = collection.slice(0, limit)
    for (let [index, item] of collection.entries()) {
      const track = item.track
      let embed = await SC.oEmbed(track.uri, {
        auto_play: false,
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
    }
    console.log("results", this.state.results)
    this.props.onReady();
  }

  render() {
    return (
      <Box mx={0.5}>
        <Typography align="left">
          {`About ${this.props.details.length} results (${this.props.performance.toFixed(2)} seconds) `}
        </Typography>
        {this.state.results.map((item, idx) =>
          <Box key={item.track.id} my={2}>
            <Track item={item} idx={idx} />
          </Box>
        )}
      </Box>
    );
  }
}

Results.propTypes = {
  details: PropTypes.array.isRequired,
  onReady: PropTypes.func,
  performance: PropTypes.number
}

export default Results;

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography, LinearProgress, Paper } from '@material-ui/core';

// react styles use camel case
const style = { textAlign: "center" };

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
  },
}))(LinearProgress);

class Loading extends React.Component {

  constructor() {
    super();
    this.state = {
      logs: ''
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.text !== prevProps.text)
      this.setState({ logs: this.props.text + '...\n' + this.state.logs })
  }

  get done() {
    return !Number.isInteger(this.props.done) ? 0 : this.props.done;
  }

  get total() {
    return !Number.isInteger(this.props.total) ? 0 : this.props.total;
  }

  get percent() {
    const percent = this.done / this.total * 100;
    return isNaN(percent) ? 0 : percent;
  }

  render() {
    return (
      <Grid container direction="column" justify="center" spacing={2} style={style} >
        <Box my={2} />
        {/* <Grid item>
          <Typography variant="overline" align="center">{Math.round(this.percent)}%</Typography>
        </Grid> */}

        <Grid item>
          <Typography variant="overline" align="center">{this.done}/{this.total}</Typography>
        </Grid>

        <Grid container item>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <BorderLinearProgress
              variant="determinate"
              value={this.percent}></BorderLinearProgress>
          </Grid>
        </Grid>

        <Grid item>
          <Paper component="img"
            src={this.props.imageUrl} />
        </Grid>

        <Grid item>
          <Typography style={{ whiteSpace: "pre" }} variant="overline" align="center">{this.state.logs}</Typography>
        </Grid>

      </Grid>
    );
  }
}

Loading.propTypes = {
  done: PropTypes.number,
  total: PropTypes.number,
  text: PropTypes.string
}

export default Loading;


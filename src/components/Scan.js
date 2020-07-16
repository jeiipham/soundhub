import React from 'react';
import { withStyles } from '@material-ui/styles';
import { InputLabel, Grid, Typography, Paper, Select, MenuItem, FormControl, Button } from '@material-ui/core';
import { AppBar, Toolbar, IconButton } from '@material-ui/core'
import { Card, CardMedia, CardContent } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons'
import Loading from "./Loading"
import Results from "./Results"
const api = require('../services/api')

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    //   color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 100,
  },
  appBarLeft: {
    marginLeft: 'auto'
  }
});


class Scan extends React.Component {

  constructor() {
    super();
    this.state = {
      username: null,
      userId: null,
      userAvatar: null,

      // loading 
      processed: 0,
      numFollowings: null,
      loadingText: null,
      imageUrl: null,

      // performance
      t0: null,
      performance: null,

      // filters
      trackType: '',
      trackTypeOptions: ["All", "Tracks", "Mixes"],
      timePeriod: '',
      timePeriodOptions: [
        { "name": "Today", "value": 1 },
        { "name": "This Week", "value": 7 },
        { "name": "This Month", "value": 30 },
        { "name": "This Year", "value": 365 },
        { "name": "All Time", "value": 0 },
      ],

      // results 
      details: [],
      fitleredDetails: [],
    };
  }

  setDefaults() {
    this.setState({
      trackType: this.state.trackTypeOptions[0],
      timePeriod: 365,
    })
  }

  async componentDidMount() {
    this.setDefaults();
    let username = this.props.match.params.username
    let user = await api.getUserAsync(username)
    this.setState({ username, userId: user.id, userAvatar: user.avatar_url })
    this.setState({ loading: "Fetching network" })
    await this.doScan(user.id)
  }

  // user: username, permalink, full_name, avatar_url
  async doScan(userId) {
    let followings = await api.getFollowingsAsync(userId)
    this.setState({ numFollowings: followings.length })
    console.log("followings", followings)
    // trackId => [users]
    let trackMap = {};
    for (let user of followings) this.handleFollowingAsync(user, trackMap)
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
      await this.generateDetails(trackMap)
      this.setState({ loading: null })
    }
  }

  async generateDetails(trackMap) {
    let details = Object.values(trackMap).filter(item => item.users.length > 1)
    details.sort((a, b) => b.users.length - a.users.length)
    this.setState({ details, filteredDetails: details })
    console.log('details', details)
  }

  onTrackTypeSelect = (event) => {
    let trackType = event.target.value;
    if (trackType == this.state.trackType) return;
    this.filter(trackType, this.state.timePeriod)
  }

  onTimePeriodSelect = (event) => {
    let timePeriod = event.target.value;
    if (timePeriod == this.state.timePeriod) return;
    this.filter(this.state.trackType, timePeriod)
  }

  filter(trackType, timePeriod) {
    console.log(trackType, timePeriod)
    let filteredDetails = this.state.details;

    // track type filter 
    switch (trackType.toLowerCase()) {
      case 'tracks':
        filteredDetails = filteredDetails.filter(item => item.track.full_duration < 10 * 60 * 1000);
        break;
      case 'mixes':
        filteredDetails = filteredDetails.filter(item => item.track.full_duration > 10 * 60 * 1000);
        break;
    }

    // time period filter 
    if (timePeriod != 0) filteredDetails = filteredDetails.filter(item =>
      new Date().getTime() - new Date(item.track.created_at).getTime() < timePeriod * 24 * 60 * 60 * 1000
    );

    console.log('filteredDetails', filteredDetails)
    this.setState({ trackType, timePeriod, filteredDetails });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <ArrowBackIos />
            </IconButton>
            <Typography variant="h5" align="center" fontSize={8}>
              soundhub
            </Typography>
            <div className={classes.appBarLeft}>
              <Grid container>
                <Grid item><CardMedia component="img" src={this.state.userAvatar} /></Grid>
                <Grid item>
                  <CardContent>
                    <Typography gutterBottom variant="body2" color="textSecondary">
                      username: {this.state.username} <br />
                          userId: {this.state.userId} <br />
                          network size: {this.state.numFollowings}
                    </Typography>
                  </CardContent>
                </Grid>
              </Grid>
            </div>
          </Toolbar>
        </AppBar>

        <Grid container spacing={2} justify="center">
          <Grid item xs={12} />
          <Grid container item xs={12} justify="center" >
            <FormControl className={classes.formControl} variant="outlined" >
              <InputLabel>Type</InputLabel>
              <Select
                value={this.state.trackType}
                onChange={this.onTrackTypeSelect}
                label="Type"
              >
                {this.state.trackTypeOptions.map(option =>
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                )}
              </Select>
            </FormControl >
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel>Period</InputLabel>
              <Select
                value={this.state.timePeriod}
                onChange={this.onTimePeriodSelect}
                label="Period"
              >
                {this.state.timePeriodOptions.map(option =>
                  <MenuItem key={option.value} value={option.value}>{option.name}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* <Paper>
            <Typography>
              performance: 10 seconds <br />
                    results: {this.state.details.length} <br />
            </Typography>
          </Paper> */}

        {
          this.state.loading && this.state.numFollowings &&
          <Loading done={this.state.processed} total={this.state.numFollowings} text={this.state.loading} imageUrl={this.state.imageUrl} />
        }
        {
          this.state.details.length != 0 &&
          <Results details={this.state.filteredDetails} />
        }

      </div >
    );
  }
}

export default withStyles(styles)(Scan);

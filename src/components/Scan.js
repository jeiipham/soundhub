import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import { Snackbar, Hidden } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import ScanAppBar from "./ScanAppBar"
import ScanDrawer from "./ScanDrawer"

import Loading from "./Loading"
import Filters from "./Filters"
import Results from "./Results"
const api = require('../services/api')
const moment = require('moment');

const drawerWidth = 200;

const styles = theme => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    // zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('sm')]: {
      marginLeft: -drawerWidth,
    },
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class Scan extends React.Component {

  controller = new AbortController();

  state = {
    // ui, must be open for mobile to work
    open: true,
    openToast: false,
    toastSeverity: "warning",
    toastMessage: null,
    // user
    user: null,
    depth: 200,
    // loading 
    processed: 0,
    numFollowings: null,
    loadingText: null,
    loadingImage: null,
    // performance
    t0: null,
    performance: null,
    // filters
    disabled: false,
    trackType: '',
    trackTypeOptions: ["All", "Tracks", "Mixes"],
    timePeriod: 0,
    timePeriodOptions: [
      { "name": "Today", "value": 1 },
      { "name": "This Week", "value": 7 },
      { "name": "This Month", "value": 30 },
      { "name": "This Year", "value": 365 },
      { "name": "All Time", "value": 0 },
    ],
    // results 
    details: null,
    filteredDetails: null,
    activityScores: []
  };

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
    let depth = parseInt(new URLSearchParams(window.location.search).get('depth'));
    if (depth) this.setState({ depth })
    this.setState({ user, disabled: true, loadingText: "Fetching network" })
    await this.doScan(user.id)
  }

  async componentWillUnmount() {
    this.controller.abort()
  }

  // trackMap = { trackId: [users] }
  async doScan(userId) {
    let followings = await api.getFollowingsAsync(userId)
    console.log("followings", followings)
    this.setState({ numFollowings: followings.length, t0: performance.now() })
    let trackMap = {};
    for (let user of followings) {
      this.handleFollowingAsync(user, trackMap).catch(error => {
        if (error.name === 'AbortError') return console.error("Requests aborted");
        console.error("error", user.username, error);
        this.setState({ openToast: true, toastMessage: `Oops! Hiccup processing ${user.username}, retrying...` })
        this.handleFollowingAsync(user, trackMap).catch(error =>
          this.setState({ openToast: true, toastSeverity: "error", toastMessage: "Error, please reload" }));
      });
    }
  }

  // activityScores = [{ permalink, user, activityScore }]
  // activityScore: theoretical max score = depth (default: 200)
  async handleFollowingAsync(user, trackMap) {
    let favorites = await api.getFavoritesAsync(user.id, this.state.depth, this.controller)
    this.setState({ loadingText: `Processing ${user.permalink}`, loadingImage: user.avatar_url })
    let activityScore = 0;
    for (let item of favorites) {
      if (!('track' in item)) continue;
      // trackMap processing 
      let track = item.track;
      if (track.id in trackMap) trackMap[track.id].users.push(user.username)
      else trackMap[track.id] = { track, users: [user.username] };
      // activityScore processing 
      let daysAgo = moment().diff(moment(track.created_at), 'day')
      if (daysAgo <= 365) activityScore += (365 - daysAgo) / 365
    }
    if (activityScore > 0) {
      let activityScores = this.state.activityScores.concat([{ permalink: user.permalink, user, activityScore }]);
      this.setState({ activityScores })
    }
    this.setState({ processed: this.state.processed + 1, activityScore: this.state.activityScores })
    // all promises resolved
    if (this.state.processed === this.state.numFollowings) {
      this.setState({ loadingText: null, performance: (performance.now() - this.state.t0) / 1000 });
      this.generateDetails(trackMap)
    }
  }

  async generateDetails(trackMap) {
    let details = Object.values(trackMap).filter(item => item.users.length > 1)
    details.sort((a, b) => b.users.length - a.users.length)
    this.setState({ details }, () => this.filter(this.state.trackType, this.state.timePeriod));
    console.log('details', details)
  }

  onTrackTypeSelect = (event) => {
    let trackType = event.target.value;
    if (trackType === this.state.trackType) return;
    this.filter(trackType, this.state.timePeriod)
  }

  onTimePeriodSelect = (event) => {
    let timePeriod = event.target.value;
    if (timePeriod === this.state.timePeriod) return;
    this.filter(this.state.trackType, timePeriod)
  }

  filter(trackType, timePeriod) {
    console.log(trackType, timePeriod)
    this.setState({ disabled: true })
    let filteredDetails = this.state.details;
    // track type filter 
    switch (trackType.toLowerCase()) {
      case 'tracks':
        filteredDetails = filteredDetails.filter(item => item.track.full_duration < 10 * 60 * 1000);
        break;
      case 'mixes':
        filteredDetails = filteredDetails.filter(item => item.track.full_duration > 10 * 60 * 1000);
        break;
      default: break;
    }
    // time period filter 
    if (timePeriod !== 0) filteredDetails = filteredDetails.filter(item =>
      new Date().getTime() - new Date(item.track.created_at).getTime() < timePeriod * 24 * 60 * 60 * 1000
    );
    console.log('filteredDetails', filteredDetails)
    this.setState({ trackType, timePeriod, filteredDetails });
  }

  closeToast = () => this.setState({ openToast: false })
  test = () => { }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Snackbar open={this.state.openToast}
          autoHideDuration={4000}
          onClose={this.closeToast}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            // elevation={6}
            variant="filled"
            onClose={this.closeToast}
            severity={this.state.toastSeverity}
          >
            {this.state.toastMessage}
          </Alert>
        </Snackbar>

        {/* appbar */}
        <ScanAppBar
          onMenuClick={() => this.setState({ open: !this.state.open })}
          onClick={this.test}
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.state.open,
          })} />

        {/* drawer */}
        <Hidden xsDown implementation="css">
          <ScanDrawer
            className={classes.drawer}
            classesProp={{ paper: classes.drawerPaper }}
            open={this.state.open}
            username={this.props.match.params.username}
            user={this.state.user}
            activityScores={this.state.activityScores}
            depth={this.state.depth}
            disabled={Boolean(this.state.loadingText)}
          />
        </Hidden>

        {/* main content */}
        <main className={clsx(classes.content, {
          [classes.contentShift]: this.state.open,
        })}>
          <div className={classes.drawerHeader} />
          <Filters
            trackType={this.state.trackType}
            trackTypeOptions={this.state.trackTypeOptions}
            onTrackTypeSelect={this.onTrackTypeSelect}
            timePeriod={this.state.timePeriod}
            timePeriodOptions={this.state.timePeriodOptions}
            onTimePeriodSelect={this.onTimePeriodSelect}
            disabled={this.state.disabled}
          />
          {this.state.loadingText && this.state.numFollowings &&
            <Loading done={this.state.processed} total={this.state.numFollowings} text={this.state.loadingText} imageUrl={this.state.loadingImage} />}
          {this.state.filteredDetails &&
            <Results details={this.state.filteredDetails} onReady={() => this.setState({ disabled: false })} performance={this.state.performance} />}
        </main>

      </div >
    );
  }
}

export default withStyles(styles)(Scan);

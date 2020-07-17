import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { AppBar, Toolbar, IconButton } from '@material-ui/core'
import { Hidden, Drawer } from '@material-ui/core'
import { Menu } from '@material-ui/icons'
import UserProfileCard from "./UserProfileCard"
import Loading from "./Loading"
import Filters from "./Filters"
import Results from "./Results"
const api = require('../services/api')

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

  constructor() {
    super();
    this.state = {
      // ui, must be open for mobile to work
      open: true,
      // user
      user: null,
      userAvatarHd: null,
      // loading 
      processed: 0,
      numFollowings: null,
      loadingText: null,
      loadingImage: null,
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
    console.log("user", user);
    this.setState({
      user,
      userAvatarHd: user.avatar_url.replace("-large", "-t500x500")
    })
    this.setState({ loading: "Fetching network" })
    await this.doScan(user.id)
  }

  async doScan(userId) {
    let followings = await api.getFollowingsAsync(userId)
    console.log("followings", followings)
    this.setState({ numFollowings: followings.length })
    // trackId => [users]
    let trackMap = {};
    for (let user of followings) this.handleFollowingAsync(user, trackMap)
    return trackMap;
  }

  async handleFollowingAsync(user, trackMap) {
    let favorites = await api.getFavoritesAsync(user.id)
    this.setState({
      loading: `Processing ${user.permalink}`,
      loadingImage: user.avatar_url
    })
    for (let item of favorites) {
      if (!('track' in item)) continue;
      let track = item.track;
      if (track.id in trackMap) trackMap[track.id].users.push(user.username)
      else trackMap[track.id] = { track, users: [user.username] };
    }
    // all promises resolved
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
    let filteredDetails = this.state.details;
    // track type filter 
    switch (trackType.toLowerCase()) {
      case 'tracks':
        filteredDetails = filteredDetails.filter(item => item.track.full_duration < 10 * 60 * 1000);
        break;
      case 'mixes':
        filteredDetails = filteredDetails.filter(item => item.track.full_duration > 10 * 60 * 1000);
        break;
      default: 
        break
    }
    // time period filter 
    if (timePeriod !== 0) filteredDetails = filteredDetails.filter(item =>
      new Date().getTime() - new Date(item.track.created_at).getTime() < timePeriod * 24 * 60 * 60 * 1000
    );
    console.log('filteredDetails', filteredDetails)
    this.setState({ trackType, timePeriod, filteredDetails });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>

        {/* appbar */}
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.state.open,
          })}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="user profile"
              onClick={() => this.setState({ open: !this.state.open })} >
              <Menu />
            </IconButton>
            <Typography variant="h5" align="center" fontSize={8}>
              soundhub
            </Typography>
          </Toolbar>
        </AppBar>

        {/* drawer */}
        <Hidden xsDown implementation="css">
          <Drawer
            className={classes.drawer}
            classes={{ paper: classes.drawer }}
            variant="persistent"
            open={this.state.open}
          >
            <UserProfileCard
              username={this.props.match.params.username}
              user={this.state.user}
              userAvatarHd={this.state.userAvatarHd} />
          </Drawer>
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
          />
          {this.state.loading && this.state.numFollowings &&
            <Loading done={this.state.processed} total={this.state.numFollowings} text={this.state.loading} imageUrl={this.state.loadingImage} />}
          {this.state.details.length !== 0 &&
            <Results details={this.state.filteredDetails} />}
        </main>

      </div >
    );
  }
}

export default withStyles(styles)(Scan);

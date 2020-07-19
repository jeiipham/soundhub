import React from 'react';
import { withStyles } from '@material-ui/styles';
import { AppBar, Box, Grid, TextField, Typography, Button, Toolbar, InputAdornment, IconButton, Popover, Paper, Link } from '@material-ui/core';
import { HelpOutline, Search } from '@material-ui/icons';
const api = require('../services/api')

const styles = theme => ({
  root: {
    textAlign: "center"
  },
  marginLeft: {
    marginLeft: theme.spacing(0.5),
  },
  padding1: {
    padding: theme.spacing(2),
  },
  padding2: {
    padding: theme.spacing(2),
  },
});

class Home extends React.Component {

  state = {
    username: '',
    anchorEl: null,
    error: null
  };

  onChange = (event) => {
    this.setState({ username: event.target.value })
  }

  onClick = async (event) => {
    event.preventDefault()

    api.getUserAsync(this.state.username)
      .then(() => this.props.history.push(`/scan/${this.state.username}`))
      .catch(error => {
        if (error instanceof TypeError) error.message = "Could not connect to server";
        this.setState({ error: error });
      })
  }

  onInfoClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  onInfoClose = () => {
    this.setState({ anchorEl: null })
  }

  onPresetUsername = (username) => {
    this.setState({ username, anchorEl: null })
  }

  render() {
    const { classes } = this.props;
    const open = Boolean(this.state.anchorEl);

    return (
      <div className={classes.root} >
        <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none' }}>
          <Toolbar>
            <Button disabled>About</Button>
            <Button disabled>Github</Button>
          </Toolbar>
        </AppBar>

        <Popover
          open={open}
          onClose={this.onInfoClose}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <div className={classes.padding2}>
            <Typography gutterBottom>How to find your unique username</Typography>
            <Typography variant="body2">1. Go to your soundcloud profile</Typography>
            <Typography gutterBottom variant="body2">2. Copy the last part your profile URL</Typography>
            <Paper className={classes.padding1} elevation={6} variant="outlined">
              <Typography variant="body2">
                e.g. soundcloud.com/
                <Typography component="span" color="primary"><b><u>username</u></b></Typography>
              </Typography>
            </Paper>
            <Box m={2}></Box>
            <Typography>
              {"Don't have an active account? "}
              <Link onClick={() => this.onPresetUsername("phamsandwich")}>Click to use mine!</Link>
            </Typography>
          </div>
        </Popover>

        <Box minHeight="20vh"></Box>
        <Grid container
          spacing={1}
          direction="column"
          alignItems="center"
          justify="center"
          alignContent="center"
        // style={{ minHeight: '70vh' }}
        >
          {/* logo */}
          <Grid item xs={12}>
            <Typography variant='h2' align="center">soundhub</Typography>
          </Grid>

          {/* form */}
          <Grid container item xs={8} justify="center" component="form" onSubmit={this.onClick}>
            <Grid item xs={8}>
              <TextField fullWidth
                label="Username" variant="outlined"
                value={this.state.username}
                onChange={this.onChange}
                InputProps={{
                  // startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>,
                  endAdornment:
                    <InputAdornment>
                      <IconButton
                        aria-label="info"
                        onClick={this.onInfoClick}
                        edge="end"
                      >
                        <HelpOutline />
                      </IconButton>
                    </InputAdornment>
                }}
              />
            </Grid>
            <Grid item className={classes.marginLeft}>
              <Button type="submit" variant="contained"
                color="primary" style={{ height: "100%" }}><Search /></Button>
            </Grid>
          </Grid>

          {/* subtext */}
          <Box mb={2}>
            {this.state.error &&
              <Typography variant="caption" color="error">
                {this.state.error.message + " "}
                {!(this.state.error instanceof TypeError) && <Link onClick={() => this.onPresetUsername("phamsandwich")}>Click to use mine!</Link>}
              </Typography>}

          </Box>
          <Grid item xs={11}>
            <Typography>Discover the most common recently liked tracks from the people you follow on SoundCloud</Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Home);

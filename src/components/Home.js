import { AppBar, Box, Button, Grid, IconButton, InputAdornment, Link, Modal, Paper, Popover, TextField, Toolbar, Typography } from '@material-ui/core';
import { Build, HelpOutline, Search } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import React from 'react';
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

  controller = new AbortController();

  state = {
    username: '',
    anchorEl: null,
    error: null,
    anchorElADMIN: null,
    clientId: '',
    password: '',
    passed: true
  };

  onChange = (event) => {
    this.setState({ username: event.target.value })
  }

  onClick = async (event) => {
    event.preventDefault();
    let username = this.state.username.includes(".com/") ? 
      this.state.username.split(".com/")[1] : this.state.username;
    api.getUserAsync(username)
      .then(() => this.props.history.push(`/scan/${username}`))
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

  onAdminClick = (event) => {
    this.setState({ anchorElADMIN: event.currentTarget });
  }

  onAdminChange = (event) => {
    this.setState({clientId: event.target.value})
  }

  onPassChange = (event) => {
    this.setState({password: event.target.value})
  }

  onSubmitID = async (event) => {
    event.preventDefault()
    let hostname = window.location.hostname;
    let clientId = this.state.clientId;
    let pass = this.state.password;
    try {
      const response = await fetch(`http://${hostname}:3001/api/validate-password/${pass}/${clientId}`)
      const result = await response.json();
      if (result.success) {
        fetch(`http://${hostname}:3001/api?client_id=${clientId}`)
        .catch(error => {
          console.error('Error:', error);
        })
        this.onAdminClose();
      } else {
          this.setState({ passed : false });
        }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  onAdminClose = () => {
    this.setState({ anchorElADMIN: null, passed: true, password: '', clientId: '' })
  }

  onPresetUsername = (username) => {
    this.setState({ username, anchorEl: null })
  }

  render() {
    const { classes } = this.props;
    const open = Boolean(this.state.anchorEl);
    const open2 = Boolean(this.state.anchorElADMIN);

    return (
      <div className={classes.root} >
        <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none' }}>
          <Toolbar>
            {/* <Button disabled>About</Button>
            <Button disabled>Github</Button> */}
          </Toolbar>
        </AppBar>
              
        <Modal
          open={open2}
          onClose={this.onAdminClose}
          anchorElADMIN={this.state.anchorElADMIN}
        >
          <Box style={{
            background: 'hsl(0, 0%, 15%)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            width: 500,
            height: 300, }}>
            <Typography variant='h5' align='center'>Configuration</Typography>
            <Box m={2}></Box>
            <Button onClick={this.onAdminClose} variant = 'text' style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              borderRadius: '0px',
            }}
            >X</Button>
            <Grid component="form" onSubmit={this.onSubmitID}>
            <TextField fullWidth
                label="Password" variant="outlined"
                value={this.state.password}
                onChange={this.onPassChange}
            />
            <Box m={2}></Box>
            <TextField fullWidth
                label="SoundCloud Client ID" variant="outlined"
                value={this.state.clientId}
                onChange={this.onAdminChange}
            />
              <Box m={2}></Box>
              {!this.state.passed &&
              <Typography variant="caption" color="error">
                Incorrect password.
              </Typography>}
            <Grid align='center' m={2}>
              <Button type="submit" variant="contained"
              color="primary" style={{ height: "100%" }}>ENTER</Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>

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
                <Typography component="span" color="primary"><b>your-username</b></Typography>
              </Typography>
            </Paper>
            <Box m={2}></Box>
            <Typography>
              {"Don't have an active account? "}
              <Link onClick={() => this.onPresetUsername("jefpha")}>Click to try one!</Link>
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
            <Typography variant='h2' align="center">soundcloudscan</Typography>
          </Grid>

          {/* form */}
          <Grid container item sm={8} xs={12} justify="center" component="form" onSubmit={this.onClick}>
            <Grid item sm={8}>
              <TextField fullWidth
                label="Username / Profile URL" variant="outlined"
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
                {!(this.state.error instanceof TypeError) && <Link onClick={() => this.onPresetUsername("jefpha")}>Click to try one!</Link>}
              </Typography>}

          </Box>
          <Grid item xs={11}>
            <Typography>Discover the most commonly liked tracks within your SoundCloud network</Typography>
          </Grid>
          <Grid>
            <Button
              onClick={this.onAdminClick}
              variant='contained'
              color= 'primary'
              style={{
                position: 'fixed',
                bottom: '5px',
                right: '5px'
              }}
            >
              <Build />
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Home);

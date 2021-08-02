import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import { Typography, AppBar, Toolbar, IconButton, Button } from '@material-ui/core';
import { Menu } from '@material-ui/icons'

const styles = theme => ({});

class ScanAppBar extends React.Component {

  onLogoClick = (event) => {
    event.preventDefault()
    this.props.history.push('/')
  }

  render() {
    return (
      <AppBar
        className={this.props.className}
        onClick={this.props.onClick}
        position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="user profile"
            onClick={this.props.onMenuClick} >
            <Menu />
          </IconButton>
          <Button variant="contained" onClick={this.onLogoClick}>
            home
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

ScanAppBar.propTypes = {
  className: PropTypes.string.isRequired,
  onMenuClick: PropTypes.func.isRequired,
  onClick: PropTypes.func,
}

export default withRouter(withStyles(styles)(ScanAppBar));


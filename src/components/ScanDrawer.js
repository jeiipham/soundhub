import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Drawer, Box} from '@material-ui/core';
import UserProfileCard from "./UserProfileCard"
import MostActiveList from "./MostActiveList"

const styles = theme => ({});

class ScanDrawer extends React.Component {

  render() {
    const userAvatarHd = this.props.user && this.props.user.avatar_url.replace("-large", "-t500x500");
    return (
      <Drawer
        className={this.props.className}
        classes={this.props.classesProp}
        variant="persistent"
        open={this.props.open}
      >
        <Box mb={1}>
          <UserProfileCard
            username={this.props.username}
            user={this.props.user}
            userAvatarHd={userAvatarHd} />
        </Box>

        <MostActiveList
          activityScores={this.props.activityScores}
          depth={this.props.depth}
          disabled={this.props.disabled}
        />
      </Drawer>
    );
  }
}

ScanDrawer.propTypes = {
  className: PropTypes.string.isRequired,
  classesProp: PropTypes.object.isRequired, // alias for overriding "classes" prop
  open: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  user: PropTypes.object,
  activityScores: PropTypes.array,
  depth: PropTypes.number,
  disabled: PropTypes.bool
}

export default withStyles(styles)(ScanDrawer);


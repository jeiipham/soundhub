import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { Card, CardHeader, CardMedia, CardContent } from '@material-ui/core';

const styles = theme => ({});

class UserProfileCard extends React.Component {

  render() {
    const { username, user, userAvatarHd } = this.props;
    return (
      <Card >
        <CardHeader
          title={user && user.username}
          subheader={username}
        // action={
        //   <IconButton href={""} target="_blank" aria-label="soundcloud">
        //     <Cloud />
        //   </IconButton>
        // }
        />
        <CardMedia component="img" src={userAvatarHd} />
        <CardContent>
          {user &&
            <div>
              <Typography variant="h6">Username</Typography>
              <Typography gutterBottom>{username}</Typography>

              <Typography variant="h6">ID</Typography>
              <Typography gutterBottom>{user.id}</Typography>

              <Typography variant="h6">Followers</Typography>
              <Typography gutterBottom>{user.followers_count}</Typography>

              <Typography variant="h6">Followings</Typography>
              <Typography gutterBottom>{user.followings_count}</Typography>
            </div>}
        </CardContent>
      </Card>
    );
  }
}

UserProfileCard.propTypes = {
  username: PropTypes.string.isRequired,
  user: PropTypes.object,
  userAvatarHd: PropTypes.string
}

export default withStyles(styles)(UserProfileCard);


import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { orange } from '@material-ui/core/colors';
import { Box, Grid, Typography, IconButton, CardActionArea } from '@material-ui/core';
import { Card, CardHeader, Avatar, CardMedia, CardContent, CardActions, Button } from '@material-ui/core';
import { Cloud, PlayArrow, Favorite, Repeat } from '@material-ui/icons';
const moment = require('moment');

const styles = theme => ({
  avatar: {
    // backgroundColor: orange[500],
  },
});

class Track extends React.Component {

  timeAgoString(created_at) {
    let time = moment(created_at);
    let periods = ["years", "months", "weeks", "days", "hours", "minutes"]
    for (let period of periods) {
      let numPeriods = moment().diff(time, period)
      if (numPeriods === 1) return `${numPeriods} ${period.slice(0, -1)} ago`
      else if (numPeriods > 1) return `${numPeriods} ${period} ago`
    }
    return "Less than a minute ago"
  }

  // id, full_duration, created_at, permalink_url, playback_count, likes_count, reposts_count 
  render() {
    const { classes, item, idx } = this.props;
    return (
      <div>
        <Card raised style={{ borderRadius: "10px" }}>
          <CardActionArea component="div">
            <Grid container>
              {/* make component into iframe */}
              <Grid item xs={8}><CardMedia component="div" dangerouslySetInnerHTML={item} /></Grid>
              <Grid item xs={4}>

                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar} aria-label="rank">
                      #{idx + 1}
                    </Avatar>}
                  title={this.timeAgoString(item.track.created_at)}
                  // subheader={new Date(item.track.created_at).toLocaleDateString()}
                  action={
                    <IconButton href={item.track.permalink_url} target="_blank" aria-label="soundcloud">
                      <Cloud />
                    </IconButton>
                  }
                />

                <CardContent>
                  <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
                    <Favorite /><Box m={0.5} />{item.users.length}
                  </Typography>
                  <Typography gutterBottom variant="body2" color="textSecondary">
                    {item.users.join(", ")}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Grid container justify="space-evenly">
                    <Grid item xs={2}></Grid>
                    <Grid item><Button disabled startIcon={<PlayArrow />}>{item.track.playback_count}</Button></Grid>
                    <Grid item><Button disabled startIcon={<Favorite />}>{item.track.likes_count}</Button></Grid>
                    <Grid item><Button disabled startIcon={<Repeat />}>{item.track.reposts_count}</Button></Grid>
                  </Grid>
                </CardActions>

              </Grid>
            </Grid>
          </CardActionArea>
        </Card>
      </div>

    );
  }
}

Track.propTypes = {
  item: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired
}

export default withStyles(styles)(Track);

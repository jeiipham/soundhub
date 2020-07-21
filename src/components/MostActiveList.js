import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Typography, Paper } from '@material-ui/core';
import { Card, CardContent } from '@material-ui/core';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';

const LIMIT = 10

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.primary[500],
  },
  root: {
    '&$selected': {
      backgroundColor: "goldenrod"
    }
  }
});


class MostActiveList extends React.Component {

  state = {
    mostActive: []
  }

  setMostActive(activityScores) {
    activityScores.sort((a, b) => b.activityScore - a.activityScore)
    let mostActive = activityScores.slice(0, LIMIT)
    let swag = activityScores.findIndex(item => item.permalink === "phamsandwich") 
    if (swag !== -1 && swag >= LIMIT) mostActive.splice(0, 0, activityScores[swag])
    this.setState({ mostActive: mostActive })
  }

  componentDidUpdate(prevProps) {
    if (this.props.activityScores !== prevProps.activityScores) {
      this.setMostActive(this.props.activityScores)
    }
  }

  showScore(idx, show) {
    let mostActive = this.state.mostActive
    mostActive[idx].showScore = show
    this.setState({ mostActive })
  }

  onClick = (item) => {
    if (this.props.disabled) return;
    const url = item.permalink === "phamsandwich" ?
      "https://www.youtube.com/watch?v=oHg5SJYRHA0" : `${window.location.origin}/scan/${item.permalink}`
    const win = window.open(url, "_blank")
    // win.focus()
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper>
        <Card >
          <CardContent>
            <Typography
              variant="h6"
              onClick={() => console.log("Activity", this.props.activityScores)}
            >Most Active</Typography>
            <Typography>Click to scan</Typography>

            <List dense>
              {this.state.mostActive.map((item, idx) =>
                <ListItem disableGutters
                  button={!this.props.disabled}
                  key={item.permalink}
                  alignitem='flex-start'
                  onMouseEnter={() => this.showScore(idx, true)}
                  onMouseLeave={() => this.showScore(idx, false)}
                  onClick={() => this.onClick(item)}
                  style={{ borderRadius: "10px" }}
                  selected={item.permalink === "phamsandwich"}
                >
                  <ListItemAvatar>
                    <div>
                      <Avatar
                        style={{ display: !this.props.disabled && !item.showScore ? "flex" : "none" }}
                        src={item.user.avatar_url} onError={null} />
                      <Avatar
                        style={{ display: this.props.disabled || item.showScore ? "flex" : "none" }}
                        className={classes.avatar}
                      >
                        <Typography variant="body2">
                          {(item.activityScore / this.props.depth * 100).toFixed() + "%"}
                        </Typography>
                      </Avatar>
                    </div>
                  </ListItemAvatar>
                  <ListItemText>{item.permalink}</ListItemText>
                </ListItem>)}
            </List>

          </CardContent>
        </Card>
      </Paper>
    );
  }
}

MostActiveList.propTypes = {
  activityScores: PropTypes.array,
  depth: PropTypes.number,
  disabled: PropTypes.bool
}

export default withStyles(styles)(MostActiveList);


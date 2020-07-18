import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { InputLabel, Grid, Select, MenuItem, FormControl } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
});

class Filters extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <Grid container justify="center">
        <FormControl className={classes.formControl} variant="outlined" >
          <InputLabel>Type</InputLabel>
          <Select
            value={this.props.trackType}
            onChange={this.props.onTrackTypeSelect}
            label="Type"
            disabled={this.props.disabled}
          >
            {this.props.trackTypeOptions.map(option =>
              <MenuItem key={option} value={option}>{option}</MenuItem>
            )}
          </Select>
        </FormControl >
        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel>Period</InputLabel>
          <Select
            value={this.props.timePeriod}
            onChange={this.props.onTimePeriodSelect}
            label="Period"
            disabled={this.props.disabled}
          >
            {this.props.timePeriodOptions.map(option =>
              <MenuItem key={option.value} value={option.value}>{option.name}</MenuItem>
            )}
          </Select>
        </FormControl>
      </Grid>
    );
  }
}

export default withStyles(styles)(Filters);

Filters.propTypes = {
  trackType: PropTypes.string,
  trackTypeOptions: PropTypes.array,
  onTrackTypeSelect: PropTypes.func,
  timePeriod: PropTypes.number,
  timePeriodOptions: PropTypes.array,
  onTimePeriodSelect: PropTypes.func,
}

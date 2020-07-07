import React from 'react';
import { Grid, TextField, Typography, Button } from '@material-ui/core';

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      username: 'phamsandwich'
    };
  }

  componentDidMount() {
  }

  onChange = (event) => {
    this.setState({ username: event.target.value })
  }

  onClick = (event) => {
    event.preventDefault()
    const destination = `http://localhost:3000/scan/${this.state.username}`;
    console.log(destination);
    window.location.href = destination;
  }

  render() {
    return (
      <form onSubmit={this.onClick}>
        <Grid container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item xs={12}>
            <Typography variant='h2' align="center">soundhub</Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField label="Username" variant="outlined"
              value={this.state.username}
              onChange={this.onChange}
            />
            <Button type="submit" variant="contained"
              // onClick={this.onClick}
              color="primary">Go</Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default Home;

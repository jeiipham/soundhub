import { createMuiTheme } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: orange,
    // secondary: 
  },
  typography: {
    // h3: {
    //   fontFamily: "Roboto"
    // }
  }
});

console.log("theme", theme)
export default theme; 
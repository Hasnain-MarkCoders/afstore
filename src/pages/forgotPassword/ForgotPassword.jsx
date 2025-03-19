import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Links from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
// import axios from 'axios';
import API from "../../api/api";
import "./forgotPassword.scss";
import { loginHandle } from "../../redux/slices/authAction";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from '../../images/Linton-logo.png';
import Banner from '../../images/login-banner.jpg';

const ForgotPassword = ({ loginHandle }) => {

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(false)
  const [msg, setMsg] = React.useState('');

  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault()
  //   const { data, error } = await loginHandle(email, password);
  //   if (data) {
  //     navigate("/");
  //   }
  //   setMsg(error.response.data.message);
  // }

  return (<Grid container spacing={2} className="forgotPass">

    <Grid className="left" item xs={0} sm={6}>
      <Typography component={"h2"} className="main-heading">Welcome to Linton's Drop Shipping System</Typography>
    </Grid>

    <Grid className="right" item xs={12} sm={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px",
              minHeight: "calc(100vh - 76px )"
            }}
          >
            {/* <Avatar
              style={{ padding: "10px", width: "100px", height: "100px" }}
              src={"markcoders-logo.png"}
            ></Avatar> */}
            <img src={Logo} style={{width:"200px", marginBottom:"20px"}}/>
            <Typography
              style={{ fontFamily: "Nunito, sans-serif", marginTop: "15px", fontWeight: "700", fontSize: "40px" }}
              component="h1"
              variant="h5"
            >
              Forgot Password
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}
            style={{width:"80%"}} 
            // onSubmit={handleLogin}
            >
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                required
              />
              <Button
                style={{ width: "100%", padding: "7px" }}
                type="submit"
                fullWidth
                className="btn btn-primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Continue
              </Button>    
            </Box>
          </Box>
      </Grid>
    
    </Grid>
   ) }
    
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Links color="inherit" target={"_blank"} href="https://markcoders.com/">
        MarkCoders
      </Links>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const action = {
  loginHandle
}

export default connect(null, action)(ForgotPassword)

const theme = createTheme();

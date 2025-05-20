import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Links from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "./login.scss";
import { loginHandle } from "../../redux/slices/authAction";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
// import Logo from '../../images/Linton-logo.png';
import Logo from "../../images/logo-transparent.png";

import Banner from "../../images/login-banner.jpg";
import API from "../../api/api";
import { getToken, messaging } from "../../firebase";
import { CircularProgress } from "@mui/material";

const Login = ({ loginHandle }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [notificationToken, setNotificationToken] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  //   const saveToken =async (token)=>{
  //     const response = await API.post(`/update-token`, {
  //      token,
  //      email
  //     });
  //   }
  //   const requestForToken =async () => {
  //     if ('serviceWorker' in navigator) {
  //       await navigator.serviceWorker.register('firebase-messaging-sw.js', {
  //         scope: '/',
  //       });
  //     }
  //       try {
  //         const newToken = await getToken(messaging, { vapidKey: 'BAtDdy_r_vQ8eyuu3ATFOR0zXgZ8ibiK5mj2aUAmyfB-ZrRk1agsXDhMB3nKPdQWswbdCQUSuLFZFA05GBi5HNU' });
  //         if(newToken){
  //           setNotificationToken(newToken);
  //         }
  //       } catch (error) {
  //         console.error("Failed to refresh token:", error);
  //       }

  //   };
  // React.useEffect(()=>{
  //   requestForToken()
  // },[])

  const handleLogin = async (e) => {
    try {
      setMsg("")
      setIsLoading(true);
      e.preventDefault();
      const { data, error } = await loginHandle(email, password, remember);
      if (data) {
        // await saveToken(notificationToken)
        navigate("/");
      }
      setMsg(error?.response?.data?.message);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Grid container spacing={2} className="login">
        <Grid className="left" item xs={12} sm={6} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px",
              minHeight: "calc(100vh - 76px )",
            }}
          >
            <img src={Logo} style={{ width: "200px", marginBottom: "20px" }} />
            <Typography
              style={{
                fontFamily: "Nunito, sans-serif",
                marginTop: "15px",
                fontWeight: "700",
                fontSize: "40px",
              }}
              component="h1"
              variant="h5"
            >
              Log In
            </Typography>
            <Box
              component="form"
              className="login-form"
              noValidate
              sx={{ mt: 1 }}
              onSubmit={handleLogin}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value={remember}
                    onChange={(e) => setRemember(e.target.value)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              {msg && (
                <Typography
                  style={{
                    fontFamily: "Nunito, sans-serif",
                    marginTop: "15px",
                    color: "rgb(255,14,14)",
                    fontWeight: "600",
                    fontSize: "12px",
                  }}
                  component="p"
                  variant="h5"
                >
                  {msg}
                </Typography>
              )}
              {/* <Link to={"/"}> */}
              <Button
                disabled={isLoading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "7px",
                }}
                type="submit"
                fullWidth
                className="btn btn-primary"
                sx={{
                   mt: 3,
                   mb: 2,
                  '&.Mui-disabled': {
                  color: 'white !important',
                },
                     
                   }}
              >
                {isLoading ? "Signing..." : "Sign In"}
                {isLoading && (
                  <CircularProgress
                    sx={{
                      color: "white",
                      fontSize: "10px",
                      width: "10px !important",
                      height: "10px !important",
                      ml: "10px",
                    }}
                  />
                )}
              </Button>
              {/* </Link> */}
              {/* <Grid container>
              <Grid item xs>
                <Links href="#" variant="body2">
                  Forgot Password?
                </Links>
              </Grid>
            </Grid> */}
            </Box>
          </Box>
        </Grid>
        <Grid className="right" item xs={0} sm={6} md={6}>
          <img src={Banner} />
        </Grid>
      </Grid>
    </>
  );
};

const action = {
  loginHandle,
};

export default connect(null, action)(Login);

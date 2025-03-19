import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

export default function AutohideSnackbar({ open,severity="success", message, onClose, bg="", color="" , anchorOrigin={ vertical:"top", horizontal:"center" }}) {
  return (
    <Snackbar
    ContentProps={{
      sx: {
        background: bg?bg:"black !important",
        color:color?color:"white !important",
      }
    }}
    anchorOrigin={anchorOrigin}
      open={open}
    >
 <Alert
    onClose={onClose}
    severity={severity}
    variant="filled"
    sx={{ width: '100%' }}
  >
   {message}
  </Alert>

    </Snackbar>
  );
}

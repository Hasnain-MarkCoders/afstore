import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import useAlertStore from "../../zustand/alert";

export default function AutohideSnackbar({ anchorOrigin={ vertical:"top", horizontal:"right" }}) {
  
  const {Alert: ZustandAlert,handleAlert} = useAlertStore()
  const handleClose = ()=>{
    handleAlert({
      message:"",
      isOpen:false,
      severity:"success"
    })
  }
  return (
    <Snackbar
    onClose={handleClose}
      // autoHideDuration={3000}
    anchorOrigin={anchorOrigin}
      open={ZustandAlert?.isOpen}
    >
 <Alert
    onClose={handleClose}
    severity={ZustandAlert?.severity}
    variant="filled"
    sx={{ width: '100%' }}
  >
   {ZustandAlert?.message}
  </Alert>

    </Snackbar>
  );
}

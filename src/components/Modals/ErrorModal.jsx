
import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";

const ErrorModal = ({reason=null, handleErrorModal=()=>{}}) => {
  return (
    <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    open={true}
    onClose={handleErrorModal}
    closeAfterTransition
    slots={{ backdrop: Backdrop }}
    slotProps={{
      backdrop: {
        timeout: 500,
      },
    }}
    className="custom-modal delete-modal"
  >
    <Fade in={!!reason} >
      <Box>
        <Box className="modal-body" >
          <a onClick={handleErrorModal} className="close-btn">
            <CloseIcon className="icon" />
          </a>
          <Typography className="main-title" component="h2" color={'red'}>
            Error
          </Typography>
          <Typography component="p">
            {reason}
          </Typography>
          <Box className="modal-footer">
            <Button className="btn btn-outline-primary" onClick={handleErrorModal}>
              Ok
            </Button>
          </Box>
        </Box>
      </Box>
    </Fade>
  </Modal>
  )
}

export default ErrorModal
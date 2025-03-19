import { Backdrop, Box, Button, CircularProgress, Fade, Modal, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close"
const ForceAddedOrderModal = ({
    handleForceAcceptModal=()=>{},
    forceAccept=null,
    progressExport=null,
    handleForceAccept=()=>{}

}) => {
  return (
    <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    open={true}
    onClose={handleForceAcceptModal}
    closeAfterTransition
    slots={{ backdrop: Backdrop }}
    slotProps={{
      backdrop: {
        timeout: 500,
      },
    }}
    className="custom-modal delete-modal"
  >
    <Fade in={!!forceAccept} >
      <Box>
        <Box className="modal-body" >
          <a onClick={handleForceAcceptModal} className="close-btn">
            <CloseIcon className="icon" />
          </a>
          <Typography className="main-title" component="h2">
            Force Accept Order
          </Typography>
          <Typography component="p">
            This {forceAccept?.po} will be Submitted without any validaion.
          </Typography>
          <Box className="modal-footer">
            <Button
              className="btn btn-outline-primary"
              onClick={handleForceAcceptModal}
            >
              Cancel
            </Button>
            <Button className="btn btn-outline-danger" style={{ display: "flex", alignItems: "center", gap: "5px" , width: progressExport ? '120px' : '90px' }} onClick={handleForceAccept}>
              Procced
              {progressExport ? (
                <CircularProgress color="inherit" className="hw-12" />
              ) : (
                <></>
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Fade>
  </Modal>
  )
}

export default ForceAddedOrderModal
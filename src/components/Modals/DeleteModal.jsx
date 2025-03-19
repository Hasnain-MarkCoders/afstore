
import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";

const DeleteModal = ({handleDeleteModal=()=>{}, deleteId=null,handleDelete=()=>{}, title=""}) => {
  return (
    <Modal      
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={true}
            onClose={handleDeleteModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
            className="custom-modal delete-modal"
          >
            <Fade in={!!deleteId}>
              <Box>
                <Box className="modal-body">
                  <a
                    onClick={handleDeleteModal}
                    className="close-btn"
                  >
                    <CloseIcon className="icon" />
                  </a>
                  <Typography className="main-title" component="h2">
                    {title}
                  </Typography>
                  <Typography component="p">
                    Are you sure want to delete?
                  </Typography>
                  <Box className="modal-footer">
                    <Button
                      className="btn btn-outline-primary"
                      onClick={handleDeleteModal}
                    >
                      No
                    </Button>
                    <Button
                      className="btn btn-outline-danger"
                      onClick={handleDelete}
                    >
                      Yes
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Modal>
  )
}

export default DeleteModal
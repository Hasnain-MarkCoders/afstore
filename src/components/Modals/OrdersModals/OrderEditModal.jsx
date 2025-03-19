import { Backdrop, Box, Button, Fade, Modal, TextField, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close"
const OrderEditModal = ({
    propertyFields=null,
    handleEditModal=()=>{},
    handleSubmitUpdateProperties=()=>{},
    handleInput=()=>{},
}) => {
  return (
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={true}
        onClose={handleEditModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="custom-modal"
      >
        <Fade in={!!propertyFields} >
          <Box>
            <form onSubmit={handleSubmitUpdateProperties}>
              <Box className="modal-body" >
                <a onClick={handleEditModal} className="close-btn">
                  <CloseIcon className="icon" />
                </a>
                <Typography className="main-title" component="h2">
                  Edit Properties
                </Typography>

                <TextField type="text"
                  label={propertyFields?.name || propertyFields?.name == '' ? "Name" : 'Customized Content'}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "10px" }}
                  value={propertyFields?.name || propertyFields?.name == '' ? propertyFields?.name : propertyFields?.customizedContent}
                  onChange={handleInput}
                  name={propertyFields?.name || propertyFields?.name == '' ? "name" : 'customizedContent'}
                />
                <TextField type="text"
                  label={propertyFields?.value || propertyFields?.value == '' ? "Value" : 'URL'}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "10px" }}
                  value={propertyFields?.value || propertyFields?.value == '' ? propertyFields?.value : propertyFields?.url}
                  onChange={handleInput}
                  name={propertyFields?.value || propertyFields?.value == '' ? "value" : 'url'}
                />

                <Box className="modal-footer">
                  <Button
                    className="btn btn-outline-primary"
                    onClick={handleEditModal}
                  >
                    Cancel
                  </Button>
                  <Button className="btn btn-primary" type="submit">
                    Update
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
  )
}

export default OrderEditModal
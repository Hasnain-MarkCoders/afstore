import { Backdrop, Box, Button, Fade, Modal, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import CloseIcon from "@mui/icons-material/Close"
const PostEditModal = ({handleEditModal=()=>{},editFields=null, handleSubmitEdit=()=>{},handleInput=()=>{}}) => {
  const state = editFields?.state?.map(item => item?.name)?.join(", ");
  const [value, setValue] = useState(state)
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
  
    <Fade in={!!editFields}>
      <Box>
        <Box className="modal-body">
          <a onClick={() => handleEditModal(null)} className="close-btn">
            <CloseIcon className="icon" />
          </a>
          <Typography className="main-title" component="h2">
            Edit Post Service
          </Typography>
          <form onSubmit={handleSubmitEdit}>
            <TextField
            InputLabelProps={{
      shrink: true, // This will keep the label on top
    }}
              type="text"
              label="Country"
              fullWidth
              variant="outlined"
              sx={{ marginBottom: "20px" }}
              value={editFields?.country}
              onChange={handleInput}
              name="code"
              required
            />
            <TextField
            InputLabelProps={{
      shrink: true, // This will keep the label on top
    }}
              type="text"
              label="Country Code"
              fullWidth
              variant="outlined"
              sx={{ marginBottom: "20px" }}
              value={editFields?.country_code}
              onChange={handleInput}
              name="country_code"
              required
            />
            <TextField
            InputLabelProps={{
      shrink: true, // This will keep the label on top
    }}
              type="text"
              inputProps={{ min: 0, step: 0.01 }}
              label="Loss Code"
              fullWidth
              variant="outlined"
              sx={{ marginBottom: "20px" }}
              value={editFields?.loss_code}
              onChange={handleInput}
              name="loss_code"
              required
            />
              <TextField
              InputLabelProps={{
      shrink: true, // This will keep the label on top
    }}
              type="text"
              inputProps={{ min: 0, step: 0.01 }}
              label="Service"
              fullWidth
              variant="outlined"
              sx={{ marginBottom: "20px" }}
              value={editFields?.service}
              onChange={handleInput}
              name="service"
              required
            />

<TextField
              InputLabelProps={{
      shrink: true, // This will keep the label on top
    }}
              type="text"
              inputProps={{ min: 0, step: 0.01 }}
              label="States"
              fullWidth
              variant="outlined"
              sx={{ marginBottom: "20px" }}
              value={value}
              onChange={handleInput}
              name="state"
              required
            />
            <Box className="modal-footer">
              <Button
                className="btn btn-outline-primary"
                onClick={handleEditModal}
              >
                Cancel
              </Button>
              <Button className="btn btn-primary" type="submit">
                Add
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Fade>
  </Modal>
  )
}

export default PostEditModal
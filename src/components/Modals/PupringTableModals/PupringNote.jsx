import { Box, Button, Fade, Modal, TextField, TextareaAutosize, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close"
const PupringNote = ({title="", isFade=null,handleModal=()=>{},handleField=()=>{}, field="",submitNote=()=>{}}) => {

return (
    <Modal
        open={true}
        onClose={handleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="list-modal"
      >
        <Fade in={!!isFade} >
          <Box component={"div"}>
            <Box component={"div"} className="modal-header">
              <Typography className="main-title" component="h2">
               {title}
              </Typography>
              <a onClick={handleModal} className="close-btn">
                <CloseIcon className="icon" />
              </a>
            </Box>
            <form onSubmit={submitNote}>
              <Box component={"div"} className="modal-body">
                <TextField
                  type="text"
                  onChange={handleField}
                  fullWidth
                  InputProps={{
                    inputComponent: TextareaAutosize,
                    rows: 3,
                  }}
                  value={field}
                  label="Enter note"
                  variant="outlined"
                />
              </Box>
              <Box component={"div"} className="modal-footer">
                <Button className="btn btn-outline-primary" onClick={handleModal}>Cancel</Button>
                <Button className="btn btn-primary" type="submit">
                  Add Note
                </Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
)

}
  


export default PupringNote
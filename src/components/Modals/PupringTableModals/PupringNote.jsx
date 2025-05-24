import { Box, Button, Fade, Modal, TextField, TextareaAutosize, Typography } from '@mui/material'
import React, { useState } from 'react'
import CloseIcon from "@mui/icons-material/Close"
const PupringNote = ({title="", isFade=null,handleModal=()=>{},handleField=()=>{}, field="",submitNote=async()=>{}}) => {
  const [isLoading, setIsLoading] = useState(false)
    const handleSubmitNote = async(e)=>{
      try {
        setIsLoading(true)
         await submitNote(e)
      } catch (error) {
        console.log(error)
      }finally{
        setIsLoading(false)
      }

    }

return (
    <Modal
        open={true}
        onClose={!isLoading&& handleModal}
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
              <a
              onClick={!isLoading &&handleModal} className="close-btn">
                <CloseIcon className="icon" />
              </a>
            </Box>
            <form onSubmit={handleSubmitNote}>
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
                <Button disabled={isLoading} className="btn btn-outline-primary" onClick={ handleModal}>Cancel</Button>
                <Button disabled={isLoading}  className="btn btn-primary" type="submit">
                  {isLoading?"Note is Adding...":"Add Note"}
                </Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
)

}
  


export default PupringNote
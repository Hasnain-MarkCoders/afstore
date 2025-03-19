import { Modal } from '@mui/material'
import React from 'react'

const PropertyAddModal = ({propertyAddModal=false, }) => {
  return (
    <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    open={propertyAddModal}
    onClose={() => setPropertyAddModal((e) => !e)}
    closeAfterTransition
    slots={{ backdrop: Backdrop }}
    slotProps={{
      backdrop: {
        timeout: 500,
      },
    }}
    className="custom-modal"
  >
    <Fade in={!!propertyAddModal} >
      <Box>
        <form onSubmit={handlePropertyAdd}>
          <Box className="modal-body" >
            <a onClick={() => setPropertyAddModal((e) => !e)} className="close-btn">
              <CloseIcon className="icon" />
            </a>
            <Typography className="main-title" component="h2">
              Add Properties
            </Typography>
            {renderDynamicFormFields()}

            <Box className="modal-footer">
              <Button
                className="btn btn-outline-primary"
                onClick={() => setPropertyAddModal((e) => !e)}
              >
                Cancel
              </Button>
              <Button className="btn btn-primary" type="submit">
                Add
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Fade>
  </Modal>
  )
}

export default PropertyAddModal
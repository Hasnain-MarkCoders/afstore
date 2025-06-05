
import { Backdrop, Box, Button, Fade, IconButton, Modal, TextField, Typography } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete";
import HscodeField from '../../HscodeField/HscodeField';
const SKUEditModal = ({
  handleEditModal = () => { },
  fields = null,
  sku = "",
  setSku = () => { },
  sku_id = "",
  setSkuId = () => { },
  handleSubmitUpdateSKU = () => { },
  handleAddKey = () => { },
  handleUpdateKey = () => { },
  handleRemoveKey = () => { },
  keys = {},
  isLoading=false,
  setCname = () => {},
  setEname = () => {},
  cname = "",
  ename = "",
  factoryPrice = "",
  customerPrice = "",
  setFactoryPrice = () => {},
  setCustomerPrice = () => {},
    productionTime="",
  setProductionTime=()=>{},
   hscodeSettings,
  setHscodeSettings=()=>{} 
}) => {

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={true}
      onClose={isLoading ? ()=>{}:handleEditModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      className="custom-modal"
    >
      <Fade in={!!fields}>
        <Box>
          <form onSubmit={handleSubmitUpdateSKU}>
            <Box className="modal-body">
              <a
                onClick={isLoading ? ()=>{}:handleEditModal}
                className="close-btn"
              >
                <CloseIcon className="icon" />
              </a>
              <Typography className="main-title" component="h2">
                Update SKU
              </Typography>
              <TextField type="text"
                label="SKU"
                fullWidth
                variant="outlined"
                style={{ marginBottom: "20px" }}
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
              />
              <TextField type="text"
                disabled={true}
                label="SKU_ID"
                fullWidth
                variant="outlined"
                style={{ marginBottom: "20px" }}
                value={sku_id}
                onChange={(e) => setSkuId(e.target.value)}
                required
              />
                        <TextField
                              type="text"
                              label="Ename"
                              fullWidth
                              variant="outlined"
                              style={{ marginBottom: "20px" }}
                              value={ename}
                              onChange={(e) => setEname(e.target.value)}
                            />
              
                            <TextField
                              type="text"
                              label="Cname"
                              fullWidth
                              variant="outlined"
                              style={{ marginBottom: "20px" }}
                              value={cname}
                              onChange={(e) => setCname(e.target.value)}
                            />
                             <TextField
                                            type="text"
                                            label="Production Time"
                                            fullWidth
                                            variant="outlined"
                                            style={{ marginBottom: "20px" }}
                                            value={productionTime}
                                            onChange={(e) => setProductionTime(e.target.value)}
                                          />
                            
              
                               <TextField
                              inputProps={{ min: 0 }}
                              label="Factory Price RMB"
                              fullWidth
                              variant="outlined"
                              style={{ marginBottom: "20px" }}
                              value={factoryPrice}
                              onChange={(e) => setFactoryPrice(e.target.value)}
                            />
                            <TextField
                              inputProps={{ min: 0 }}
                              label="Customer Price USD"
                              fullWidth
                              variant="outlined"
                              style={{ marginBottom: "20px" }}
                              value={customerPrice}
                              onChange={(e) => setCustomerPrice(e.target.value)}
                            />
           
              <Typography variant='h6'>
                Custom SKU Properties
              </Typography>
              <Box>
                {
                  Object.entries(keys).map(([key, value]) => (
                    <Box sx={{
                      display: "flex",
                      alignItems: "center"
                    }}>

                      <TextField
                        fullWidth
                        onChange={(e) => { handleUpdateKey(key, e.target.value) }}
                        value={value}
                        variant='outlined'
                        label={`Property.${key}`}
                      />
                      <IconButton color="error" onClick={()=>{handleRemoveKey(key)}}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))
                }
                <Button 
                sx={{
                  my:"20px"
                }}
                onClick={handleAddKey}
                variant='outlined'>
                  + Add New Property
                </Button>
              </Box>   <HscodeField
                             hscodeSettings={hscodeSettings}
                             setHscodeSettings={setHscodeSettings}/>

              <Box className="modal-footer">
                <Button
                  className="btn btn-outline-primary"
                  onClick={isLoading ? ()=>{}:handleEditModal}
                >
                  Cancel
                </Button>
                <Button className="btn btn-primary" type="submit">
                  {isLoading ? "Updating..." :"Update"}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  )
}

export default SKUEditModal
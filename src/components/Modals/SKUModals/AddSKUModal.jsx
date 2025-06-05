import { Backdrop, Box, Button, Fade, IconButton, Modal, TextField, Typography } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import HscodeField from '../../HscodeField/HscodeField';
const AddSKUModal = ({
  sku = "",
  sku_id = "",
  setSkuId = () => { },
  setSku = () => { },
  handleModal = () => { },
  open = false,
  keys = {}, 
  handleSubmitAddSKU = () => { },
  removeKey=()=>{},
  updateKeyValue=()=>{},
  addNewKey=()=>{},
  isLoading=false,
  setCname = () => {},
  setEname = () => {},
  cname = "",
  ename = "",
  factoryPrice = "",
  customerPrice = "",
  productionTime="",
  setFactoryPrice = () => {},
  setProductionTime=()=>{},
  setCustomerPrice = () => {},
   hscodeSettings,
  setHscodeSettings=()=>{} 
}) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={isLoading ? ()=>{}:handleModal}

      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      className="custom-modal"
    >
      <Fade in={open} >
        <Box>
          <Box className="modal-body" >
            <a onClick={ isLoading ? ()=>{}: handleModal} className="close-btn">
              <CloseIcon className="icon" />
            </a>
            <Typography className="main-title" component="h2">
              Add SKU
            </Typography>
            <form onSubmit={(e)=>{
              e.preventDefault()
              handleSubmitAddSKU(e)
            }}>
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
               <Typography variant="h6">Custom SKU Properties</Typography>
               {Object.entries(keys).map(([key, value]) => (
                <Box key={key} display="flex" alignItems="center" gap={1} mb={1}>
                  <TextField
                    label={`Property: ${key}`}
                    fullWidth
                    variant="outlined"
                    value={value}
                    onChange={(e) => updateKeyValue(key, e.target.value)}
                  />
                  <IconButton onClick={() => removeKey(key)} color="error">
                    <DeleteIcon  />
                  </IconButton>
                </Box>
              ))}

              <Button
                variant="outlined"
                onClick={addNewKey}
                style={{ marginBottom: "20px", marginTop: "10px" }}
              >
                + Add Property
              </Button>
     <HscodeField 
               hscodeSettings={hscodeSettings}
               setHscodeSettings={setHscodeSettings}/>
              <Box className="modal-footer"></Box>
              <Box className="modal-footer">
                <Button
                  className="btn btn-outline-primary"
                  onClick={isLoading ? ()=>{}:handleModal}
                >
                  Cancel
                </Button>
                <Button className="btn btn-primary" type="submit">
                {isLoading? "Adding...":"Add"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default AddSKUModal
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Autocomplete,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import API from '../../api/api';

const MakePremiumPostServiceModal = ({ open, handleClose, postService, cb=()=>{} }) => {
  const [loading, setLoading] = useState(false);

  const [selectedState, setSelectedState] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: '',
  });

  useEffect(()=>{
  },[])
  useEffect(() => {
    if (postService && postService.states) {
      // Extract the state names from postService.states
      const statesList = postService.states.filter(item=>item.is_premium!=true).map((state) => state.name || state);
      setStateOptions(statesList);
    } else {
      setStateOptions([]);
    }
    // Reset the selected state when the modal opens
    setSelectedState(null);
  }, [postService, open]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedState || selectedState.trim() === '') {
      newErrors.selectedState = 'Please select a state.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix the errors in the form.',
        severity: 'error',
      });
      return;
    }

    const data = {
      id: postService._id,
      state: selectedState,
    };

    try {
      setLoading(true)
      const response = await API.post('/admin/activate-premium', data);
      setSnackbar({
        open: true,
        message: response?.data?.message,
        severity: 'success',
      });
      cb()
      if (response.data){
        setTimeout(()=>{
      handleClose();

        },200)
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'An error occurred while activating the post service.';
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
    finally{
      setLoading(false)
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 500,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
          Select state for premium
          </Typography>
          <Autocomplete
            options={stateOptions}
            value={selectedState}
            onChange={(event, newValue) => setSelectedState(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select State"
                margin="normal"
                error={!!errors.selectedState}
                helperText={errors.selectedState}
              />
            )}
          />
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
            
            disabled={loading || !selectedState} variant="contained" onClick={handleSubmit}>
              Premium
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MakePremiumPostServiceModal;

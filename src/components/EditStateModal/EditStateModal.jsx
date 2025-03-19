// EditStateModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import API from '../../api/api';

const EditStateModal = ({ open, handleClose, postService, cb=()=>{} }) => {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [newState, setNewState] = useState('');
  const [service, setService] = useState(postService?.service);
  const [loss_code, setLoss_code] = useState(postService?.loss_code);

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    if (postService && postService.states) {
      setStates(postService.states.map((state) => state.name));
    } else {
      setStates([]);
    }
  }, [postService]);

  const validateForm = () => {
    const newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddState = () => {
    if (newState.trim() !== '') {
      setStates((prevStates) => [...prevStates, newState.trim()]);
      setNewState('');
    }
  };

  const handleDeleteState = (stateToDelete) => {
    setStates((prevStates) => prevStates.filter((state) => state !== stateToDelete));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please fix the errors in the form.', severity: 'error' });
      return;
    }

    const data = {
      id: postService._id,
      state: states.map((stateName) => ({ name: stateName })),
      loss_code,
      service
    };

    try {
      setLoading(true);
      await API.post('/suadmin/edit-post-service', data);
      setSnackbar({ open: true, message: 'States updated successfully!', severity: 'success' });
      cb()
      handleClose();
      setStates([]);
    } catch (error) {
      let errorMessage = 'An error occurred while updating the states.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
    finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="edit-states-modal">
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
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" component="h2" mb={2} id="edit-states-modal">
            Edit Post Service
          </Typography>
          <Box display="flex" sx={{
            flexBasis:"50px"
          }} alignItems="center" mb={2}>
            <TextField
              label="Add State"
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              variant="outlined"
              fullWidth
              aria-label="Add State"
            />
            <Button
              variant="contained"
              onClick={handleAddState}
              disabled={newState.trim() === ''}
              sx={{ ml: 2 }}
            >
              Add
            </Button>
          </Box>
          <Box sx={{display:"flex", flexDirection:"column", gap:2, mb:2}}>

          <TextField
              label="Edit Service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              variant="outlined"
              fullWidth
              aria-label="Add State"
            />
               <TextField
                mb={2}
              label="Edit Loss Code"
              value={loss_code}
              onChange={(e) => setLoss_code(e.target.value)}
              variant="outlined"
              fullWidth
              aria-label="Add State"
            />
          </Box>
          <Box
            sx={{
              minHeight: '200px',
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: 1,
              p: 1,
            }}
          >
            {states.map((state, index) => (
              <Chip
                key={index}
                label={state}
                onDelete={() => handleDeleteState(state)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button disabled={loading ||newState.trim() != ''} variant="contained" onClick={handleSubmit}>
              Save
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
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditStateModal;

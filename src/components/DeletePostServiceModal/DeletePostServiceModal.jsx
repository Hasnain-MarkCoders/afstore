import React, { useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import API from '../../api/api';
import { useSelector } from 'react-redux';

const DeletePostServiceModal = ({ open, handleClose, postService, cb=()=>{} }) => {
  const [loading, setLoading] = useState(false);
  const auth = useSelector(state=>state.user)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: '',
  });

  const handleDelete = async () => {
    const data = {
      id: postService._id,
    };

    try {
      setLoading(true);
      const response = await API.delete(`/${auth.type}/delete-post-service`, {
        params: data,
      });
      console.log('Response:', response.data);
      setSnackbar({
        open: true,
        message: 'Post service deleted successfully!',
        severity: 'success',
      });
      cb()
      handleClose();
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'An error occurred while deleting the post service.';
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
      setLoading(false);
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
            Delete Post Service
          </Typography>
          <Typography variant="body1" mb={2}>
            Are you sure you want to delete the post service?
          </Typography>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button 
            disabled={loading}
            
            variant="contained" color="error" onClick={handleDelete}>
              Delete
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

export default DeletePostServiceModal;

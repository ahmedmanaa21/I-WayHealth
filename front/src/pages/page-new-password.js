import { Helmet } from 'react-helmet-async';
import { Container, Typography, TextField, Button, Stack } from '@mui/material';
import { useState } from 'react';
import axios from 'axios'; // Don't forget to import axios
import swal from 'sweetalert'; // Don't forget to import swal
import { useParams, useNavigate } from 'react-router-dom';


export default function NewPassword() {
  // const { userId, token } = useParams();
  const searchParams = new URLSearchParams(document.location.search);
  const userId = searchParams.get("id");
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      swal('Error', 'Passwords do not match!', 'error');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/user/resetPassword/${userId}/${token}`, {
        password: newPassword,
      });
      console.log(response);
      swal('Success', 'Password reset successfully!', 'success');
      navigate('/login'); // Redirect to login page after successful password reset
    } catch (error) {
      console.log(error);
      swal('Error', 'Failed to reset password!', 'error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | Minimal UI</title>
      </Helmet>
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ my: 10 }}>
          <Typography variant="h4">Reset Password</Typography>
          <Typography variant="body2" color="text.secondary">
            Please enter your new password.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              sx={{ marginBottom: 2 }} // Add margin at the bottom
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              sx={{ marginBottom: 2 }} // Add margin at the bottom
            />
            <Button fullWidth variant="contained" type="submit" sx={{ marginTop: 2 }}>
              Reset Password
            </Button>
          </form>
        </Stack>
      </Container>
    </>
  );
}
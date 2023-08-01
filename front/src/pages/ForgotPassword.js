import { Helmet } from 'react-helmet-async';
import { Container, Typography, TextField, Button, Stack } from '@mui/material';
import axios from 'axios'; // Don't forget to import axios
import swal from 'sweetalert'; // Don't forget to import swal

export default function ForgotPassword() {
  // Implement your logic for handling the email submission and password recovery here

const submitHandler = async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;

  try {
    const response = await axios.post('http://localhost:3000/user/forgotPassword', { email });
    console.log(response);
    swal('Success', 'Password reset link sent to your email account', 'success');
  } catch (error) {
    console.log(error);
    swal('Oops', 'Invalid Email !', 'error');
  }
};


  return (
    <>
      <Helmet>
        <title>Forgot Password | Minimal UI</title>
      </Helmet>
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ my: 10 }}>
          <Typography variant="h4">Forgot Password</Typography>
          <Typography variant="body2" color="text.secondary">
            Please enter your email address to recover your password.
          </Typography>
          <form onSubmit={submitHandler}>
            <TextField fullWidth label="Email" name="email" />
            <br />
            <br />
            <Button fullWidth variant="contained" type="submit">
              Send
            </Button>
          </form>
        </Stack>
      </Container>
    </>
  );
}

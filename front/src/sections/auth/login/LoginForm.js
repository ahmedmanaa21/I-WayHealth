import { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Stack } from '@mui/material';
import swal from 'sweetalert';
import { useAuthStore , useUserStore } from "../../../utils/zustand";

export default function LoginForm() {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const user = {
    username,
    password,
  };

  const handleLogin = async () => {
    try {
      // Make an API request to your login endpoint
      const response = await axios.post('http://localhost:3000/user/login', user);
      // Set token response data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.user);
      useUserStore.setState({ user: response.data.user });
      login();
      // Redirect or navigate to the dashboard or desired page
      if (isAuthenticated) {
        // If already authenticated, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      // Handle login error
      console.error(error);
      if (error.response && error.response.status === 401) {
        // User not approved
        swal('Not Approved', 'Please wait for approval to login', 'warning');
      } else if (error.response && error.response.status === 404) {
        // User not found
        swal('User not found', 'Please check your username and password', 'error');
      } else {
        // Other error occurred
        swal('Error', 'Wrong Password !', 'error');
      }
    }
  };

  return (
    <>
      <Stack spacing={3}>
      <TextField
        label="Username"
        value={username}
        onChange={handleUsernameChange}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
      <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            component={Link} // Use the Link component
            to="/ForgotPassword" // Navigate to the "ForgotPage"
          >
            Forgot Password
          </Button>
      </Stack>
    </>
  );
}

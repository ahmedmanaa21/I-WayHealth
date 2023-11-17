import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Stack, MenuItem, Select } from '@mui/material';
import swal from 'sweetalert';
import { useAuthStore, useUserStore } from "../../../utils/zustand";

export default function SignupForm() {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const [cin, setCin] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [phonenumber, setPhonenumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [place, setPlace] = useState('');
  const [address, setAddress] = useState('');




  const handleCinChange = (event) => {
    setCin(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value);
  };

  const handleLastnameChange = (event) => {
    setLastname(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handlePhonenumberChange = (event) => {
    setPhonenumber(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handlePlaceChange = (event) => {
    setPlace(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSignup = async () => {
    try {
      const newUser = {
        _id: cin,
        username,
        firstname,
        lastname,
        email,
        image,
        phonenumber,
        password,
        role,
        place,
        address,
      };
      // Make an API request to your signup endpoint
      console.log(newUser)
      const response = await axios.post('http://localhost:3000/user/', newUser, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      // Set token response data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      useUserStore.setState({ user: response.data.user });
      // Show success Swal and redirect to login page
      swal('Signup Successful!', 'You have signed up successfully.', 'success').then(() => {
        navigate('/login');
      });
    } catch (error) {
      // Handle signup error
      console.error(error);
      if (error.response && error.response.status === 409) {
        // User already exists
        swal('User already exists', 'Please choose a different username', 'error');
      } else {
        // Other error occurred
        swal('Error', 'Cin or Email or Username already used', 'error');
      }
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          label="CIN"
          value={cin}
          onChange={handleCinChange}
        />
        <TextField
          label="Username"
          value={username}
          onChange={handleUsernameChange}
        />
        <TextField
          label="First Name"
          value={firstname}
          onChange={handleFirstnameChange}
        />
        <TextField
          label="Last Name"
          value={lastname}
          onChange={handleLastnameChange}
        />
        <TextField
          label="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          label=" "
          type="file"
          onChange={handleImageChange}
        />
        <TextField
          label="Phone Number"
          value={phonenumber}
          onChange={handlePhonenumberChange}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <TextField
          label="Role"
          value={role}
          onChange={handleRoleChange}
          select
        >
          <MenuItem value="medecin">medecin</MenuItem>
          <MenuItem value="Pharmacist">Pharmacist</MenuItem>
        </TextField>
        <TextField
          label="Place"
          value={place}
          onChange={handlePlaceChange}
        />
        <TextField
          label="Address"
          value={address}
          onChange={handleAddressChange}
        />
        <Button variant="contained" onClick={handleSignup}>
          Sign Up
        </Button>
      </Stack>
    </>
  );
}

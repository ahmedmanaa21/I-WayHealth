import { useState , useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import account from '../../../_mock/account';

// ----------------------------------------------------------------------

import { useUserStore, useAuthStore } from "../../../utils/zustand";
import defaultAvatar from '../../../utils/profilePictures/default.jpg';

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(null);
  const userr = JSON.parse(localStorage.getItem("user"));
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (userr.image) {
      // Load the image dynamically and set it in the state
      import(`../../../utils/profilePictures/${userr.image}`)
        .then((imageModule) => {
          setProfileImage(imageModule.default);
          
        })
        .catch((error) => {
          console.error(error);
          setProfileImage(null); // Set to a default image or handle error as needed
        });
    }
  }, [userr.image]);


  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    logout();
    navigate("/login");
  };


  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
         {userr.image ? (
        <Avatar src={profileImage} alt="User Profile" />
        // <Avatar src={`../../../utils/profilePictures/${userr.image}`} alt="User Profile" />
      ) : (
        <Avatar src={defaultAvatar} alt="Default User Profile" />
      )}
        
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userr.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userr.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}


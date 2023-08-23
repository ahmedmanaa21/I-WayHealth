import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TableHead,
} from '@mui/material';
import Iconify from '../components/iconify';
import { useUserStore, useAuthStore } from "../utils/zustand";

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'place', label: 'Place', alignRight: false },
  { id: 'status', label: 'Approved', alignRight: false },
  { id: '', label: 'Actions', alignRight: false },
];

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPopoverId, setOpenPopoverId] = useState(null);

  const handleOpenMenu = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setOpenPopoverId(userId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpenPopoverId(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const userr = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const user = useAuthStore((state) => state.user);
  const images = require.context('../utils/profilePictures/', true, /\.(png|jpe?g|gif|svg)$/);


  useEffect(() => {
    axios
      .get('http://localhost:3000/user/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (user) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, the user will be permanently removed.',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`http://localhost:3000/user/${user._id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((res) => {
            swal('User has been deleted!', {
              icon: 'success',
            });
            axios
            .get('http://localhost:3000/user/users', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then((res) => {
              setUsers(res.data);
            })
            .catch((err) => {
              console.log(err);
            });

          })
          .catch((error) => {
            swal('Oops! Something went wrong.', {
              icon: 'error',
            });
          });
      }
    });
  };

  const handleApprove = (user) => {
    if (user.approved) {
      swal('User is already approved!', {
        icon: 'info',
      });
      return;
    }
    swal({
      title: 'Are you sure?',
      text: 'Once approved, the user will be able to login.',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willApprove) => {
      if (willApprove) {
        axios
          .put(`http://localhost:3000/user/approve/${user._id}`, {
            approved: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            // Update the user's approved status in the local state or refresh the user data
            // For example, if you want to update the local state, you can do:
            setUsers(prevUsers => prevUsers.map(u => u._id === user._id ? { ...u, approved: true } : u));
  
            swal('User has been approved!', {
              icon: 'success',
            });
          })
          .catch((error) => {
            swal('Oops! Something went wrong.', {
              icon: 'error',
            });
          });
      }
    });
  };
  
         
              

  const filteredUsers = users.filter((user) => user.firstname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0;

  return (
    <>
      <Helmet>
        <title>Users</title>
      </Helmet>

      <Container>
      <Card>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} sx={{ px: 3 }}>
          <Typography variant="h4" gutterBottom>
            Users List
          </Typography>
        </Stack>

        
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} sx={{ px: 3 }}>
            <Typography variant="subtitle2" noWrap>
              Filter by Name :
            </Typography>
            <input type="text" value={filterName} onChange={handleFilterByName} />
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((headCell) => (
                    <TableCell key={headCell.id} align={headCell.alignRight ? 'right' : 'left'}>
                      {headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => {
                  const { _id, firstname, lastname, email, image, role, place, approved } = user;

                  return (
                    <TableRow key={_id} tabIndex={-1} role="checkbox">
                      <TableCell component="th" scope="row">
                        <Stack direction="row" alignItems="center" spacing={3}>
                          <Avatar alt="User Profile" src={images(`./${image}`)} />
                          <Typography variant="subtitle2" noWrap>
                            {firstname} {lastname}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{role}</TableCell>
                      <TableCell>{place}</TableCell>
                      <TableCell>{approved ? 'Yes' : 'No'}</TableCell>
                      <TableCell align="center">
                        <div style={{ position: 'relative' }}>
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenu(event, _id)}
                          >
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                          <Popover
                            open={openPopoverId === _id}
                            anchorEl={openPopoverId === _id ? anchorEl : null}
                            onClose={handleCloseMenu}
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            PaperProps={{
                              sx: {
                                p: 1,
                                width: 140,
                                '& .MuiMenuItem-root': {
                                  px: 1,
                                  typography: 'body2',
                                  borderRadius: 0.75,
                                },
                              },
                            }}
                          >
                            <MenuItem onClick={() => handleDelete(user)}>
                              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                              Delete
                            </MenuItem>
                            <MenuItem onClick={() => handleApprove(user)}>
                              <Iconify icon={'eva:checkmark-circle-2-outline'} sx={{ mr: 2 }} />
                              Approve
                            </MenuItem>
                          </Popover>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

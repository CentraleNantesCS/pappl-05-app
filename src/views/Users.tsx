import { Box, Button, Card, CardContent, Container, Modal, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useStateContext } from '../utils/state';
import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';
import Typography from 'material-ui/styles/typography';
import axios from '../utils/axios';
import PersonAdd from "@material-ui/icons/PersonAdd";

function Users() {
  const { state } = useStateContext();

  const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params: ValueGetterParams) =>
        `${params.getValue('firstname') || ''} ${params.getValue('lastname') || ''
        }`,
    },
    { field: 'email', headerName: 'Email', width: 210 }
  ];

  const [Users, setUsers] = useState([])

  const loadUsers = async () => {
    try {
      const response = await axios.get('/api/users')
      if (response.status == 200) {
        setUsers(response.data)
      } else {
        // TODO: error message
      }

    } catch (error) {
      // TODO: Do nothing for now
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }
  const useStyles = makeStyles(theme => ({
    paper: {
      position: "absolute",
      width: 300,
      padding: 20
    }
  }));

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <Container className="mt-10 ">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div style={modalStyle} className="bg-white absolute py-6 px-6 w-1/2 rounded-sm">
          <h2 id="modal-title" className="text-xl font-medium py-2">Add new user</h2>
          <p id="modal-description pb-4">
          </p>
          <div className="grid grid-flow-row gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className=""><TextField required label="First Name" className="w-full" defaultValue="" /></div>
              <div className=""><TextField required label="Last Name" className="w-full" defaultValue="" /></div>
            </div>
            <div className=""><TextField required label="Acronym" className="w-full" defaultValue="" /></div>
            <div className=""><TextField required label="Email" className="w-full" defaultValue="" /></div>
            <div className=""><TextField required label="Password" className="w-full" defaultValue="" /></div>
            {/* TODO: role */}
          </div>
          <div className="flex flex-row mt-10">
            <div className="flex-1"></div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="contained" onClick={handleClose}>Cancel</Button>
              <Button variant="contained" color="primary">
              Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Card className="px-4 py-10" style={{ height: '80vh' }}>
        <div className="w-full flex flex-row">
          <div className="flex-1"></div>
          <Button variant="contained" color="secondary" startIcon={<PersonAdd />} onClick={handleOpen}>
            Add User
          </Button>
        </div>
        <h3 className="text-3xl font-medium ml-4">Users: </h3>
        <CardContent className="pb-20">
          <DataGrid autoHeight rows={Users} columns={columns} pageSize={5} checkboxSelection />
        </CardContent>
      </Card>
    </Container>
  );
}

export default Users;

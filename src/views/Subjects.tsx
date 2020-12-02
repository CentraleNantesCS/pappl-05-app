import { Button, Card, CardContent, Container, Modal, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useStateContext } from '../utils/state';
import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';
import Typography from 'material-ui/styles/typography';
import axios from '../utils/axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { title } from 'process';
import { green } from '@material-ui/core/colors';

function Subjects() {
  
  const { state } = useStateContext();

  const columns: ColDef[] = [
    { field: 'id', headerName: 'Id', width: 70 },
    { field: 'name', headerName: 'Name', width: 230 },
    { field: 'acronym', headerName: 'Acronym', width: 100 }
  ];

  //Just to see the data 
  const rows = [
    { id: 1, name: 'Discret Math', acronym: 'MADIS' },
    { id: 2, name: 'Oriented Object Programming', acronym: 'OOP' },
    { id: 3, name: 'Software Engnieering', acronym: 'GELOG' },
    { id: 4, name: 'Application Project', acronym: 'PAPPL' },
  ];

  const [Subs, setSubs] = useState(rows)

  const loadSpecs = async () => {
    try {
      const response = await axios.get('/api/')
      if (response.status === 200) {
        setSubs(response.data)
      } else {
        // TODO: error message
      }

    } catch (error) {
      // TODO: Do nothing for now
    }
  }

  useEffect(() => {
    loadSpecs()
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
          <h2 id="modal-title" className="text-xl font-medium py-2">Add new Subject</h2>
          <p id="modal-description pb-4">
          </p>
          <div className="grid grid-flow-row gap-4">
            <div className=""><TextField required label="Title" className="w-full" defaultValue="" /></div>
            <div className=""><TextField required label="Acronym" className="w-full" defaultValue="" /></div>
            {/* TODO: role */}
          </div>
          <div className="flex flex-row mt-10">
            <div className="flex-1"></div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="contained" onClick={handleClose}>Cancel</Button>
              <Button variant="contained" color="primary">Save</Button>
            </div>
          </div>
        </div>
      </Modal>
      <Card className="px-4 py-10" style={{ height: '80vh' }}>
        <div className="w-full flex flex-row">
          <div className="flex-1"></div>
          <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleOpen}>
            Add Subject
          </Button>
        </div>
        <h3 className="text-3xl font-medium ml-4">Subjects: </h3>
        <CardContent className="pb-20">
          <DataGrid autoHeight rows={Subs} columns={columns} pageSize={5} checkboxSelection />
        </CardContent>
      </Card>
    </Container>
  );
}


export default Subjects;

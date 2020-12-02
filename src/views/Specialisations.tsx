import { Button, Card, CardContent, Container, Modal, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useStateContext } from '../utils/state';
import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';
import axios from '../utils/axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';


function Specialisations() {
  const { state } = useStateContext();

  const columns: ColDef[] = [
    { field: 'id', headerName: 'Id', width: 70 },
    { field: 'title', headerName: 'Title', width: 180 },
    { field: 'acronym', headerName: 'Acronym', width: 100 }
  ];

  //Just to see the data 
  const rows = [
    { id: 1, title: 'Computer Science', acronym: 'INF' },
    { id: 2, title: 'Robotics', acronym: 'ROB' },
    { id: 3, title: 'Embeded Systems', acronym: 'EMS' },
    { id: 4, title: 'Civil Engineering', acronym: 'CE' },
  ];

  const [Specs, setSpecs] = useState(rows)

  const loadSpecs = async () => {
    try {
      const response = await axios.get('/api/')
      if (response.status === 200) {
        setSpecs(response.data)
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

  const Subjects = [
    { id: 1, title: 'TLANG'},
    { id: 2, title: 'MADIS'},
    { id: 3, title: 'POO'},
    { id: 4, title: 'PAPPL'}
  ];

  //To modify the data structure for the option field
  let opt: {value: string, label: string}[] = [];
  Subjects.map((sub)=>{
    opt.push({value: sub.title, label: sub.title})
  })

  const animatedComponents = makeAnimated();

  return (
    <Container className="mt-10 ">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div style={modalStyle} className="bg-white absolute py-6 px-6 w-1/2 rounded-sm">
          <h2 id="modal-title" className="text-xl font-medium py-2">Add new Specialisation</h2>
          <p id="modal-description pb-4">
          </p>
          <div className="grid grid-flow-row gap-4">
            <div className=""><TextField required label="Title" className="w-full" defaultValue="" /></div>
            <div className=""><TextField required label="Acronym" className="w-full" defaultValue="" /></div>
            {/* TODO: role */}
          </div>
          <div className="form pt-5">
            <h4>Select related subjects to this Specialisation :</h4>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={opt}
            />
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
            Add Specialisation
          </Button>
        </div>
        <h3 className="text-3xl font-medium ml-4">Specialisations: </h3>
        <CardContent className="pb-20">
          <DataGrid autoHeight rows={Specs} columns={columns} pageSize={5} checkboxSelection />
        </CardContent>
      </Card>
    </Container>
  );
}


export default Specialisations;

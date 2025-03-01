import { Button, Card, CardContent, Container, createMuiTheme, Modal, TextField, ThemeProvider } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../utils/state';
import { DataGrid, ColDef, ValueGetterParams, ValueFormatterParams } from '@material-ui/data-grid';
import axios from '../utils/axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useForm } from "react-hook-form";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon  from "@material-ui/icons/Delete";
import { useQuery, QueryCache, ReactQueryCacheProvider, useMutation, useQueryCache } from 'react-query'
 import LabelIcon from '@material-ui/icons/Label'
import IconButton  from '@material-ui/core/IconButton';
import { EventType } from '../models/EventType';

const queryCache = new QueryCache()

function EventTypes() {
  const deleteType = (id: number | string) => {}
  const Theme = createMuiTheme({
    palette: {
      primary: {
        main: '#045d93',
      },
      secondary: {
        main: '#F9BE1B',
      },
    },
    typography: {
      fontFamily: 'Poppins'
    },
  })

  function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


   // Cache
  const cache = useQueryCache()

  // Queries
  const eventTypesQuery = useQuery('getEventTypes', () =>
    axios.get('/api/eventtypes').then(res =>
      res.data
    )
  )

  const [addEventType] = useMutation(async ({ name, acronym }: EventType) => {
    const res = await axios.post('/api/eventtypes', { name, acronym });
    return res.data;
  }, {
      onSuccess: (data) => {
      handleClose()
      // Query Invalidations
      cache.invalidateQueries('getEventTypes')
    },
  })

  const [deleteEventType] = useMutation(async (id: number | string) => {
    const res = await axios.delete(`/api/eventtypes/${id}`);
    return res.data;
  }, {
    onSuccess: (data) => {
      // Query Invalidations
      cache.invalidateQueries('getEventTypes')
    },
  })

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data: EventType) => addEventType(data);

  const columns: ColDef[] = [
    { field: 'name', headerName: 'Type', width: 230, headerAlign: 'center', align: 'center' },
    { field: 'acronym', headerName: 'Acronyme', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'id2', headerName: 'Action', headerAlign: 'center', align: 'center',width: 120, renderCell: (params: ValueFormatterParams) => (
        <div>
          <ThemeProvider theme={Theme}>
            <IconButton color ="primary" onClick={() => deleteEventType(params.data.id)}>
              <DeleteIcon />
            </IconButton>
            <IconButton color = "secondary">
              <EditIcon />
            </IconButton>
          </ThemeProvider>
        </div>

  )}
  ];
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ThemeProvider theme={Theme}>
      <Container className="mt-10 ">
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div style={modalStyle} className="bg-white absolute py-6 px-6 w-1/2 rounded-sm">
            <h2 id="modal-title" className="text-xl font-medium py-2">Ajouter un type</h2>
            <p id="modal-description pb-4">
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-flow-row gap-4">
                <div className="">
                  <TextField required label="Intitulé" className="w-full" defaultValue="" name="name" inputRef={register({ required: true })} />
                  {errors.name && <span>Ce champ est obligatoire</span>}
                </div>
                <div className="">
                  <TextField required label="Acronyme" className="w-full" defaultValue="" name="acronym" inputRef={register({ required: true })} />
                  {errors.acronym && <span>Ce champ est obligatoire</span>}
                </div>
              </div>
              <div className="flex flex-row mt-10">
                <div className="flex-1"></div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="contained" color="secondary" onClick={handleClose}>Annuler</Button>
                  <Button variant="contained" type="submit" color="primary">Enregistrer</Button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
        <Card className="px-4 py-10" style={{ height: '80vh' }}>
          <div className="w-full flex flex-row">
            <div className="flex-1"></div>
            <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleOpen}>
              Ajouter un type
          </Button>
          </div>
          <div className="flex items-center	ml-4">
            <LabelIcon fontSize="large"/>
            <h3 className="text-3xl font-medium ml-4">Types D'évènements :</h3>
          </div>
          <CardContent className="pb-20">
            {eventTypesQuery.isLoading && <p>Loading...</p>}
            {eventTypesQuery.error && <p>An error has occurred: {eventTypesQuery.error || 'Unknown'}</p>}
            {eventTypesQuery.data && <DataGrid autoHeight rows={eventTypesQuery.data} columns={columns} pageSize={5} />}
          </CardContent>
        </Card>
      </Container>
      </ThemeProvider>
      </ReactQueryCacheProvider>
  );
}


export default EventTypes;

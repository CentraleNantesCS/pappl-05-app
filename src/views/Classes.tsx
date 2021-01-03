import { Button, Card, CardContent, Container, Modal, TextField } from '@material-ui/core';
import React from 'react';
import { DataGrid, ColDef,  ValueFormatterParams } from '@material-ui/data-grid';
import axios from '../utils/axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useForm } from "react-hook-form";

import { useQuery, QueryCache, ReactQueryCacheProvider, useMutation, useQueryCache } from 'react-query'
import { Class } from '../models/Class';
import SchoolIcon from '@material-ui/icons/School';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from "@material-ui/core";

const queryCache = new QueryCache()

function Classes() {
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
  const [openCreate, setOpenCreate] = React.useState(false);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };


  // Cache
  const cache = useQueryCache()

  // Queries
  const classesQuery = useQuery('getClasses', () =>
    axios.get('/api/classes').then(res =>
      res.data
    )
  )

  const [addClass] = useMutation(async ({ start_year, end_year }: Class) => {
    const res = await axios.post('/api/classes', { start_year, end_year });
    return res.data;
  }, {
    onSuccess: (data) => {
      handleCloseCreate()
      // Query Invalidations
      cache.invalidateQueries('getClasses')
    },
  })

  const [deleteClass] = useMutation(async (id: number | string) => {
    const res = await axios.delete(`/api/classes/${id}`);
    return res.data;
  }, {
    onSuccess: (data) => {
      // Query Invalidations
      cache.invalidateQueries('getClasses')
    },
  })


  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data: Class) => addClass(data);

  const columns: ColDef[] = [
    { field: 'annee', headerName: 'Année Scolaire', flex: 1, valueFormatter: (params) => `${params.data.start_year}-${params.data.end_year}`, headerAlign: 'center', align: 'center' },
    {
      field: 'actions', headerName: 'Action', headerAlign: 'center', align: 'center', width: 120, renderCell: (params: ValueFormatterParams) => (
        <ThemeProvider theme={Theme}>
          <IconButton color="primary" onClick={() => deleteClass(params.data.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton color="secondary">
            <EditIcon />
          </IconButton>
        </ThemeProvider>

      )
    }
  ];

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ThemeProvider theme={Theme}>
        <Container className="mt-10 ">
          <Modal
            open={openCreate}
            onClose={handleCloseCreate}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <div style={modalStyle} className="bg-white absolute py-6 px-6 w-1/2 rounded-sm">
              <h2 id="modal-title" className="text-xl font-medium py-2">Ajouter une promo</h2>
              <p id="modal-description pb-4">
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-flow-row gap-4">
                  <div className="">
                    <TextField required label="Start Year" className="w-full" defaultValue="" name="start_year" inputRef={register({ required: true })} />
                    {errors.start_year && <span>Ce champ est obligatoire</span>}
                  </div>
                  <div className="">
                    <TextField required label="End Year" className="w-full" defaultValue="" name="end_year" inputRef={register({ required: true })} />
                    {errors.end_year && <span>Ce champ est obligatoire</span>}
                  </div>
                </div>
                <div className="flex flex-row mt-10">
                  <div className="flex-1"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button color="secondary" variant="contained" onClick={handleCloseCreate}>Annuler</Button>
                    <Button variant="contained" type="submit" color="primary">Enregistrer</Button>
                  </div>
                </div>
              </form>
            </div>
          </Modal>
          <Card className="px-4 py-10" style={{ height: '80vh' }}>
            <div className="w-full flex flex-row">
              <div className="flex-1"></div>
              <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleOpenCreate}>
                Ajouter une promo
            </Button>
            </div>
            <div className="flex items-center	ml-4">
              <SchoolIcon fontSize="large" />
              <h3 className="text-3xl font-medium ml-4">Promotions :</h3>
            </div>
            <CardContent className="pb-20">
              {classesQuery.isLoading && <p>Loading...</p>}
              {classesQuery.error && <p>An error has occurred: {classesQuery.error || 'Unknown'}</p>}
              {classesQuery.data && <DataGrid autoHeight rows={classesQuery.data} columns={columns} pageSize={5} />}
            </CardContent>
          </Card>
        </Container>
      </ThemeProvider>
    </ReactQueryCacheProvider>
  );
}


export default Classes;

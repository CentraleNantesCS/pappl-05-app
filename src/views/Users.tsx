import { Button, Card, CardContent, Container, createMuiTheme, Modal, TextField, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { DataGrid, ColDef, ValueGetterParams, ValueFormatterParams } from '@material-ui/data-grid';
import axios from '../utils/axios';
import PersonAdd from "@material-ui/icons/PersonAdd";
import { useQuery, QueryCache, ReactQueryCacheProvider, useMutation, useQueryCache } from 'react-query'
import PersonIcon from "@material-ui/icons/Person";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { User } from '../models/User';
import { useForm } from "react-hook-form";


const queryCache = new QueryCache()

function Users() {
  function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }
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
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const columns: ColDef[] = [
    {
      field: 'fullName',
      headerName: 'Nom et Prénom',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: ValueGetterParams) =>
        `${params.getValue('firstname') || ''} ${params.getValue('lastname') || ''
        }`,
    },
    { field: 'acronym', headerName: 'Acronyme', width: 120, headerAlign: 'center', align: 'center' },
    { field: 'email', headerName: 'Email', width: 300, headerAlign: 'center', align: 'center' },
    {
      field: 'id2', headerName: 'Action', headerAlign: 'center', align: 'center', width: 120, renderCell: (params: ValueFormatterParams) => (
        <div>
          <ThemeProvider theme={Theme}>
            <IconButton color="primary">
              <DeleteIcon />
            </IconButton>
            <IconButton color="secondary">
              <EditIcon />
            </IconButton>
          </ThemeProvider>
        </div>
      )
    }
  ];

  // Queries
  const usersQuery = useQuery('getUsers', () =>
    axios.get('/api/users').then(res =>
      res.data
    )
  )

  // Cache
  const cache = useQueryCache()

  const [addUser] = useMutation(async ({ firstname, lastname, email, acronym, password }: User) => {
     const res = await axios.post('/api/users', { firstname, lastname, email, acronym, password });
    return res.data;
  }, {
    onSuccess: (data) => {
      handleClose()
      // Query Invalidations
      cache.invalidateQueries('getUsers')
    },
  })

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data: User) => {
    console.log(data)
    addUser(data)
  };

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
              <h2 id="modal-title" className="text-xl font-medium py-2">Ajouter un nouveau utilisateur</h2>
              <p id="modal-description pb-4" />
              <form onSubmit={handleSubmit(onSubmit)}>

                <div className="grid grid-flow-row gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="">
                      <TextField required label="Prénom" className="w-full" defaultValue="" name="firstname" inputRef={register({ required: true })} />
                      {errors.firstname && <span>Ce champ est obligatoire</span>}
                    </div>
                    <div className="">
                      <TextField required label="Nom" className="w-full" defaultValue="" name="lastname" inputRef={register({ required: true })} />
                      {errors.lastname && <span>Ce champ est obligatoire</span>}
                    </div>
                  </div>
                  <div className="">
                    <TextField required label="Acronyme" className="w-full" defaultValue="" name="acronym" inputRef={register({ required: true })} />
                    {errors.acronym && <span>Ce champ est obligatoire</span>}
                  </div>
                  <div className="">
                    <TextField required label="Email" type="email" className="w-full" defaultValue="" name="email" inputRef={register({ required: true })} />
                    {errors.email && <span>Ce champ est obligatoire</span>}
                  </div>
                  <div className="">
                    <TextField required label="Mot de passe" className="w-full" defaultValue="" name="password" inputRef={register({ required: true })} />
                    {errors.password && <span>Ce champ est obligatoire</span>}
                  </div>
                  {/* TODO: role  */}
                </div>
                <div className="flex flex-row mt-10">
                  <div className="flex-1"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="contained" color="secondary" onClick={handleClose}>Annuler</Button>
                    <Button variant="contained" color="primary" type="submit">
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </Modal>
          <Card className="px-4 py-10" style={{ height: '80vh' }}>
            <div className="w-full flex flex-row">
              <div className="flex-1"></div>
              <Button variant="contained" color="secondary" startIcon={<PersonAdd />} onClick={handleOpen}>
                Ajouter un utilisateur
              </Button>
            </div>
            <div className="flex items-center	ml-4">
              <PersonIcon fontSize="large" />
              <h3 className="text-3xl font-medium ml-4">Utilisateurs : </h3>
            </div>
            <CardContent className="pb-20">
              {usersQuery.isLoading && <p>Loading...</p>}
              {usersQuery.error && <p>An error has occurred: {usersQuery.error || 'Unknown'}</p>}
              {usersQuery.data && <DataGrid autoHeight rows={usersQuery.data} columns={columns} pageSize={5} />}
            </CardContent>
          </Card>
        </Container>
      </ThemeProvider>
    </ReactQueryCacheProvider>
  );
}

export default Users;

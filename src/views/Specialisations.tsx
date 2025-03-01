import { Button, Card, CardContent, Container, createMuiTheme, Modal, TextField, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { DataGrid, ColDef, ValueFormatterParams } from '@material-ui/data-grid';
import axios from '../utils/axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import Select, { OptionTypeBase } from 'react-select';
import makeAnimated from 'react-select/animated';

import { Subject } from '../models/Subject';
import { Specialisation } from '../models/Specialisation';
import { useForm, Controller } from "react-hook-form";
import { useQuery, QueryCache, ReactQueryCacheProvider, useMutation, useQueryCache } from 'react-query'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import BookIcon from '@material-ui/icons/Book';
import IconButton from '@material-ui/core/IconButton';

const queryCache = new QueryCache()


function Specialisations() {
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

  const animatedComponents = makeAnimated();

  // Cache
  const cache = useQueryCache()

  // Queries
  const subjectsQuery = useQuery('getSubjects', () =>
    axios.get('/api/subjects').then(res =>
      res.data
    )
  )
  const specialisationsQuery = useQuery('getSpecialisations', () =>
    axios.get('/api/specialisations').then(res =>
      res.data
    )
  )

  //To modify the data structure for the option field
  let options: OptionTypeBase[] = [];
  if (!subjectsQuery.isLoading && !subjectsQuery.isError) {
    subjectsQuery.data.map((sub: Subject) => {
      options.push({ value: sub.id!, label: sub.name })
    })
  }

  const [addSpecialisation] = useMutation(async ({ name, acronym, subjects }: { name: string, acronym: string, subjects: OptionTypeBase[] }) => {
    const res = await axios.post('/api/specialisations', { name, acronym, subjects: subjects.map(sub => sub.value) });
    return res.data;
  }, {
    onSuccess: (data) => {
      handleClose()
      // Query Invalidations
      cache.invalidateQueries('getSpecialisations')
    },
  })

  const [deleteSpecialisation] = useMutation(async (id: number | string) => {
    const res = await axios.delete(`/api/specialisations/${id}`);
    return res.data;
  }, {
    onSuccess: (data) => {
      // Query Invalidations
      cache.invalidateQueries('getSpecialisations')
    },
  })


  const { register, control, handleSubmit, errors } = useForm();
  const onSubmit = (data: any) => addSpecialisation(data);
  //
  const columns: ColDef[] = [
    { field: 'name', headerName: 'Option', width: 250, headerAlign: 'center', align: 'center' },
    { field: 'acronym', headerName: 'Acronyme', width: 120, headerAlign: 'center', align: 'center' },
    { field: 'subjects', headerName: 'Matières', flex: 1, valueFormatter: ({ value }) => value ? (value as Subject[]).map((subject: Subject) => subject.name).join(' | ') : "", headerAlign: 'center', align: 'center' },
    {
      field: 'id2', headerName: 'Action', headerAlign: 'center', align: 'center', width: 120, renderCell: (params: ValueFormatterParams) => (
        <div>
          <ThemeProvider theme={Theme}>
            <IconButton color="primary" onClick={() => deleteSpecialisation(params.data.id)}>
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
              <h2 id="modal-title" className="text-xl font-medium py-2">Ajouter une nouvelle option</h2>
              <p id="modal-description pb-4"></p>
              <form onSubmit={handleSubmit(onSubmit)}>

                <div className="grid grid-flow-row gap-4">
                  <div className="">
                    <TextField required label="Nom de l'option" className="w-full" defaultValue="" name="name" inputRef={register({ required: true })} />
                    {errors.name && <span>Ce champ est obligatoire</span>}
                  </div>
                  <div className="">
                    <TextField required label="Acronyme" className="w-full" defaultValue="" name="acronym" inputRef={register({ required: true })} />
                    {errors.acronym && <span>Ce champ est obligatoire</span>}
                  </div>
                  <div className="form pt-5">
                    <h4>Selectionner les matières de cette option :</h4>
                    <Controller
                      name="subjects"
                      as={Select}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      options={options}
                      control={control}
                      rules={{ required: true }}
                    />
                    {errors.subjects && <span>Ce champ est obligatoire</span>}
                  </div>
                  <div className="flex flex-row mt-10">
                    <div className="flex-1"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="contained" color="secondary" onClick={handleClose}>Annuler</Button>
                      <Button variant="contained" type="submit" color="primary">Enregistrer</Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Modal>

          <Card className="px-4 py-10" style={{ height: '80vh' }}>
            <div className="w-full flex flex-row">
              <div className="flex-1"></div>
              <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleOpen}>
                Ajouter une option
            </Button>
            </div>
            <div className="flex items-center	ml-4">
              <BookIcon fontSize="large" />
              <h3 className="text-3xl font-medium ml-4">Options Disciplinaires :</h3>
            </div>
            <CardContent className="pb-20">
              {specialisationsQuery.isLoading && <p>Loading...</p>}
              {specialisationsQuery.error && <p>An error has occurred: {specialisationsQuery.error || 'Unknown'}</p>}
              {subjectsQuery.error && <p>An error has occurred: {subjectsQuery.error || 'Unknown'}</p>}
              {specialisationsQuery.data && <DataGrid autoHeight rows={specialisationsQuery.data} columns={columns} pageSize={5} />}
            </CardContent>
          </Card>
        </Container>
      </ThemeProvider>
    </ReactQueryCacheProvider>
  );
}


export default Specialisations;

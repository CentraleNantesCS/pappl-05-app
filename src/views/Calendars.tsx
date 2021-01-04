import { Button, Card, CardContent, Container, createMuiTheme, Modal, TextField, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { DataGrid, ColDef, ValueFormatterParams } from '@material-ui/data-grid';
import axios from '../utils/axios';
import PersonAdd from "@material-ui/icons/PersonAdd";
import { useQuery, QueryCache, ReactQueryCacheProvider, useMutation, useQueryCache } from 'react-query'
import { useForm, Controller } from "react-hook-form";
import Select, { OptionTypeBase } from 'react-select';
import makeAnimated from 'react-select/animated';
import { Specialisation } from '../models/Specialisation';
import { Class } from '../models/Class';
import EventIcon from '@material-ui/icons/Event';

const queryCache = new QueryCache()

function Calendars() {
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

  const openCalendar = (id: any) => {
    // redirect to calendars/:id
    window.open(`/calendar/${id}`)
  }

  const exportCalendar = (id: any) => {
    // redirect to calendars/:id
    window.open(`${process.env.REACT_APP_API_URL}api/calendars/${id}/export`)
  }


  // Queries
  const calendarsQuery = useQuery('getCalendars', () =>
    axios.get('/api/calendars').then(res =>
      res.data
    )
  )

  const specialisationsQuery = useQuery('getSpecialisations', () =>
    axios.get('/api/specialisations').then(res =>
      res.data
    )
  )

  const classesQuery = useQuery('getClasses', () =>
    axios.get('/api/classes').then(res =>
      res.data
    )
  )

  // Cache
  const cache = useQueryCache()

  //To modify the data structure for the option field
  let optionsSpecialisation: OptionTypeBase[] = [];
  if (!specialisationsQuery.isLoading && !specialisationsQuery.isError) {
    specialisationsQuery.data.forEach((sub: Specialisation) => {
      optionsSpecialisation.push({ value: sub.id!, label: sub.name })
    })
  }


  //To modify the data structure for the option field
  let optionsPromos: OptionTypeBase[] = [];
  if (!classesQuery.isLoading && !classesQuery.isError) {
    classesQuery.data.forEach((sub: Class) => {
      optionsPromos.push({ value: sub.id!, label: `${sub.start_year} - ${sub.end_year}` })
    })
  }

  const [addCalendar] = useMutation(async ({ classe, specialisation }: { classe: OptionTypeBase, specialisation: OptionTypeBase }) => {
    console.log(classe)
    const res = await axios.post('/api/calendars', { specialisation: specialisation.value, classe: classe.value });
    return res.data;
  }, {
    onSuccess: (data) => {
      handleClose()
      // Query Invalidations
      cache.invalidateQueries('getCalendars')
    },
  })

  const animatedComponents = makeAnimated();
  const { register, control, handleSubmit, errors } = useForm();
  const onSubmit = (data: any) => addCalendar(data);

  const [deleteCalendar] = useMutation(async (id: number | string) => {
    const res = await axios.delete(`/api/calendars/${id}`);
    return res.data;
  }, {
    onSuccess: (data) => {
      // Query Invalidations
      cache.invalidateQueries('getCalendars')
    },
  })
  //

  const columns: ColDef[] = [
    { field: 'classe', headerName: 'Année scolaire', width: 200, headerAlign: 'center', align: 'center', valueFormatter: ({ value }) => `${(value as Class).start_year} - ${(value as Class).end_year}` },
    { field: 'specialisation', headerName: 'Option', width: 350, headerAlign: 'center', align: 'center', valueFormatter: ({ value }) => (value as Specialisation)?.name },
    {
      field: 'open', headerName: 'Action', width: 350, headerAlign: 'center', align: 'center',  renderCell: (params: ValueFormatterParams) => (
        <div>
          <ThemeProvider theme={Theme}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => { openCalendar(params.data.id) }}
          >
            Ouvrir
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => { exportCalendar(params.data.id) }}
          >
            Exporter
          </Button>
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => deleteCalendar(params.data.id)}
          >
            Supprimer
          </Button>
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
            <h2 id="modal-title" className="text-xl font-medium py-2">Ajouter un EDT</h2>
            <p id="modal-description pb-4">
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-flow-row gap-4">

                <div className="form pt-5">
                  <h4>Selectionner une option :</h4>
                  <Controller
                    name="specialisation"
                    as={Select}
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    options={optionsSpecialisation}
                    control={control}
                    rules={{ required: true }}
                  />
                  {errors.subjects && <span>Ce champ est obligatoire</span>}
                </div>

                <div className="form pt-5">
                  <h4>Selectionner une promo :</h4>
                  <Controller
                    name="classe"
                    as={Select}
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    options={optionsPromos}
                    control={control}
                    rules={{ required: true }}
                  />
                  {errors.subjects && <span>Ce champ est obligatoire</span>}
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
            <Button variant="contained" color="secondary" startIcon={<PersonAdd />} onClick={handleOpen}>
              Ajouter un EDT
          </Button>
          </div>
          <div className="flex items-center	ml-4">
              <EventIcon fontSize="large"/>
              <h3 className="text-3xl font-medium ml-4">Emplois du temps :</h3>
            </div>
          <CardContent className="pb-20">
            {calendarsQuery.isLoading && <p>Loading...</p>}
            {calendarsQuery.error && <p>An error has occurred: {calendarsQuery.error || 'Unknown'}</p>}
            {calendarsQuery.data && <DataGrid autoHeight rows={calendarsQuery.data} columns={columns} pageSize={5}/>}
          </CardContent>
        </Card>
      </Container>
      </ThemeProvider>
    </ReactQueryCacheProvider>
  );
}

export default Calendars;

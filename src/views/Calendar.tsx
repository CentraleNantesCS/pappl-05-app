import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import axios from '../utils/axios';
import * as STC from 'string-to-color'

import {
  AppointmentModel,
  ViewState,
  SchedulerDateTime,
  EditingState,
  IntegratedEditing,
  ChangeSet,
  SelectOption
} from '@devexpress/dx-react-scheduler';

import {
  Scheduler,
  DayView,
  Appointments,
  Resources,
  WeekView,
  MonthView,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
  AppointmentTooltip,
  AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';

import { useQuery, QueryCache, ReactQueryCacheProvider, useQueryCache, useMutation } from 'react-query'
import { Event as CalendarEvent } from '../models/Event';
import { Subject } from '../models/Subject';
import { EventType } from '../models/EventType';
import { User } from '../models/User';
import { getDate, getHours, isAfter, setHours, setMinutes } from 'date-fns'

const queryCache = new QueryCache()

interface CalendarProps {
  id: number;
}
interface SchedulerAppointementType {
  id: string
  text: string
  color: string
}

const Calendar: React.FunctionComponent<CalendarProps> = (props: CalendarProps) => {
  const [currentDate, setCurrentDate] = React.useState<SchedulerDateTime>(
    new Date()
  );

  const calendarID = props.id

  // Queries
  const calendarQuery = useQuery('getCalendar', () =>
    axios.get(`/api/calendars/${calendarID}`).then(res =>
      res.data
    )
  )

  const subjectsQuery = useQuery('getSubjects', () =>
    axios.get('/api/subjects').then(res =>
      res.data
    )
  )

  const eventTypesQuery = useQuery('getEventTypes', () =>
    axios.get('/api/eventtypes').then(res =>
      res.data
    )
  )

  const hostsQuery = useQuery('getHosts', () =>
    axios.get('/api/users').then(res =>
      res.data
    )
  )

  let subjectTypes: SchedulerAppointementType[] = [];
  if (!subjectsQuery.isLoading && !subjectsQuery.isError) {
    subjectsQuery.data.forEach((sub: Subject) => {
      subjectTypes.push({
        id: String(sub.id || -1),
        text: sub.acronym,
        color: STC.default(sub.acronym)
      })
    })
  }

  let subjects: SelectOption[] = [];
  if (!subjectsQuery.isLoading && !subjectsQuery.isError) {
    subjectsQuery.data.forEach((sub: Subject) => {
      subjects.push({
        text: `${sub.acronym}-${sub.name}`,
        id: sub.id || -1,
      })
    })
  }

  let eventTypes: SelectOption[] = [];
  if (!eventTypesQuery.isLoading && !eventTypesQuery.isError) {
    eventTypesQuery.data.forEach((e: EventType) => {
      eventTypes.push({
        text: `${e.acronym}-${e.name}`,
        id: e.id || -1,
      })
    })
  }


  const fullNameOrAcronym = (u: User) => {
    return u.acronym ? u.acronym : `${u.firstname} ${u.lastname}`
  }
  let hosts: SelectOption[] = [];
  if (!hostsQuery.isLoading && !hostsQuery.isError) {
    hostsQuery.data.forEach((e: User) => {
      hosts.push({
        text: fullNameOrAcronym(e),
        id: e.id || -1,
      })
    })
  }

  const resources = [
    {
      fieldName: 'type',
      title: 'Type',
      instances: subjectTypes,
    },
  ];
  // Cache
  const cache = useQueryCache()
  const generateTitle = (event: CalendarEvent) => {
    const items = []

    if (event.eventType?.acronym == 'JB') {
      return 'Journée banalisée'
    }

    if (event.eventType?.acronym == 'DJB') {
      return 'Demi-Journée banalisée'
    }

    if(event.eventType.acronym) items.push(event.eventType.acronym)
    if(event.subject?.acronym) items.push(event.subject.acronym)
    if (event.host) items.push(fullNameOrAcronym(event.host))
    if(event.remote) items.push('dist')
    return items.join(' - ')
  }
  const eventsToAppointements = (events: CalendarEvent[]): AppointmentModel[] => {
    return events.map((event: CalendarEvent) => {
      return {
        startDate: event.start,
        endDate: event.end,
        title: generateTitle(event),
        type: String(event.subject?.id),
        allDay: false,
        id: event.id,
        subject_id: event.subject?.id,
        event_type_id: event.eventType.id,
        user_id: event?.host?.id || null,
        remote: event.remote
      }
    })
  }

  const appointments: Array<AppointmentModel> = eventsToAppointements(calendarQuery.data?.events ?? [])

  const [addEvent] = useMutation(async ({ startDate, endDate, event_type_id, remote, subject_id, user_id }: AppointmentModel) => {
    const res = await axios.post(`/api/events`, { startDate, endDate, eventTypeId: event_type_id, remote, subjectId: subject_id, calendarId: calendarID, userId: user_id });
    return res.data;
  }, {
    onSuccess: (data) => {
      // Query Invalidations
      cache.invalidateQueries('getCalendar')
    },
  })

  const [updateEvent] = useMutation(async ({ id, startDate, endDate, event_type_id, remote, subject_id, user_id }: AppointmentModel) => {
    const res = await axios.put(`/api/events/${id}`, { startDate, endDate, eventTypeId: event_type_id, remote, subjectId: subject_id, calendarId: calendarID, userId: user_id });
    return res.data;
  }, {
    onSuccess: (data) => {
      // Query Invalidations
      cache.invalidateQueries('getCalendar')
    },
  })

  const [deleteEvent] = useMutation(async (id: number) => {
    const res = await axios.delete(`/api/events/${id}`);
    return res.data;
  }, {
    onSuccess: (data) => {
      // Query Invalidations
      cache.invalidateQueries('getCalendar')
    },
  })

  const commitChanges = async ({ added, changed, deleted }: ChangeSet) => {
    console.log(added, changed, deleted)
    if (added) {
      // Add event to DB
      addEvent(added as AppointmentModel)
    }
    if (changed) {
      //Update all the updated events
      for (let eventId of Object.keys(changed)) {
        const updatedEvent = {
          ...appointments.find((event: AppointmentModel) => event.id!.toString() === eventId.toString()),
          ...changed[eventId]
        }
        await updateEvent(updatedEvent as AppointmentModel)
      }
    }
    if (deleted !== undefined) {
      await deleteEvent(Number(deleted))
    }
  }

  const EventFormLayout = ({ onFieldChange, appointmentData, ...restProps }: AppointmentForm.BasicLayoutProps) => {
    const onSubjectChange = (nextValue: React.ReactText) => {
      onFieldChange({ subject_id: nextValue, type: String(nextValue) });
    };
    const onRemoteChange = (nextValue: any) => {
      onFieldChange({ remote: nextValue })
    }
    const onEventTypeChange = (nextValue: any) => {
      console.log(nextValue)
      const originalDate = appointmentData.startDate as Date
      let startDate
      let endDate
      switch (nextValue) {
        case 6:
          // djb
          if (getHours(originalDate) < 12) {
            startDate = setMinutes(setHours(originalDate, 8), 0)
            endDate = setMinutes(setHours(originalDate, 12), 15)
          } else {
            startDate = setMinutes(setHours(originalDate, 13), 45)
            endDate = setMinutes(setHours(originalDate, 18), 0)
          }

          onFieldChange({ event_type_id: nextValue, startDate, endDate })
          break;
        case 5:
          // jb
          startDate = setMinutes(setHours(originalDate, 8), 0)
          endDate = setMinutes(setHours(originalDate, 18), 0)


          onFieldChange({ event_type_id: nextValue, startDate, endDate })
          break;

        default:
          onFieldChange({ event_type_id: nextValue })
      }
    }
    const onHostChange = (nextValue: any) => {
      onFieldChange({ user_id: nextValue })
    }

    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}
      >
        <h4 className="text-xl font-bold mt-4 mb-2">Information sur la séance</h4>

        <AppointmentForm.Label
          text="Matière"
          type="titleLabel"
        />

        <AppointmentForm.Select
          value={appointmentData.subject_id}
          onValueChange={onSubjectChange}
          availableOptions={subjects}
          placeholder="Matière"
          type="outlinedSelect"
        />

        <AppointmentForm.Label
          text="Type Séance"
          type="titleLabel"
        />


        <AppointmentForm.Select
          value={appointmentData.event_type_id}
          onValueChange={onEventTypeChange}
          availableOptions={eventTypes}
          placeholder="Type Séance"
          type="outlinedSelect"
        />

        <AppointmentForm.Label
          text="Intervenant"
          type="titleLabel"
        />

        <AppointmentForm.Select
          value={appointmentData.host_id}
          onValueChange={onHostChange}
          availableOptions={hosts}
          placeholder="Intervenant"
          type="outlinedSelect"
        />

        <AppointmentForm.BooleanEditor
          label="Distanciel ?"
          value={appointmentData.remote}
          onValueChange={onRemoteChange}
        />
      </AppointmentForm.BasicLayout>
    );
  };

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Paper className="h-full">
        {calendarQuery.isLoading && <p>Loading...</p>}
        {calendarQuery.error && <p>An error has occurred: {calendarQuery.error || 'Unknown'}</p>}
        {calendarQuery.data &&
          <Scheduler data={appointments}>
            <ViewState
              currentDate={currentDate}
              onCurrentDateChange={setCurrentDate}
              defaultCurrentViewName="Week"
            />
            <DayView startDayHour={7} endDayHour={12} />
            <WeekView startDayHour={8} endDayHour={20} />
            <MonthView />
            <Toolbar />
            <EditingState
              onCommitChanges={commitChanges}
            />
            <IntegratedEditing />
            <ViewSwitcher />
            <DateNavigator />
            <TodayButton />
            <Appointments />
            <AppointmentTooltip showCloseButton showOpenButton />
            <AppointmentForm
              basicLayoutComponent={EventFormLayout}
            />
            <Resources data={resources} />
          </Scheduler>}
      </Paper>
    </ReactQueryCacheProvider>
  );
};

export default Calendar;

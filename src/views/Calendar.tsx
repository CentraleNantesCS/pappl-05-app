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

import { useQuery, QueryCache, ReactQueryCacheProvider, useQueryCache } from 'react-query'
import { Event as CalendarEvent } from '../models/Event';
import { Subject } from '../models/Subject';
import { EventType } from '../models/EventType';

const queryCache = new QueryCache()

interface CalendarProps {
  id: number;
}
interface SchedulerAppointementType{
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
    axios.get('/api/calendar/events/types').then(res =>
      res.data
    )
  )

  //To modify the data structure for the option field
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

  const resources = [
    {
      fieldName: 'type',
      title: 'Type',
      instances: subjectTypes,
    },
  ];
  
  
  // Cache
  const cache = useQueryCache()

  const eventsToAppointements = (events: CalendarEvent[]): AppointmentModel[] => {
    return events.map((event: CalendarEvent) => {
      return {
        startDate: event.start,
        endDate: event.end,
        title: `${event.eventType} - ${event.subject.acronym} - ${event.remote ? 'dist' :''}`,
        type: event.subject.acronym,
        allDay: false,
        id: event.id,
        subject_id: event.subject.id,
        event_type_id: event.eventType.id,
        remote: event.remote
      }
    })
  }

  const appointments: Array<AppointmentModel> = eventsToAppointements(calendarQuery.data?.events ?? [])

  const commitChanges = ({ added, changed, deleted }: ChangeSet) => {
    console.log(added, changed, deleted)
  }
  
  const EventFormLayout = ({ onFieldChange, appointmentData, ...restProps }: AppointmentForm.BasicLayoutProps) => {
    const onSubjectChange = (nextValue: React.ReactText) => {
      onFieldChange({ subject_id: nextValue, type: String(nextValue) });
    };
    const onRemoteChange =(nextValue: any) => {
      onFieldChange({remote: nextValue})
    }
    const onEventTypeChange =(nextValue: any) => {
      onFieldChange({event_type_id: nextValue})
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

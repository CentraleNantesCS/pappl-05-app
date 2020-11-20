import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  AppointmentModel,
  ViewState,
  SchedulerDateTime,
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

const appointments: Array<AppointmentModel> = [
  {
    startDate: '2020-11-20T10:00',
    endDate: '2020-11-20T11:15',
    title: 'Meeting',
    type: 'private',
  },
  {
    startDate: '2018-10-31T07:30',
    endDate: '2018-10-31T09:00',
    title: 'Go to a gym',
    type: 'work',
  },
];
const resources = [
  {
    fieldName: 'type',
    title: 'Type',
    instances: [
      { id: 'private', text: 'Private', color: '#EC407A' },
      { id: 'work', text: 'Work', color: '#7E57C2' },
    ],
  },
];

const Calendar: React.FunctionComponent = () => {
  const [currentDate, setCurrentDate] = React.useState<SchedulerDateTime>(
    '2020-11-20'
  );

  return (
    <Paper className="h-full">
      <Scheduler data={appointments}>
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={setCurrentDate}
        />
        <DayView startDayHour={7} endDayHour={12} />
        <WeekView startDayHour={10} endDayHour={19} />
        <MonthView />
        <Toolbar />
        <ViewSwitcher />
        <DateNavigator />
        <TodayButton />
        <Appointments />
        <AppointmentTooltip showCloseButton showOpenButton />
        <AppointmentForm readOnly />
        <Resources data={resources} />
      </Scheduler>
    </Paper>
  );
};

export default Calendar;

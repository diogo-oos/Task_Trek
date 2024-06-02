import { Priority } from '@/enums/EnumPriority';
import { Status } from '@/enums/EnumStatus';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import moment from 'moment';
import { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export type ListItens = {
  title: string,
  description: string,
  date: string,
  priority: number,
  status: number,
};

export interface ITaskContext {
  IMMUTABLEDATA: ListItens[],
  DATA: ListItens[],
  SETDATA: React.Dispatch<React.SetStateAction<ListItens[]>>,
  selectedDate: moment.Moment,
  setSelectedDate: React.Dispatch<React.SetStateAction<moment.Moment>>,
}

export const TaskContext = createContext<ITaskContext>({} as ITaskContext);

export default function RootLayoutTabs() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const [selectedDate, setSelectedDate] = useState(moment().endOf('day'));

  const IMMUTABLEDATA: ListItens[] = [
    {
      title: 'ateste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam suscipit aut temporibus, eaque rem iure!',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Low,
      status: Status.Todo,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Medium,
      status: Status.Done,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam suscipit aut temporibus, eaque rem iure!',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.High,
      status: Status.Todo,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Medium,
      status: Status.Todo,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Medium,
      status: Status.InProgress,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam suscipit aut temporibus, eaque rem iure!',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.High,
      status: Status.InProgress,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Low,
      status: Status.Done,
    },
  ];

  const [DATA, SETDATA] = useState<ListItens[]>([
    {
      title: 'ateste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam suscipit aut temporibus, eaque rem iure!',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Low,
      status: Status.Todo,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Medium,
      status: Status.Done,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam suscipit aut temporibus, eaque rem iure!',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.High,
      status: Status.Todo,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Medium,
      status: Status.Todo,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Medium,
      status: Status.InProgress,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam suscipit aut temporibus, eaque rem iure!',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.High,
      status: Status.InProgress,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Low,
      status: Status.Done,
    },
  ]);

  const sharedValues: ITaskContext = {
    IMMUTABLEDATA,
    DATA,
    SETDATA,
    selectedDate,
    setSelectedDate,
  };

  return (
    <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DarkTheme}>
      <TaskContext.Provider value={sharedValues}>
        <Stack>
          <Stack.Screen name="task/index" options={{ headerShown: false }} />
          <Stack.Screen name="task/components/handleTask/[taskIndex]" options={{ headerShown: false }} />
        </Stack>
      </TaskContext.Provider>
    </ThemeProvider>
  );
}

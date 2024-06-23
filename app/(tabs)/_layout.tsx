import { auth, db } from '@/services/firebaseConfig';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { collection, getDocs, query, where } from 'firebase/firestore';
import moment from 'moment';
import { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export type ListItens = {
  id: string,
  userId: string,
  title: string,
  description: string,
  date: string,
  priority: number,
  status: number,
};

export interface ITaskContext {
  immutableData: ListItens[],
  setImmutableData: React.Dispatch<React.SetStateAction<ListItens[]>>,
  data: ListItens[],
  setData: React.Dispatch<React.SetStateAction<ListItens[]>>,
  selectedDate: moment.Moment,
  setSelectedDate: React.Dispatch<React.SetStateAction<moment.Moment>>,
  loadingTasks: boolean,
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

  const [loadingTasks, setLoadingTasks] = useState(false);

  const [selectedDate, setSelectedDate] = useState(moment().endOf('day'));

  const [immutableData, setImmutableData] = useState<ListItens[]>([]);
  const [data, setData] = useState<ListItens[]>([]);

  const onComponentMount = () => {
    if (!auth.currentUser) return;
    setLoadingTasks(true);
    const dataAux: ListItens[] = [];
    getDocs(query(collection(db, "tasks"), where('userId', '==', `${auth.currentUser.uid}`))).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data().date)
        dataAux.push({
          id: doc.id,
          userId: doc.data().userId,
          title: doc.data().title,
          description: doc.data().description,
          date: doc.data().date,
          priority: doc.data().priority,
          status: doc.data().status,
        });
      });
      setImmutableData(dataAux);
      setData(dataAux.filter((task) => moment(task.date).startOf('day').isSame(moment().startOf('day'))));
      setLoadingTasks(false);
    });
  };
  useEffect(onComponentMount, []);

  const sharedValues: ITaskContext = {
    immutableData,
    setImmutableData,
    data,
    setData,
    selectedDate,
    setSelectedDate,
    loadingTasks,
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

import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { getPriority } from '@/enums/EnumPriority';
import moment from 'moment';
import 'moment/locale/pt-br';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, FlatList, ListRenderItemInfo, useColorScheme, Alert, ActivityIndicator, View } from 'react-native';
import { getStatus } from '@/enums/EnumStatus';
import { router } from 'expo-router';
import { ListItens, TaskContext } from '../_layout';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '@/services/firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';
import TasksBottomSheet from './components/bottomSheet/TasksBottomSheet';

export default function TaskList() {
  const {
    immutableData,
    setImmutableData,
    data,
    setData,
    selectedDate,
    setSelectedDate,
    loadingTasks,
  } = useContext(TaskContext);
  const colorScheme = useColorScheme();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    moment.locale('pt-br');
  }, []);

  const onChangeSelectedDate = (currentDate: moment.Moment) => {
    setSelectedDate(currentDate);
    setData(immutableData.filter((task) => moment(task.date).startOf('day').isSame(currentDate.startOf('day'))));
  };

  const handlePreviousDay = () => {
    const currentDate = selectedDate.endOf('day').subtract(1, 'day');
    onChangeSelectedDate(currentDate);
  };

  const handleNextDay = () => {
    const currentDate = selectedDate.endOf('day').add(1, 'day');
    onChangeSelectedDate(currentDate);
  };

  const handleEditItem = (taskIndex: number) => {
    router.push(`/task/components/handleTask/${taskIndex.toString()}`);
  };

  const handleDeleteItem = (taskIndex: number) => {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja excluir esta tarefa?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: () => {
            setLoading(true);
            deleteDoc(doc(db, "tasks", data[taskIndex].id)).then(() => {
              const newItems = [...data];
              newItems.splice(taskIndex, 1);
              setData(newItems);

              const newItemsAux = [...immutableData];
              newItemsAux.splice(taskIndex, 1);
              setImmutableData(newItemsAux);
              setLoading(false);
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = (item: ListRenderItemInfo<ListItens>) => {
    return (
      <ThemedView
        lightColor={Colors['light'].background}
        darkColor={Colors['dark'].background}
        style={styles.itemContainer}
      >
        <ThemedView
          lightColor={Colors['light'].background}
          darkColor={Colors['dark'].background}
          style={styles.itemContainerButton}
        >
          <Icon
            style={styles.itemButtonEdit}
            onPress={() => handleEditItem(item.index)}
            name="edit"
            size={30}
            color={colorScheme === 'light' ? Colors['dark'].icon : Colors['light'].icon}
          />
          <Icon
            onPress={() => handleDeleteItem(item.index)}
            name="trash-o"
            size={30}
            color={colorScheme === 'light' ? Colors['dark'].icon : Colors['light'].icon}
          />
        </ThemedView>

        <ThemedView
          lightColor={Colors['light'].background}
          darkColor={Colors['dark'].background}
        >
          <ThemedText
            lightColor="#3fa9ff"
            darkColor="#3fa9ff"
            type="subtitle"
          >
            {moment(item.item.date).format('DD [de] MMMM [até] HH:mm')}
          </ThemedText>

          <ThemedText
            lightColor={Colors['dark'].text}
            darkColor={Colors['light'].text}
            type="subtitle"
            style={styles.itemTitle}
          >
            {item.item.title}
          </ThemedText>

          <ThemedText
            lightColor={Colors['dark'].text}
            darkColor={Colors['light'].text}
          >
            {item.item.description}
          </ThemedText>

          <ThemedText
            lightColor={Colors['dark'].text}
            darkColor={Colors['light'].text}
          >
            {`Prioridade ${getPriority(item.item.priority)}`}
          </ThemedText>

          <ThemedText
            lightColor={Colors['dark'].text}
            darkColor={Colors['light'].text}
          >
            {getStatus(item.item.status)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  };

  return (
    <>
      <ThemedView
        style={styles.textContainer}
      >
        <ThemedText
          type='subtitle'
          style={styles.text}
        >
          Task Trek
        </ThemedText>
      </ThemedView>

      <>
        <ThemedView
          lightColor={Colors['light'].background}
          darkColor={Colors['dark'].background}
          style={styles.container}
        >
          <ThemedView
            lightColor={Colors['light'].background}
            darkColor={Colors['dark'].background}
            style={styles.dateContainer}
          >
            <ThemedButton
              lightColor={Colors['light'].background}
              darkColor={Colors['dark'].background}
              type="clear"
              onPress={handlePreviousDay}
              icon={{
                name: 'chevron-left',
                type: 'font-awesome',
                size: 15,
                color: colorScheme === 'light' ? Colors['dark'].icon : Colors['light'].icon,
              }}
            />

            <ThemedText
              lightColor={Colors['dark'].text}
              darkColor={Colors['light'].text}
              type='subtitle'
            >
              {selectedDate?.format('LL')}
            </ThemedText>

            <ThemedButton
              lightColor={Colors['light'].background}
              darkColor={Colors['dark'].background}
              type="clear"
              onPress={handleNextDay}
              icon={{
                name: 'chevron-right',
                type: 'font-awesome',
                size: 15,
                color: colorScheme === 'light' ? Colors['dark'].icon : Colors['light'].icon,
              }}
            />
          </ThemedView>

          {
            loadingTasks || loading ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color={colorScheme === 'light' ? Colors['dark'].text : Colors['light'].text} />
              </View>
            ) : (
              data.length === 0 ? (
                <ThemedView
                  lightColor={Colors['light'].background}
                  darkColor={Colors['dark'].background}
                  style={styles.emptyMessage}
                >
                  <ThemedText
                    lightColor={Colors['dark'].text}
                    darkColor={Colors['light'].text}
                    type='subtitle'
                  >
                    Nenhum item encontrado
                  </ThemedText>
                </ThemedView>
              ) : (
                <FlatList
                  data={data}
                  renderItem={(item) => renderItem(item)}
                  keyExtractor={(item, index) => index.toString()}
                />
              )
            )
          }
        </ThemedView>

        <TasksBottomSheet immutableData={immutableData} setData={setData} />
      </>
    </>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingTop: 40,
    padding: 5,
  },
  loading: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingBottom: 0,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    marginRight: 20,
  },
  itemContainerButton: {
    marginLeft: 16,
    marginRight: 5,
    marginTop: 3,
    flexDirection: 'column',
  },
  itemButtonEdit: {
    marginBottom: 3,
  },
  itemTitle: {
    marginBottom: 15,
  },
  emptyMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  }
});
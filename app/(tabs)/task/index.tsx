import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Priority, getPriority } from '@/enums/EnumPriority';
import moment from 'moment';
import 'moment/locale/pt-br';
import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ListRenderItemInfo, useColorScheme } from 'react-native';

export type ListItens = {
  title: string,
  description: string,
  date: string,
  priority: number,
};

export default function taskList() {
  const colorScheme = useColorScheme();

  const [selectedDate, setSelectedDate] = useState(moment().endOf('day'));

  useEffect(() => {
    moment.locale('pt-br');
  }, []);

  const handlePreviousDay = () => {
    const currentDate = selectedDate.endOf('day').subtract(1, 'day');
    setSelectedDate(moment(currentDate));
  };

  const handleNextDay = () => {
    const currentDate = selectedDate.endOf('day').add(1, 'day');
    setSelectedDate(moment(currentDate));
  };

  const handleEditItem = () => {
  };

  const renderItem = (item: ListRenderItemInfo<ListItens>) => {
    return (
      <ThemedView
        lightColor={Colors['light'].background}
        darkColor={Colors['dark'].background}
        style={styles.itemContainer}
      >
        <ThemedButton
          lightColor={Colors['light'].background}
          darkColor={Colors['dark'].background}
          type="clear"
          onPress={handleEditItem}
          icon={{
            name: 'edit',
            type: 'font-awesome',
            size: 30,
            color: colorScheme === 'light' ? Colors['dark'].icon : Colors['light'].icon,
          }}
        />
        <ThemedView
          lightColor={Colors['light'].background}
          darkColor={Colors['dark'].background}
        >
          <ThemedText
            lightColor="#3fa9ff"
            darkColor="#3fa9ff"
            type="subtitle"
          >
            {item.item.date}
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
        </ThemedView>
      </ThemedView>
    );
  };

  const DATA: ListItens[] = [
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam suscipit aut temporibus, eaque rem iure!',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Low,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Medium,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam suscipit aut temporibus, eaque rem iure!',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.High,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Medium,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Medium,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam suscipit aut temporibus, eaque rem iure!',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.High,
    },
    {
      title: 'teste titulo',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      date: selectedDate.format('DD MMMM'),
      priority: Priority.Low,
    },
  ];

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
            {selectedDate.format('LL')}
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

        <FlatList
          data={DATA}
          renderItem={(item) => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  text: {
    paddingTop: 40,
    padding: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  itemTitle: {
    marginBottom: 15,
  },
});
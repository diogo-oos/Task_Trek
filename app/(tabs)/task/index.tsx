import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Priority, getPriority } from '@/enums/EnumPriority';
import moment from 'moment';
import 'moment/locale/pt-br';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, FlatList, ListRenderItemInfo, useColorScheme } from 'react-native';
import { ThemedBottomSheet } from '@/components/themedBottomSheet/ThemedBottomSheet';
import { ThemedBottomSheetFilterPriority } from '@/components/themedBottomSheet/components/filter/ThemedBottomSheetFilterPriority';
import { Status, getStatus } from '@/enums/EnumStatus';
import { ThemedBottomSheetFilterStatus } from '@/components/themedBottomSheet/components/filter/ThemedBottomSheetFilterStatus';
import { Sort } from '@/enums/EnumSort';
import { router } from 'expo-router';
import { TaskContext } from '../_layout';

export type ListItens = {
  title: string,
  description: string,
  date: string,
  priority: number,
  status: number,
};
 
export default function taskList() {
  const {
    IMMUTABLEDATA,
    DATA,
    SETDATA,
    selectedDate,
    setSelectedDate,
  } = useContext(TaskContext);
  const colorScheme = useColorScheme();

  const [visibleBottomSheetFilter, setVisibleBottomSheetFilter] = useState(false);
  const [visibleBottomSheetFilterPriority, setVisibleBottomSheetFilterPriority] = useState(false);
  const [visibleBottomSheetFilterStatus, setVisibleBottomSheetFilterStatus] = useState(false);

  const [visibleBottomSheetSort, setVisibleBottomSheetSort] = useState(false);

  const [sortDate, setSortDate] = useState(Sort.Descending);

  const [sortTitle, setSortTitle] = useState(Sort.Ascending);

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

  const handleDeleteItem = () => {
  };

  const handleFilterItemByPriority = (selectIds: number[]) => {
    SETDATA(IMMUTABLEDATA.filter((item) => selectIds.includes(item.priority)));
  };

  const handleFilterItemByStatus = (selectIds: number[]) => {
    SETDATA(IMMUTABLEDATA.filter((item) => selectIds.includes(item.status)));
  };

  const handleSortItemByDate = () => {
    if (sortDate === Sort.Descending) {
      SETDATA(IMMUTABLEDATA.sort((a, b) => moment(a.date).isAfter(b.date) ? 1 : -1));
      setSortDate(Sort.Ascending);
    } else {
      SETDATA(IMMUTABLEDATA.sort((a, b) => moment(a.date).isBefore(b.date) ? 1 : -1));
      setSortDate(Sort.Descending);
    }
  };

  const handleSortItemByTitle = () => {
    if (sortTitle === Sort.Ascending) {
      SETDATA(IMMUTABLEDATA.sort((a, b) => a.title.localeCompare(b.title)));
      setSortTitle(Sort.Descending);
    } else {
      SETDATA(IMMUTABLEDATA.sort((a, b) => b.title.localeCompare(a.title)));
      setSortTitle(Sort.Ascending);
    }
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
      <ThemedBottomSheetFilterPriority
        modalProps={{}}
        isVisible={visibleBottomSheetFilterPriority}
        onBackdropPress={() => setVisibleBottomSheetFilterPriority(false)}
        onFilter={(selectIds: number[]) => handleFilterItemByPriority(selectIds)}
      />

      <ThemedBottomSheetFilterStatus
        modalProps={{}}
        isVisible={visibleBottomSheetFilterStatus}
        onBackdropPress={() => setVisibleBottomSheetFilterStatus(false)}
        onFilter={(selectIds: number[]) => handleFilterItemByStatus(selectIds)}
      />

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

      <ThemedBottomSheet
        title="Filtrar por"
        modalProps={{}}
        isVisible={visibleBottomSheetFilter}
        onBackdropPress={() => setVisibleBottomSheetFilter(false)}
        listItens={[
          {
            onPress: () => setVisibleBottomSheetFilterPriority(true),
            icon: 'sort-amount-asc',
            iconType: 'font-awesome',
            title: 'Prioridade',
          },
          {
            onPress: () => setVisibleBottomSheetFilterStatus(true),
            icon: 'tasks',
            iconType: 'font-awesome',
            title: 'Status',
          },
        ]}
      />

      <ThemedBottomSheet
        title="Ordenar por"
        modalProps={{}}
        isVisible={visibleBottomSheetSort}
        onBackdropPress={() => setVisibleBottomSheetSort(false)}
        listItens={[
          {
            onPress: () => handleSortItemByDate(),
            icon: 'calendar-o',
            iconType: 'font-awesome',
            title: sortDate === Sort.Descending ? 'Mais recentes primeiro' : 'Mais antigas primeiro',
          },
          {
            onPress: () => handleSortItemByTitle(),
            icon: sortTitle === Sort.Ascending ?  'sort-alpha-asc' : 'sort-alpha-desc',
            iconType: 'font-awesome',
            title: 'Título',
          },
        ]}
      />

      <ThemedView style={[styles.menuContainer, { borderTopColor: colorScheme === 'light' ? Colors['light'].border : Colors['dark'].border }]}>
        <ThemedView style={styles.menuItem}>
          <ThemedButton
            lightColor="#3fa9ff"
            darkColor="#3fa9ff"
            type="clear"
            onPress={() => setVisibleBottomSheetFilter(true)}
            icon={{
              name: 'filter',
              type: 'font-awesome',
              size: 30,
              color: colorScheme === 'light' ? Colors['light'].icon : Colors['dark'].icon,
            }}
          />
          <ThemedText style={styles.menuText}>Filtrar</ThemedText>
        </ThemedView>

        <ThemedView style={styles.menuItem}>
          <ThemedButton
            lightColor="#3fa9ff"
            darkColor="#3fa9ff"
            type="clear"
            onPress={() => setVisibleBottomSheetSort(true)}
            icon={{
              name: 'sort',
              type: 'font-awesome',
              size: 30,
              color: colorScheme === 'light' ? Colors['light'].icon : Colors['dark'].icon,
            }}
          />
          <ThemedText style={styles.menuText}>Ordenar</ThemedText>
        </ThemedView>

        <ThemedView style={styles.menuItem}>
          <ThemedButton
            lightColor="#3fa9ff"
            darkColor="#3fa9ff"
            type="clear"
            onPress={() => router.push('/task/components/insertTask')}
            icon={{
              name: 'plus',
              type: 'font-awesome',
              size: 30,
              color: colorScheme === 'light' ? Colors['light'].icon : Colors['dark'].icon,
            }}
          />
          <ThemedText style={styles.menuText}>Nova tarefa</ThemedText>
        </ThemedView>

        <ThemedView style={styles.menuItem}>
          <ThemedButton
            lightColor="#3fa9ff"
            darkColor="#3fa9ff"
            type="clear"
            icon={{
              name: 'reorder',
              type: 'font-awesome',
              size: 30,
              color: colorScheme === 'light' ? Colors['light'].icon : Colors['dark'].icon,
            }}
          />
          <ThemedText style={styles.menuText}>Menu</ThemedText>
        </ThemedView>
      </ThemedView>
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
  },
  itemTitle: {
    marginBottom: 15,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    borderTopWidth: 1,
  },
  menuItem: {
    alignItems: 'center',
  },
  menuText: {
    fontSize: 12,
  },
});
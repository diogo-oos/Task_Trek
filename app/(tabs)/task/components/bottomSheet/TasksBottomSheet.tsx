import { ListItens } from "@/app/(tabs)/_layout";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedBottomSheet } from "@/components/themedBottomSheet/ThemedBottomSheet";
import { ThemedBottomSheetFilterPriority } from "@/components/themedBottomSheet/components/filter/ThemedBottomSheetFilterPriority";
import { ThemedBottomSheetFilterStatus } from "@/components/themedBottomSheet/components/filter/ThemedBottomSheetFilterStatus";
import { Colors } from "@/constants/Colors";
import { Sort } from "@/enums/EnumSort";
import { auth } from "@/services/firebaseConfig";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import moment from "moment";
import { useState } from "react";
import { Alert, StyleSheet, useColorScheme } from "react-native";

interface IProps {
    immutableData: ListItens[],
    setData: React.Dispatch<React.SetStateAction<ListItens[]>>,
}

export default function TasksBottomSheet({
    immutableData,
    setData,
}: IProps) {
    const colorScheme = useColorScheme();

    const [visibleBottomSheetFilterPriority, setVisibleBottomSheetFilterPriority] = useState(false);
    const [visibleBottomSheetFilterStatus, setVisibleBottomSheetFilterStatus] = useState(false);

    const [visibleBottomSheetFilter, setVisibleBottomSheetFilter] = useState(false);
    const [visibleBottomSheetSort, setVisibleBottomSheetSort] = useState(false);

    const [sortDate, setSortDate] = useState(Sort.Descending);
    const [sortTitle, setSortTitle] = useState(Sort.Ascending);

    const handleFilterItemByPriority = (selectIds: number[]) => {
        setData(immutableData.filter((item) => selectIds.includes(item.priority)));
    };

    const handleFilterItemByStatus = (selectIds: number[]) => {
        setData(immutableData.filter((item) => selectIds.includes(item.status)));
    };

    const handleSortItemByDate = () => {
        if (sortDate === Sort.Descending) {
            setData(immutableData.sort((a, b) => moment(a.date).isAfter(b.date) ? 1 : -1));
            setSortDate(Sort.Ascending);
        } else {
            setData(immutableData.sort((a, b) => moment(a.date).isBefore(b.date) ? 1 : -1));
            setSortDate(Sort.Descending);
        }
    };

    const handleSortItemByTitle = () => {
        if (sortTitle === Sort.Ascending) {
            setData(immutableData.sort((a, b) => a.title.localeCompare(b.title)));
            setSortTitle(Sort.Descending);
        } else {
            setData(immutableData.sort((a, b) => b.title.localeCompare(a.title)));
            setSortTitle(Sort.Ascending);
        }
    };

    const handleSignOut = () => {
        signOut(auth).then(() => {
            router.replace('/');
        });
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
                        icon: sortTitle === Sort.Ascending ? 'sort-alpha-asc' : 'sort-alpha-desc',
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
                        onPress={() => router.push('/task/components/handleTask/-1')}
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
                        onPress={handleSignOut}
                        icon={{
                            name: 'sign-out',
                            type: 'font-awesome',
                            size: 30,
                            color: colorScheme === 'light' ? Colors['light'].icon : Colors['dark'].icon,
                        }}
                    />
                    <ThemedText style={styles.menuText}>Sair</ThemedText>
                </ThemedView>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
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
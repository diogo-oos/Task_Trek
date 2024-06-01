import { FlatList, ListRenderItemInfo, StyleSheet, useColorScheme } from 'react-native';

import { BottomSheet, CheckBox, type BottomSheetProps } from '@rneui/base';
import { Colors } from '@/constants/Colors';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Priority, getPriority } from '@/enums/EnumPriority';
import { useState } from 'react';

export type ListItens = {
    priority: Priority,
    checked: boolean,
};


export type ThemedBottomSheetProps = BottomSheetProps & {
    onFilter: (selectIds: number[]) => void,
};

export function ThemedBottomSheetFilterPriority({
    onFilter,
    ...rest
}: ThemedBottomSheetProps) {
    const colorScheme = useColorScheme();

    const [listItens, setListItens] = useState<ListItens[]>([
        {
            priority: Priority.Low,
            checked: true,
        },
        {
            priority: Priority.Medium,
            checked: true,
        },
        {
            priority: Priority.High,
            checked: true,
        },
    ]);

    const renderItem = (item: ListRenderItemInfo<ListItens>) => {
        return (
            <ThemedView
                style={styles.menuContainerItens}
            >
                <CheckBox
                    center
                    title={`Prioridade ${getPriority(item.item.priority)}`}
                    checked={item.item.checked}
                    onPress={() => {
                        listItens[item.item.priority].checked = !item.item.checked;
                        setListItens(listItens);
                        onFilter(listItens.filter((item) => item.checked).map((item) => item.priority));
                    }}
                    textStyle={{ color: colorScheme === 'light' ? Colors['light'].icon : Colors['dark'].icon}}
                    checkedColor={colorScheme === 'light' ? Colors['light'].icon : Colors['dark'].icon}
                    uncheckedColor={colorScheme === 'light' ? Colors['light'].icon : Colors['dark'].icon}
                    containerStyle={{ backgroundColor: '#3fa9ff'}}
                />
            </ThemedView>
        );
    };

    return (
        <BottomSheet
            {...rest}
        >
            <ThemedView style={[styles.menuContainer, { borderTopColor: colorScheme === 'light' ? Colors['light'].border : Colors['dark'].border }]}>
                <ThemedText type='title' style={styles.title}>Escolha os itens desejados</ThemedText>

                <FlatList
                    data={listItens}
                    renderItem={(item) => renderItem(item)}
                    keyExtractor={(item, index) => item.priority.toString()}
                />
            </ThemedView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        flex: 1,
        flexDirection: 'column',
        height: 300,
        borderTopWidth: 1,
    },
    title: {
        padding: 20,
    },
    menuContainerItens: {
        flexDirection: 'row',
    },
});

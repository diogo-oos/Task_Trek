import { GestureResponderEvent, StyleSheet, useColorScheme } from 'react-native';

import { BottomSheet, type BottomSheetProps } from '@rneui/base';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { ThemedButton } from '../ThemedButton';

export type ListItens = {
  onPress: (event: GestureResponderEvent) => void,
  icon: string,
  iconType: string,
  title: string,
};


export type ThemedBottomSheetProps = BottomSheetProps & {
  title: string,
  listItens: ListItens[],
};

export function ThemedBottomSheet({
  title,
  listItens,
  ...rest
}: ThemedBottomSheetProps) {
  const colorScheme = useColorScheme();

  return (
    <BottomSheet
      {...rest}
    >
      <ThemedView style={[styles.menuContainer, { borderTopColor: colorScheme === 'light' ? Colors['light'].border : Colors['dark'].border }]}>
        <ThemedText type='title' style={styles.title}>{title}</ThemedText>

        <ThemedView style={styles.menuContainerItens}>
          {
            listItens.map((item) => (
              <ThemedView style={styles.menuItem}>
                <ThemedButton
                  buttonStyle={styles.button}
                  onPress={item.onPress}
                  icon={{
                    name: item.icon,
                    type: item.iconType,
                    size: 30,
                    color: colorScheme === 'light' ? Colors['light'].icon : Colors['dark'].icon,
                  }}
                />
                <ThemedText type='defaultSemiBold'>{item.title}</ThemedText>
              </ThemedView>
            ))
          }
        </ThemedView>
      </ThemedView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'column',
    height: 230,
    borderTopWidth: 1,
  },
  title: {
    padding: 20,
    textAlign: 'center',
  },
  menuContainerItens: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  menuItem: {
    alignItems: 'center',
  },
  button: {
    height: 70,
    width: 70,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#c9c9c9',
  },
});

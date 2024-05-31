import { TextInput, type TextInputProps, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';

export type ThemedTextProps = TextInputProps & {
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
  lightColor?: string;
  darkColor?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
};

export function ThemedTextInput({
  style,
  lightBackgroundColor = Colors['light'].background,
  darkBackgroundColor = Colors['dark'].background,
  lightColor = Colors['dark'].background,
  darkColor = Colors['light'].background,
  lightBorderColor = Colors['light'].border,
  darkBorderColor = Colors['dark'].border,
  ...rest
}: ThemedTextProps) {
  const backgroundColor = useThemeColor({ light: lightBackgroundColor, dark: darkBackgroundColor }, 'background');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const borderColor = useThemeColor({ light: lightBorderColor, dark: darkBorderColor }, 'border');

  return (
    <TextInput
      style={[
        { backgroundColor },
        { color },
        { borderColor },
        style,
      ]}
      {...rest}
    />
  );
}
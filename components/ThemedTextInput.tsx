import { TextInput, type TextInputProps, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';

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
  lightBackgroundColor = '#fff',
  darkBackgroundColor = '#000',
  lightColor = '#000',
  darkColor = '#fff',
  lightBorderColor = '#c9c9c9',
  darkBorderColor = '#333333',
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
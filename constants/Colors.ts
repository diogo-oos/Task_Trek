/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#fff';
const tintColorDark = '#000';

export const Colors = {
  light: {
    text: '#fff',
    background: '#f0f0f0',
    tint: tintColorLight,
    icon: '#fff',
    tabIconDefault: '#fff',
    tabIconSelected: tintColorLight,
    border: '#c9c9c9',
  },
  dark: {
    text: '#000',
    background: '#333333',
    tint: tintColorDark,
    icon: '#000',
    tabIconDefault: '#000',
    tabIconSelected: tintColorDark,
    border: '#1e1e1e',
  },
};

import { Button, type ButtonProps } from '@rneui/themed';


import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = ButtonProps & {
    lightColor?: string;
    darkColor?: string;
    lightTextColor?: string;
    darkTextColor?: string;
};

export function ThemedButton({
    buttonStyle,
    titleStyle,
    containerStyle,
    lightColor = '#1294f2',
    darkColor = '#1294f2',
    lightTextColor = '#fff',
    darkTextColor = '#000',
    ...rest
}: ThemedTextProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightTextColor, dark: darkTextColor }, 'text');

    return (
        <Button
            buttonStyle={[
                { backgroundColor: backgroundColor },
                buttonStyle
            ]}
            titleStyle={[
                {
                    fontWeight: 'bold',
                    color: color,
                },
                titleStyle
            ]}
            containerStyle={containerStyle}
            {...rest}
        />
    );
}
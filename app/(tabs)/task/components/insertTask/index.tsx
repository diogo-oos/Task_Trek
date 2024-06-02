import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Priority, getPriority } from '@/enums/EnumPriority';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';


LocaleConfig.locales['pt-br'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ],
    dayNames: [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: "Hoje"
};

LocaleConfig.defaultLocale = 'pt-br';

export default function InsertTask() {
    const colorScheme = useColorScheme();

    const [date, setDate] = useState(moment());
    const [markedDates, setMarkedDates] = useState({});

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState(Priority.Low);

    const handleInsert = () => {
        const isValidTime = moment(time, 'HH:mm', true).isValid();
        if (isValidTime) {
            const newDateTime = moment(date.format('YYYY-MM-DD') + ' ' + time, 'YYYY-MM-DD HH:mm');
            if (newDateTime.isBefore(moment())) {
                alert('Por favor, selecione uma data a partir da data atual');
                return;
            }
            setDate(newDateTime);
        } else {
            alert('Por favor, insira um horário válido no formato HH:mm');
            return;
        }
    };

    useEffect(() => {
        moment.locale('pt-br'); // Configura o locale para português do Brasil
        updateMarkedDates(moment());
    }, []);

    const onDayPress = (day: { dateString: moment.MomentInput; }) => {
        const newSelectedDate = moment(day.dateString);
        setDate(newSelectedDate);
        updateMarkedDates(newSelectedDate);
    };

    const updateMarkedDates = (currentDate: moment.Moment) => {
        const newMarkedDates = {
            [currentDate.format('YYYY-MM-DD')]: {
                selected: true,
                marked: true,
                selectedColor: '#3fa9ff',
            },
        };
        setMarkedDates(newMarkedDates);
    };

    return (
        <ThemedView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Calendar
                        style={styles.calendar}
                        onDayPress={onDayPress}
                        markedDates={markedDates}
                        theme={{
                            backgroundColor: colorScheme === 'light' ? Colors['light'].background : Colors['dark'].background,
                            calendarBackground: colorScheme === 'light' ? Colors['light'].background : Colors['dark'].background,
                            textSectionTitleColor: colorScheme === 'light' ? Colors['dark'].text : Colors['light'].text,
                            selectedDayBackgroundColor: '#3fa9ff',
                            selectedDayTextColor: colorScheme === 'light' ? Colors['light'].background : Colors['dark'].background,
                            todayTextColor: '#3fa9ff',
                            dayTextColor: colorScheme === 'light' ? Colors['dark'].text : Colors['light'].text,
                            monthTextColor: colorScheme === 'light' ? Colors['dark'].text : Colors['light'].text,
                        }}
                        monthFormat={'MMMM yyyy'}
                        hideExtraDays={true}
                        firstDay={1}
                        renderArrow={(direction) => direction === 'left' ? (
                            <Icon name="chevron-left" size={15} color={colorScheme === 'light' ? Colors['dark'].icon : Colors['light'].icon} />                       
                        ) : (
                            <Icon name="chevron-right" size={15} color={colorScheme === 'light' ? Colors['dark'].icon : Colors['light'].icon} />                       
                        )}
                    />

                    <ThemedText style={styles.label}>Título</ThemedText>
                    <ThemedTextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <ThemedText style={styles.label}>Descrição</ThemedText>
                    <ThemedTextInput
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <ThemedText style={styles.label}>Digite um horário (HH:mm)</ThemedText>
                    <ThemedTextInput
                        style={styles.input}
                        placeholder="HH:mm"
                        value={time}
                        onChangeText={setTime}
                        keyboardType="numeric"
                    />

                    <ThemedText style={styles.label}>Prioridade</ThemedText>
                    <Picker
                        selectedValue={priority}
                        style={[styles.picker, { backgroundColor: colorScheme === 'light' ? Colors['light'].background : Colors['dark'].background }]}
                        onValueChange={(itemValue) => setPriority(itemValue)}
                    >
                        <Picker.Item label={getPriority(Priority.Low)} value={Priority.Low} />
                        <Picker.Item label={getPriority(Priority.Medium)} value={Priority.Medium} />
                        <Picker.Item label={getPriority(Priority.High)} value={Priority.High} />
                    </Picker>

                    <ThemedButton
                        title={Platform.OS === 'ios' ? 'Cadastrar' : 'CADASTRAR'}
                        onPress={handleInsert}
                        containerStyle={styles.button}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    keyboardAvoidingView: {
        zIndex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        zIndex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        zIndex: 1,
    },
    input: {
        height: 40,
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        zIndex: 1,
    },
    calendar: {
        marginTop: 90,
        marginBottom: 16,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
    },
    button: {
        zIndex: 1,
    },
});

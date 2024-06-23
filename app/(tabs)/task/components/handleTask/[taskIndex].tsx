import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Priority, getPriority } from '@/enums/EnumPriority';
import { Picker } from '@react-native-picker/picker';
import moment, { Moment } from 'moment';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TaskContext } from '@/app/(tabs)/_layout';
import { Status, getStatus } from '@/enums/EnumStatus';
import { router, useLocalSearchParams } from 'expo-router';
import { DocumentData, DocumentReference, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebaseConfig';

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

export default function HandleTask() {
    const colorScheme = useColorScheme();

    const {
        immutableData,
        setImmutableData,
        data,
        setData,
    } = useContext(TaskContext);

    const { taskIndex } = useLocalSearchParams();

    const [loading, setLoading] = useState(false);

    const [date, setDate] = useState(Number(taskIndex) !== -1 ? moment(data[Number(taskIndex)].date) : moment());
    const [markedDates, setMarkedDates] = useState({});

    const [title, setTitle] = useState(Number(taskIndex) !== -1 ? data[Number(taskIndex)].title : '');
    const [description, setDescription] = useState(Number(taskIndex) !== -1 ? data[Number(taskIndex)].description : '');

    const [time, setTime] = useState<Date | null>(Number(taskIndex) !== -1 ? moment(data[Number(taskIndex)].date).toDate() : moment().toDate());
    const [timePickerVisible, setTimePickerVisible] = useState(false);

    const [priority, setPriority] = useState(Number(taskIndex) !== -1 ? data[Number(taskIndex)].priority : Priority.Low);
    const [status, setStatus] = useState(Number(taskIndex) !== -1 ? data[Number(taskIndex)].status : Status.Todo);

    useEffect(() => {
        moment.locale('pt-br');
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

    const handleConfirmTime = (selectedTime: Date) => {
        setTime(selectedTime);
        const combined = moment(date)
            .set({
                hour: moment(selectedTime).hour(),
                minute: moment(selectedTime).minute(),
                second: 0,
                millisecond: 0
            });
        setDate(combined);
        setTimePickerVisible(false);
    };

    const updateTask = (docRef: DocumentReference<DocumentData, DocumentData>) => {
        if (!auth.currentUser) return;

        updateDoc(docRef, {
            title: title,
            description: description,
            date: moment(date).format(),
            priority: priority,
            status: status,
        }).then((docRef) => {
            if (!auth.currentUser) return;

            const taskIndexImmutableData = immutableData.findIndex((task) => task.id === data[Number(taskIndex)].id);

            if (taskIndexImmutableData !== -1) {
                immutableData[taskIndexImmutableData] = {
                    id: immutableData[taskIndexImmutableData].id,
                    userId: immutableData[taskIndexImmutableData].userId,
                    title,
                    description,
                    date: moment(date).format(),
                    priority,
                    status: status,
                }
                setImmutableData(immutableData);
            }

            data[Number(taskIndex)] = {
                id: data[Number(taskIndex)].id,
                userId: data[Number(taskIndex)].userId,
                title,
                description,
                date: moment(date).format(),
                priority,
                status: Number(taskIndex) !== -1 ? status : Status.Todo,
            };
            setData(data);

            router.replace('/task');
        }).catch(() => {
            Alert.alert('Ops...', 'Ocorreu um erro ao editar a tarefa');
        }).finally(() => {
            setLoading(false);
        });
    };

    const addTask = () => {
        if (!auth.currentUser) return;

        addDoc(collection(db, "tasks"), {
            userId: auth.currentUser.uid,
            title: title,
            description: description,
            date: moment(date).format(),
            priority: priority,
            status: Status.Todo,
        }).then((docRef) => {
            if (!auth.currentUser) return;

            setImmutableData([
                ...immutableData,
                {
                    id: docRef.id,
                    userId: auth.currentUser.uid,
                    title,
                    description,
                    date: moment(date).format(),
                    priority,
                    status: Status.Todo,
                }
            ]);
            setData([
                ...data,
                {
                    id: docRef.id,
                    userId: auth.currentUser.uid,
                    title,
                    description,
                    date: moment(date).format(),
                    priority,
                    status: Status.Todo,
                }
            ]);
            router.replace('/task');
        }).catch(() => {
            Alert.alert('Ops...', 'Ocorreu um erro ao cadastrar a tarefa');
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleTask = () => {
        if (moment(date).startOf('day').isBefore(moment().startOf('day'))) {
            Alert.alert('Data inválida', 'Por favor, selecione uma data a partir da data atual');
            return;
        }

        setLoading(true);
        if (Number(taskIndex) !== -1) {
            const docRef = doc(db, "tasks", data[Number(taskIndex)].id);
            updateTask(docRef);
        } else {
            addTask();
        }
    };

    return (
        <ThemedView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ThemedText
                    type="title"
                    style={styles.title}
                >
                    {Number(taskIndex) !== -1 ? 'Editar tarefa' : 'Cadastrar tarefa'}
                </ThemedText>

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
                        placeholder="Digite um título para sua tarefa"
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <ThemedText style={styles.label}>Descrição</ThemedText>
                    <ThemedTextInput
                        placeholder="Digite uma descrição"
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <ThemedText style={styles.label}>Digite um horário</ThemedText>
                    <DateTimePickerModal
                        isVisible={timePickerVisible}
                        mode="time"
                        onConfirm={handleConfirmTime}
                        onCancel={() => setTimePickerVisible(false)}
                    />
                    <ThemedTextInput
                        style={styles.input}
                        placeholder="Selecione um horário"
                        value={moment(time).format('HH:mm')}
                        onPress={() => setTimePickerVisible(true)}
                    />

                    <ThemedText style={styles.label}>Prioridade</ThemedText>
                    <Picker
                        itemStyle={styles.picker}
                        selectedValue={priority}
                        style={[styles.picker, { backgroundColor: colorScheme === 'light' ? Colors['light'].background : Colors['dark'].background }]}
                        onValueChange={(itemValue) => setPriority(itemValue)}
                    >
                        <Picker.Item label={getPriority(Priority.Low)} value={Priority.Low} />
                        <Picker.Item label={getPriority(Priority.Medium)} value={Priority.Medium} />
                        <Picker.Item label={getPriority(Priority.High)} value={Priority.High} />
                    </Picker>

                    {
                        Number(taskIndex) !== -1 && (
                            <>
                                <ThemedText style={styles.label}>Status</ThemedText>
                                <Picker
                                    itemStyle={styles.picker}
                                    selectedValue={status}
                                    style={[styles.picker, { backgroundColor: colorScheme === 'light' ? Colors['light'].background : Colors['dark'].background }]}
                                    onValueChange={(itemValue) => setStatus(itemValue)}
                                >
                                    <Picker.Item label={getStatus(Status.Todo)} value={Status.Todo} />
                                    <Picker.Item label={getStatus(Status.InProgress)} value={Status.InProgress} />
                                    <Picker.Item label={getStatus(Status.Done)} value={Status.Done} />
                                </Picker>
                            </>
                        )
                    }

                    <ThemedButton
                        title={Platform.OS === 'ios'
                            ? Number(taskIndex) !== -1 ? 'Editar' : 'Cadastrar'
                            : Number(taskIndex) !== -1 ? 'EDITAR' : 'CADASTRAR'}
                        onPress={handleTask}
                        containerStyle={styles.button}
                        loading={loading}
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
    title: {
        marginTop: 30,
        marginBottom: 16,
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
        marginBottom: 16,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
    },
    button: {
        zIndex: 1,
        marginBottom: 100,
    },
});

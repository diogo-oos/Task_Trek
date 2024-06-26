import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";

export default function Register() {
  const colorScheme = useColorScheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [messageEmailAlreadyInUse, setMessageEmailAlreadyInUse] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setMessageEmailAlreadyInUse(false);
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
          displayName: name,
        }).then(() => {
          router.replace('/task');
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        if (errorCode === 'auth/email-already-in-use') {
          setMessageEmailAlreadyInUse(true);
        }
        Alert.alert('Ops...', 'Ocorreu um erro ao cadastrar o usuário. Por favor, verifique o e-mail e/ou a senha');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ThemedView style={styles.container}>
      {
        loading ? (
          <ThemedView style={styles.loading}>
            <ActivityIndicator size="large" color={colorScheme === 'light' ? Colors['light'].text : Colors['dark'].text} />
          </ThemedView>
        ) : (
          <>
            <KeyboardAvoidingView
              style={styles.keyboardAvoidingView}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <ThemedText
                type="title"
                style={styles.title}
              >
                Task Trek
              </ThemedText>

              <ThemedText
                type="title"
                style={styles.subTitle}
              >
                Cadastro
              </ThemedText>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <ThemedText style={styles.label}>Nome</ThemedText>
                <ThemedTextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Digite o seu nome"
                />

                <ThemedText style={styles.label}>
                  Email 
                  {
                    messageEmailAlreadyInUse && <ThemedText style={[styles.label, styles.labelError]}>: Esse e-mail já está em uso. Por favor, digite outro e-mail</ThemedText>
                  }
                </ThemedText>
                <ThemedTextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholder="Digite um e-mail válido"
                />

                <ThemedText style={styles.label}>Senha</ThemedText>
                <ThemedTextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Digite a sua senha. (deve ter no mínimo 6 caracteres)"
                />

                <ThemedText style={styles.label}>Confirmar Senha</ThemedText>
                <ThemedTextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Digite a sua senha novamente"
                />

                <ThemedButton
                  title={Platform.OS === 'ios' ? 'Cadastrar' : 'CADASTRAR'}
                  onPress={handleRegister}
                  containerStyle={styles.button}
                />

                <Link
                  href="/login"
                >
                  <ThemedText
                    type="link"
                  >
                    Já tem uma conta? Vá para a tela de login
                  </ThemedText>
                </Link>
              </ScrollView>
            </KeyboardAvoidingView>

            <ImageBackground
              source={colorScheme === 'light' ? require('../../assets/images/calendar-background-image-light.png') : require('../../assets/images/calendar-background-image-dark.png')}
              style={styles.backgroundImage}
              imageStyle={styles.backgroundImageStyle}
            />
          </>
        )
      }
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loading: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    zIndex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    marginTop: 80,
    fontSize: 64,
    lineHeight: 64,
  },
  subTitle: {
    marginBottom: 50,
    fontSize: 42,
    lineHeight: 42,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    zIndex: 1,
  },
  labelError: {
    color: 'red',
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  button: {
    zIndex: 1,
  },
  backgroundImage: {
    position: 'static',
    bottom: 200,
    left: 30,
    right: 50,
    height: 350,
    width: 350,
  },
  backgroundImageStyle: {
    transform: [{ rotate: '-30deg' }],
  },
});

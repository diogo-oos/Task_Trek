import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
            Login
          </ThemedText>

          <ThemedText style={styles.label}>Email</ThemedText>
          <ThemedTextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <ThemedText style={styles.label}>Senha</ThemedText>
          <ThemedTextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <ThemedButton
            title="Cadastrar"
            onPress={handleLogin}
            containerStyle={styles.button}
          />

          <Link
            href="/register"
          >
            <ThemedText
              type="link"
            >
              Não tem uma conta? Cadastre-se
            </ThemedText>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>

      <ImageBackground
        source={require('../assets/images/calendar-background-image.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      />
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
    bottom: 25,
    left: 30,
    right: 50,
    height: 350,
    width: 350,
  },
  backgroundImageStyle: {
    transform: [{ rotate: '-30deg' }],
  },
});

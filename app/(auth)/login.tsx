import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/auth-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setIsLoading(true);
      clearError();

      await login({ email, password });

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      Alert.alert('Error de autenticación', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo_toto.png')}
              style={styles.logoImage}
              resizeMode="contain"
              accessible
              accessibilityLabel="Logo Toto"
            />
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>

          {/* Email */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Link href="/(auth)/forgot-password" asChild>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </Link>
          </TouchableOpacity>

          {/* Login */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Text>
            {!isLoading && <ArrowRight size={20} color="white" />}
          </TouchableOpacity>

          {/* Register */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Regístrate aquí</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFEB',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'flex-start', 
    paddingHorizontal: SCREEN_WIDTH * 0.05, // 5% del ancho de pantalla
    paddingVertical: 24,
    width: '100%',
  },
  header: { alignItems: 'center', marginBottom: SCREEN_WIDTH < 340 ? 24 : 40 },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  logoImage: {
    width: Math.min(SCREEN_WIDTH * 0.72, 300),
    height: Math.min(SCREEN_WIDTH * 0.30, 140),
    resizeMode: 'contain',
  },

  title: { fontSize: 32, fontWeight: '700', color: '#1F2937', marginBottom: 8, fontFamily: 'PlayfairDisplay-Bold' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 },

  formContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: Math.max(SCREEN_WIDTH * 0.05, 12), // Mínimo 12px, 5% del ancho
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formTitle: { fontSize: 24, fontWeight: '700', color: '#1F2937', marginBottom: 24, textAlign: 'center', fontFamily: 'PlayfairDisplay-Bold' },

  inputContainer: { marginBottom: 16 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: Math.max(SCREEN_WIDTH * 0.03, 10), // Mínimo 10px, máximo 3% del ancho
    paddingVertical: SCREEN_WIDTH < 340 ? 10 : 14,
    minHeight: SCREEN_WIDTH < 340 ? 44 : 50,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#1F2937' },
  eyeIcon: { padding: 4 },

  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { fontSize: 14, color: '#6B8E23', fontWeight: '600' },

  loginButton: {
    backgroundColor: '#6B8E23',
    borderRadius: 12,
    minHeight: SCREEN_WIDTH < 340 ? 44 : 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: SCREEN_WIDTH < 340 ? 10 : 12,
    gap: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },

  registerContainer: {
    width: '100%',
    flexDirection: SCREEN_WIDTH < 340 ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  registerText: {
    fontSize: SCREEN_WIDTH < 340 ? 13 : 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  registerLink: {
    fontSize: SCREEN_WIDTH < 340 ? 13 : 14,
    color: '#6B8E23',
    fontWeight: '600',
    textAlign: 'center',
  },
});

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
  Image
} from 'react-native';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  Heart,
  MapPin,
  Calendar
} from 'lucide-react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TERMS_ACCEPTED: '@toto_terms_accepted',
};

export default function RegisterScreen() {
  const { register, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthdate: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleRegister = async () => {
    const { name, email, phone, address, birthdate, password, confirmPassword } = formData;

    if (!name || !email || !phone || !address || !birthdate || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones para continuar');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!validateBirthdate(birthdate)) {
      Alert.alert('Error', 'La fecha de nacimiento no es válida. Usa el formato DD/MM/AAAA y verifica que seas mayor de 18 años.');
      return;
    }

    try {
      setIsLoading(true);
      clearError();

      await register({
        name,
        email,
        phone,
        address,
        birthdate,
        password,
        role: 'CAREGIVER',
      });

      // Guardar que aceptó los términos
      await AsyncStorage.setItem(STORAGE_KEYS.TERMS_ACCEPTED, 'true');

      // Redirigir a la app principal
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error?.message || 'Error al registrarse. Intenta nuevamente.';

      // Show field errors if available
      if (error?.fieldErrors) {
        const fieldErrors = Object.entries(error.fieldErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n');
        Alert.alert('Error de validación', fieldErrors);
      } else {
        Alert.alert('Error de registro', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatBirthdate = (text: string) => {
    // Eliminar todo lo que no sea número
    const numbers = text.replace(/[^\d]/g, '');
    
    // Limitar a 8 dígitos
    const limited = numbers.slice(0, 8);
    
    // Aplicar formato DD/MM/AAAA
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 4) {
      return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    } else {
      return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
    }
  };

  const handleBirthdateChange = (text: string) => {
    const formatted = formatBirthdate(text);
    updateFormData('birthdate', formatted);
  };

  const validateBirthdate = (dateString: string): boolean => {
    // Verificar formato DD/MM/AAAA
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);
    
    if (!match) return false;
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Verificar rangos básicos
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Verificar año razonable (mayor de 18 años y menor de 120 años)
    const currentYear = new Date().getFullYear();
    if (year < currentYear - 120 || year > currentYear - 18) return false;
    
    // Verificar días por mes
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Año bisiesto
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (isLeapYear) daysInMonth[1] = 29;
    
    if (day > daysInMonth[month - 1]) return false;
    
    return true;
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>
            Únete a Toto y mantente conectado
          </Text>
        </View>

        {/* Register Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Registro</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Phone size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Número de teléfono"
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Dirección"
                value={formData.address}
                onChangeText={(text) => updateFormData('address', text)}
                autoCapitalize="words"
                autoComplete="street-address"
              />
            </View>
          </View>

          {/* Birthdate Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Calendar size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Fecha de nacimiento (DD/MM/AAAA)"
                value={formData.birthdate}
                onChangeText={handleBirthdateChange}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms and Conditions Checkbox */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
              {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>Acepto los </Text>
              <Link href="/terms-and-conditions" asChild>
                <TouchableOpacity>
                  <Text style={styles.termsLink}>términos y condiciones</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, (isLoading || !termsAccepted) && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading || !termsAccepted}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Text>
            {!isLoading && <ArrowRight size={20} color="white" />}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Inicia sesión aquí</Text>
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
    backgroundColor: '#F2EFEB', // Color beige
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6B8E23',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6B8E23',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsTextContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  termsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  termsLink: {
    fontSize: 14,
    color: '#6B8E23',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#6B8E23',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#6B8E23',
    fontWeight: '600',
  },
});
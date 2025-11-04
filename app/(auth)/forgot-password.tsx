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
  Linking,
  Clipboard,
} from 'react-native';
import { Mail, ArrowLeft, Send, Heart, CircleCheck as CheckCircle, Copy } from 'lucide-react-native';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { apiClient } from '../../api/client';

const SUPPORT_PHONE = '+5491159753115';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const navigateToLogin = () => {
    try {
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleContactSupport = () => {
    const url = `whatsapp://send?phone=${SUPPORT_PHONE}&text=${encodeURIComponent('Hola, necesito ayuda con la recuperación de mi contraseña.')}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            'WhatsApp no disponible',
            'Por favor instala WhatsApp para contactar con soporte.'
          );
        }
      })
      .catch((err) => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Error', 'No se pudo abrir WhatsApp');
      });
  };

  const handleCallSupport = () => {
    const url = `tel:${SUPPORT_PHONE}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            'Error',
            'No se pudo abrir el teléfono'
          );
        }
      })
      .catch((err) => {
        console.error('Error opening phone:', err);
        Alert.alert('Error', 'No se pudo abrir el teléfono');
      });
  };

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSendReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.forgotPassword(email);
      setResetToken(response.token);
      setEmailSent(true);
      Alert.alert(
        'Token Generado', 
        `Token de recuperación: ${response.token}`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      Alert.alert(
        'Error', 
        error.message || 'No se pudo procesar tu solicitud. Verifica que el email esté registrado.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setResetToken('');
    handleSendReset();
  };

  const handleCopyToken = async () => {
    try {
      await Clipboard.setString(resetToken);
      Alert.alert('¡Copiado!', 'El token se ha copiado al portapapeles');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'No se pudo copiar el token');
    }
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <CheckCircle size={60} color="#10B981" />
            </View>

            <Text style={styles.successTitle}>¡Token Generado!</Text>
            <Text style={styles.successMessage}>
              Se ha generado un token de recuperación para:
            </Text>
            <Text style={styles.emailText}>{email}</Text>

            <View style={styles.tokenContainer}>
              <Text style={styles.tokenLabel}>Token de recuperación:</Text>
              <TouchableOpacity 
                style={styles.tokenTextContainer}
                onPress={handleCopyToken}
                activeOpacity={0.7}
              >
                <Text style={styles.tokenText}>{resetToken}</Text>
                <Copy size={20} color="#6B8E23" style={styles.copyIcon} />
              </TouchableOpacity>
              <Text style={styles.tokenNote}>
                ✨ Toca el token para copiarlo al portapapeles
              </Text>
            </View>

            <Text style={styles.instructionText}>
              Usa este token en la siguiente pantalla para restablecer tu contraseña.
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push('/(auth)/reset-password' as any)}
            >
              <Text style={styles.continueButtonText}>Continuar al reseteo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendEmail}
            >
              <Send size={20} color="#6B8E23" />
              <Text style={styles.resendButtonText}>Reenviar correo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={navigateToLogin}
            >
              <Text style={styles.backToLoginText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#6B8E23" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo_toto.png')}
              style={styles.logoImage}
              resizeMode="contain"
              accessible
              accessibilityLabel="Logo Toto"
            />
          </View>
          <Text style={styles.title}>Restablece tu contraseña</Text>
          <Text style={styles.subtitle}>
            Introduce tu correo electrónico y te enviaremos un enlace para restablecerla.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Solicitar restablecimiento</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <View style={styles.inputWrapper}>
              <Mail size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
              />
            </View>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.buttonDisabled]}
            onPress={handleSendReset}
            disabled={isLoading}
          >
            <Send size={20} color="white" />
            <Text style={styles.sendButtonText}>
              {isLoading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
            </Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Recordaste tu contraseña? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Inicia sesión</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>¿Necesitas ayuda?</Text>
          <Text style={styles.helpText}>
            Si tienes problemas para recuperar tu cuenta, puedes contactar
            a nuestro equipo de soporte técnico.
          </Text>
          <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
            <Text style={styles.supportButtonText}>Chat en Vivo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton} onPress={handleCallSupport}>
            <Text style={styles.callButtonText}>Llamar al Soporte</Text>
          </TouchableOpacity>
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
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
  sendButton: {
    backgroundColor: '#6B8E23',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  helpContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  supportButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  supportButtonText: {
    fontSize: 14,
    color: '#6B8E23',
    fontWeight: '600',
    textAlign: 'center',
  },
  callButton: {
    backgroundColor: '#6B8E23',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  callButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B8E23',
    marginBottom: 24,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6B8E23',
    marginBottom: 16,
    gap: 8,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B8E23',
  },
  backToLoginButton: {
    paddingVertical: 12,
  },
  backToLoginText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  tokenContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  tokenTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6B8E23',
    marginBottom: 8,
    gap: 8,
  },
  tokenText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#6B8E23',
  },
  copyIcon: {
    marginLeft: 8,
  },
  tokenNote: {
    fontSize: 12,
    color: '#6B8E23',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#6B8E23',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
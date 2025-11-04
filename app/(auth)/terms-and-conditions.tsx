import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const BRAND = '#6B8E23';

export default function TermsAndConditionsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={BRAND} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Términos y Condiciones</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.lastUpdated}>Última actualización: 30/09/2025</Text>

                    <Text style={styles.mainTitle}>Términos y Condiciones de Uso (TyC)</Text>

                    <Text style={styles.sectionTitle}>Objeto del servicio</Text>
                    <Text style={styles.paragraph}>
                        Toto es una aplicación de acompañamiento gerontológico destinada a personas mayores y sus familiares/cuidadores.
                    </Text>
                    <Text style={styles.paragraph}>
                        Brinda funcionalidades de recordatorios, asistencia por voz, entretenimiento, comunicación y detección de emergencias (caídas y pedidos de auxilio).
                    </Text>
                    <Text style={styles.paragraph}>
                        No constituye un servicio médico ni reemplaza la atención profesional de salud.
                    </Text>

                    <Text style={styles.sectionTitle}>Condiciones de uso</Text>
                    <Text style={styles.paragraph}>
                        El usuario se compromete a usar la aplicación únicamente con fines personales y familiares.
                    </Text>
                    <Text style={styles.paragraph}>
                        Queda prohibido el uso fraudulento, ilegal o contrario a la buena fe.
                    </Text>
                    <Text style={styles.paragraph}>
                        Los familiares/cuidadores deben garantizar que cuentan con el consentimiento informado de la persona mayor registrada.
                    </Text>

                    <Text style={styles.sectionTitle}>Limitaciones y descargo de responsabilidad</Text>
                    <Text style={styles.paragraph}>
                        Toto no garantiza la detección del 100% de caídas o emergencias, ya que depende de factores técnicos (micrófono, ruido ambiental, conectividad, etc.).
                    </Text>
                    <Text style={styles.paragraph}>
                        La aplicación no asume responsabilidad por daños derivados de fallos técnicos, errores de reconocimiento de voz o interrupciones de servicio.
                    </Text>
                    <Text style={styles.paragraph}>
                        Toto no reemplaza la asistencia médica de emergencia ni servicios profesionales de salud.
                    </Text>

                    <Text style={styles.sectionTitle}>Registro y autenticación</Text>
                    <Text style={styles.paragraph}>
                        El registro de usuarios se realiza mediante Firebase Authentication, que gestiona las credenciales y contraseñas de manera segura.
                    </Text>
                    <Text style={styles.paragraph}>
                        Los cuidadores deben registrar información veraz y mantenerla actualizada.
                    </Text>

                    <Text style={styles.sectionTitle}>Propiedad intelectual</Text>
                    <Text style={styles.paragraph}>
                        Los desarrolladores conservan los derechos sobre el software, diseño, marcas y contenidos de Toto.
                    </Text>
                    <Text style={styles.paragraph}>
                        El usuario obtiene una licencia limitada, no exclusiva y revocable para usar la aplicación.
                    </Text>

                    <Text style={styles.sectionTitle}>Modificaciones</Text>
                    <Text style={styles.paragraph}>
                        Toto se reserva el derecho de modificar funcionalidades, TyC y condiciones del servicio, notificando a los usuarios.
                    </Text>

                    <Text style={styles.sectionTitle}>Jurisdicción</Text>
                    <Text style={styles.paragraph}>
                        Este acuerdo se rige por las leyes de Argentina. Cualquier disputa será resuelta en los tribunales competentes de la Ciudad Autónoma de Buenos Aires.
                    </Text>

                    <Text style={styles.sectionTitle}>Contacto</Text>
                    <Text style={styles.paragraph}>
                        Para consultas o reclamos sobre estos TyC, puedes contactarnos a: <Text style={styles.bold}>soporte@toto-app.com</Text>
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'PlayfairDisplay-Bold',
        color: '#1F2937',
    },
    placeholder: {
        width: 44,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    lastUpdated: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: BRAND,
        marginTop: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: BRAND,
        marginTop: 16,
        marginBottom: 12,
    },
    bold: {
        fontWeight: '600',
        color: '#374151',
    },
});
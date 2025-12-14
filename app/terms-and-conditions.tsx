import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const BRAND = '#6B8E23';

export default function TermsAndConditionsScreen() {
  const router = useRouter();

  const navigateBack = () => {
    try {
      router.back();
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={navigateBack}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Última actualización: 30/09/2025</Text>

          <Text style={styles.mainTitle}>Términos y Condiciones de Uso (TyC)</Text>

          <Text style={styles.sectionTitle}>Ámbito de aplicación y legislación vigente</Text>
          <Text style={styles.paragraph}>
            Estos Términos y Condiciones regulan el uso de la aplicación Toto (en adelante, la
            “Aplicación”), destinada a personas mayores y sus familiares/cuidadores, desarrollada en el
            marco de la República Argentina. El uso de la Aplicación implica la aceptación expresa de
            estos TyC y de la Política de Privacidad, conforme a la Ley N.º 25.326 de Protección de los
            Datos Personales, la Ley N.º 27.360 que aprueba la Convención Interamericana sobre la
            Protección de los Derechos Humanos de las Personas Mayores y demás normativa argentina
            aplicable.
          </Text>

          <Text style={styles.sectionTitle}>Objeto del servicio</Text>
          <Text style={styles.paragraph}>
            Toto es una herramienta de acompañamiento gerontológico destinada a personas mayores
            autoválidas y a su red de apoyo (familiares y cuidadores).
          </Text>
          <Text style={styles.paragraph}>
            La Aplicación brinda funcionalidades de recordatorios, asistencia conversacional por voz,
            entretenimiento, comunicación con la red de apoyo y detección de posibles emergencias
            (como caídas o pedidos de auxilio) mediante procesamiento de audio.
          </Text>
          <Text style={styles.paragraph}>
            Toto no constituye un servicio médico, de telemedicina ni de urgencias, y no reemplaza en
            ningún caso la atención profesional de salud ni los servicios de emergencia disponibles en
            cada jurisdicción.
          </Text>

          <Text style={styles.sectionTitle}>Enfoque en derechos de las personas mayores</Text>
          <Text style={styles.paragraph}>
            El diseño y la implementación de Toto se inspiran en los principios de autonomía,
            dignidad, inclusión social, envejecimiento activo y acceso a la información reconocidos por
            la Convención Interamericana sobre la Protección de los Derechos Humanos de las Personas
            Mayores (Ley N.º 27.360).
          </Text>
          <Text style={styles.paragraph}>
            La Aplicación busca favorecer la independencia cotidiana de las personas mayores mediante
            recordatorios, canales de comunicación accesibles y mecanismos preventivos, sin promover
            prácticas invasivas ni de control desproporcionado sobre su vida diaria.
          </Text>

          <Text style={styles.sectionTitle}>Condiciones de uso</Text>
          <Text style={styles.paragraph}>
            El usuario se compromete a utilizar la Aplicación únicamente con fines personales y
            familiares, de manera lícita y conforme a la buena fe.
          </Text>
          <Text style={styles.paragraph}>
            Queda prohibido cualquier uso fraudulento, ilegal, discriminatorio o contrario a los
            derechos humanos de las personas mayores.
          </Text>
          <Text style={styles.paragraph}>
            Los familiares y cuidadores que registren a una persona mayor declaran y garantizan que
            cuentan con su consentimiento informado, libre y expreso para el uso de la Aplicación y el
            tratamiento de sus datos personales, de acuerdo con la Ley N.º 25.326.
          </Text>

          <Text style={styles.sectionTitle}>Limitaciones y descargo de responsabilidad</Text>
          <Text style={styles.paragraph}>
            Toto no garantiza la detección del 100% de caídas, emergencias o situaciones de riesgo, ya
            que la funcionalidad depende de factores técnicos tales como el correcto funcionamiento del
            micrófono del dispositivo, las condiciones del entorno, la conectividad, la configuración
            del usuario y la disponibilidad de los servicios de terceros involucrados.
          </Text>
          <Text style={styles.paragraph}>
            La Aplicación no asume responsabilidad por daños directos o indirectos derivados de fallos
            técnicos, errores de reconocimiento de voz, interrupciones de servicio, pérdida de
            conectividad, uso indebido de la Aplicación o decisiones tomadas por los usuarios en base a
            la información provista.
          </Text>
          <Text style={styles.paragraph}>
            Ante cualquier situación de emergencia, los usuarios y sus cuidadores deben contactar de
            inmediato a los servicios de salud o de emergencia correspondientes. Toto es un complemento
            de acompañamiento y no un sustituto de dichos servicios.
          </Text>

          <Text style={styles.sectionTitle}>Registro y autenticación</Text>
          <Text style={styles.paragraph}>
            El registro de usuarios se realiza mediante una cuenta creada en la propia Aplicación,
            utilizando correo electrónico y contraseña u otros medios de acceso que se habiliten en
            el futuro.
          </Text>
          <Text style={styles.paragraph}>
            Las credenciales se almacenan y protegen en los servidores del backend de Toto mediante
            técnicas de seguridad razonables (por ejemplo, contraseñas encriptadas o hash y controles
            de acceso), y nunca se guardan en texto plano.
          </Text>
          <Text style={styles.paragraph}>
            El usuario es responsable de mantener la confidencialidad de sus datos de acceso y de
            notificar de inmediato cualquier uso no autorizado de su cuenta.
          </Text>
          <Text style={styles.paragraph}>
            Los familiares y cuidadores se comprometen a registrar información veraz, completa y
            actualizada sobre la persona mayor y sobre su propia identidad.
          </Text>

          <Text style={styles.sectionTitle}>Propiedad intelectual</Text>
          <Text style={styles.paragraph}>
            Los desarrolladores de Toto conservan todos los derechos de propiedad intelectual sobre el
            software, el diseño, las interfaces, las marcas, los contenidos y la documentación
            asociados a la Aplicación.
          </Text>
          <Text style={styles.paragraph}>
            El usuario obtiene una licencia limitada, personal, no exclusiva, intransferible y
            revocable para utilizar la Aplicación conforme a estos TyC. Queda prohibida la ingeniería
            inversa, copia, modificación, distribución o explotación comercial no autorizada de la
            Aplicación o de sus componentes.
          </Text>

          <Text style={styles.sectionTitle}>Servicios de terceros</Text>
          <Text style={styles.paragraph}>
            La Aplicación integra servicios y APIs de terceros (como OpenAI, WhatsApp Business y
            Spotify), los cuales se utilizan bajo sus respectivas licencias y condiciones de uso
            establecidas por cada proveedor.
          </Text>
          <Text style={styles.paragraph}>
            El uso de estos servicios puede implicar el envío de determinados datos (por ejemplo,
            fragmentos de texto o audio) a los servidores de dichos proveedores para procesar
            solicitudes, siempre respetando los principios de minimización y finalidad.
          </Text>
          <Text style={styles.paragraph}>
            Cada proveedor aplica sus propias políticas de privacidad y términos de servicio, que el
            usuario declara conocer y aceptar al utilizar las funcionalidades asociadas.
          </Text>

          <Text style={styles.sectionTitle}>Modificaciones</Text>
          <Text style={styles.paragraph}>
            Toto se reserva el derecho de actualizar o modificar en cualquier momento las
            funcionalidades de la Aplicación, los presentes TyC y la Política de Privacidad. Se
            procurará notificar a los usuarios cuando se produzcan cambios relevantes. El uso
            continuado de la Aplicación tras dichas modificaciones implica su aceptación.
          </Text>

          <Text style={styles.sectionTitle}>Jurisdicción aplicable</Text>
          <Text style={styles.paragraph}>
            Para toda controversia relacionada con la interpretación o aplicación de estos TyC será
            de aplicación la legislación de la República Argentina, sin perjuicio de las normas de
            orden público que pudieran corresponder.
          </Text>

          {/* POLÍTICA DE PRIVACIDAD */}

          <Text style={styles.mainTitle}>Política de Privacidad</Text>

          <Text style={styles.sectionTitle}>Responsable del tratamiento y consentimiento</Text>
          <Text style={styles.paragraph}>
            El tratamiento de los datos personales recabados a través de la Aplicación se realiza en
            el marco de la Ley N.º 25.326 de Protección de los Datos Personales. El responsable del
            tratamiento es el equipo desarrollador del proyecto Toto (en adelante, el “Responsable”).
          </Text>
          <Text style={styles.paragraph}>
            Al registrarse y utilizar la Aplicación, el usuario (persona mayor y/o cuidador) otorga su
            consentimiento informado, libre y expreso para el tratamiento de sus datos personales con
            las finalidades descriptas en esta Política de Privacidad.
          </Text>

          <Text style={styles.sectionTitle}>Datos recopilados</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Datos de registro:</Text> nombre, edad aproximada o rango etario,
            relaciones de parentesco, contactos de confianza y credenciales de acceso.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Datos de uso:</Text> recordatorios configurados, mensajes
            enviados y recibidos, historial de alertas, interacciones conversacionales y preferencias
            de configuración.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Datos técnicos:</Text> información del dispositivo, logs de
            actividad, métricas de rendimiento, eventos de error y telemetría mínima necesaria para el
            mantenimiento y la mejora del servicio.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Audio procesado:</Text> fragmentos de voz y sonidos
            ambientales utilizados para la detección de caídas, pedidos de auxilio y comandos de voz.
            El procesamiento se realiza principalmente en el dispositivo, y cuando corresponde se
            envían fragmentos a servicios de reconocimiento de voz de terceros (por ejemplo, OpenAI)
            exclusivamente para convertir audio en texto y devolver respuestas conversacionales.
          </Text>

          <Text style={styles.sectionTitle}>Finalidades del tratamiento</Text>
          <Text style={styles.paragraph}>
            Brindar las funcionalidades centrales de la Aplicación: recordatorios, comunicación entre
            la persona mayor y su red de apoyo, asistencia conversacional y gestión de alertas.
          </Text>
          <Text style={styles.paragraph}>
            Mejorar la experiencia de uso, monitorear el correcto funcionamiento del sistema, detectar
            fallos y realizar ajustes técnicos y de usabilidad.
          </Text>
          <Text style={styles.paragraph}>
            Cumplir con las obligaciones legales y regulatorias aplicables, así como responder a
            requerimientos fundados de autoridades competentes.
          </Text>
          <Text style={styles.paragraph}>
            Los datos no se utilizan con fines de publicidad invasiva, ni se venden ni ceden a
            terceros con fines comerciales sin el consentimiento expreso del titular.
          </Text>

          <Text style={styles.sectionTitle}>Base legal y principios de tratamiento</Text>
          <Text style={styles.paragraph}>
            El tratamiento se sustenta principalmente en el consentimiento del titular de los datos y,
            en su caso, en el interés legítimo de familiares y cuidadores para brindar acompañamiento
            y apoyo a la persona mayor, siempre respetando los principios de finalidad, calidad,
            proporcionalidad, seguridad y confidencialidad previstos por la Ley N.º 25.326.
          </Text>

          <Text style={styles.sectionTitle}>Almacenamiento, seguridad y transferencias</Text>
          <Text style={styles.paragraph}>
            Los datos se almacenan en una base de datos PostgreSQL (Railway) y en servicios asociados,
            bajo medidas razonables de seguridad destinadas a prevenir accesos no autorizados, pérdidas
            o usos indebidos.
          </Text>
          <Text style={styles.paragraph}>
            Las credenciales de acceso se almacenan de forma protegida (por ejemplo, mediante técnicas
            de cifrado o hash) y nunca se guardan en texto plano. Las comunicaciones entre la Aplicación
            y el backend se realizan mediante protocolos seguros (como HTTPS).
          </Text>
          <Text style={styles.paragraph}>
            Los servidores utilizados por la Aplicación y por los proveedores de servicios de terceros
            pueden estar ubicados dentro o fuera de la República Argentina. En todos los casos se
            procurará que el tratamiento respete estándares adecuados de protección de datos.
          </Text>


          <Text style={styles.sectionTitle}>Acceso, rectificación y supresión de datos</Text>
          <Text style={styles.paragraph}>
            La persona mayor y sus familiares/cuidadores pueden solicitar en cualquier momento el
            acceso, la rectificación, actualización o supresión de sus datos personales, de acuerdo con
            los derechos reconocidos por la Ley N.º 25.326.
          </Text>
          <Text style={styles.paragraph}>
            El ejercicio de estos derechos se podrá realizar a través de los canales de contacto
            indicados en la Aplicación. La supresión de datos puede implicar la baja definitiva de la
            cuenta y la imposibilidad de seguir utilizando la Aplicación.
          </Text>

          <Text style={styles.sectionTitle}>Retención de datos</Text>
          <Text style={styles.paragraph}>
            Los datos personales y de uso se conservan mientras la cuenta del usuario permanezca
            activa y durante el tiempo necesario para cumplir las finalidades descriptas en esta
            Política de Privacidad.
          </Text>
          <Text style={styles.paragraph}>
            Una vez solicitada la baja o transcurrido un plazo razonable sin actividad, los datos
            serán eliminados o anonimizados, salvo que deba conservarse cierta información por
            obligación legal o por posibles responsabilidades derivadas del tratamiento.
          </Text>

          <Text style={styles.sectionTitle}>Servicios de terceros</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>OpenAI API (ChatGPT y servicios de voz):</Text> se utiliza para
            procesar consultas de lenguaje natural y, en su caso, convertir fragmentos de voz en texto
            y generar respuestas conversacionales.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>WhatsApp Business API:</Text> se emplea para facilitar la
            comunicación entre la persona mayor y su red de apoyo a través de mensajes.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Spotify API:</Text> se integra para la reproducción de música y
            contenidos de audio.
          </Text>
          <Text style={styles.paragraph}>
            El uso de estos servicios se realiza respetando las licencias y términos de uso de cada
            proveedor. Cada servicio aplica sus propias políticas de privacidad, que el usuario declara
            conocer y aceptar al utilizar las funcionalidades correspondientes.
          </Text>

          {/* Read-only: no accept button when viewing from profile */}
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
  acceptButton: {
    backgroundColor: BRAND,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  checkIcon: {
    marginRight: 8,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert
} from 'react-native';
import { Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useProfile } from '../../context/profile-context';

const BRAND = '#6B8E23';

export default function AcceptTermsAndConditionsScreen() {
    const router = useRouter();
    const { setAcceptedTerms } = useProfile();
    const [accepted, setAccepted] = useState(false);

    const handleAccept = () => {
        setAccepted(true);
        setAcceptedTerms(true);
        Alert.alert(
            'Términos Aceptados',
            'Has aceptado los términos y condiciones.',
            [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Términos y Condiciones</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Mismo contenido que el original */}
                    <TouchableOpacity
                        style={[styles.acceptButton, accepted && styles.acceptButtonDisabled]}
                        onPress={handleAccept}
                        disabled={accepted}
                    >
                        {accepted && <Check size={20} color="white" style={styles.checkIcon} />}
                        <Text style={styles.acceptButtonText}>
                            {accepted ? 'Términos Aceptados' : 'Aceptar Términos y Condiciones'}
                        </Text>
                    </TouchableOpacity>
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
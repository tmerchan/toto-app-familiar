import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last Update: 14/08/2024</Text>
          
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pellentesque congue lorem, vel tincidunt tortor placerat a. Proin ac diam quam. Aenean in sagittis magna, ut feugiat diam. Fusce a sodales neque, sed accumsan metus.
          </Text>

          <Text style={styles.paragraph}>
            Nunc auctor tortor in dolor luctus, quis euismod urna tincidunt. Aenean arcu metus, bibendum at magna et, volutpat ut lacus. Morbi pellentesque enim vel leo eros semper ultrices. Vestibulum lobortis enim vel neque auctor, a ultrices ex placerat. Mauris ut lacinia justo, sed suscipit tortor. Nam egestas nulla posuere neque.
          </Text>

          <Text style={styles.sectionTitle}>Terms & Conditions</Text>

          <Text style={styles.numberedItem}>
            <Text style={styles.itemNumber}>1. </Text>
            Ut lacinia justo sit amet lorem sodales cursus. Proin malesuada eleifend fermentum. Donec condimentum, nunc at rhoncus faucibus, ex nisl laoreet ipsum, eu pharetra eros est vitae orci. Morbi quis rhoncus mi. Nullam lacinia ornare accumsan. Duis laoreet, ex eget rutrum pharetra, lectus nisl posuere risus, vel facilisis nisl tellus ac turpis.
          </Text>

          <Text style={styles.numberedItem}>
            <Text style={styles.itemNumber}>2. </Text>
            Ut lacinia justo sit amet lorem sodales cursus. Proin malesuada eleifend fermentum. Donec condimentum, nunc at rhoncus faucibus, ex nisl laoreet ipsum, eu pharetra eros est vitae orci. Morbi quis rhoncus mi. Nullam lacinia ornare accumsan. Duis laoreet, ex eget rutrum pharetra, lectus nisl posuere risus, vel facilisis nisl tellus ac turpis.
          </Text>

          <Text style={styles.numberedItem}>
            <Text style={styles.itemNumber}>3. </Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pellentesque congue lorem, vel tincidunt tortor placerat a. Proin ac diam quam. Aenean in sagittis magna, ut feugiat diam.
          </Text>

          <Text style={styles.numberedItem}>
            <Text style={styles.itemNumber}>4. </Text>
            Nunc auctor tortor in dolor luctus, quis euismod urna tincidunt. Aenean arcu metus, bibendum at magna et, volutpat ut lacus. Morbi pellentesque enim vel leo eros semper ultrices. Vestibulum lobortis enim vel neque auctor, a ultrices ex placerat. Mauris ut lacinia justo, sed suscipit tortor. Nam egestas nulla posuere neque.
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 10,
    marginBottom: 20,
  },
  numberedItem: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  itemNumber: {
    fontWeight: '600',
    color: '#007AFF',
  },
});
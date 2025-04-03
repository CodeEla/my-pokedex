import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera"; // Expo kamera bileşenleri ve barkod sonuç tipi
import { useState, useEffect } from "react"; // React'in temel hook'ları
import { 
  Alert, 
  Text, 
  TouchableOpacity, 
  View, 
  Animated, 
  Easing, 
  Vibration, 
  StyleSheet 
} from "react-native"; // Gerekli React Native bileşenleri
import { useNavigation } from "@react-navigation/native"; // Navigasyon hook'u
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; // Stack tipini kullanmak için
import { RootStackParamList } from "../navigation/types"; // Ekran isimleri ve parametre tipleri
import { saveScannedData } from "../utils/storage"; // AsyncStorage'e veri kaydetme fonksiyonu

const ScannerScreen = () => {
  // Kamera iznini kontrol etmek ve izin istemek için hook
  const [permission, requestPermission] = useCameraPermissions();

  // Kullanıcının QR kodu tarayıp taramadığını takip eden state
  const [scanned, setScanned] = useState(false);

  // Navigasyon objesi; ekranlar arasında geçiş yapmak için kullanılır
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Tarama animasyonu için animasyon değeri (yukarı-aşağı çizgi hareketi)
  const scanAnimation = new Animated.Value(0);

  // Ekran yüklendiğinde animasyonu başlat
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // Eğer kamera izni bilgisi yoksa boş View dön
  if (!permission) return <View />;

  // Eğer kamera izni verilmemişse kullanıcıdan izin iste
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>Kamera izni gerekiyor.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.buttonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // QR kod tarandığında çağrılacak fonksiyon
  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    // Daha önce taranmışsa işlem yapma
    if (scanned) return;

    // QR kod tarandı olarak işaretle
    setScanned(true);

    // Cihazı titreştir (geri bildirim)
    Vibration.vibrate(200);

    // QR koddan gelen veriyi al
    const scannedData = result.data;

    // AsyncStorage'e veriyi kaydet
    await saveScannedData(scannedData);

    // Bilgi mesajı göster
    Alert.alert("Tarama Başarılı!", `Taranan Veri: ${scannedData}`);

    // Verinin sayıya çevrilip çevrilemediğini kontrol et (Pokemon ID olabilir)
    const pokemonId = parseInt(scannedData);
    if (!isNaN(pokemonId)) {
      // Eğer geçerli bir sayıysa, detay ekranına yönlendir
      navigation.navigate("Details", { id: pokemonId });
    } else {
      // Geçersiz veri uyarısı
      Alert.alert("Hata", "Geçersiz QR Kodu. Lütfen tekrar tarayın.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Kamera görüntüsü */}
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        {/* Tarama kutusu ve çizgisi */}
        <View style={styles.overlay}>
          <View style={styles.scanBox}>
            <Animated.View
              style={[
                styles.scanLine,
                {
                  top: scanAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 220],
                  }),
                },
              ]}
            />
            <Text style={styles.scanText}>QR Kodunu Buraya Yerleştir</Text>
          </View>
        </View>
      </CameraView>

      {/* Alt butonlar */}
      <View style={styles.buttonContainer}>
        {/* Yeniden taramak için */}
        {scanned && (
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
            <Text style={styles.buttonText}>Tekrar Tara</Text>
          </TouchableOpacity>
        )}

        {/* Geri dönmek için */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Geri</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Tüm stiller aynı dosyada tanımlı
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { textAlign: "center", paddingBottom: 10, fontSize: 16, fontWeight: "bold" },
  permissionButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 8,
  },
  camera: { flex: 1, width: "100%" },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#d32f2f",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    overflow: "hidden",
  },
  scanText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    position: "absolute",
    bottom: -30,
    textAlign: "center",
  },
  scanLine: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    position: "absolute",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    gap: 20,
  },
  scanAgainButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 10,
  },
  backButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ScannerScreen; // Bileşeni dışa aktar

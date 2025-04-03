// Gerekli kütüphaneler ve bileşenler import ediliyor
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Iconlar
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types"; // navigation için type tanımı
import { SafeAreaView } from "react-native-safe-area-context"; // iPhone çentik ve alt bar uyumu için
import { getScannedData, ScannedDataItem } from "../utils/storage"; // AsyncStorage'tan verileri çekme
import axios from "axios"; // API isteği için

// Ana ekranda gösterilecek sabit Pokémon verileri
const pokemons = [
  { id: 132, name: "Ditto", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png" },
  { id: 1, name: "Bulbasaur", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  { id: 4, name: "Charmander", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
  { id: 7, name: "Squirtle", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
  { id: 25, name: "Pikachu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
];

// Ana sayfa bileşeni
const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // State'ler
  const [scannedData, setScannedData] = useState<ScannedDataItem[]>([]); // QR ile taranan veriler
  const [modalVisible, setModalVisible] = useState(false); // Modal gösteriliyor mu?
  const [lastPokemon, setLastPokemon] = useState<any>(null); // Son taranan Pokémon
  const [loading, setLoading] = useState(false); // API'den veri çekerken loading göstermek için

  // Sayfa yüklendiğinde AsyncStorage'den veri çek
  useEffect(() => {
    const fetchScannedData = async () => {
      const data = await getScannedData(); // AsyncStorage içeriğini çek
      setScannedData(data); // State'e yaz
    };
    fetchScannedData();
  }, []);

  // Taranan son Pokémon'u modal olarak göstermek için
  const showScannedData = async () => {
    const data = await getScannedData(); // QR ile taranan tüm kayıtlar
    if (!data || data.length === 0) return; // Hiç veri yoksa çık

    const lastValue = data[data.length - 1].value; // Son kaydın değeri alınır
    const pokemonId = parseInt(lastValue); // Sayıya çevrilir (ID)

    // Eğer sayı geçerliyse API'den detayları çek
    if (!isNaN(pokemonId)) {
      try {
        setLoading(true); // Spinner'ı göster
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`); // API isteği
        setLastPokemon(res.data); // Gelen veriyi state'e ata
        setModalVisible(true); // Modal'ı aç
      } catch (err) {
        console.log("API hatası:", err);
      } finally {
        setLoading(false); // Spinner'ı kapat
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Başlık alanı */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="pokeball" size={36} color="white" />
        <Text style={styles.title}>Pokédex</Text>
        <View style={{ width: 36 }} /> {/* Ortalamak için sağ boşluk */}
      </View>

      {/* QR Kodu Tara Butonu */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Scanner")} // Scanner ekranına git
        style={styles.scanButtonNew}
      >
        <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
        <Text style={styles.scanTextNew}>QR Kodu Tara</Text>
      </TouchableOpacity>

      {/* Sabit Pokémon Kart Listesi */}
      <FlatList
        data={pokemons} // Yukarıdaki sabit liste
        keyExtractor={(item) => item.id.toString()} // key
        numColumns={2} // iki sütunlu grid
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Details", { id: item.id })} // Detay sayfasına git
          >
            <Image source={{ uri: item.image }} style={styles.pokemonImage} />
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Alt Navigasyon Barı */}
      <View style={styles.bottomNav}>
        {/* Eğitmen ekranına yönlendir */}
        <TouchableOpacity onPress={() => navigation.navigate("Trainer")}>
          <MaterialCommunityIcons name="account" size={30} color="white" />
        </TouchableOpacity>

        {/* Ana ekran simgesi (ortadaki büyük ikon) */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.pokeIconWrapper}
        >
          <View style={styles.pokeIconContainer}>
            <MaterialCommunityIcons name="pokeball" size={50} color="white" />
          </View>
        </TouchableOpacity>

        {/* Son taranan Pokémon'u göster */}
        <TouchableOpacity onPress={showScannedData}>
          <MaterialCommunityIcons name="file-document-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal – QR ile taranan Pokémon'un detaylarını gösterir */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loading ? (
              // API'den veri çekiliyorsa spinner göster
              <ActivityIndicator size="large" color="#d32f2f" />
            ) : lastPokemon ? (
              // Veri varsa bilgileri göster
              <>
                <Image source={{ uri: lastPokemon.sprites.front_default }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{lastPokemon.name.toUpperCase()}</Text>
                <Text style={styles.modalText}>Boy: {lastPokemon.height / 10} m</Text>
                <Text style={styles.modalText}>Kilo: {lastPokemon.weight / 10} kg</Text>
                <Text style={styles.modalText}>Deneyim: {lastPokemon.base_experience}</Text>
              </>
            ) : (
              <Text style={styles.modalText}>Veri bulunamadı</Text>
            )}

            {/* Kapat butonu */}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.buttonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center", paddingBottom: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 10,
    marginLeft: 20,
  },
  scanButtonNew: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d32f2f",
    paddingVertical: 14,        // Daha kalın
    paddingHorizontal: 24,      // Daha geniş
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 24,
  },
  
  scanTextNew: {
    color: "white",
    fontSize: 20,               // Daha büyük yazı
    marginLeft: 10,
    fontWeight: "bold",
  },
  
  list: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    margin: 12,
    width: 160,
    height: 160,
    justifyContent: "center",
    shadowColor: "#fff",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  pokemonImage: { width: 90, height: 90, marginBottom: 10 },
  cardText: { fontSize: 20, fontWeight: "bold", color: "white" },
  bottomNav: {
    width: "100%",
    height: 70,
    backgroundColor: "#d32f2f",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    paddingHorizontal: 20,
    position: "relative",
  },
  pokeIconWrapper: {
    position: "absolute",
    bottom: 15,
    left: "45%",
    transform: [{ translateX: -5 }],
  },
  pokeIconContainer: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#FF0000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: 300,
  },
  modalImage: { width: 120, height: 120, marginBottom: 10 },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  modalText: { fontSize: 16, color: "#fff", marginBottom: 4 },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#d32f2f",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default HomeScreen;

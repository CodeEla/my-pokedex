// Gerekli kütüphaneleri import ediyoruz
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";

// Navigasyon için gerekli hook ve type
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// İkonlar için Expo'dan gelen ikon seti
import { MaterialCommunityIcons } from "@expo/vector-icons";

// QR kodla yakalanan verileri almak için helper fonksiyon
import { getScannedData } from "../utils/storage";
import axios from "axios";

// Alt navigasyon bar bileşeni
import BottomNavBar from "../components/BottomNavBar";

// Navigation'daki ekran tipleri
import { RootStackParamList } from "../navigation/types";

// API'den gelen Pokémon verisinin tipi
interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
}

// Ana bileşenimiz
const TrainerScreen = () => {
  // Navigasyon tanımı (TypeScript ile güvenli)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // State: Yakalanan Pokémon'ları saklar
  const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);

  // State: Stat ortalamasını saklar
  const [averageStat, setAverageStat] = useState(0);

  // Bileşen yüklendiğinde çalışır (componentDidMount gibi)
  useEffect(() => {
    const fetchScannedData = async () => {
      // AsyncStorage'den yakalanan Pokémon ID'lerini al
      const data = await getScannedData();

      // Her bir ID için API'den detayları al
      const responses = await Promise.all(
        data.map(async (item) => {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${item.value}`
          );
          return response.data;
        })
      );

      // Gelen Pokémon'ları state'e kaydet
      setPokemonList(responses);

      // Stat ortalamasını hesapla
      const allStats = responses.flatMap((poke) =>
        poke.stats.map((s: any) => s.base_stat)
      );
      const average =
        allStats.reduce((sum, stat) => sum + stat, 0) / allStats.length;

      // Stat ortalamasını state'e kaydet (ondalıkla)
      setAverageStat(parseFloat(average.toFixed(1)));
    };

    fetchScannedData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Üst başlık alanı */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="account-circle" size={80} color="white" />
        <Text style={styles.title}>Eğitmen Profili</Text>
      </View>

      {/* Bilgi kutuları (kaç tane Pokémon var ve stat ortalaması) */}
      <View style={styles.infoBoxWrapper}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>📍 Yakalanan Pokémon:</Text>
          <Text style={styles.infoValue}>{pokemonList.length}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>📊 Stat Ortalaması:</Text>
          <Text style={styles.infoValue}>{averageStat}</Text>
        </View>
      </View>

      {/* Pokémon kartlarını listeleyen grid görünüm */}
      <FlatList
        data={pokemonList}
        numColumns={2} // iki kolonlu görünüm
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.pokemonCard}>
            <Image source={{ uri: item.sprites.front_default }} style={styles.pokemonImage} />
            <Text style={styles.pokemonName}>{item.name}</Text>
          </View>
        )}
      />

      {/* Alt navigasyon bar (Trainer - Pokeball - QR verisi) */}
      <BottomNavBar
        onShowScannedData={() => {}} // İstersen buraya modal açtıran fonksiyon verilebilir
        onNavigateTrainer={() => navigation.navigate("Trainer")} // Trainer'a gider (şu an zaten bu ekran)
        onNavigateHome={() => navigation.navigate("Home")} // Home'a gider
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 80, // BottomNavBar için boşluk
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  infoBoxWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: "#aaa",
  },
  infoValue: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginTop: 4,
  },
  list: {
    paddingBottom: 80,
  },
  pokemonCard: {
    backgroundColor: "#1f1f1f",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    flex: 1,
  },
  pokemonImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  pokemonName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "capitalize",
  },
});

export default TrainerScreen;

import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { fetchPokemonData } from "../redux/pokemonSlice";
import { RootState, AppDispatch } from "../redux/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Pokémon detaylarını gösteren ekran
const DetailsScreen = () => {
  const dispatch = useDispatch<AppDispatch>(); // Redux action çağırmak için
  const { data, loading } = useSelector((state: RootState) => state.pokemon); // Redux store'dan pokemon verisini al
  const route = useRoute<RouteProp<RootStackParamList, "Details">>(); // navigation parametresinden "id" al
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // sayfa geçişi için navigation

  const { id } = route.params; // route içindeki id parametresini al

  useEffect(() => {
    if (id) {
      dispatch(fetchPokemonData(id)); // Eğer id varsa ilgili Pokémon verisini çek
    }
  }, [dispatch, id]);

  if (loading) {
    // Eğer veri yükleniyorsa spinner göster
    return (
      <View style={styles.containerActivity}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    // Eğer veri boşsa hiçbir şey gösterme
    return <View style={styles.containerActivity} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Başlık alanı ve geri butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.pokemonName}>{data.name?.toUpperCase()}</Text>
      </View>

      {/* Pokémon resmi */}
      <Image source={{ uri: data.sprites?.front_default }} style={styles.image} />

      {/* Pokémon temel bilgileri */}
      <View style={styles.card}>
        <Text style={styles.infoText}>ID: {data.id}</Text>
        <Text style={styles.infoText}>Boy: {data.height / 10} m</Text>
        <Text style={styles.infoText}>Ağırlık: {data.weight / 10} kg</Text>
        <Text style={styles.infoText}>Deneyim: {data.base_experience}</Text>
      </View>

      {/* İstatistikler bölümü */}
      <Text style={styles.sectionTitle}>İstatistikler</Text>
      <View style={styles.statContainer}>
        {data.stats?.map((item, index) => {
          const percentage = item.base_stat;
          const formattedStatName = item.stat?.name?.toUpperCase().replace("-", "\n");
          return (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statLabel}>{formattedStatName}</Text>
              <View style={styles.statBar}>
                <View style={[styles.statFill, { width: `${percentage}%` }]} />
              </View>
              <Text style={styles.statValue}>{item.base_stat}</Text>
            </View>
          );
        })}
      </View>

      {/* Yetenekler bölümü */}
      <Text style={styles.sectionTitle}>Yetenekler</Text>
      <View style={styles.abilityContainer}>
        {data.abilities?.map((item, index) => (
          <View key={index} style={styles.abilityCard}>
            <Text style={styles.abilityText}>{item.ability?.name}</Text>
          </View>
        ))}
      </View>

      {/* Türler bölümü */}
      <Text style={styles.sectionTitle}>Türler</Text>
      <View style={styles.typeContainer}>
        {data.types?.map((item, index) => (
          <View key={index} style={styles.typeCard}>
            <Text style={styles.typeText}>{item.type?.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Tüm stiller burada tanımlanıyor
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: "#000",
    alignItems: "center",
  },
  containerActivity: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 5,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginTop: 35,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#1A1A1A",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    width: "90%",
    marginBottom: 10,
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#FFF",
  },
  statContainer: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    padding: 10,
    borderRadius: 12,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  statBar: {
    flex: 3,
    height: 12,
    backgroundColor: "#444",
    borderRadius: 6,
    marginHorizontal: 10,
  },
  statFill: {
    height: "100%",
    backgroundColor: "#FF0000",
    borderRadius: 6,
  },
  statValue: {
    flex: 0.7,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  abilityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  abilityCard: {
    backgroundColor: "#FFCC00",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    margin: 4,
  },
  abilityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  typeCard: {
    backgroundColor: "#FFCC00",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    margin: 4,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
});

export default DetailsScreen;

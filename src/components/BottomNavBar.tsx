import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Props interface'i: Bu bileşene dışarıdan hangi fonksiyonlar verilecek onu tanımlar
interface Props {
  onShowScannedData: () => void;    // Taranan verileri gösterecek fonksiyon
  onNavigateTrainer: () => void;    // Trainer ekranına geçiş fonksiyonu
  onNavigateHome: () => void;       // Ana sayfaya geçiş fonksiyonu
}

// Functional component olarak tanımlanmış BottomNavBar bileşeni
const BottomNavBar: React.FC<Props> = ({ onShowScannedData, onNavigateTrainer, onNavigateHome }) => {
  return (
    // Ana kapsayıcı: alt gezinti çubuğu (bottom nav bar)
    <View style={styles.bottomNav}>
      {/* Sol taraf - Eğitmen (Trainer) ikonu */}
      <TouchableOpacity onPress={onNavigateTrainer}>
        <MaterialCommunityIcons name="account" size={30} color="white" />
      </TouchableOpacity>

      {/* Orta taraf - Pokeball ikonu (ana sayfa) */}
      <TouchableOpacity onPress={onNavigateHome} style={styles.pokeIconWrapper}>
        <View style={styles.pokeIconContainer}>
          <MaterialCommunityIcons name="pokeball" size={50} color="white" />
        </View>
      </TouchableOpacity>

      {/* Sağ taraf - Son taranan verileri açma */}
      <TouchableOpacity onPress={onShowScannedData}>
        <MaterialCommunityIcons name="file-document-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

// Stil tanımları
const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",          // Sayfanın en altına sabitlenir
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,                    // Yükseklik
    backgroundColor: "#d32f2f",    // Arka plan rengi (kırmızı ton)
    flexDirection: "row",          // Yatay yerleşim
    justifyContent: "space-between", // Sol, orta ve sağ arası boşluk
    alignItems: "center",          // Dikey ortalama
    paddingHorizontal: 20,         // Yana boşluk
    borderTopLeftRadius: 20,       // Üst sol köşe oval
    borderTopRightRadius: 20,      // Üst sağ köşe oval
  },
  pokeIconWrapper: {
    position: "absolute",          // Ortadaki büyük ikon yukarıda konumlandırılıyor
    bottom: 15,
    left: "45%",                   // Ekranın ortasına yakın bir konum
    transform: [{ translateX: -5 }], // Hafif sola kaydırılarak tam merkezleniyor
  },
  pokeIconContainer: {
    backgroundColor: "#000",       // İkon arka planı siyah
    padding: 15,                   // İç boşluk
    borderRadius: 50,              // Yuvarlak form
    borderWidth: 3,                // Kırmızı kenarlık
    borderColor: "#FF0000",
  },
});

export default BottomNavBar;

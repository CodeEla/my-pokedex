import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "scannedData";

export interface ScannedDataItem {
  id: number;
  value: string;
}

export const saveScannedData = async (data: string) => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const parsedData: ScannedDataItem[] = existingData ? JSON.parse(existingData) : [];

    parsedData.push({ id: parsedData.length + 1, value: data });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
  } catch (error) {
    console.error("Veri kaydedilirken hata oluştu:", error);
  }
};

export const getScannedData = async (): Promise<ScannedDataItem[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Veri okunurken hata oluştu:", error);
    return [];
  }
};

  

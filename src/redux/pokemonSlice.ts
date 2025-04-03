import { createSlice, PayloadAction } from "@reduxjs/toolkit";//redux toolkit kütüphanesinden createSlice ve PayloadAction fonksiyonlarını import ediyoruz. creatSlice, Redux reducer larını ve aksiyonlarını kolayca oluşturmak için kullanılır.
import axios from "axios"; //pokemon verilerini almak için API isteği yapmamızı sağlar.
import { AppDispatch } from "./store"; //redux store dan AppDispatch i import ettik. Asenkron aksiyonlar için kullanılır

interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
  };
}

interface PokemonAbility {
  ability: {
    name: string;
  };
}

interface PokemonType {
  type: {
    name: string;
  };
}

interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
  };
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  types: PokemonType[];
}

interface PokemonState { //Redux Store içindeki pokemon state ini tanımlıyoruz
  data: PokemonData | null; //pokemon verisini saklar
  loading: boolean; //veri yüklenirken true olur
  error: string | null; //hata mesajı(varsa)
}

const initialState: PokemonState = { //başlangıç state ini oluşturuyoruz
  data: null,
  loading: false,
  error: null,
};

const pokemonSlice = createSlice({ //Redux Slice ı oluşturuyoruz
  name: "pokemon", //slice ın adı
  initialState, //başlangıç state
  reducers: {
    //API isteği başladığında çalışır
    fetchPokemonStart(state) {
      state.loading = true; //yükleniyor bilgisini true yap
      state.error = null; //hata mesajını sıfırla
    },
    fetchPokemonSuccess(state, action: PayloadAction<PokemonData>) { //API isteği başarılı olursa çalışır
      state.loading = false; //yükleme tamamlandı
      state.data = action.payload; //API den gelen veriyi state e ekle

      //console.log("Redux Store Güncellendi:", JSON.stringify(action.payload, null, 2));
    },
    fetchPokemonFailure(state, action: PayloadAction<string>) { //API isteği başarısız olursa çalışır
      state.loading = false; //yükleme tamamlandı ama hata var
      state.error = action.payload; //hata mesajını kaydet
    },
  },
});

export const fetchPokemonData = (id: number = 132) => async (dispatch: AppDispatch) => { //API den pokemon verisini getiren asenkron fonksiyon
  dispatch(fetchPokemonStart()); //yükleme başladığını belirtiyoruz
  try {
    const response = await axios.get<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${id}`); //pokemon API ye GET isteği yapar
    
    //console.log("API’den Gelen Yanıt:", JSON.stringify(response.data, null, 2));

    dispatch(fetchPokemonSuccess(response.data)); //başarılı olursa Redux Store a ekle 
  } catch (error) {
    console.error("API Hatası:", error); //hata varsa konsola yazdır
    dispatch(fetchPokemonFailure("Pokemon verisi yüklenemedi")); //Redux a hata mesajı gönder
  }
};

export const { fetchPokemonStart, fetchPokemonSuccess, fetchPokemonFailure } = pokemonSlice.actions; //Reducer dan gelen actionları  dışa aktarıyoruz
export default pokemonSlice.reducer; //Reducer ı dışa aktarıyoruz. store.ts içinde kullanılacak



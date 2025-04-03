import { configureStore } from '@reduxjs/toolkit'; //bu fonksiyon Redux store unu oluşturmak için kullanılır
import pokemonReducer from './pokemonSlice'; //bu reducer, pokemon verilerini yönetmek için kullanılır

export const store = configureStore({ //redux stor'u oluşturuyoruz
  reducer: {
    //redux state içinde "pokemon" anahtarına pokemonReducer'ı atıyoruz bu sayede pokemon verileri global state içinde "pokemon" anahtarı altında tutulur
    pokemon: pokemonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; //RootState türünü oluşturuyoruz bu store un mevcut tüm state ini temsil eden türdür
export type AppDispatch = typeof store.dispatch; //AppDispatch türünü oluşturuyoruz bu redux un store.dispatch fonksiyonunun türünü belirler
export default store; //store u dışa aktarıyoruz


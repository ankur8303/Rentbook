import AsyncStorage from '@react-native-async-storage/async-storage';
export const getToken = async <T = any>(): Promise<T | null> => {
    try {
        const raw = await AsyncStorage.getItem('USER_KEY');
        return raw ? (JSON.parse(raw)as T) : null;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function Details() {
    const params = useLocalSearchParams();

    async function fetchPokemonDetails(name: string) {}

    return (
        <>
        <Stack.Screen options={{ title: params.name as string }} />
        <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }}></ScrollView>
        </>
    );
}

const styles = StyleSheet.create({});

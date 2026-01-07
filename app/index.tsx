import { Text, View, ScrollView, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Link } from "expo-router";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorsByType = {
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
  bug: "#A8B820",
};

export default function Index() {
  const [pokemons, setPokemon] = useState<Pokemon[]>([]);

  // console.log(JSON.stringify(pokemons[0]), null, 2);

  useEffect(() => {
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=20"
      );
      const data = await response.json();

      //fetch detailed info for each Pokemon in parallel
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        })
      );

      setPokemon(detailedPokemons);
    } catch (e) {
      console.error("Error fetching pokemons:", e);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }}>
      {pokemons.map((pokemon) => (
        <Link href={{ pathname: "/details", params: { name: pokemon.name } }} key={pokemon.name}>
          <View
            style={{
              //@ts-ignore
              backgroundColor: colorsByType[pokemon.types[0].type.name] + 50,
              padding: 40,
              borderRadius: 20,
            }}
          >
            <Text className="text-2xl font-bold text-center">{pokemon.name}</Text>
            <Text className="text-lg font-bold text-red-500 text-center">{pokemon.types[0].type.name}</Text>

            <View style={{ flexDirection: "row" }}>
              <Image
                source={{ uri: pokemon.image }}
                style={{ width: 150, height: 150 }}
              />
              <Image
                source={{ uri: pokemon.imageBack }}
                style={{ width: 150, height: 150 }}
              />
            </View>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
});

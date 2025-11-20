import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { View, StyleSheet, ActivityIndicator, FlatList, Text, TextInput, Pressable, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const getRecipes = async (seachParams) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?${seachParams}`);
      const json = await response.json();
      if(seachParams == "f=a")
        setRecipes(json.meals);
      else
        setSearchedRecipes(json.meals);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRecipes("f=a");
  }, []);

  const onSearch = (searchWord) => {
    if(searchWord)
      getRecipes(`s=${searchWord}`);
    else
      setSearchedRecipes([]);    
  }

  const getDetailedRecipe = (mealId) => {
    router.push(`recipes/${mealId}`);
  }

  if (loading) return <ActivityIndicator size="large" style={styles.loading} />

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Discover Recipes</Text>
      <TextInput
        placeholder="Search for recipe..."
        style={styles.searchInput}
        value={query}
        onChangeText={(searchWord) => {
          setQuery(searchWord);
          onSearch(searchWord);
        }}
      />
      <FlatList
        data={query ? searchedRecipes : recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => getDetailedRecipe(item.idMeal)}
            style={styles.card}>
            <ImageBackground
              source={{ uri: item.strMealThumb }}
              style={styles.cardImage}
              imageStyle={{ borderRadius: 12 }}>
                <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>{item.strMeal}</Text>
                <Text style={styles.cardSubtitle}>
                  <Text style={styles.categoryLabel}>{item.strCategory}</Text>
                  <Text style={styles.location}>
                    <Ionicons style={styles.locationIcon} name="location-sharp" />
                    <Text>{item.strArea}</Text>
                  </Text>
                </Text>
              </View>
            </ImageBackground>
          </Pressable>
        )}
      />
    </View>
  )}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 1)"
  },
  card: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(155, 153, 153, 0.71)",
    marginBottom: 12
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cardOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  pageTitle: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 20,
    fontWeight: 500
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "rgba(240, 237, 237, 1)",
    borderRadius: 6,
    marginBottom: 15,
    color: "rgba(0, 0, 0, 1)"
  },
  categoryLabel: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: "rgba(171, 171, 171, 0.5)"
  },
  location : {
    marginLeft: 6
  },
  locationIcon: {
    marginRight: 3
  }
});
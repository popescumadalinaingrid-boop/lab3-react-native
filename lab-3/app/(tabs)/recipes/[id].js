import { useEffect, useState } from "react";
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, ActivityIndicator, ImageBackground, Text, View, ScrollView } from "react-native";

export default function Details() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
  const fetchRecipe = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const json = await response.json();
      setRecipeDetails(json.meals[0]);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchRecipe();
}, [id]);

  const setRecipeDetails = (recipe) => {
    const ingredients = [];
    const measures = [];

    for(const key in recipe)
    {
      if(key.startsWith("strIngredient") && recipe[key])
        ingredients.push(recipe[key]);
      if(key.startsWith("strMeasure") && recipe[key] != " ")
        measures.push(recipe[key]);
    }

    setRecipe({
      mealName: recipe.strMeal,
      category: recipe.strCategory,
      area: recipe.strArea,
      imageUrl: recipe.strMealThumb,
      instructions: recipe.strInstructions,
      ingredients: ingredients,
      measures: measures
    });
  }

  if (loading) return <ActivityIndicator size="large" style={styles.loading} />

  return (
    <ScrollView>
      <ImageBackground
        source={{ uri: recipe.imageUrl }}
        style={styles.mealThumb}>
      </ImageBackground>
      <View style={styles.container}>
        <Text style={styles.cardTitle}>{recipe.mealName}</Text>
        <Text style={styles.cardSubtitle}>
          {recipe.category} • {recipe.area}
        </Text>
        <View style={styles.horizontalRule} />
        <View>
        {
          recipe.ingredients.map((item, index) => (
            <View style={styles.ingredient} key={index}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.details} key={item}>{recipe.measures[index]} {item}</Text>
            </View>
          ))
        }
        </View>
        <View style={styles.horizontalRule} />
        <Text style={styles.instructionsTag}>Instructions</Text>
        <Text style={styles.details}>{recipe.instructions}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mealThumb: {
    width: '100%',
    height: 300,
    backgroundColor: "rgba(155, 153, 153, 0.71)"
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 15
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
    cardTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 17,
    marginTop: 10,
    fontWeight: 500
  },
  ingredient: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 4,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 22,
    marginRight: 8,
    color: "#333",
  },
  details: {
    fontSize: 16
  },
  horizontalRule: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,      
    width: '100%',              
    marginVertical: 20
  },
  instructionsTag: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 15
  }
});
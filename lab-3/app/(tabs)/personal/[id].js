import { useEffect, useState } from "react";
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, ActivityIndicator, ImageBackground, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { getRecipeAsync, deleteRecipeAsync } from "./repository/repository"
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

export default function Details() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setRecipeDetails(await getRecipeAsync(id));
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

    const setRecipeDetails = (recipe) => {
    const ingredietsMeasures = recipe.ingredients.split(",");
    const ingredients = ingredietsMeasures.map(ingr => ingr.split("|")[0]);
    const measures = ingredietsMeasures.map(ingr => ingr.split("|")[1]);

    setRecipe({
      mealName: recipe.name,
      category: recipe.category,
      area: recipe.area,
      imageUrl: recipe.image_url,
      instructions: recipe.instructions,
      ingredients: ingredients,
      measures: measures
    });
  }

  const deleteRecipe = async () => {
    const isSucessful = await deleteRecipeAsync(id);
    if(isSucessful)
      router.push(`personal`);
  }

  const updateRecipe = () => {
    router.push(`personal/updateRecipe/${id}`);
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
      <View style={styles.buttonsContainer}>
      <TouchableOpacity style={styles.editButton} onPress={updateRecipe}>
        <Ionicons name="create-outline" size={18} color="#fff" />
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={deleteRecipe}>
        <Ionicons name="trash-outline" size={18} color="#FF5A5F" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mealThumb: {
    width: '100%',
    height: 300,
    backgroundColor: "rgba(155, 153, 153, 0.71)",
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
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
    editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF7A00", // orange
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#FF5A5F",
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteText: {
    color: "#FF5A5F",
    fontWeight: "600",
    marginLeft: 6,
  }
});
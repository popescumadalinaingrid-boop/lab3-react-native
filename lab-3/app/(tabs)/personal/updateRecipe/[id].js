import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getRecipeAsync, updateRecipeAsync } from "../repository/repository"
import { useLocalSearchParams } from 'expo-router';

export default function UpsertRecipe() {
  const [recipeName, setRecipeName] = useState("");
  const [category, setCategory] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState([{ ingredient: "", measure: "" }]);
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);

  // Validation
  const [errors, setErrors] = useState({});

  const router = useRouter();

  // Update state
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const updateRecipeAsync = async() => {
      if(id) {
        const recipe = await getRecipeAsync(id);
        if(recipe) {
          const ingredients = recipe.ingredients.split(",")
            .map(ingr => { 
              const ingredientsMeasures = ingr.split("|"); 
              return {
                ingredient: ingredientsMeasures[0],
                measure: ingredientsMeasures[1]
              } 
            }
          );

          setRecipeName(recipe.name);
          setCategory(recipe.category);
          setCuisine(recipe.area);
          setImage(recipe.image_url);
          setInstructions(recipe.instructions);
          setIngredients(ingredients)
        }
      }
    };

    updateRecipeAsync();
  }, []);

  const validate = () => {
    const newErrors = {};

    if (recipeName.length < 3)
      newErrors.recipeName = "Recipe name must be at least 3 characters";
    if (!category) 
      newErrors.category = "Category is required";
    if (!cuisine) 
      newErrors.cuisine = "Area/Cuisine is required";
    if (ingredients.length === 0)
      newErrors.ingredients = "At least one ingredient is required";
    
    return newErrors;
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled)
      setImage(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length === 0) {
      const isSuccessful = await updateRecipeAsync({
        id: id,
        name: recipeName,
        category: category,
        area: cuisine,
        image_url: image,
        instructions: instructions,
        ingredients: ingredients.map(ingr => `${ingr.ingredient}|${ingr.measure}`).join(',')
      });

      if(isSuccessful)
      {
        router.push('personal');
        Alert.alert("Recipe updated successfully!");
      }
      else
        Alert.alert("Failed to update recipe");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image Picker */}
      <Text style={styles.inputLabel}>Recipe Image</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={36} color="#aaa" />
            <Text style={styles.placeholderText}>Tap to select an image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Recipe Name */}
      <Text style={styles.inputLabel}>Recipe Name</Text>
      <View style={styles.inputMargin}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={recipeName}
          onChangeText={setRecipeName}
        />
        {errors.recipeName && (
          <Text style={styles.error}>{errors.recipeName}</Text>
        )}
      </View>

      {/* Category */}
      <Text style={styles.inputLabel}>Category</Text>
      <View style={styles.inputMargin}>
        <TextInput
          style={styles.input}
          placeholder="e.g., Dessert, Main Course"
          value={category}
          onChangeText={setCategory}
        />
        {errors.category && <Text style={styles.error}>{errors.category}</Text>}
      </View>

      {/* Cuisine */}
      <Text style={styles.inputLabel}>Cuisine</Text>
      <View style={styles.inputMargin}>
        <TextInput
          style={styles.input}
          placeholder="e.g., Italian, Chinese"
          value={cuisine}
          onChangeText={setCuisine}
        />
        {errors.cuisine && <Text style={styles.error}>{errors.cuisine}</Text>}
      </View>

      {/* Ingredients */}
      <View style={styles.ingredientsHeader}>
        <Text style={styles.inputLabel}>Ingredients</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            setIngredients([...ingredients, { ingredient: "", measure: "" }])
          }
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputMargin}>
        {ingredients.map((item, index) => (
          <View key={index} style={styles.ingredientRow}>
            <TextInput
              style={[styles.inputRowInput, styles.ingredientInput]}
              placeholder="Ingredient"
              value={item.ingredient}
              onChangeText={(text) => {
                const updated = [...ingredients];
                updated[index].ingredient = text;
                setIngredients(updated);
              }}
            />
            <TextInput
              style={[styles.inputRowInput, styles.measureInput]}
              placeholder="Measure"
              value={item.measure}
              onChangeText={(text) => {
                const updated = [...ingredients];
                updated[index].measure = text;
                setIngredients(updated);
              }}
            />
            {ingredients.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  const updated = ingredients.filter((_, i) => i !== index);
                  setIngredients(updated);
                }}
              >
                <Ionicons name="trash-outline" size={22} color="#ff6347" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {errors.ingredients && (
          <Text style={styles.error}>{errors.ingredients}</Text>
        )}
      </View>

      {/* Instructions */}
      <Text style={styles.inputLabel}>Instructions</Text>
      <View style={styles.inputMargin}>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Enter cooking instructions..."
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Save Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  inputLabel: {
    paddingBottom: 10,
    fontSize: 15,
    fontWeight: 500
  },
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%"
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#aaa",
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
  },
  inputMargin: {
    marginBottom: 8
  },
  error: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
  },
  ingredientsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  addButton: {
    backgroundColor: "#ff7f50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: "#fff"
  },
  ingredientItem: {
    fontSize: 15,
    marginLeft: 4,
    marginBottom: 4,
    color: "#333",
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#ff7f50",
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  inputRowInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    height: 44,
    backgroundColor: "#fff",
    minWidth: 0,
  },
  ingredientInput: {
    flex: 2,
    marginRight: 8,
  },
  measureInput: {
    flex: 1
  },
  removeButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  }
});
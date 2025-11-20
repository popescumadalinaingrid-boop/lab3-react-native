import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Pressable, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRecipesAsync } from "./repository/repository"
import { useRouter } from 'expo-router';

export default function Personal() {
  const [recipes, setRecipes] = useState([{}]);
  const router = useRouter();

  useEffect(() => {
    const getRecipes = async () => {
      setRecipes(await getRecipesAsync());
    }

    getRecipes();
  }, []);

  const onPress = () => {
    router.push('personal/addRecipe');
  }

  const getDetailedRecipe = (mealId) => {
    router.push(`personal/${mealId}`);
  }

  return (
    <>
      {recipes == undefined || recipes.length == 0 ? (
        <View style={styles.emptyListContainer}>
          <Ionicons style={styles.restaurantIcon} size={70} color={'gray'} name="restaurant-outline" />
          <Text style={styles.noRecipesHeader}>No recipes yet</Text>
          <Text style={styles.noRecipesInfo}>Tap the + button to add your first recipe</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => getDetailedRecipe(item.id)}
                style={styles.card}>
                <ImageBackground
                  source={{ uri: item.image_url }}
                  style={styles.cardImage}
                  imageStyle={{ borderRadius: 12 }}>
                    <View style={styles.cardOverlay}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>
                      <Text style={styles.categoryLabel}>{item.category}</Text>
                      <Text style={styles.location}>
                        <Ionicons style={styles.locationIcon} name="location-sharp" />
                        <Text>{item.area}</Text>
                      </Text>
                    </Text>
                  </View>
                </ImageBackground>
              </Pressable>
            )}
          />
        </View>
      )}
      <View style={styles.createButtonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={onPress}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 1)"
  },
  emptyListContainer : {
    paddingTop: 50,
    flex: 1,
    alignItems: "center" 
  },
  noRecipesHeader: {
    fontSize: 17,
    fontWeight: 500,
    marginTop: 10
  },
  noRecipesInfo: {
    marginTop: 10,
    fontWeight: 400
  },
  createButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30
  },
  createButton: {
    backgroundColor: "rgba(255, 128, 0, 1)",
    borderRadius: "50%",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },
  plusText: {
    color: "white",
    fontSize: 28,
    marginBottom: 3
  },
  card: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginBottom: 12
  },
  cardImage: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(155, 153, 153, 0.71)",
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
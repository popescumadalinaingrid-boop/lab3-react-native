import { Stack } from 'expo-router';

export default function PersonalLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'My Recipes' }} />
      <Stack.Screen name="addRecipe" options={{ title: 'Add recipe' }} />
      <Stack.Screen name="updateRecipe/[id]" options={{ title: 'Update recipe' }} />
      <Stack.Screen name="[id]" options={{ title: 'Recipe Details' }} />
    </Stack>
  );
}
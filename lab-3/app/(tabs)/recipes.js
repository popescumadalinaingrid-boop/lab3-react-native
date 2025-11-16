import { Text, View } from 'react-native';
import { useEffect } from 'react';
import { initDatabase } from '../../db';

export default function RecipesScreen() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <View>
      <Text>Recipes Screen</Text>
    </View>
  );
}

import { View, Text } from 'react-native';

export default function App() {
  const names: string[] = ['Anderson', 'Maria', 'João'];

  return (
    <View style={{ padding: 20 }}>
      {names.map((name, index) => (
        <Text key={index}>{name}</Text>
      ))}
    </View>
  );
}
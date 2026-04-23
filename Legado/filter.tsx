import { View, Text } from 'react-native';

export default function App() {
  const numbers: number[] = [10, 15, 20, 25, 30];
  const filtered = numbers.filter((n) => n >= 20);

  return (
    <View style={{ padding: 20 }}>
      {filtered.map((n, index) => (
        <Text key={index}>{n}</Text>
      ))}
    </View>
  );
}
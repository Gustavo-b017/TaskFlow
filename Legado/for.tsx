import { View, Text } from 'react-native';

export default function App() {
  const items: string[] = [];

  for (let i = 1; i <= 5; i++) {
    items.push(`Item ${i}`);
  }

  return (
    <View style={{ padding: 20 }}>
      {items.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </View>
  );
}
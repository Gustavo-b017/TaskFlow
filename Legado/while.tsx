import { View, Text } from 'react-native';

export default function App() {
  let count = 1;
  const values: string[] = [];

  while (count <= 3) {
    values.push(`Valor ${count}`);
    count++;
  }

  return (
    <View style={{ padding: 20 }}>
      {values.map((value, index) => (
        <Text key={index}>{value}</Text>
      ))}
    </View>
  );
}
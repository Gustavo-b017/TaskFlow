import { View, Text } from 'react-native';

export default function App() {
  const isAdmin = true;
  const isActive = true;

  return (
    <View style={{ padding: 20 }}>
      <Text>{isAdmin && isActive ? 'Acesso liberado' : 'Acesso negado'}</Text>
    </View>
  );
}

// && significa E
// || significa OU
// ! inverte um booleano

/**
 * 
import { View, Text } from 'react-native';

export default function App() {
  const isAdmin = true;

  return (
    <View style={{ padding: 20 }}>
      {isAdmin && <Text>Área de admin</Text>}
    </View>
  );
}
 */
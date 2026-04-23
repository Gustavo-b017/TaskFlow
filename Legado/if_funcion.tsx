import { View, Text } from 'react-native';

export default function App() {
  const isLogged = true;

  if (!isLogged) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Usuário não logado</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Bem-vindo!</Text>
    </View>
  );
}


export /*default*/ function App2() {
  const role = 'ADMIN';

  function renderContent() {
    if (role === 'ADMIN') return <Text>Admin</Text>;
    if (role === 'USER') return <Text>Usuário</Text>;
    return <Text>Visitante</Text>;
  }

  return <View style={{ padding: 20 }}>{renderContent()}</View>;
}
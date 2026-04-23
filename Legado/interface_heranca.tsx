import { View, Text } from 'react-native';

interface Animal {
  name: string;
  makeSound(): string;
}

class Dog implements Animal {
  constructor(public name: string) {}

  makeSound(): string {
    return 'Au au';
  }
}

class Vehicle {
  constructor(public brand: string) {}
}

class Car extends Vehicle {
  constructor(brand: string, public model: string) {
    super(brand);
  }
}

interface User {
  // ao declarar não é possivel mais alterar o valor do id, somente leitura
  readonly id: number;
  // o '?:' indica que a propriedade é opcional, ou seja, pode ser omitida
  name?: string;
}

export default function App() {
  const dog = new Dog('Rex');
  const car = new Car('Toyota', 'Corolla');

  const user: User = {
    id: 1,
    name: 'Anderson',
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{dog.name} faz {dog.makeSound()}</Text>
      <Text>{car.brand} - {car.model}</Text>
      <Text>ID: {user.id}</Text>
      <Text>Nome: {user.name ?? 'Não informado'}</Text>
    </View>
  );
}
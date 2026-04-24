import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View>
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.userRole}>
            {user?.role === 'admin' ? 'Administrador' : 'Colaborador'}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={signOut} style={styles.logoutButton} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  userRole: {
    fontSize: 12,
    color: '#666666',
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F2F2F7',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
});

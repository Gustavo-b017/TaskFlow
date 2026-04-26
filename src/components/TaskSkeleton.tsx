import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface TaskSkeletonProps {
  theme: 'light' | 'dark';
}

export function TaskSkeleton({ theme }: TaskSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1F2937' : '#E5E7EB';

  return (
    <Animated.View style={[styles.skeletonCard, { opacity, backgroundColor: bgColor }]}>
      <View style={[styles.skeletonLine, { width: '60%', height: 20, backgroundColor: isDark ? '#374151' : '#D1D5DB' }]} />
      <View style={[styles.skeletonLine, { width: '30%', height: 16, backgroundColor: isDark ? '#374151' : '#D1D5DB', marginTop: 12 }]} />
      <View style={[styles.skeletonLine, { width: '40%', height: 12, backgroundColor: isDark ? '#374151' : '#D1D5DB', marginTop: 16 }]} />
      <View style={[styles.skeletonLine, { width: '40%', height: 12, backgroundColor: isDark ? '#374151' : '#D1D5DB', marginTop: 8 }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  skeletonCard: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    minHeight: 120,
  },
  skeletonLine: {
    borderRadius: 4,
  },
});

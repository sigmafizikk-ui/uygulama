import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { mockNeighbors } from '@/utils/mockData';
import { Neighbor } from '@/types';

function NeighborRow({ neighbor, index }: { neighbor: Neighbor; index: number }) {
  const initials = `${neighbor.name.charAt(0)}${neighbor.surname.charAt(0)}`;

  return (
    <Animated.View
      entering={FadeInDown.delay(50 + index * 40)}
      style={styles.neighborRow}
    >
      <View style={styles.neighborAvatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.neighborInfo}>
        <Text style={styles.neighborName}>
          {neighbor.name} {neighbor.surname}
        </Text>
        <Text style={styles.neighborApartment}>{neighbor.apartment}</Text>
      </View>
    </Animated.View>
  );
}

function groupNeighborsByFloor(neighbors: Neighbor[]) {
  const grouped: { [key: number]: Neighbor[] } = {};
  neighbors.forEach((neighbor) => {
    if (!grouped[neighbor.floor]) {
      grouped[neighbor.floor] = [];
    }
    grouped[neighbor.floor].push(neighbor);
  });
  return grouped;
}

export default function NeighborsScreen() {
  const router = useRouter();
  const groupedNeighbors = groupNeighborsByFloor(mockNeighbors);
  const floors = Object.keys(groupedNeighbors)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Komşularım',
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 18,
            color: Colors.slate[800],
          },
          headerStyle: {
            backgroundColor: Colors.background.secondary,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft color={Colors.slate[700]} size={24} strokeWidth={2} />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        }}
      />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {floors.map((floor) => (
            <View key={floor} style={styles.floorGroup}>
              <Text style={styles.floorTitle}>Kat {floor}</Text>
              <View style={styles.floorCard}>
                {groupedNeighbors[floor].map((neighbor, index) => (
                  <NeighborRow
                    key={neighbor.id}
                    neighbor={neighbor}
                    index={index}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate[50],
  },
  backButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  floorGroup: {
    marginBottom: Spacing.lg,
  },
  floorTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.slate[700],
    marginBottom: Spacing.sm,
  },
  floorCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.sm,
    ...Shadows.sm,
  },
  neighborRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  neighborAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.primary[600],
  },
  neighborInfo: {
    flex: 1,
  },
  neighborName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.slate[800],
    marginBottom: 2,
  },
  neighborApartment: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.slate[500],
  },
});

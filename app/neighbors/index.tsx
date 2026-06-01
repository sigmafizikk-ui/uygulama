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
import { Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { mockNeighbors } from '@/utils/mockData';
import { Neighbor } from '@/types';

function NeighborRow({ neighbor, index, Colors }: { neighbor: Neighbor; index: number; Colors: any }) {
  const initials = `${neighbor.name.charAt(0)}${neighbor.surname.charAt(0)}`;

  return (
    <Animated.View
      entering={FadeInDown.delay(50 + index * 40)}
      style={[styles.neighborRow, { backgroundColor: Colors.background.card }]}
    >
      <View style={[styles.neighborAvatar, { backgroundColor: Colors.primary[100] }]}>
        <Text style={[styles.avatarText, { color: Colors.primary[600] }]}>{initials}</Text>
      </View>
      <View style={styles.neighborInfo}>
        <Text style={[styles.neighborName, { color: Colors.text.primary }]}>
          {neighbor.name} {neighbor.surname}
        </Text>
        <Text style={[styles.neighborApartment, { color: Colors.text.secondary }]}>{neighbor.apartment}</Text>
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
  const Colors = useThemeColors();
  const [neighbors] = useState<Neighbor[]>(mockNeighbors);
  const groupedNeighbors = groupNeighborsByFloor(neighbors);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Komşularım',
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: Colors.background.secondary,
          },
          headerTintColor: Colors.text.primary,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft color={Colors.text.primary} size={24} strokeWidth={2} />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        }}
      />

      <SafeAreaView style={[styles.container, { backgroundColor: Colors.background.primary }]} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(groupedNeighbors)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([floor, floorNeighbors]) => (
              <View key={floor} style={styles.floorGroup}>
                <Text style={[styles.floorTitle, { color: Colors.text.tertiary }]}>{floor}. Kat</Text>
                <View style={[styles.floorCard, { backgroundColor: Colors.background.card }]}>
                  {floorNeighbors.map((neighbor, index) => (
                    <NeighborRow key={neighbor.id} neighbor={neighbor} index={index} Colors={Colors} />
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
    paddingBottom: Spacing['4xl'] + 80,
  },
  floorGroup: {
    marginBottom: Spacing.xl,
  },
  floorTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  floorCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.base,
    ...Shadows.md,
  },
  neighborRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  neighborAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  neighborInfo: {
    flex: 1,
  },
  neighborName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  neighborApartment: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
});

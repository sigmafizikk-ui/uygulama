import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, MessageCircle, Phone, User } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { mockNeighbors } from '@/utils/mockData';
import { Neighbor } from '@/types';

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

function NeighborRow({ neighbor, index }: { neighbor: Neighbor; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(50 + index * 30)}
      style={styles.neighborRow}
    >
      <View style={styles.neighborInfo}>
        <View style={styles.neighborAvatar}>
          <User color={Colors.neutral[500]} size={20} strokeWidth={2} />
        </View>
        <View style={styles.neighborDetails}>
          <Text style={styles.neighborName}>
            {neighbor.name} {neighbor.surname}
          </Text>
          <Text style={styles.neighborApartment}>{neighbor.apartment}</Text>
        </View>
      </View>
      <View style={styles.neighborActions}>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle color={Colors.primary[500]} size={22} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Phone color={Colors.secondary[500]} size={22} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
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
            color: Colors.neutral[800],
          },
          headerStyle: {
            backgroundColor: Colors.background.secondary,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft color={Colors.neutral[700]} size={24} strokeWidth={2} />
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
              <View style={styles.floorHeader}>
                <Text style={styles.floorTitle}>Kat {floor}</Text>
                <View style={styles.floorCountBadge}>
                  <Text style={styles.floorCount}>
                    {groupedNeighbors[floor].length} daire
                  </Text>
                </View>
              </View>
              <View style={styles.neighborList}>
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
    backgroundColor: Colors.neutral[50],
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
    marginBottom: Spacing.xl,
  },
  floorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  floorTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[700],
  },
  floorCountBadge: {
    backgroundColor: Colors.primary[50],
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  floorCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.primary[600],
  },
  neighborList: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  neighborRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  neighborInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  neighborAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  neighborDetails: {
    flex: 1,
  },
  neighborName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.neutral[800],
    marginBottom: 2,
  },
  neighborApartment: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[500],
  },
  neighborActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.neutral[50],
  },
});

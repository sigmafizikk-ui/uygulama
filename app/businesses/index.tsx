import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Star,
  Percent,
  ShoppingBag,
  Utensils,
  Wrench,
  Heart,
  Store,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { mockBusinesses, LocalBusiness } from '@/utils/mockData';

const categories = [
  { id: 'all', label: 'Tümü', icon: Store },
  { id: 'food', label: 'Yemek', icon: Utensils },
  { id: 'grocery', label: 'Market', icon: ShoppingBag },
  { id: 'service', label: 'Hizmet', icon: Wrench },
  { id: 'health', label: 'Sağlık', icon: Heart },
];

function BusinessCard({ business, index }: { business: LocalBusiness; index: number }) {
  const Colors = useThemeColors();

  const categoryConfig = {
    food: { icon: Utensils, color: Colors.status.error },
    grocery: { icon: ShoppingBag, color: Colors.secondary[500] },
    service: { icon: Wrench, color: Colors.primary[500] },
    health: { icon: Heart, color: Colors.status.error },
    other: { icon: Store, color: Colors.neutral[500] },
  };

  const config = categoryConfig[business.category] || categoryConfig.other;
  const CategoryIcon = config.icon;

  const handleCall = () => {
    Linking.openURL(`tel:${business.phone}`);
  };

  const handleMap = () => {
    const query = encodeURIComponent(business.address);
    const scheme = Platform.select({ ios: 'maps:', android: 'geo:' });
    Linking.openURL(`${scheme}?q=${query}`);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 100)}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.categoryIcon, { backgroundColor: config.color + '15' }]}>
          <CategoryIcon color={config.color} size={24} strokeWidth={2} />
        </View>
        <View style={styles.cardHeaderRight}>
          <View style={styles.ratingContainer}>
            <Star color={Colors.status.warning} size={14} strokeWidth={2} fill={Colors.status.warning} />
            <Text style={styles.rating}>{business.rating}</Text>
          </View>
          <Text style={styles.distance}>{business.distance}</Text>
        </View>
      </View>

      <Text style={styles.businessName}>{business.name}</Text>
      <Text style={styles.description}>{business.description}</Text>

      <View style={styles.discountContainer}>
        <Percent color={Colors.secondary[600]} size={16} strokeWidth={2} />
        <Text style={styles.discountText}>{business.discount}</Text>
      </View>

      <View style={styles.addressContainer}>
        <MapPin color={Colors.neutral[400]} size={14} strokeWidth={2} />
        <Text style={styles.address} numberOfLines={2}>{business.address}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Phone color={Colors.text.inverse} size={18} strokeWidth={2} />
          <Text style={styles.callButtonText}>Ara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapButton} onPress={handleMap}>
          <MapPin color={Colors.primary[600]} size={18} strokeWidth={2} />
          <Text style={styles.mapButtonText}>Harita</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function BusinessesScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredBusinesses = activeCategory === 'all'
    ? mockBusinesses
    : mockBusinesses.filter(b => b.category === activeCategory);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Anlaşmalı Esnaflar',
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
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            Site sakinlerine özel indirim ve avantajlar
          </Text>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  activeCategory === cat.id && styles.categoryButtonActive,
                ]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Icon
                  color={activeCategory === cat.id ? Colors.text.inverse : Colors.neutral[600]}
                  size={16}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === cat.id && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Businesses List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredBusinesses.map((business, index) => (
            <BusinessCard key={business.id} business={business} index={index} />
          ))}

          {filteredBusinesses.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Bu kategoride işletme bulunamadı
              </Text>
            </View>
          )}
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
  infoBanner: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  infoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.sm,
  },
  categoryButtonActive: {
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  categoryTextActive: {
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  distance: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  businessName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: Spacing.xs,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.base,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
    marginBottom: Spacing.base,
  },
  discountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginBottom: Spacing.base,
  },
  address: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
  },
  callButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  mapButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  emptyState: {
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
});

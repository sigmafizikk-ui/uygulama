import React, { useState } from 'react';
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
import { ArrowLeft, MessageCircle, Package, HandHeart } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { mockShareItems } from '@/utils/mockData';
import { ShareItem } from '@/types';

const tabs = [
  { id: 'all', label: 'Tümü' },
  { id: 'borrowing', label: 'Arıyorum' },
  { id: 'sharing', label: 'Veriyorum' },
];

function ShareCard({ item, index }: { item: ShareItem; index: number }) {
  const typeConfig = {
    borrowing: {
      label: 'Arıyorum',
      color: Colors.status.info,
      icon: Package,
    },
    sharing: {
      label: 'Paylaşıyorum',
      color: Colors.secondary[500],
      icon: HandHeart,
    },
  };

  const config = typeConfig[item.type];

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 100)}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardImage}>
          <config.icon color={config.color} size={32} strokeWidth={2} />
        </View>
        <View style={styles.cardInfo}>
          <View style={[styles.typeBadge, { backgroundColor: config.color + '20' }]}>
            <Text style={[styles.typeText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardOwner}>
          İlan Sahibi: {item.owner} (Kat: {item.floor})
        </Text>
        <TouchableOpacity style={styles.messageButton}>
          <MessageCircle color={Colors.text.inverse} size={18} strokeWidth={2} />
          <Text style={styles.messageButtonText}>Mesaj Gönder</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function SharingScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = activeTab === 'all'
    ? mockShareItems
    : mockShareItems.filter(item => item.type === activeTab);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Ödünç & Paylaşım',
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
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.map((item, index) => (
            <ShareCard key={item.id} item={item} index={index} />
          ))}

          {filteredItems.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Bu kategoride ilan bulunamadı</Text>
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
    backgroundColor: Colors.neutral[50],
  },
  backButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.xs,
  },
  tabActive: {
    backgroundColor: Colors.primary[50],
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[500],
  },
  tabTextActive: {
    color: Colors.primary[600],
    fontFamily: 'Inter-SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  cardImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  typeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
    marginTop: Spacing.xs,
  },
  cardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral[600],
    marginBottom: Spacing.base,
  },
  cardFooter: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardOwner: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.neutral[500],
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary[500],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    width: '100%',
    justifyContent: 'center',
  },
  messageButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.text.inverse,
  },
  emptyState: {
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[500],
  },
});

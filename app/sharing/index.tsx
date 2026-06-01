import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Plus, X } from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows, Gradients } from '@/utils/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { mockShareItems, currentUser } from '@/utils/mockData';
import { ShareItem } from '@/types';
import { useSite } from '@/context/SiteContext';

const tabs = [
  { id: 'all', label: 'Tümü' },
  { id: 'borrowing', label: 'Arıyorum' },
  { id: 'sharing', label: 'Veriyorum' },
];

function ShareCard({ item, index }: { item: ShareItem; index: number }) {
  const typeConfig = {
    borrowing: {
      label: 'Arıyorum',
      gradient: Gradients.faults,
    },
    sharing: {
      label: 'Paylaşıyorum',
      gradient: Gradients.sharing,
    },
  };

  const config = typeConfig[item.type];
  const Colors = useThemeColors();

  return (
    <Animated.View
      entering={FadeInDown.delay(50 + index * 80)}
      style={[styles.card, { backgroundColor: Colors.background.card }]}
    >
      <View style={styles.cardHeader}>
        <LinearGradient
          colors={config.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardIcon}
        >
          <Text style={styles.cardIconText}>
            {item.type === 'borrowing' ? '🔍' : '❤️'}
          </Text>
        </LinearGradient>
        <View style={styles.cardInfo}>
          <View style={[styles.typeBadge, { backgroundColor: config.gradient[0] + '20' }]}>
            <Text style={[styles.typeText, { color: config.gradient[0] }]}>
              {config.label}
            </Text>
          </View>
          <Text style={[styles.cardTitle, { color: Colors.text.primary }]}>{item.title}</Text>
        </View>
      </View>
      <Text style={[styles.cardDescription, { color: Colors.text.secondary }]}>{item.description}</Text>
      <View style={[styles.cardFooter, { borderTopColor: Colors.slate[200] }]}>
        <Text style={[styles.cardOwner, { color: Colors.text.tertiary }]}>
          {item.owner} • Kat {item.floor}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function SharingScreen() {
  const router = useRouter();
  const { currentSite } = useSite();
  const Colors = useThemeColors();
  const [activeTab, setActiveTab] = useState('all');
  const [shareItems, setShareItems] = useState<ShareItem[]>(mockShareItems);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItemType, setNewItemType] = useState<'borrowing' | 'sharing'>('borrowing');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  // Filter items by current site and type
  const siteItems = shareItems.filter(item => item.siteId === currentSite.id);

  const filteredItems = activeTab === 'all'
    ? siteItems
    : siteItems.filter(item => item.type === activeTab);

  const handleAddItem = () => {
    if (!newItemTitle.trim() || !newItemDescription.trim()) {
      Alert.alert('Uyarı', 'Lütfen başlık ve açıklama girin.');
      return;
    }

    const newItem: ShareItem = {
      id: Date.now().toString(),
      type: newItemType,
      title: newItemTitle.trim(),
      description: newItemDescription.trim(),
      owner: `${currentUser.name} ${currentUser.surname}`,
      floor: currentUser.floor,
      createdAt: new Date(),
      siteId: currentSite.id,
    };

    setShareItems([newItem, ...shareItems]);
    setNewItemTitle('');
    setNewItemDescription('');
    setIsModalVisible(false);

    Alert.alert('Başarılı', 'İlanınız başarıyla yayınlandı.', [{ text: 'Tamam' }]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Ödünç & Paylaşım',
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
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && { backgroundColor: Colors.primary[600] },
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: Colors.text.secondary },
                  activeTab === tab.id && { color: '#FFFFFF' },
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
            <ShareCard key={item.id} item={item} index={index} Colors={Colors} />
          ))}

          {filteredItems.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Bu kategoride ilan bulunamadı</Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsModalVisible(true)}
        >
          <LinearGradient
            colors={Gradients.heroCard}
            style={styles.fabGradient}
          >
            <Plus color={Colors.text.inverse} size={28} strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'] + 80,
  },
  card: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cardIconText: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xs,
  },
  typeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  cardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.base,
  },
  cardFooter: {},
  cardOwner: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  emptyState: {
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.slate[500],
  },
  fab: {
    position: 'absolute',
    right: Spacing['2xl'],
    bottom: Spacing['2xl'],
    width: 64,
    height: 64,
    borderRadius: 32,
    ...Shadows.lg,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


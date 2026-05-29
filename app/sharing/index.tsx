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
import { ArrowLeft, MessageCircle, Package, HandHeart, Plus, X } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { mockShareItems, currentUser } from '@/utils/mockData';
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
  const [shareItems, setShareItems] = useState<ShareItem[]>(mockShareItems);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItemType, setNewItemType] = useState<'borrowing' | 'sharing'>('borrowing');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const filteredItems = activeTab === 'all'
    ? shareItems
    : shareItems.filter(item => item.type === activeTab);

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
    };

    setShareItems([newItem, ...shareItems]);
    setNewItemTitle('');
    setNewItemDescription('');
    setIsModalVisible(false);

    Alert.alert(
      'Başarılı',
      'İlanınız başarıyla yayınlandı.',
      [{ text: 'Tamam' }]
    );
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

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsModalVisible(true)}
        >
          <Plus color={Colors.text.inverse} size={28} strokeWidth={2.5} />
        </TouchableOpacity>

        {/* New Item Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <X color={Colors.neutral[500]} size={24} strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Yeni İlan Ekle</Text>
                <TouchableOpacity
                  style={[
                    styles.publishButton,
                    (!newItemTitle.trim() || !newItemDescription.trim()) && styles.publishButtonDisabled,
                  ]}
                  onPress={handleAddItem}
                  disabled={!newItemTitle.trim() || !newItemDescription.trim()}
                >
                  <Text
                    style={[
                      styles.publishButtonText,
                      (!newItemTitle.trim() || !newItemDescription.trim()) && styles.publishButtonTextDisabled,
                    ]}
                  >
                    Yayınla
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {/* Type Selection */}
                <View style={styles.typeSection}>
                  <Text style={styles.inputLabel}>İlan Türü</Text>
                  <View style={styles.typeButtons}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        newItemType === 'borrowing' && styles.typeButtonBorrowing,
                      ]}
                      onPress={() => setNewItemType('borrowing')}
                    >
                      <Package
                        color={newItemType === 'borrowing' ? Colors.text.inverse : Colors.status.info}
                        size={20}
                        strokeWidth={2}
                      />
                      <Text
                        style={[
                          styles.typeButtonText,
                          newItemType === 'borrowing' && styles.typeButtonTextActive,
                        ]}
                      >
                        Arıyorum
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        newItemType === 'sharing' && styles.typeButtonSharing,
                      ]}
                      onPress={() => setNewItemType('sharing')}
                    >
                      <HandHeart
                        color={newItemType === 'sharing' ? Colors.text.inverse : Colors.secondary[500]}
                        size={20}
                        strokeWidth={2}
                      />
                      <Text
                        style={[
                          styles.typeButtonText,
                          newItemType === 'sharing' && styles.typeButtonTextActive,
                        ]}
                      >
                        Veriyorum
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Title Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Başlık</Text>
                  <TextInput
                    style={styles.titleInput}
                    placeholder={newItemType === 'borrowing' ? 'Ne arıyorsunuz?' : 'Ne paylaşıyorsunuz?'}
                    placeholderTextColor={Colors.neutral[400]}
                    value={newItemTitle}
                    onChangeText={setNewItemTitle}
                    maxLength={100}
                  />
                </View>

                {/* Description Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Açıklama</Text>
                  <TextInput
                    style={styles.contentInput}
                    placeholder="Detaylı açıklama yazın..."
                    placeholderTextColor={Colors.neutral[400]}
                    value={newItemDescription}
                    onChangeText={setNewItemDescription}
                    multiline
                    textAlignVertical="top"
                    maxLength={500}
                  />
                  <Text style={styles.charCount}>
                    {newItemDescription.length}/500
                  </Text>
                </View>

                <View style={styles.infoNote}>
                  <Text style={styles.infoNoteText}>
                    İlanınız {currentUser.block} bloğu komşuları tarafından görülecektir.
                  </Text>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
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
    paddingBottom: Spacing['4xl'] + 80,
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
  fab: {
    position: 'absolute',
    right: Spacing['2xl'],
    bottom: Spacing['2xl'],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  keyboardView: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
  },
  publishButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.md,
  },
  publishButtonDisabled: {
    backgroundColor: Colors.neutral[200],
  },
  publishButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.text.inverse,
  },
  publishButtonTextDisabled: {
    color: Colors.neutral[400],
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  typeSection: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[50],
  },
  typeButtonBorrowing: {
    backgroundColor: Colors.status.info,
    borderColor: Colors.status.info,
  },
  typeButtonSharing: {
    backgroundColor: Colors.secondary[500],
    borderColor: Colors.secondary[500],
  },
  typeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.neutral[600],
  },
  typeButtonTextActive: {
    color: Colors.text.inverse,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  titleInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[800],
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  contentInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[800],
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    minHeight: 120,
  },
  charCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[400],
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  infoNote: {
    backgroundColor: Colors.neutral[100],
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  infoNoteText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
});

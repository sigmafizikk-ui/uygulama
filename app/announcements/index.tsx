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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Plus, AlertTriangle, AlertCircle, Info, X } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { mockAnnouncements } from '@/utils/mockData';
import { Announcement } from '@/types';

const priorityConfig = {
  urgent: {
    label: 'Acil',
    color: Colors.priority.urgent,
    icon: AlertTriangle,
  },
  warning: {
    label: 'Uyarı',
    color: Colors.priority.warning,
    icon: AlertCircle,
  },
  info: {
    label: 'Bilgilendirme',
    color: Colors.priority.info,
    icon: Info,
  },
};

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days === 0) {
    return `Bugün ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (days === 1) {
    return `Dün ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  }
}

function AnnouncementCard({ announcement, index }: { announcement: Announcement; index: number }) {
  const config = priorityConfig[announcement.priority];
  const PriorityIcon = config.icon;

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 100)}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.priorityBadge, { backgroundColor: config.color + '20' }]}>
          <PriorityIcon color={config.color} size={14} strokeWidth={2} />
          <Text style={[styles.priorityText, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{announcement.title}</Text>
      <Text style={styles.cardContent}>{announcement.content}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardMeta}>
          {announcement.author} - {formatDate(announcement.createdAt)}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function AnnouncementsScreen() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<'urgent' | 'warning' | 'info'>('info');

  const handleAddAnnouncement = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent.trim(),
      priority: newPriority,
      author: 'Site Yönetimi',
      createdAt: new Date(),
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setNewTitle('');
    setNewContent('');
    setNewPriority('info');
    setIsModalVisible(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Duyurular',
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
          {announcements.map((announcement, index) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              index={index}
            />
          ))}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsModalVisible(true)}
        >
          <Plus color={Colors.text.inverse} size={28} strokeWidth={2.5} />
        </TouchableOpacity>

        {/* New Announcement Modal */}
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
                <Text style={styles.modalTitle}>Yeni Duyuru Yayınla</Text>
                <TouchableOpacity
                  style={[
                    styles.publishButton,
                    (!newTitle.trim() || !newContent.trim()) && styles.publishButtonDisabled,
                  ]}
                  onPress={handleAddAnnouncement}
                  disabled={!newTitle.trim() || !newContent.trim()}
                >
                  <Text
                    style={[
                      styles.publishButtonText,
                      (!newTitle.trim() || !newContent.trim()) && styles.publishButtonTextDisabled,
                    ]}
                  >
                    Yayınla
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {/* Priority Selection */}
                <View style={styles.prioritySection}>
                  <Text style={styles.inputLabel}>Önem Derecesi</Text>
                  <View style={styles.priorityButtons}>
                    {Object.entries(priorityConfig).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <TouchableOpacity
                          key={key}
                          style={[
                            styles.priorityButton,
                            newPriority === key && styles.priorityButtonActive,
                            { borderColor: config.color + '50' },
                            newPriority === key && { backgroundColor: config.color + '20', borderColor: config.color },
                          ]}
                          onPress={() => setNewPriority(key as typeof newPriority)}
                        >
                          <Icon
                            color={newPriority === key ? config.color : Colors.neutral[400]}
                            size={18}
                            strokeWidth={2}
                          />
                          <Text
                            style={[
                              styles.priorityButtonText,
                              newPriority === key && { color: config.color },
                            ]}
                          >
                            {config.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Title Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Başlık</Text>
                  <TextInput
                    style={styles.titleInput}
                    placeholder="Duyuru başlığını yazın..."
                    placeholderTextColor={Colors.neutral[400]}
                    value={newTitle}
                    onChangeText={setNewTitle}
                    maxLength={100}
                  />
                </View>

                {/* Content Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>İçerik</Text>
                  <TextInput
                    style={styles.contentInput}
                    placeholder="Duyuru içeriğini detaylı açıklayın..."
                    placeholderTextColor={Colors.neutral[400]}
                    value={newContent}
                    onChangeText={setNewContent}
                    multiline
                    textAlignVertical="top"
                    maxLength={1000}
                  />
                  <Text style={styles.charCount}>
                    {newContent.length}/1000
                  </Text>
                </View>

                <View style={styles.infoBox}>
                  <Info color={Colors.status.info} size={16} strokeWidth={2} />
                  <Text style={styles.infoText}>
                    Yayınlanan duyuru tüm site sakinleri tarafından görülecektir.
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  priorityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  cardContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: Colors.neutral[600],
    marginBottom: Spacing.base,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
    paddingTop: Spacing.sm,
  },
  cardMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[500],
    textAlign: 'right',
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
  prioritySection: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    backgroundColor: Colors.neutral[50],
  },
  priorityButtonActive: {
    borderWidth: 2,
  },
  priorityButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.neutral[500],
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
    minHeight: 150,
  },
  charCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[400],
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.status.info + '10',
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.status.info + '30',
    marginBottom: Spacing['2xl'],
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[600],
    lineHeight: 18,
  },
});

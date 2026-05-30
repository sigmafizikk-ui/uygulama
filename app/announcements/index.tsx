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
import { ArrowLeft, X } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { mockAnnouncements } from '@/utils/mockData';
import { Announcement } from '@/types';
import { useAuth } from '@/context/AuthContext';

const priorityConfig = {
  urgent: {
    label: 'Acil',
    background: Colors.status.error + '15',
    text: Colors.status.error,
    border: Colors.status.error + '40',
  },
  warning: {
    label: 'Uyarı',
    background: Colors.amber[500] + '15',
    text: Colors.amber[600],
    border: Colors.amber[500] + '40',
  },
  info: {
    label: 'Bilgilendirme',
    background: Colors.primary[500] + '15',
    text: Colors.primary[600],
    border: Colors.primary[500] + '40',
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

  return (
    <Animated.View
      entering={FadeInDown.delay(50 + index * 70)}
      style={styles.card}
    >
      <View style={[styles.priorityBadge, { backgroundColor: config.background, borderColor: config.border }]}>
        <Text style={[styles.priorityText, { color: config.text }]}>
          {config.label}
        </Text>
      </View>
      <Text style={styles.cardTitle}>{announcement.title}</Text>
      <Text style={styles.cardContent}>{announcement.content}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardMeta}>
          {announcement.author} • {formatDate(announcement.createdAt)}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function AnnouncementsScreen() {
  const router = useRouter();
  const { isAdmin } = useAuth();
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
          {announcements.map((announcement, index) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              index={index}
            />
          ))}
        </ScrollView>

        {/* Floating Action Button - Only for Admin */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        )}
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
    paddingBottom: Spacing['4xl'] + 80,
  },
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  priorityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    color: Colors.slate[800],
    marginBottom: Spacing.sm,
  },
  cardContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 21,
    color: Colors.slate[600],
    marginBottom: Spacing.base,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.slate[100],
    paddingTop: Spacing.sm,
  },
  cardMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.slate[500],
  },
  fab: {
    position: 'absolute',
    right: Spacing['2xl'],
    bottom: Spacing['2xl'],
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  fabText: {
    fontFamily: 'Inter-Regular',
    fontSize: 32,
    color: Colors.text.inverse,
    marginTop: -2,
  },
});

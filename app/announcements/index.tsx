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
import { Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { mockAnnouncements } from '@/utils/mockData';
import { Announcement } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useSite } from '@/context/SiteContext';

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

function AnnouncementCard({ announcement, index, Colors }: { announcement: Announcement; index: number; Colors: any }) {
  const config = priorityConfig[announcement.priority];

  return (
    <Animated.View
      entering={FadeInDown.delay(50 + index * 70)}
      style={[styles.card, { backgroundColor: Colors.background.card }]}
    >
      <View style={[styles.priorityBadge, { backgroundColor: config.background, borderColor: config.border }]}>
        <Text style={[styles.priorityText, { color: config.text }]}>
          {config.label}
        </Text>
      </View>
      <Text style={[styles.cardTitle, { color: Colors.text.primary }]}>{announcement.title}</Text>
      <Text style={[styles.cardContent, { color: Colors.text.secondary }]}>{announcement.content}</Text>
      <View style={[styles.cardFooter, { borderTopColor: Colors.slate[200] }]}>
        <Text style={[styles.cardMeta, { color: Colors.text.tertiary }]}>
          {announcement.author} • {formatDate(announcement.createdAt)}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function AnnouncementsScreen() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { currentSite } = useSite();
  const Colors = useThemeColors();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<'urgent' | 'warning' | 'info'>('info');

  // Filter announcements by current site
  const filteredAnnouncements = announcements.filter(
    (announcement) => announcement.siteId === currentSite.id
  );

  const handleAddAnnouncement = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent.trim(),
      priority: newPriority,
      author: 'Site Yönetimi',
      createdAt: new Date(),
      siteId: currentSite.id,
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
          {filteredAnnouncements.map((announcement, index) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              index={index}
              Colors={Colors}
            />
          ))}

          {filteredAnnouncements.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: Colors.text.secondary }]}>
                Bu site için henüz duyuru bulunmuyor
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button - Only for Admin */}
        {isAdmin && (
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: Colors.primary[600] }]}
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
  emptyState: {
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.slate[500],
    textAlign: 'center',
  },
});

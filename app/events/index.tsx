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
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, BorderRadius, Shadows, Gradients } from '@/utils/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { mockEvents } from '@/utils/mockData';
import { Event } from '@/types';

function EventCard({ event, index, Colors }: { event: Event; index: number; Colors: any }) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(50 + index * 70)}
      style={[styles.card, { backgroundColor: Colors.background.card }]}
    >
      <View style={styles.cardHeader}>
        <LinearGradient
          colors={Gradients.events}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardIcon}
        >
          <Calendar color="#FFFFFF" size={24} strokeWidth={2.5} />
        </LinearGradient>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: Colors.text.primary }]}>{event.title}</Text>
          <Text style={[styles.cardDate, { color: Colors.text.secondary }]}>
            {formatDate(event.date)}
          </Text>
        </View>
      </View>
      <Text style={[styles.cardDescription, { color: Colors.text.secondary }]}>
        {event.description}
      </Text>
      <View style={[styles.cardFooter, { borderTopColor: Colors.slate[200] }]}>
        <View style={styles.footerItem}>
          <Text style={[styles.footerLabel, { color: Colors.text.tertiary }]}>Saat</Text>
          <Text style={[styles.footerValue, { color: Colors.text.primary }]}>{formatTime(event.date)}</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={[styles.footerLabel, { color: Colors.text.tertiary }]}>Konum</Text>
          <Text style={[styles.footerValue, { color: Colors.text.primary }]}>{event.location}</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={[styles.footerLabel, { color: Colors.text.tertiary }]}>Katılımcı</Text>
          <Text style={[styles.footerValue, { color: Colors.text.primary }]}>{event.attendees.length}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function EventsScreen() {
  const router = useRouter();
  const Colors = useThemeColors();
  const [events] = useState<Event[]>(mockEvents);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Etkinlikler',
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
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} Colors={Colors} />
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
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  cardDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  cardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.base,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: Spacing.md,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  footerValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
});

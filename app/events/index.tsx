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
import { ArrowLeft, Calendar, MapPin, Clock, Check, X } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { mockEvents, currentUser } from '@/utils/mockData';
import { Event } from '@/types';

const DAYS_TO_SHOW = 14;

function generateDays() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < DAYS_TO_SHOW; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
}

function formatDay(date: Date): string {
  return date.toLocaleDateString('tr-TR', { weekday: 'short' });
}

function formatDayNumber(date: Date): string {
  return date.getDate().toString();
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

function formatEventDate(date: Date): string {
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function EventCard({
  event,
  index,
  onAttend,
  onDecline,
}: {
  event: Event;
  index: number;
  onAttend: () => void;
  onDecline: () => void;
}) {
  const isAttending = event.attendees.includes(currentUser.id);

  return (
    <Animated.View
      entering={FadeInDown.delay(150 + index * 100)}
      style={styles.eventCard}
    >
      <View style={styles.eventHeader}>
        <View style={styles.eventDateContainer}>
          <Calendar color={Colors.primary[500]} size={20} strokeWidth={2} />
          <Text style={styles.eventDate}>{formatEventDate(event.date)}</Text>
        </View>
      </View>

      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>

      <View style={styles.eventDetails}>
        <View style={styles.eventDetail}>
          <Clock color={Colors.neutral[400]} size={16} strokeWidth={2} />
          <Text style={styles.eventDetailText}>{event.time}</Text>
        </View>
        <View style={styles.eventDetail}>
          <MapPin color={Colors.neutral[400]} size={16} strokeWidth={2} />
          <Text style={styles.eventDetailText}>{event.location}</Text>
        </View>
      </View>

      <View style={styles.eventActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isAttending && styles.actionButtonActive,
          ]}
          onPress={onAttend}
        >
          <Check
            color={isAttending ? Colors.text.inverse : Colors.secondary[600]}
            size={18}
            strokeWidth={2}
          />
          <Text
            style={[
              styles.actionButtonText,
              isAttending && styles.actionButtonTextActive,
            ]}
          >
            Katılacağım
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButtonDecline}
          onPress={onDecline}
        >
          <X color={Colors.status.error} size={18} strokeWidth={2} />
          <Text style={styles.actionButtonDeclineText}>Katılmayacağım</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.eventFooter}>
        <Text style={styles.attendeeCount}>
          {event.attendees.length} kişi katılıyor
        </Text>
      </View>
    </Animated.View>
  );
}

export default function EventsScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(mockEvents);
  const days = generateDays();

  const handleAttend = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          const isAttending = event.attendees.includes(currentUser.id);
          return {
            ...event,
            attendees: isAttending
              ? event.attendees.filter((id) => id !== currentUser.id)
              : [...event.attendees, currentUser.id],
          };
        }
        return event;
      })
    );
  };

  const handleDecline = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            attendees: event.attendees.filter((id) => id !== currentUser.id),
          };
        }
        return event;
      })
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Etkinlikler',
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
        {/* Calendar Strip */}
        <View style={styles.calendarStrip}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarContent}
          >
            {days.map((day, index) => {
              const isSelected = isSameDay(day, selectedDate);
              const hasEvent = events.some((event) =>
                isSameDay(new Date(event.date), day)
              );
              const isToday = isSameDay(day, new Date());

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayItem,
                    isSelected && styles.dayItemActive,
                  ]}
                  onPress={() => setSelectedDate(day)}
                >
                  <Text
                    style={[
                      styles.dayName,
                      isSelected && styles.dayNameActive,
                    ]}
                  >
                    {formatDay(day)}
                  </Text>
                  <View
                    style={[
                      styles.dayNumberContainer,
                      isToday && styles.todayContainer,
                      isSelected && styles.dayNumberContainerActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                       isSelected && styles.dayNumberActive,
                      ]}
                    >
                      {formatDayNumber(day)}
                    </Text>
                  </View>
                  {hasEvent && <View style={styles.eventIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Events List */}
        <ScrollView
          style={styles.eventsList}
          contentContainerStyle={styles.eventsContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Yaklaşan Etkinlikler</Text>
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              onAttend={() => handleAttend(event.id)}
              onDecline={() => handleDecline(event.id)}
            />
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
  calendarStrip: {
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  calendarContent: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  dayItem: {
    alignItems: 'center',
    minWidth: 56,
    paddingHorizontal: Spacing.xs,
    marginHorizontal: Spacing.xs,
  },
  dayItemActive: {},
  dayName: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: Spacing.xs,
  },
  dayNameActive: {
    color: Colors.primary[600],
    fontFamily: 'Inter-SemiBold',
  },
  dayNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  todayContainer: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  dayNumberContainerActive: {
    backgroundColor: Colors.primary[600],
  },
  dayNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[700],
  },
  dayNumberActive: {
    color: Colors.text.inverse,
  },
  eventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary[500],
  },
  eventsList: {
    flex: 1,
  },
  eventsContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.neutral[800],
    marginBottom: Spacing.lg,
  },
  eventCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  eventDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  eventDate: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.primary[600],
  },
  eventTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  eventDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral[600],
    marginBottom: Spacing.base,
  },
  eventDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  eventDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  eventActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.secondary[50],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.secondary[300],
  },
  actionButtonActive: {
    backgroundColor: Colors.secondary[500],
    borderColor: Colors.secondary[500],
  },
  actionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.secondary[700],
  },
  actionButtonTextActive: {
    color: Colors.text.inverse,
  },
  actionButtonDecline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.status.error + '10',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.status.error + '30',
  },
  actionButtonDeclineText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.status.error,
  },
  eventFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
    paddingTop: Spacing.sm,
  },
  attendeeCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.neutral[500],
  },
});

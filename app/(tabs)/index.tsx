import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  Bell,
  User,
  Megaphone,
  Share2,
  Users,
  Wrench,
  Calendar,
  FileText,
  Store,
  MessageSquare,
  Building2,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { currentUser, siteInfo } from '@/utils/mockData';

const menuItems = [
  {
    id: 'announcements',
    title: 'Duyurular',
    icon: Megaphone,
    color: Colors.primary[500],
    route: '/announcements',
  },
  {
    id: 'sharing',
    title: 'Ödünç & Paylaşım',
    icon: Share2,
    color: Colors.secondary[500],
    route: '/sharing',
  },
  {
    id: 'neighbors',
    title: 'Komşularım',
    icon: Users,
    color: Colors.status.info,
    route: '/neighbors',
  },
  {
    id: 'faults',
    title: 'Arıza & Talep',
    icon: Wrench,
    color: Colors.status.warning,
    route: '/faults',
  },
  {
    id: 'events',
    title: 'Etkinlikler',
    icon: Calendar,
    color: Colors.secondary[600],
    route: '/events',
  },
  {
    id: 'documents',
    title: 'Belgeler',
    icon: FileText,
    color: Colors.neutral[600],
    route: '/documents',
  },
  {
    id: 'businesses',
    title: 'Anlaşmalı Esnaflar',
    icon: Store,
    color: Colors.status.error,
    route: '/businesses',
  },
  {
    id: 'forum',
    title: 'Sohbet & Soru',
    icon: MessageSquare,
    color: Colors.primary[600],
    route: '/forum',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.delay(100)}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={styles.siteNameRow}>
            <Building2 color={Colors.primary[600]} size={20} strokeWidth={2} />
            <Text style={styles.logo}>{siteInfo.name}</Text>
          </View>
          <Text style={styles.locationText}>
            {currentUser.block} - {currentUser.apartment}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell color={Colors.neutral[700]} size={24} strokeWidth={2} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileImage}>
              <User color={Colors.neutral[600]} size={22} strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Site Info Card */}
        <Animated.View
          entering={FadeInDown.delay(150)}
          style={styles.siteCard}
        >
          <View style={styles.siteCardHeader}>
            <Building2 color={Colors.primary[600]} size={24} strokeWidth={2} />
            <Text style={styles.siteCardTitle}>{siteInfo.name}</Text>
          </View>
          <Text style={styles.siteCardAddress}>{siteInfo.address}</Text>
          <View style={styles.siteCardStats}>
            <View style={styles.siteStat}>
              <Text style={styles.siteStatNumber}>{siteInfo.totalBlocks}</Text>
              <Text style={styles.siteStatLabel}>Blok</Text>
            </View>
            <View style={styles.siteStatDivider} />
            <View style={styles.siteStat}>
              <Text style={styles.siteStatNumber}>{siteInfo.totalApartments}</Text>
              <Text style={styles.siteStatLabel}>Daire</Text>
            </View>
          </View>
        </Animated.View>

        {/* Welcome Section */}
        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.welcomeSection}
        >
          <Text style={styles.welcomeTitle}>Merhaba, {currentUser.name}</Text>
          <Text style={styles.welcomeSubtitle}>
            Site hayatınızı kolaylaştıran uygulama
          </Text>
        </Animated.View>

        {/* Menu Grid */}
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(300 + index * 80)}
              style={styles.gridItem}
            >
              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => router.push(item.route)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.color + '15' },
                  ]}
                >
                  <item.icon color={item.color} size={32} strokeWidth={2} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Quick Stats */}
        <Animated.View
          entering={FadeInDown.delay(1100)}
          style={styles.statsContainer}
        >
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>4</Text>
            <Text style={styles.statsLabel}>Aktif Duyuru</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>3</Text>
            <Text style={styles.statsLabel}>Yaklaşan Etkinlik</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>6</Text>
            <Text style={styles.statsLabel}>Anlaşmalı Esnaf</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerLeft: {
    flex: 1,
  },
  siteNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 2,
  },
  logo: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.primary[700],
  },
  locationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[500],
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.status.error,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },
  profileButton: {
    marginLeft: Spacing.sm,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing['4xl'],
  },
  siteCard: {
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary[100],
  },
  siteCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  siteCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.primary[700],
  },
  siteCardAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    marginBottom: Spacing.md,
  },
  siteCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  siteStat: {
    alignItems: 'center',
    flex: 1,
  },
  siteStatNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.primary[600],
  },
  siteStatLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  siteStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.primary[200],
    marginHorizontal: Spacing.lg,
  },
  welcomeSection: {
    marginBottom: Spacing['2xl'],
  },
  welcomeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 26,
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.neutral[500],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  gridItem: {
    width: '50%',
    padding: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  menuCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  menuTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.neutral[700],
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing['xl'],
  },
  statsCard: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm + 2,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statsNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.primary[600],
    marginBottom: 2,
  },
  statsLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
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
  Home,
  ChevronRight,
  Check,
  Building2,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows, Gradients } from '@/utils/theme';
import { currentUser } from '@/utils/mockData';
import { useAuth } from '@/context/AuthContext';
import { useSite } from '@/context/SiteContext';

const menuItems = [
  {
    id: 'announcements',
    title: 'Duyurular',
    subtitle: 'Yönetimden',
    icon: Megaphone,
    gradient: Gradients.announcements,
    route: '/announcements',
  },
  {
    id: 'sharing',
    title: 'Ödünç & Paylaşım',
    subtitle: 'Komşuluk',
    icon: Share2,
    gradient: Gradients.sharing,
    route: '/sharing',
  },
  {
    id: 'neighbors',
    title: 'Komşularım',
    subtitle: 'Bina sakinleri',
    icon: Users,
    gradient: Gradients.neighbors,
    route: '/neighbors',
  },
  {
    id: 'faults',
    title: 'Arıza & Talep',
    subtitle: 'Teknik destek',
    icon: Wrench,
    gradient: Gradients.faults,
    route: '/faults',
  },
  {
    id: 'events',
    title: 'Etkinlikler',
    subtitle: 'Organizasyonlar',
    icon: Calendar,
    gradient: Gradients.events,
    route: '/events',
  },
  {
    id: 'documents',
    title: 'Belgeler',
    subtitle: 'Resmi evraklar',
    icon: FileText,
    gradient: Gradients.documents,
    route: '/documents',
  },
  {
    id: 'businesses',
    title: 'Anlaşmalı Esnaflar',
    subtitle: 'İndirimler',
    icon: Store,
    gradient: Gradients.businesses,
    route: '/businesses',
  },
  {
    id: 'forum',
    title: 'Sohbet & Soru',
    subtitle: 'Topluluk',
    icon: MessageSquare,
    gradient: Gradients.forum,
    route: '/forum',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { currentSite, setSite, availableSites } = useSite();
  const [siteModalVisible, setSiteModalVisible] = useState(false);

  const getInitials = () => {
    return `${currentUser.name.charAt(0)}${currentUser.surname.charAt(0)}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.delay(100)}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={styles.logoRow}>
            <LinearGradient
              colors={Gradients.heroCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.homeIconContainer}
            >
              <Home color={Colors.text.inverse} size={18} strokeWidth={2.5} />
            </LinearGradient>
            <Text style={styles.logo}>Apartmanım</Text>
          </View>
          <Text style={styles.locationText}>
            {currentSite.name} • {currentUser.block} • D:{currentUser.floor}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell color={Colors.slate[700]} size={24} strokeWidth={2} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={Gradients.heroCard}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </LinearGradient>
          </View>
        </View>
      </Animated.View>

      {/* Active Site Bar */}
      <Animated.View
        entering={FadeIn.delay(150)}
        style={styles.siteBar}
      >
        <View style={styles.siteBarLeft}>
          <Text style={styles.activeSiteLabel}>AKTİF SITE</Text>
          <Text style={styles.activeSiteName}>{currentSite.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.changeSiteButton}
          onPress={() => setSiteModalVisible(true)}
        >
          <Text style={styles.changeSiteText}>Değiştir</Text>
          <ChevronRight color={Colors.primary[600]} size={16} strokeWidth={2} />
        </TouchableOpacity>
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.heroCard}
        >
          <LinearGradient
            colors={Gradients.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroGradient}
          >
            <Text style={styles.heroTitle}>
              Hoş geldin, {currentUser.name} 👋
            </Text>
            <Text style={styles.heroSubtitle}>
              Sitende 2 yeni duyuru ve 1 etkinlik var.
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Menu Grid */}
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(300 + index * 70)}
              style={styles.gridItem}
            >
              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => router.push(item.route)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconContainer}
                >
                  <item.icon color={Colors.text.inverse} size={26} strokeWidth={2} />
                </LinearGradient>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Site Selector Modal */}
      <Modal
        visible={siteModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSiteModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Site Seçin</Text>
            <TouchableOpacity
              onPress={() => setSiteModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {availableSites.map((site) => {
              const isSelected = currentSite.id === site.id;
              return (
                <TouchableOpacity
                  key={site.id}
                  style={[
                    styles.siteOption,
                    isSelected && styles.siteOptionSelected,
                  ]}
                  onPress={() => {
                    setSite(site.id);
                    setSiteModalVisible(false);
                  }}
                >
                  <View style={styles.siteOptionContent}>
                    <View style={styles.siteIconContainer}>
                      <Building2
                        color={isSelected ? Colors.primary[600] : Colors.slate[500]}
                        size={24}
                        strokeWidth={2}
                      />
                    </View>
                    <View style={styles.siteInfo}>
                      <Text
                        style={[
                          styles.siteName,
                          isSelected && styles.siteNameSelected,
                        ]}
                      >
                        {site.name}
                      </Text>
                      <Text style={styles.siteAddress}>{site.address}</Text>
                    </View>
                  </View>
                  {isSelected && (
                    <View style={styles.checkContainer}>
                      <Check color={Colors.primary[600]} size={24} strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background.secondary,
  },
  headerLeft: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  homeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.slate[800],
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.slate[500],
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.xs,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.status.error,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },
  avatarContainer: {},
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.text.inverse,
  },
  siteBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    ...Shadows.sm,
  },
  siteBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  activeSiteLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: Colors.slate[400],
    letterSpacing: 0.5,
  },
  activeSiteName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.slate[700],
  },
  changeSiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.lg,
  },
  changeSiteText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.primary[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  heroCard: {
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.md,
  },
  heroGradient: {
    padding: Spacing.xl,
    paddingVertical: Spacing['2xl'],
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.text.inverse,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.inverse,
    opacity: 0.9,
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
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  menuTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.slate[800],
    marginBottom: 2,
    textAlign: 'center',
  },
  menuSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.slate[500],
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.slate[50],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[200],
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.slate[800],
  },
  closeButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.lg,
  },
  closeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.text.inverse,
  },
  modalContent: {
    padding: Spacing.lg,
  },
  siteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.slate[200],
  },
  siteOptionSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  siteOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  siteIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.slate[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  siteInfo: {
    flex: 1,
  },
  siteName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.slate[700],
    marginBottom: 2,
  },
  siteNameSelected: {
    color: Colors.primary[700],
  },
  siteAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.slate[500],
  },
  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
});

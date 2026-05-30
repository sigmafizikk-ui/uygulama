import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Key,
  Phone,
  Mail,
  Shield,
  ShieldCheck,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows, Gradients, LightColors, DarkColors } from '@/utils/theme';
import { currentUser } from '@/utils/mockData';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface SettingsItem {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action?: () => void;
  rightElement?: React.ReactNode;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function SettingsScreen() {
  const { userRole, toggleRole, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? DarkColors : LightColors;
  const [notifications, setNotifications] = useState({
    announcements: true,
    messages: true,
    events: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: currentUser.name,
    surname: currentUser.surname,
    phone: '0532 123 45 67',
    email: currentUser.email,
  });

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive' },
      ]
    );
  };

  const roleSection: SettingsSection = {
    title: 'Rol Değiştir (Test Modu)',
    items: [
      {
        icon: isAdmin ? ShieldCheck : Shield,
        title: isAdmin ? 'Yönetici Modu' : 'Sakin Modu',
        subtitle: isAdmin ? 'Tüm yetkilere sahipsiniz' : 'Standart resident yetkileri',
        rightElement: (
          <TouchableOpacity
            style={[styles.roleToggle, { backgroundColor: theme.primary[600] }]}
            onPress={toggleRole}
          >
            <Text style={styles.roleToggleText}>
              {isAdmin ? 'Sakine Geç' : 'Yöneticiye Geç'}
            </Text>
          </TouchableOpacity>
        ),
      },
    ],
  };

  const profileSection: SettingsSection = {
    title: 'Profil Bilgileri',
    items: [
      {
        icon: User,
        title: 'Ad',
        subtitle: userData.name,
        action: () => setIsEditing(true),
        rightElement: isEditing ? (
          <TextInput
            style={[styles.editInput, { color: theme.text.primary, borderBottomColor: theme.primary[500] }]}
            value={userData.name}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
            placeholder="Adınız"
            placeholderTextColor={theme.text.tertiary}
          />
        ) : (
          <Text style={[styles.settingValue, { color: theme.text.secondary }]}>{userData.name}</Text>
        ),
      },
      {
        icon: User,
        title: 'Soyad',
        subtitle: userData.surname,
        action: () => setIsEditing(true),
        rightElement: isEditing ? (
          <TextInput
            style={[styles.editInput, { color: theme.text.primary, borderBottomColor: theme.primary[500] }]}
            value={userData.surname}
            onChangeText={(text) => setUserData({ ...userData, surname: text })}
            placeholder="Soyadınız"
            placeholderTextColor={theme.text.tertiary}
          />
        ) : (
          <Text style={[styles.settingValue, { color: theme.text.secondary }]}>{userData.surname}</Text>
        ),
      },
      {
        icon: Phone,
        title: 'Telefon',
        subtitle: userData.phone,
        action: () => setIsEditing(true),
        rightElement: isEditing ? (
          <TextInput
            style={[styles.editInput, { color: theme.text.primary, borderBottomColor: theme.primary[500] }]}
            value={userData.phone}
            onChangeText={(text) => setUserData({ ...userData, phone: text })}
            placeholder="Telefon"
            placeholderTextColor={theme.text.tertiary}
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={[styles.settingValue, { color: theme.text.secondary }]}>{userData.phone}</Text>
        ),
      },
      {
        icon: Mail,
        title: 'E-posta',
        subtitle: userData.email,
        action: () => setIsEditing(true),
        rightElement: isEditing ? (
          <TextInput
            style={[styles.editInput, { color: theme.text.primary, borderBottomColor: theme.primary[500] }]}
            value={userData.email}
            onChangeText={(text) => setUserData({ ...userData, email: text })}
            placeholder="E-posta"
            placeholderTextColor={theme.text.tertiary}
            keyboardType="email-address"
          />
        ) : (
          <Text style={[styles.settingValue, { color: theme.text.secondary }]}>{userData.email}</Text>
        ),
      },
    ],
  };

  const notificationSection: SettingsSection = {
    title: 'Bildirim Ayarları',
    items: [
      {
        icon: Bell,
        title: 'Duyuru Bildirimleri',
        subtitle: 'Yönetim duyurularını al',
        rightElement: (
          <Switch
            value={notifications.announcements}
            onValueChange={(value) =>
              setNotifications({ ...notifications, announcements: value })
            }
            trackColor={{ false: theme.slate[300], true: theme.primary[400] }}
            thumbColor={theme.background.card}
          />
        ),
      },
      {
        icon: Bell,
        title: 'Mesaj Bildirimleri',
        subtitle: 'Komşu mesajlarını al',
        rightElement: (
          <Switch
            value={notifications.messages}
            onValueChange={(value) =>
              setNotifications({ ...notifications, messages: value })
            }
            trackColor={{ false: theme.slate[300], true: theme.primary[400] }}
            thumbColor={theme.background.card}
          />
        ),
      },
      {
        icon: Bell,
        title: 'Etkinlik Bildirimleri',
        subtitle: 'Yeni etkinlikleri al',
        rightElement: (
          <Switch
            value={notifications.events}
            onValueChange={(value) =>
              setNotifications({ ...notifications, events: value })
            }
            trackColor={{ false: theme.slate[300], true: theme.primary[400] }}
            thumbColor={theme.background.card}
          />
        ),
      },
    ],
  };

  const appearanceSection: SettingsSection = {
    title: 'Görünüş',
    items: [
      {
        icon: Moon,
        title: 'Karanlık Mod',
        subtitle: isDark ? 'Karanlık tema aktif' : 'Açık tema aktif',
        rightElement: (
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.slate[300], true: theme.primary[400] }}
            thumbColor={theme.background.card}
          />
        ),
      },
    ],
  };

  const securitySection: SettingsSection = {
    title: 'Güvenlik',
    items: [
      {
        icon: Key,
        title: 'Şifre Değiştir',
        subtitle: 'Hesap şifrenizi güncelleyin',
        action: () => Alert.alert('Bilgi', 'Şifre değiştirme ekranı açılacak'),
        rightElement: <ChevronRight color={theme.text.tertiary} size={20} strokeWidth={2} />,
      },
    ],
  };

  function renderSection(section: SettingsSection, sectionIndex: number) {
    return (
      <Animated.View
        key={section.title}
        entering={FadeInDown.delay(100 + sectionIndex * 150)}
        style={styles.section}
      >
        <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>{section.title}</Text>
        <View style={[styles.sectionContent, { backgroundColor: theme.background.card, borderColor: theme.slate[200] }]}>
          {section.items.map((item, itemIndex) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={`${section.title}-${item.title}`}
                style={[
                  styles.settingItem,
                  itemIndex < section.items.length - 1 && { borderBottomColor: theme.slate[200] },
                ]}
                onPress={item.action}
                disabled={!item.action && !item.rightElement}
              >
                <View style={styles.settingRow}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIconContainer, { backgroundColor: theme.primary[50] }]}>
                      <Icon color={theme.primary[600]} size={20} strokeWidth={2} />
                    </View>
                    <View style={styles.settingTextContainer}>
                      <Text style={[styles.settingTitle, { color: theme.text.primary }]}>{item.title}</Text>
                      <Text style={[styles.settingSubtitle, { color: theme.text.tertiary }]}>{item.subtitle}</Text>
                    </View>
                  </View>
                  {item.rightElement}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background.secondary, borderBottomColor: theme.slate[200] }]}>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Ayarlar</Text>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: theme.primary[50] }]}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={[styles.editButtonText, { color: theme.primary[600] }]}>
            {isEditing ? 'Kaydet' : 'Düzenle'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* User Info Card */}
      <Animated.View
        entering={FadeInDown.delay(50)}
        style={[styles.userCard, { backgroundColor: theme.background.card, borderColor: theme.slate[200] }]}
      >
        <LinearGradient
          colors={isAdmin ? Gradients.heroCard : Gradients.sharing}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.userRoleIndicator}
        >
          <Text style={styles.userRoleText}>
            {isAdmin ? 'YÖNETİCİ' : 'SAKİN'}
          </Text>
        </LinearGradient>
        <View style={[styles.userAvatar, { backgroundColor: theme.slate[100] }]}>
          <User color={theme.text.secondary} size={32} strokeWidth={2} />
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.text.primary }]}>
            {userData.name} {userData.surname}
          </Text>
          <Text style={[styles.userLocation, { color: theme.text.tertiary }]}>
            {currentUser.block} - {currentUser.apartment}
          </Text>
        </View>
      </Animated.View>

      {/* Settings Sections */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {[
          roleSection,
          profileSection,
          notificationSection,
          appearanceSection,
          securitySection,
        ].map((section, index) => renderSection(section, index))}

        {/* Logout Button */}
        <Animated.View
          entering={FadeInDown.delay(800)}
          style={styles.logoutContainer}
        >
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color={theme.text.inverse} size={20} strokeWidth={2} />
            <Text style={styles.logoutText}>Hesaptan Çıkış Yap</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.versionText, { color: theme.text.tertiary }]}>Versiyon 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  editButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  editButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  userCard: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    ...Shadows.md,
    borderWidth: 1,
  },
  userRoleIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderTopRightRadius: BorderRadius['2xl'],
    borderBottomLeftRadius: BorderRadius.lg,
  },
  userRoleText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  userInfo: {},
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  userLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['4xl'],
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  sectionContent: {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.sm,
    borderWidth: 1,
  },
  settingItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    minHeight: 56,
    borderBottomWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  editInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'right',
    borderBottomWidth: 1,
    minWidth: 100,
    paddingVertical: 2,
  },
  roleToggle: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  roleToggleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  logoutContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: '#EF4444',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius['2xl'],
    ...Shadows.md,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.lg,
  },
});

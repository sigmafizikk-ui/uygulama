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
import { Colors, Spacing, BorderRadius, Shadows, Gradients } from '@/utils/theme';
import { currentUser } from '@/utils/mockData';
import { useAuth } from '@/context/AuthContext';

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
  const [notifications, setNotifications] = useState({
    announcements: true,
    messages: true,
    events: false,
  });
  const [darkMode, setDarkMode] = useState(false);
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

  const roletSection: SettingsSection = {
    title: 'Rol Değiştir (Test Modu)',
    items: [
      {
        icon: isAdmin ? ShieldCheck : Shield,
        title: isAdmin ? 'Yönetici Modu' : 'Sakin Modu',
        subtitle: isAdmin ? 'Tüm yetkilere sahipsiniz' : 'Standart resident yetkileri',
        rightElement: (
          <TouchableOpacity
            style={styles.roleToggle}
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
            style={styles.editInput}
            value={userData.name}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
            placeholder="Adınız"
          />
        ) : (
          <Text style={styles.settingValue}>{userData.name}</Text>
        ),
      },
      {
        icon: User,
        title: 'Soyad',
        subtitle: userData.surname,
        action: () => setIsEditing(true),
        rightElement: isEditing ? (
          <TextInput
            style={styles.editInput}
            value={userData.surname}
            onChangeText={(text) => setUserData({ ...userData, surname: text })}
            placeholder="Soyadınız"
          />
        ) : (
          <Text style={styles.settingValue}>{userData.surname}</Text>
        ),
      },
      {
        icon: Phone,
        title: 'Telefon',
        subtitle: userData.phone,
        action: () => setIsEditing(true),
        rightElement: isEditing ? (
          <TextInput
            style={styles.editInput}
            value={userData.phone}
            onChangeText={(text) => setUserData({ ...userData, phone: text })}
            placeholder="Telefon"
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.settingValue}>{userData.phone}</Text>
        ),
      },
      {
        icon: Mail,
        title: 'E-posta',
        subtitle: userData.email,
        action: () => setIsEditing(true),
        rightElement: isEditing ? (
          <TextInput
            style={styles.editInput}
            value={userData.email}
            onChangeText={(text) => setUserData({ ...userData, email: text })}
            placeholder="E-posta"
            keyboardType="email-address"
          />
        ) : (
          <Text style={styles.settingValue}>{userData.email}</Text>
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
            trackColor={{ false: Colors.slate[300], true: Colors.primary[400] }}
            thumbColor={Colors.background.card}
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
            trackColor={{ false: Colors.slate[300], true: Colors.primary[400] }}
            thumbColor={Colors.background.card}
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
            trackColor={{ false: Colors.slate[300], true: Colors.primary[400] }}
            thumbColor={Colors.background.card}
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
        subtitle: 'Uygulama temasını değiştir',
        rightElement: (
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: Colors.slate[300], true: Colors.primary[400] }}
            thumbColor={Colors.background.card}
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
        rightElement: <ChevronRight color={Colors.slate[400]} size={20} strokeWidth={2} />,
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
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={styles.sectionContent}>
          {section.items.map((item, itemIndex) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={`${section.title}-${item.title}`}
                style={[
                  styles.settingItem,
                  itemIndex < section.items.length - 1 && styles.settingItemBorder,
                ]}
                onPress={item.action}
                disabled={!item.action && !item.rightElement}
              >
                <View style={styles.settingRow}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconContainer}>
                      <Icon color={Colors.primary[600]} size={20} strokeWidth={2} />
                    </View>
                    <View style={styles.settingTextContainer}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Kaydet' : 'Düzenle'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* User Info Card */}
      <Animated.View
        entering={FadeInDown.delay(50)}
        style={styles.userCard}
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
        <View style={styles.userAvatar}>
          <User color={Colors.slate[500]} size={32} strokeWidth={2} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {userData.name} {userData.surname}
          </Text>
          <Text style={styles.userLocation}>
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
          roletSection,
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
            <LogOut color={Colors.text.inverse} size={20} strokeWidth={2} />
            <Text style={styles.logoutText}>Hesaptan Çıkış Yap</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.versionText}>Versiyon 1.0.0</Text>
      </ScrollView>
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
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.secondary,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.slate[800],
  },
  editButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[50],
  },
  editButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.primary[600],
  },
  userCard: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius['2xl'],
    ...Shadows.md,
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
    color: Colors.text.inverse,
    letterSpacing: 0.5,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.slate[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  userInfo: {},
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.slate[800],
    marginBottom: 4,
  },
  userLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.slate[500],
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
    color: Colors.slate[700],
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  sectionContent: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.sm,
  },
  settingItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    minHeight: 56,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
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
    backgroundColor: Colors.primary[50],
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
    color: Colors.slate[800],
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.slate[500],
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.slate[600],
  },
  editInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.slate[800],
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary[500],
    minWidth: 100,
    paddingVertical: 2,
  },
  roleToggle: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.lg,
  },
  roleToggleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.text.inverse,
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
    backgroundColor: Colors.status.error,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius['2xl'],
    ...Shadows.md,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.inverse,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.slate[400],
    textAlign: 'center',
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.lg,
  },
});

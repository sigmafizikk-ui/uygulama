import { Tabs } from 'expo-router';
import { Home, Settings } from 'lucide-react-native';
import { Platform, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function TabLayout() {
  const Colors = useThemeColors();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.background.secondary,
            borderTopWidth: 0,
            height: Platform.OS === 'ios' ? 88 : 64,
            paddingBottom: Platform.OS === 'ios' ? 28 : 8,
            paddingTop: 10,
            elevation: 20,
            shadowColor: Colors.slate[900],
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
          },
          tabBarActiveTintColor: Colors.primary[600],
          tabBarInactiveTintColor: Colors.text.tertiary,
          tabBarLabelStyle: {
            fontFamily: 'Inter-Medium',
            fontSize: 11,
            marginTop: 4,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Ana Sayfa',
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size + 4} strokeWidth={2.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ayarlar',
            tabBarIcon: ({ color, size }) => (
              <Settings color={color} size={size + 4} strokeWidth={2.5} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({});

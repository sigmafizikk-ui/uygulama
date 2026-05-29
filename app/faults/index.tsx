import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Camera, Send, Clock, CheckCircle, Loader } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { mockFaultReports } from '@/utils/mockData';
import { FaultReport } from '@/types';

const categories = [
  { id: 'cleaning', label: 'Temizlik' },
  { id: 'technical', label: 'Teknik' },
  { id: 'security', label: 'Güvenlik' },
  { id: 'other', label: 'Diğer' },
];

const statusConfig = {
  pending: {
    label: 'Beklemede',
    color: Colors.badge.pending,
    icon: Clock,
  },
  in_progress: {
    label: 'İşleme Alındı',
    color: Colors.badge.in_progress,
    icon: Loader,
  },
  resolved: {
    label: 'Çözüldü',
    color: Colors.badge.resolved,
    icon: CheckCircle,
  },
};

function FaultCard({ report, index }: { report: FaultReport; index: number }) {
  const config = statusConfig[report.status];
  const StatusIcon = config.icon;

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 100)}
      style={styles.faultCard}
    >
      <View style={styles.faultHeader}>
        <Text style={styles.faultTitle}>{report.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
          <StatusIcon color={config.color} size={14} strokeWidth={2} />
          <Text style={[styles.statusText, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
      </View>
      <Text style={styles.faultDescription}>{report.description}</Text>
      <View style={styles.faultFooter}>
        <Text style={styles.faultMeta}>
          {report.reportedBy} - {report.createdAt.toLocaleDateString('tr-TR')}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function FaultsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('technical');
  const [description, setDescription] = useState('');

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Arıza & Talep',
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
          {/* New Request Form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Yeni Talep Oluştur</Text>

            <View style={styles.formCard}>
              {/* Category Selection */}
              <View style={styles.categoryContainer}>
                <Text style={styles.inputLabel}>Kategori</Text>
                <View style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryButton,
                        selectedCategory === cat.id && styles.categoryButtonActive,
                      ]}
                      onPress={() => setSelectedCategory(cat.id)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          selectedCategory === cat.id && styles.categoryTextActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Description Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Açıklama</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Lütfen sorunu detaylı açıklayın..."
                  placeholderTextColor={Colors.neutral[400]}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Photo Upload */}
              <View style={styles.photoSection}>
                <Text style={styles.inputLabel}>Fotoğraf Ekle</Text>
                <TouchableOpacity style={styles.photoButton}>
                  <Camera color={Colors.neutral[500]} size={24} strokeWidth={2} />
                  <Text style={styles.photoButtonText}>Fotoğraf Yükle</Text>
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton}>
                <Send color={Colors.text.inverse} size={20} strokeWidth={2} />
                <Text style={styles.submitButtonText}>Talebi Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* My Requests History */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Geçmiş Taleplerim</Text>

            {mockFaultReports.map((report, index) => (
              <FaultCard key={report.id} report={report} index={index} />
            ))}
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  formSection: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.neutral[800],
    marginBottom: Spacing.md,
  },
  formCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
  },
  categoryContainer: {
    marginBottom: Spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[500],
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  categoryTextActive: {
    color: Colors.primary[600],
    fontFamily: 'Inter-SemiBold',
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  textInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.neutral[800],
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    minHeight: 100,
  },
  photoSection: {
    marginBottom: Spacing.lg,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.neutral[300],
  },
  photoButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    marginTop: Spacing.sm,
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.inverse,
  },
  historySection: {
    marginTop: Spacing.sm,
  },
  faultCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  faultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  faultTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
    flex: 1,
    marginRight: Spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
  },
  faultDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral[600],
    marginBottom: Spacing.sm,
  },
  faultFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
    paddingTop: Spacing.sm,
  },
  faultMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
  },
});

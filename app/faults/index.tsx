import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Clock, CheckCircle, Loader, Camera, ChevronRight } from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { mockFaultReports, currentUser } from '@/utils/mockData';
import { FaultReport } from '@/types';
import { useAuth } from '@/context/AuthContext';

const categories = [
  { id: 'cleaning', label: 'Temizlik' },
  { id: 'technical', label: 'Teknik' },
  { id: 'security', label: 'Güvenlik' },
  { id: 'other', label: 'Diğer' },
];

const requestTargets = [
  { id: 'block', label: 'A Blok Yönetimi' },
  { id: 'site', label: 'Site Yönetimi' },
];

function getStatusConfig() {
  const Colors = useThemeColors();
  return {
    pending: {
      label: 'Beklemede',
      background: Colors.badge.pending,
      textColor: Colors.badge.pendingText,
      icon: Clock,
    },
    in_progress: {
      label: 'İşleme Alındı',
      background: Colors.badge.in_progress,
      textColor: Colors.badge.in_progressText,
      icon: Loader,
    },
    resolved: {
      label: 'Çözüldü',
      background: Colors.badge.resolved,
      textColor: Colors.badge.resolvedText,
      icon: CheckCircle,
    },
  };
}

function FaultCard({
  report,
  index,
  isAdmin,
  onStatusChange,
}: {
  report: FaultReport;
  index: number;
  isAdmin: boolean;
  onStatusChange: (id: string, status: FaultReport['status']) => void;
}) {
  const Colors = useThemeColors();
  const statusConfig = getStatusConfig();
  const config = statusConfig[report.status];

  return (
    <Animated.View
      entering={FadeInDown.delay(50 + index * 50)}
      style={styles.faultCard}
    >
      <View style={styles.faultContent}>
        <Text style={styles.faultTitle}>{report.title}</Text>
        <Text style={styles.faultDescription} numberOfLines={2}>
          {report.description}
        </Text>
        <Text style={styles.faultDate}>
          {report.createdAt.toLocaleDateString('tr-TR')}
        </Text>
      </View>
      <View style={styles.faultRight}>
        <View style={[styles.statusBadge, { backgroundColor: config.background }]}>
          <Text style={[styles.statusText, { color: config.textColor }]}>
            {config.label}
          </Text>
        </View>

        {isAdmin && report.status !== 'resolved' && (
          <View style={styles.adminActions}>
            {report.status === 'pending' && (
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => onStatusChange(report.id, 'in_progress')}
              >
                <Text style={styles.statusButtonText}>İşleme Al</Text>
              </TouchableOpacity>
            )}
            {report.status === 'in_progress' && (
              <TouchableOpacity
                style={[styles.statusButton, styles.statusButtonResolve]}
                onPress={() => onStatusChange(report.id, 'resolved')}
              >
                <Text style={styles.statusButtonText}>Çözüldü</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export default function FaultsScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [faultReports, setFaultReports] = useState<FaultReport[]>(mockFaultReports);
  const [selectedTarget, setSelectedTarget] = useState('block');
  const [selectedCategory, setSelectedCategory] = useState('technical');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleStatusChange = (id: string, newStatus: FaultReport['status']) => {
    setFaultReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: newStatus } : report
      )
    );
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir açıklama girin.');
      return;
    }

    const newReport: FaultReport = {
      id: Date.now().toString(),
      title: title.trim() || categories.find(c => c.id === selectedCategory)?.label + ' Talebi',
      description: description.trim(),
      category: selectedCategory as FaultReport['category'],
      status: 'pending',
      reportedBy: `${currentUser.name} ${currentUser.surname} (${currentUser.apartment})`,
      createdAt: new Date(),
    };

    setFaultReports([newReport, ...faultReports]);
    setTitle('');
    setDescription('');

    Alert.alert(
      'Başarılı',
      'Talebiniz başarıyla oluşturuldu.',
      [{ text: 'Tamam' }]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Arıza & Talep',
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
          {/* New Request Form */}
          <View style={styles.formCard}>
            {/* Request Target */}
            <View style={styles.targetSection}>
              <Text style={styles.sectionLabel}>Talep Yönü</Text>
              <View style={styles.targetButtons}>
                {requestTargets.map((target) => (
                  <TouchableOpacity
                    key={target.id}
                    style={[
                      styles.targetButton,
                      selectedTarget === target.id && styles.targetButtonActive,
                    ]}
                    onPress={() => setSelectedTarget(target.id)}
                  >
                    <Text
                      style={[
                        styles.targetButtonText,
                        selectedTarget === target.id && styles.targetButtonTextActive,
                      ]}
                    >
                      {target.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Selection */}
            <View style={styles.categorySection}>
              <Text style={styles.sectionLabel}>Kategori</Text>
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
            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>Sorun Açıklaması</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Sorunu kısaca açıklayın..."
                placeholderTextColor={Colors.slate[400]}
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Photo Upload */}
            <View style={styles.photoSection}>
              <TouchableOpacity style={styles.photoButton}>
                <Camera color={Colors.slate[500]} size={24} strokeWidth={2} />
                <Text style={styles.photoButtonText}>Fotoğraf Ekle</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                !description.trim() && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!description.trim()}
            >
              <Text style={styles.submitButtonText}>Talebi Gönder</Text>
            </TouchableOpacity>
          </View>

          {/* History Section */}
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>GEÇMİŞ TALEPLERİM</Text>
            {faultReports.map((report, index) => (
              <FaultCard
                key={report.id}
                report={report}
                index={index}
                isAdmin={isAdmin}
                onStatusChange={handleStatusChange}
              />
            ))}

            {faultReports.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Henüz bir talebiniz bulunmuyor</Text>
              </View>
            )}
          </View>
        </ScrollView>
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
    paddingBottom: Spacing['4xl'],
  },
  formCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    marginBottom: Spacing['2xl'],
    ...Shadows.md,
  },
  targetSection: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.slate[700],
    marginBottom: Spacing.sm,
  },
  targetButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  targetButton: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.slate[100],
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  targetButtonActive: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  targetButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.slate[600],
  },
  targetButtonTextActive: {
    color: Colors.text.inverse,
    fontFamily: 'Inter-SemiBold',
  },
  categorySection: {
    marginBottom: Spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.slate[100],
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  categoryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.slate[600],
  },
  categoryTextActive: {
    color: Colors.text.inverse,
    fontFamily: 'Inter-Medium',
  },
  inputSection: {
    marginBottom: Spacing.lg,
  },
  textInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.slate[800],
    backgroundColor: Colors.slate[50],
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.slate[200],
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
    backgroundColor: Colors.slate[50],
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.slate[300],
  },
  photoButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.slate[600],
  },
  submitButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.base + 2,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.slate[300],
  },
  submitButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.inverse,
  },
  historySection: {},
  historyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: Colors.slate[500],
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  faultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  faultContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  faultRight: {
    alignItems: 'flex-end',
  },
  faultTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.slate[800],
    marginBottom: 2,
  },
  faultDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.slate[600],
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  faultDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.slate[500],
  },
  statusBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
  },
  adminActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  statusButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  statusButtonResolve: {
    backgroundColor: Colors.emerald[50],
    borderColor: Colors.emerald[200],
  },
  statusButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: Colors.primary[700],
  },
  emptyState: {
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.slate[500],
  },
});

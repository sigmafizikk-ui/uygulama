import React from 'react';
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
import { ArrowLeft, FileText, Download, Eye, Folder, Calendar, HardDrive, Plus } from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { mockDocuments } from '@/utils/mockData';
import { Document } from '@/types';
import { useAuth } from '@/context/AuthContext';

function DocumentCard({ document, index }: { document: Document; index: number }) {
  const Colors = useThemeColors();

  const docTypeConfig = {
    pdf: {
      color: Colors.status.error,
      extension: '.pdf',
    },
    doc: {
      color: Colors.primary[600],
      extension: '.doc',
    },
    image: {
      color: Colors.secondary[500],
      extension: '',
    },
    other: {
      color: Colors.neutral[500],
      extension: '',
    },
  };

  const config = docTypeConfig[document.type];

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 100)}
      style={[styles.documentCard, { backgroundColor: Colors.background.card, borderColor: Colors.neutral[100] }]}
    >
      <View style={styles.documentMain}>
        <View
          style={[
            styles.documentIconContainer,
            { backgroundColor: config.color + '15' },
          ]}
        >
          <FileText color={config.color} size={28} strokeWidth={2} />
        </View>
        <View style={styles.documentInfo}>
          <Text style={[styles.documentName, { color: Colors.neutral[800] }]} numberOfLines={2}>
            {document.name}
          </Text>
          <View style={styles.documentMeta}>
            <View style={styles.metaItem}>
              <Calendar color={Colors.neutral[400]} size={12} strokeWidth={2} />
              <Text style={[styles.metaText, { color: Colors.neutral[500] }]}>
                {document.uploadedAt.toLocaleDateString('tr-TR')}
              </Text>
            </View>
            {document.size && (
              <View style={styles.metaItem}>
                <HardDrive color={Colors.neutral[400]} size={12} strokeWidth={2} />
                <Text style={[styles.metaText, { color: Colors.neutral[500] }]}>{document.size}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={[styles.documentActions, { borderTopColor: Colors.neutral[100] }]}>
        <TouchableOpacity style={[styles.viewButton, { backgroundColor: Colors.primary[50], borderColor: Colors.primary[200] }]}>
          <Eye color={Colors.primary[600]} size={18} strokeWidth={2} />
          <Text style={[styles.viewButtonText, { color: Colors.primary[700] }]}>Görüntüle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.downloadButton, { backgroundColor: Colors.secondary[50], borderColor: Colors.secondary[200] }]}>
          <Download color={Colors.secondary[600]} size={18} strokeWidth={2} />
          <Text style={[styles.downloadButtonText, { color: Colors.secondary[700] }]}>İndir</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function DocumentsScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const { isAdmin } = useAuth();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Belgeler',
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

      <SafeAreaView style={[styles.container, { backgroundColor: Colors.neutral[50] }]} edges={['bottom']}>
        {/* Folder Info Section */}
        <View style={styles.folderSection}>
          <View style={[styles.folderCard, { backgroundColor: Colors.primary[50], borderColor: Colors.primary[100] }]}>
            <View style={[styles.folderIconContainer, { backgroundColor: Colors.background.card }]}>
              <Folder color={Colors.primary[600]} size={32} strokeWidth={2} />
            </View>
            <View style={styles.folderInfo}>
              <Text style={[styles.folderTitle, { color: Colors.neutral[800] }]}>Apartman Belgeleri</Text>
              <Text style={[styles.folderCount, { color: Colors.neutral[500] }]}>
                {mockDocuments.length} belge
              </Text>
            </View>
          </View>
        </View>

        {/* Documents List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionTitle, { color: Colors.neutral[800] }]}>Tüm Belgeler</Text>
          {mockDocuments.map((document, index) => (
            <DocumentCard key={document.id} document={document} index={index} />
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Floating Action Button - Only for Admin */}
      {isAdmin && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: Colors.primary[600] }]}
          onPress={() => {}}
        >
          <Text style={[styles.fabText, { color: Colors.text.inverse }]}>+</Text>
        </TouchableOpacity>
      )}
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
  folderSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  folderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
  },
  folderIconContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
  },
  folderInfo: {
    flex: 1,
  },
  folderTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  folderCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: Spacing.md,
  },
  documentCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
  },
  documentMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  documentIconContainer: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  documentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  documentActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing.base,
    gap: Spacing.sm,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  viewButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  downloadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: Spacing['2xl'],
    bottom: Spacing['2xl'],
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  fabText: {
    fontFamily: 'Inter-Regular',
    fontSize: 32,
    marginTop: -2,
  },
});

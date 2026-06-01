import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  ArrowLeft,
  MessageCircle,
  Heart,
  Eye,
  Plus,
  Send,
  HelpCircle,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '@/utils/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { mockForumPosts, ForumPost, ForumReply, currentUser } from '@/utils/mockData';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return 'Az önce';
  if (hours < 24) return `${hours} saat önce`;
  if (days === 1) return 'Dün';
  return `${days} gün önce`;
}

function ReplyItem({ reply, index }: { reply: ForumReply; index: number }) {
  const Colors = useThemeColors();
  return (
    <View style={styles.replyItem}>
      <View style={styles.replyHeader}>
        <View style={styles.replyAuthorAvatar}>
          <Text style={styles.replyAuthorInitials}>
            {reply.author.charAt(0)}
          </Text>
        </View>
        <View style={styles.replyAuthorInfo}>
          <Text style={styles.replyAuthorName}>{reply.author}</Text>
          <Text style={styles.replyMeta}>
            {reply.authorBlock} - {reply.authorApartment} • {formatTimeAgo(reply.createdAt)}
          </Text>
        </View>
      </View>
      <Text style={styles.replyContent}>{reply.content}</Text>
      <TouchableOpacity style={styles.replyLikeButton}>
        <Heart color={Colors.neutral[400]} size={14} strokeWidth={2} />
        <Text style={styles.replyLikeCount}>{reply.likes}</Text>
      </TouchableOpacity>
    </View>
  );
}

function ForumPostCard({
  post,
  index,
  isExpanded,
  onToggle,
}: {
  post: ForumPost;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Colors = useThemeColors();

  const categoryConfig = {
    question: { icon: HelpCircle, label: 'Soru', color: Colors.status.info },
    discussion: { icon: MessageSquare, label: 'Tartışma', color: Colors.primary[500] },
    suggestion: { icon: Lightbulb, label: 'Öneri', color: Colors.secondary[500] },
    complaint: { icon: AlertTriangle, label: 'Şikayet', color: Colors.status.warning },
  };

  const config = categoryConfig[post.category];
  const CategoryIcon = config.icon;

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 100)}
      style={styles.postCard}
    >
      <View style={styles.postHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: config.color + '20' }]}>
          <CategoryIcon color={config.color} size={14} strokeWidth={2} />
          <Text style={[styles.categoryLabel, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
        <Text style={styles.postTime}>{formatTimeAgo(post.createdAt)}</Text>
      </View>

      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postContent}>{post.content}</Text>

      <View style={styles.authorRow}>
        <View style={styles.authorAvatar}>
          <Text style={styles.authorInitials}>
            {post.author.charAt(0)}
          </Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author}</Text>
          <Text style={styles.authorMeta}>
            {post.authorBlock} - {post.authorApartment}
          </Text>
        </View>
      </View>

      <View style={styles.postStats}>
        <View style={styles.postStat}>
          <Heart color={Colors.status.error} size={16} strokeWidth={2} />
          <Text style={styles.postStatNumber}>{post.likes}</Text>
        </View>
        <View style={styles.postStat}>
          <MessageCircle color={Colors.primary[500]} size={16} strokeWidth={2} />
          <Text style={styles.postStatNumber}>{post.replies.length}</Text>
        </View>
        <View style={styles.postStat}>
          <Eye color={Colors.neutral[400]} size={16} strokeWidth={2} />
          <Text style={styles.postStatNumber}>{post.views}</Text>
        </View>
      </View>

      {/* Replies Section */}
      {post.replies.length > 0 && (
        <TouchableOpacity style={styles.repliesToggle} onPress={onToggle}>
          <Text style={styles.repliesToggleText}>
            {isExpanded ? 'Gizle' : `${post.replies.length} cevap`}
          </Text>
          {isExpanded ? (
            <ChevronUp color={Colors.primary[600]} size={18} strokeWidth={2} />
          ) : (
            <ChevronDown color={Colors.primary[600]} size={18} strokeWidth={2} />
          )}
        </TouchableOpacity>
      )}

      {isExpanded && (
        <View style={styles.repliesContainer}>
          {post.replies.map((reply, replyIndex) => (
            <ReplyItem key={reply.id} reply={reply} index={replyIndex} />
          ))}

          {/* Quick Reply */}
          <View style={styles.quickReplyContainer}>
            <TextInput
              style={styles.quickReplyInput}
              placeholder="Cevap yazın..."
              placeholderTextColor={Colors.neutral[400]}
            />
            <TouchableOpacity style={styles.quickReplyButton}>
              <Send color={Colors.text.inverse} size={18} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

export default function ForumScreen() {
  const Colors = useThemeColors();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [isNewPostModalVisible, setIsNewPostModalVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'question' | 'discussion' | 'suggestion' | 'complaint'>('question');

  const categoryConfig = getCategoryConfig();

  const togglePost = (postId: string) => {
    setExpandedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const filteredPosts = activeCategory
    ? mockForumPosts.filter((p) => p.category === activeCategory)
    : mockForumPosts;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Sohbet & Soru',
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
        {/* Category Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              !activeCategory && styles.filterButtonActive,
            ]}
            onPress={() => setActiveCategory(null)}
          >
            <Text
              style={[
                styles.filterText,
                !activeCategory && styles.filterTextActive,
              ]}
            >
              Tümü
            </Text>
          </TouchableOpacity>
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterButton,
                  activeCategory === key && styles.filterButtonActive,
                ]}
                onPress={() => setActiveCategory(key)}
              >
                <Icon
                  color={activeCategory === key ? Colors.text.inverse : config.color}
                  size={14}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.filterText,
                    activeCategory === key && styles.filterTextActive,
                  ]}
                >
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Posts List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredPosts.map((post, index) => (
            <ForumPostCard
              key={post.id}
              post={post}
              index={index}
              isExpanded={expandedPosts.has(post.id)}
              onToggle={() => togglePost(post.id)}
            />
          ))}

          {filteredPosts.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Bu kategoride henüz gönderi yok
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsNewPostModalVisible(true)}
        >
          <Plus color={Colors.text.inverse} size={28} strokeWidth={2.5} />
        </TouchableOpacity>

        {/* New Post Modal */}
        <Modal
          visible={isNewPostModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsNewPostModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsNewPostModalVisible(false)}>
                <Text style={styles.modalCancel}>İptal</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Yeni Gönderi</Text>
              <TouchableOpacity style={styles.modalSubmit}>
                <Text style={styles.modalSubmitText}>Paylaş</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.categorySelector}>
                <Text style={styles.inputLabel}>Kategori</Text>
                <View style={styles.categoryButtons}>
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.categorySelectorButton,
                          newPostCategory === key && styles.categorySelectorButtonActive,
                        ]}
                        onPress={() => setNewPostCategory(key as typeof newPostCategory)}
                      >
                        <Icon
                          color={newPostCategory === key ? Colors.text.inverse : config.color}
                          size={18}
                          strokeWidth={2}
                        />
                        <Text
                          style={[
                            styles.categorySelectorText,
                            newPostCategory === key && styles.categorySelectorTextActive,
                          ]}
                        >
                          {config.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Başlık</Text>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Başlık yazın..."
                  placeholderTextColor={Colors.neutral[400]}
                  value={newPostTitle}
                  onChangeText={setNewPostTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mesajınız</Text>
                <TextInput
                  style={styles.contentInput}
                  placeholder="Mesajınızı yazın..."
                  placeholderTextColor={Colors.neutral[400]}
                  value={newPostContent}
                  onChangeText={setNewPostContent}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.lg,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[600],
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.neutral[600],
  },
  filterTextActive: {
    color: Colors.text.inverse,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'] + 80,
  },
  postCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  categoryLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
  },
  postTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  postTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  postContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: Colors.neutral[600],
    marginBottom: Spacing.base,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  authorInitials: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.primary[600],
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  authorMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  postStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  postStatNumber: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.neutral[600],
  },
  repliesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  repliesToggleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.primary[600],
  },
  repliesContainer: {
    marginTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
    paddingTop: Spacing.base,
  },
  replyItem: {
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  replyAuthorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  replyAuthorInitials: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.secondary[600],
  },
  replyAuthorInfo: {
    flex: 1,
  },
  replyAuthorName: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.neutral[700],
  },
  replyMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.neutral[500],
  },
  replyContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral[600],
    marginBottom: Spacing.sm,
  },
  replyLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
  },
  replyLikeCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  quickReplyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  quickReplyInput: {
    flex: 1,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[800],
  },
  quickReplyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[500],
  },
  fab: {
    position: 'absolute',
    right: Spacing['2xl'],
    bottom: Spacing['2xl'],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  modalCancel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[500],
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
  },
  modalSubmit: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.md,
  },
  modalSubmitText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.text.inverse,
  },
  modalContent: {
    padding: Spacing.lg,
  },
  categorySelector: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categorySelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  categorySelectorButtonActive: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  categorySelectorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.neutral[600],
  },
  categorySelectorTextActive: {
    color: Colors.text.inverse,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  titleInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[800],
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  contentInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[800],
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    minHeight: 150,
  },
});

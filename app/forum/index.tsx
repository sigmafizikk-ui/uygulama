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
    <View style={[styles.replyItem, { backgroundColor: Colors.neutral[50] }]}>
      <View style={styles.replyHeader}>
        <View style={[styles.replyAuthorAvatar, { backgroundColor: Colors.secondary[100] }]}>
          <Text style={[styles.replyAuthorInitials, { color: Colors.secondary[600] }]}>
            {reply.author.charAt(0)}
          </Text>
        </View>
        <View style={styles.replyAuthorInfo}>
          <Text style={[styles.replyAuthorName, { color: Colors.neutral[700] }]}>{reply.author}</Text>
          <Text style={[styles.replyMeta, { color: Colors.neutral[500] }]}>
            {reply.authorBlock} - {reply.authorApartment} • {formatTimeAgo(reply.createdAt)}
          </Text>
        </View>
      </View>
      <Text style={[styles.replyContent, { color: Colors.neutral[600] }]}>{reply.content}</Text>
      <TouchableOpacity style={styles.replyLikeButton}>
        <Heart color={Colors.neutral[400]} size={14} strokeWidth={2} />
        <Text style={[styles.replyLikeCount, { color: Colors.neutral[500] }]}>{reply.likes}</Text>
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
      style={[
        styles.postCard,
        {
          backgroundColor: Colors.background.card,
          borderColor: Colors.neutral[100],
        },
      ]}
    >
      <View style={styles.postHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: config.color + '20' }]}>
          <CategoryIcon color={config.color} size={14} strokeWidth={2} />
          <Text style={[styles.categoryLabel, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
        <Text style={[styles.postTime, { color: Colors.neutral[500] }]}>{formatTimeAgo(post.createdAt)}</Text>
      </View>

      <Text style={[styles.postTitle, { color: Colors.neutral[800] }]}>{post.title}</Text>
      <Text style={[styles.postContent, { color: Colors.neutral[600] }]}>{post.content}</Text>

      <View style={styles.authorRow}>
        <View style={[styles.authorAvatar, { backgroundColor: Colors.primary[100] }]}>
          <Text style={[styles.authorInitials, { color: Colors.primary[600] }]}>
            {post.author.charAt(0)}
          </Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: Colors.neutral[700] }]}>{post.author}</Text>
          <Text style={[styles.authorMeta, { color: Colors.neutral[500] }]}>
            {post.authorBlock} - {post.authorApartment}
          </Text>
        </View>
      </View>

      <View style={[styles.postStats, { borderBottomColor: Colors.neutral[100] }]}>
        <View style={styles.postStat}>
          <Heart color={Colors.status.error} size={16} strokeWidth={2} />
          <Text style={[styles.postStatNumber, { color: Colors.neutral[600] }]}>{post.likes}</Text>
        </View>
        <View style={styles.postStat}>
          <MessageCircle color={Colors.primary[500]} size={16} strokeWidth={2} />
          <Text style={[styles.postStatNumber, { color: Colors.neutral[600] }]}>{post.replies.length}</Text>
        </View>
        <View style={styles.postStat}>
          <Eye color={Colors.neutral[400]} size={16} strokeWidth={2} />
          <Text style={[styles.postStatNumber, { color: Colors.neutral[600] }]}>{post.views}</Text>
        </View>
      </View>

      {/* Replies Section */}
      {post.replies.length > 0 && (
        <TouchableOpacity style={styles.repliesToggle} onPress={onToggle}>
          <Text style={[styles.repliesToggleText, { color: Colors.primary[600] }]}>
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
        <View style={[styles.repliesContainer, { borderTopColor: Colors.neutral[100] }]}>
          {post.replies.map((reply, replyIndex) => (
            <ReplyItem key={reply.id} reply={reply} index={replyIndex} />
          ))}

          {/* Quick Reply */}
          <View style={styles.quickReplyContainer}>
            <TextInput
              style={[
                styles.quickReplyInput,
                {
                  backgroundColor: Colors.neutral[100],
                  color: Colors.neutral[800],
                },
              ]}
              placeholder="Cevap yazın..."
              placeholderTextColor={Colors.neutral[400]}
            />
            <TouchableOpacity style={[styles.quickReplyButton, { backgroundColor: Colors.primary[600] }]}>
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

      <SafeAreaView style={[styles.container, { backgroundColor: Colors.neutral[50] }]} edges={['bottom']}>
        {/* Category Filters */}
        <View
          style={[
            styles.filtersContainer,
            {
              backgroundColor: Colors.background.secondary,
              borderBottomColor: Colors.neutral[200],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: !activeCategory ? Colors.primary[600] : Colors.neutral[100],
              },
            ]}
            onPress={() => setActiveCategory(null)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: !activeCategory ? Colors.text.inverse : Colors.neutral[600],
                },
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
                  {
                    backgroundColor: activeCategory === key ? Colors.primary[600] : Colors.neutral[100],
                  },
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
                    {
                      color: activeCategory === key ? Colors.text.inverse : Colors.neutral[600],
                    },
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
              <Text style={[styles.emptyText, { color: Colors.neutral[500] }]}>
                Bu kategoride henüz gönderi yok
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: Colors.primary[600] }]}
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
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: Colors.background.secondary }]}>
            <View
              style={[
                styles.modalHeader,
                {
                  backgroundColor: Colors.background.secondary,
                  borderBottomColor: Colors.neutral[200],
                },
              ]}
            >
              <TouchableOpacity onPress={() => setIsNewPostModalVisible(false)}>
                <Text style={[styles.modalCancel, { color: Colors.neutral[500] }]}>İptal</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: Colors.neutral[800] }]}>Yeni Gönderi</Text>
              <TouchableOpacity style={[styles.modalSubmit, { backgroundColor: Colors.primary[600] }]}>
                <Text style={[styles.modalSubmitText, { color: Colors.text.inverse }]}>Paylaş</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.categorySelector}>
                <Text style={[styles.inputLabel, { color: Colors.neutral[700] }]}>Kategori</Text>
                <View style={styles.categoryButtons}>
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.categorySelectorButton,
                          {
                            backgroundColor: newPostCategory === key ? Colors.primary[600] : Colors.neutral[100],
                            borderColor: newPostCategory === key ? Colors.primary[600] : Colors.neutral[200],
                          },
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
                            {
                              color: newPostCategory === key ? Colors.text.inverse : Colors.neutral[600],
                            },
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
                <Text style={[styles.inputLabel, { color: Colors.neutral[700] }]}>Başlık</Text>
                <TextInput
                  style={[
                    styles.titleInput,
                    {
                      color: Colors.neutral[800],
                      backgroundColor: Colors.neutral[50],
                      borderColor: Colors.neutral[200],
                    },
                  ]}
                  placeholder="Başlık yazın..."
                  placeholderTextColor={Colors.neutral[400]}
                  value={newPostTitle}
                  onChangeText={setNewPostTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: Colors.neutral[700] }]}>Mesajınız</Text>
                <TextInput
                  style={[
                    styles.contentInput,
                    {
                      color: Colors.neutral[800],
                      backgroundColor: Colors.neutral[50],
                      borderColor: Colors.neutral[200],
                    },
                  ]}
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
    borderBottomWidth: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  filterButtonActive: {
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  filterTextActive: {
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'] + 80,
  },
  postCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
    borderWidth: 1,
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
  },
  postTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: Spacing.sm,
  },
  postContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  authorInitials: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  authorMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  postStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  postStatNumber: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
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
  },
  repliesContainer: {
    marginTop: Spacing.base,
    borderTopWidth: 1,
    paddingTop: Spacing.base,
  },
  replyItem: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  replyAuthorInitials: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  replyAuthorInfo: {
    flex: 1,
  },
  replyAuthorName: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  replyMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
  },
  replyContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
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
  },
  quickReplyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  quickReplyInput: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  quickReplyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  fab: {
    position: 'absolute',
    right: Spacing['2xl'],
    bottom: Spacing['2xl'],
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalCancel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  modalSubmit: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  modalSubmitText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
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
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  categorySelectorButtonActive: {
    borderWidth: 1,
  },
  categorySelectorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  categorySelectorTextActive: {
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  titleInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
  },
  contentInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    minHeight: 150,
  },
});

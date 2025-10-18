import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Image as ExpoImage } from 'expo-image';

const renderStars = (rating, theme) => {
  let stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? 'star' : 'star-outline'}
        size={16}
        color={theme.colors.primary}
      />
    );
  }
  return stars;
};

const ReviewCard = ({ review }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.cardBackground, borderBottomColor: theme.colors.border }]}>
      <View style={styles.header}>
        <ExpoImage
          style={styles.avatar}
          source={{ uri: review.profile_photo_url }}
          placeholder={require('../assets/icon.png')}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: theme.colors.text }]}>{review.author_name}</Text>
          <Text style={[styles.relativeTime, { color: theme.colors.textSecondary }]}>{review.relative_time_description}</Text>
        </View>
        <View style={styles.ratingContainer}>
          {renderStars(review.rating, theme)}
        </View>
      </View>
      <Text style={[styles.reviewText, { color: theme.colors.textSecondary }]}>
        {review.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    padding: 16, 
    borderBottomWidth: 1 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 12 
  },
  authorInfo: { 
    flex: 1 
  },
  authorName: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  relativeTime: { 
    fontSize: 12, 
    marginTop: 2 
  },
  ratingContainer: { 
    flexDirection: 'row' 
  },
  reviewText: { 
    fontSize: 14, 
    lineHeight: 20 
  },
});

export default ReviewCard;


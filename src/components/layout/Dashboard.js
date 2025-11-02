// src/components/layout/Dashboard.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import Header from '../common/Header';
import { colors, globalStyles } from '../../styles/theme';

const { width } = Dimensions.get('window');

const Dashboard = ({
  title,
  subtitle,
  children,
  onRefresh,
  refreshing = false,
  headerProps = {},
  scrollable = true,
  showStats = false,
  statsData = [],
  backgroundColor = colors.background,
}) => {
  const [layoutWidth, setLayoutWidth] = useState(width);

  const handleLayout = (event) => {
    const { width: newWidth } = event.nativeEvent.layout;
    setLayoutWidth(newWidth);
  };

  const isTablet = layoutWidth > 768;
  const isDesktop = layoutWidth > 1024;

  const renderStats = () => {
    if (!showStats || !statsData.length) return null;

    return (
      <View style={[
        styles.statsContainer,
        isTablet && styles.statsContainerTablet,
        isDesktop && styles.statsContainerDesktop,
      ]}>
        {statsData.map((stat, index) => (
          <View
            key={stat.key || index}
            style={[
              styles.statCard,
              isTablet && styles.statCardTablet,
            ]}
          >
            <View style={styles.statContent}>
              {stat.icon && (
                <View style={styles.statIcon}>
                  {stat.icon}
                </View>
              )}
              <View style={styles.statText}>
                <Text style={[
                  styles.statNumber,
                  { color: stat.color || colors.primary }
                ]}>
                  {stat.number}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    const content = (
      <View style={styles.content} onLayout={handleLayout}>
        {renderStats()}
        {children}
      </View>
    );

    if (scrollable) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && styles.scrollContentDesktop,
          ]}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            ) : undefined
          }
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      );
    }

    return content;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Header
        title={title}
        subtitle={subtitle}
        showLogo
        {...headerProps}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentDesktop: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexWrap: 'wrap',
  },
  statsContainerTablet: {
    paddingHorizontal: 32,
  },
  statsContainerDesktop: {
    paddingHorizontal: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    marginVertical: 4,
    minWidth: Platform.OS === 'web' ? 200 : undefined,
    ...globalStyles.shadow,
  },
  statCardTablet: {
    marginHorizontal: 8,
    padding: 20,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  statLabel: {
    fontSize: 12,
    color: colors.placeholder,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default Dashboard;
// src/screens/LandingScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ImageBackground,
  Image,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { colors } from '../styles/theme';

const NAV_LINKS = [
  { key: 'contact', label: 'Contact Us', route: 'contact' },
  { key: 'about', label: 'About', route: 'about' },
  { key: 'whyus', label: 'Why Us', route: 'why-us' },
  { key: 'admin', label: 'Admin', route: null },
];

const FEATURES = [
  { title: 'ISO Certified', description: 'Aligned with stringent global quality benchmarks.' },
  { title: 'Latest Tech', description: 'AI-guided treatment planning for precision results.' },
  { title: '360° Care', description: 'Orthodontists, lab & support — all under one roof.' },
];

const LandingScreen = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth >= 900;

  const [hoveredKey, setHoveredKey] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const homeBgSource = require('./home_bg.jpg');
  const headerBgSource = require('./a1_header_bg.jpg');
  const logoSource = require('./a1_logo.png');

  const handleNavPress = (item) => {
    if (item.key === 'admin') {
      navigation.navigate('Login', { userType: 'a1_user' });
      return;
    }

    if (item.route) {
      navigation.navigate(item.route);
    }
  };

  const handleDoctorLogin = () => {
    navigation.navigate('Login', { userType: 'doctor' });
  };

  return (
    <ImageBackground source={headerBgSource} style={styles.background} resizeMode="cover">
      <View style={styles.backdrop} />

      {isLargeScreen ? (
        <Animated.View
          style={[
            styles.container,
            styles.containerWide,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={[styles.navBar, styles.navBarWide]}>
            <View style={styles.brandGroup}>
              <View style={styles.brandLogoShell}>
                <Image source={logoSource} style={styles.brandLogo} resizeMode="contain" />
              </View>
              <Text style={styles.brandTagline}>German precision aligners for effortless smiles</Text>
            </View>

            <View style={styles.navLinks}>
              {NAV_LINKS.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => handleNavPress(item)}
                  onHoverIn={() => setHoveredKey(item.key)}
                  onHoverOut={() => setHoveredKey(null)}
                  style={[styles.navLink, hoveredKey === item.key && styles.navLinkHovered]}
                >
                  <Text style={styles.navLinkText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.hero, styles.heroRow]}>
            <View style={[styles.heroVisual, styles.heroVisualWide]}>
              <View style={styles.heroImageGlow} />
              <Image source={homeBgSource} style={[styles.heroImage, styles.heroImageLarge]} resizeMode="contain" />
            </View>

            <View style={[styles.heroCopy, styles.heroCopyWide]}>
              <View style={styles.heroTexts}>
                <Text style={styles.eyebrow}>Smile Transformation Specialists</Text>
                <Text style={styles.heroTitle}>
                  Clear aligners crafted for confident living.
                </Text>
                <Text style={styles.heroSubtitle}>
                  From digital scans to final retention, we orchestrate every stage with precision,
                  speed, and concierge-level support.
                </Text>
              </View>

              <View style={[styles.ctaRow, styles.ctaRowWide]}>
                <Pressable
                  onPress={handleDoctorLogin}
                  onHoverIn={() => setHoveredKey('doctor')}
                  onHoverOut={() => setHoveredKey(null)}
                  style={[styles.primaryCta, hoveredKey === 'doctor' && styles.primaryCtaHovered]}
                >
                  <Text style={styles.primaryCtaText}>Doctor Login</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={[styles.featureFooter, styles.featureFooterWide]}>
            {FEATURES.map((feature) => (
              <View
                key={feature.title}
                style={[styles.featureCard, styles.featureCardWide]}
              >
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          bounces={false}
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
        >
          <Animated.View
            style={[
              styles.container,
              styles.containerNarrow,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={[styles.navBar, styles.navBarCompact]}>
              <View style={styles.brandGroup}>
                <View style={styles.brandLogoShell}>
                  <Image source={logoSource} style={styles.brandLogo} resizeMode="contain" />
                </View>
                <Text style={styles.brandTagline}>German precision aligners for effortless smiles</Text>
              </View>

              <View style={styles.navLinks}>
                {NAV_LINKS.map((item) => (
                  <Pressable
                    key={item.key}
                    onPress={() => handleNavPress(item)}
                    onHoverIn={() => setHoveredKey(item.key)}
                    onHoverOut={() => setHoveredKey(null)}
                    style={[styles.navLink, hoveredKey === item.key && styles.navLinkHovered]}
                  >
                    <Text style={styles.navLinkText}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={[styles.hero, styles.heroColumn]}>
              <View style={[styles.heroVisual, styles.heroVisualNarrow]}>
                <View style={styles.heroImageGlow} />
                <Image source={homeBgSource} style={styles.heroImage} resizeMode="contain" />
              </View>

              <View style={[styles.heroCopy, styles.heroCopyNarrow]}>
                <View style={[styles.heroTexts, styles.heroTextsCompact]}>
                  <Text style={styles.eyebrow}>Smile Transformation Specialists</Text>
                  <Text style={[styles.heroTitle, styles.heroTitleCompact]}>
                    Clear aligners crafted for confident living.
                  </Text>
                  <Text style={[styles.heroSubtitle, styles.heroSubtitleCompact]}>
                    From digital scans to final retention, we orchestrate every stage with precision,
                    speed, and concierge-level support.
                  </Text>
                </View>

                <View style={styles.ctaRow}>
                  <Pressable
                    onPress={handleDoctorLogin}
                    onHoverIn={() => setHoveredKey('doctor')}
                    onHoverOut={() => setHoveredKey(null)}
                    style={[styles.primaryCta, hoveredKey === 'doctor' && styles.primaryCtaHovered]}
                  >
                    <Text style={styles.primaryCtaText}>Doctor Login</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={[styles.featureFooter, styles.featureFooterStack]}>
              {FEATURES.map((feature) => (
                <View
                  key={feature.title}
                  style={[styles.featureCard, styles.featureCardStack]}
                >
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#041710',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 23, 16, 0.55)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
  },
  containerWide: {
    maxWidth: 1200,
    paddingHorizontal: 48,
    paddingVertical: 32,
    maxHeight: '100vh',
    overflow: 'hidden',
  },
  containerNarrow: {
    maxWidth: 960,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  navBar: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(6, 33, 24, 0.55)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 6,
  },
  navBarWide: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  navBarCompact: {
    flexDirection: 'column',
    gap: 20,
    marginBottom: 20,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    minWidth: 0,
  },
  brandLogoShell: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  brandLogo: {
    width: '70%',
    height: '70%',
  },
  brandTagline: {
    color: '#F5F8F6',
    fontSize: 15,
    fontWeight: '600',
    maxWidth: 250,
    flexShrink: 1,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  navLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  navLinkHovered: {
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
    borderColor: colors.gold,
  },
  navLinkText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  hero: {
    flex: 1,
    width: '100%',
    gap: 32,
    minHeight: 0,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
  },
  heroColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroCopy: {
    flex: 1,
    gap: 20,
  },
  heroCopyWide: {
    gap: 28,
    paddingBottom: 16,
    paddingLeft: 20,
  },
  heroCopyNarrow: {
    alignItems: 'center',
  },
  heroTexts: {
    gap: 12,
  },
  heroTextsCompact: {
    alignItems: 'center',
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 42,
    lineHeight: 50,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroTitleCompact: {
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(245, 248, 246, 0.88)',
    maxWidth: 520,
  },
  heroSubtitleCompact: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    alignSelf: 'center',
  },
  ctaRow: {
    flexDirection: 'column',
    gap: 12,
    maxWidth: 360,
    alignSelf:'center'
  },
  ctaRowWide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryCta: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: colors.gold,
    alignItems: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 6,
  },
  primaryCtaHovered: {
    backgroundColor: '#FFE066',
    transform: [{ translateY: -2 }],
  },
  primaryCtaText: {
    color: colors.darkGreen,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  secondaryCta: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  secondaryCtaHovered: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(255,215,0,0.15)',
    transform: [{ translateY: -2 }],
  },
  secondaryCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  featureCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(6, 33, 24, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  featureCardWide: {
    flex: 1,
    minWidth: 0,
    maxWidth: 320,
  },
  featureCardStack: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  featureTitle: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDescription: {
    color: 'rgba(245, 248, 246, 0.85)',
    fontSize: 14,
    lineHeight: 20,
  },
  heroVisual: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroVisualWide: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 24,
    minHeight: 300,
    maxHeight: 450,
  },
  heroVisualNarrow: {
    width: '100%',
    maxWidth: 420,
    minHeight: 250,
  },
  heroImageGlow: {
    position: 'absolute',
    width: '88%',
    height: '80%',
    borderRadius: 220,
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
    shadowColor: colors.gold,
    shadowOpacity: 0.35,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 0 },
  },
  heroImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.35,
  },
  heroImageLarge: {
    width: '100%',
    maxWidth: 580,
  },
  featureFooter: {
    width: '100%',
    marginTop: 20,
    gap: 12,
    alignSelf: 'stretch',
  },
  featureFooterWide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  featureFooterStack: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
});

export default LandingScreen;

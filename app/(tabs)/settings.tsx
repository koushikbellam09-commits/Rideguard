/**
 * app/(tabs)/settings.tsx
 * RideGuard — Settings screen.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ACCENT = '#D32F2F';

function SettingsRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.6}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.rowIconWrap}>
        <Ionicons name={icon} size={19} color={ACCENT} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {value !== undefined && <Text style={styles.rowValue}>{value}</Text>}
      {onPress && (
        <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
      )}
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Settings</Text>

        <SectionHeader title="Safety" />
        <View style={styles.section}>
          <SettingsRow
            icon="people"
            label="Emergency contacts"
            onPress={() => router.push('/contacts')}
          />
          <SettingsRow icon="briefcase" label="Carry mode" value="Pocket" />
          <SettingsRow
            icon="speedometer"
            label="Crash sensitivity"
            value="Medium"
          />
        </View>

        <SectionHeader title="Permissions" />
        <View style={styles.section}>
          <SettingsRow
            icon="location"
            label="Location access"
            onPress={() => Linking.openSettings()}
          />
          <SettingsRow
            icon="battery-charging"
            label="Background & battery"
            onPress={() => Linking.openSettings()}
          />
        </View>

        <SectionHeader title="About" />
        <View style={styles.section}>
          <SettingsRow icon="information-circle" label="Version" value="1.0.0" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EFEFEF',
  },
  rowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 14,
    color: '#999',
    marginRight: 4,
  },
});

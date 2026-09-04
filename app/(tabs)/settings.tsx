/**
 * app/(tabs)/settings.tsx
 * RideGuard — Settings screen.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  startCarryPositionDetection,
  stopCarryPositionDetection,
  getCurrentCarryPosition,
} from '../../carryPositionDetector';

const ACCENT = '#D32F2F';

const SENSITIVITY_KEY = 'rideguard_sensitivity';
const SENSITIVITY_LEVELS = ['Low', 'Medium', 'High'];

const CARRY_LABELS: Record<string, string> = {
  pocket: 'Pocket',
  bag: 'Bag',
  mounted: 'Handlebar mount',
  hand: 'In hand',
  unknown: 'Detecting…',
};

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

function OptionModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={modalStyles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={modalStyles.sheet}>
          <Text style={modalStyles.title}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={modalStyles.option}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={modalStyles.optionText}>{item}</Text>
                {item === selected && (
                  <Ionicons name="checkmark" size={20} color={ACCENT} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function SettingsScreen() {
  const router = useRouter();

  const [carryPosition, setCarryPosition] = useState(getCurrentCarryPosition());
  const [sensitivity, setSensitivity] = useState('Medium');
  const [sensitivityModalOpen, setSensitivityModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const savedSensitivity = await AsyncStorage.getItem(SENSITIVITY_KEY);
      if (savedSensitivity) setSensitivity(savedSensitivity);
    })();

    startCarryPositionDetection();
    (global as any).onCarryPositionChanged = (position: string) => {
      setCarryPosition(position);
    };

    return () => {
      stopCarryPositionDetection();
      (global as any).onCarryPositionChanged = undefined;
    };
  }, []);

  const handleSensitivitySelect = async (value: string) => {
    setSensitivity(value);
    await AsyncStorage.setItem(SENSITIVITY_KEY, value);
  };

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
          <SettingsRow
            icon="briefcase"
            label="Carry mode"
            value={CARRY_LABELS[carryPosition] ?? 'Detecting…'}
          />
          <SettingsRow
            icon="speedometer"
            label="Crash sensitivity"
            value={sensitivity}
            onPress={() => setSensitivityModalOpen(true)}
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

      <OptionModal
        visible={sensitivityModalOpen}
        title="Crash sensitivity"
        options={SENSITIVITY_LEVELS}
        selected={sensitivity}
        onSelect={handleSensitivitySelect}
        onClose={() => setSensitivityModalOpen(false)}
      />
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

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EFEFEF',
  },
  optionText: {
    fontSize: 15,
    color: '#1A1A1A',
  },
});
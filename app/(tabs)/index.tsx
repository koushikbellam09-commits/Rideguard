/**
 * app/(tabs)/index.tsx
 * RideGuard — Home screen.
 *
 * Shows monitoring status, emergency contacts summary (live count from
 * contactsStorage), carry mode setting, and quick actions.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { getContacts } from '../../contactsStorage';

const ACCENT = '#D32F2F';
const BG = '#FAFAFA';

export default function HomeScreen() {
  const router = useRouter();
  const [contactCount, setContactCount] = useState(0);
  const [carryMode, setCarryMode] = useState('Pocket');
  const [monitoring, setMonitoring] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const contacts = await getContacts();
        if (active) setContactCount(contacts.length);
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBadge}>
              <Ionicons name="shield-checkmark" size={22} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>RideGuard</Text>
          </View>
          <View
            style={[
              styles.statusPill,
              monitoring ? styles.statusPillActive : styles.statusPillIdle,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: monitoring ? '#1E8E3E' : '#9AA0A6' },
              ]}
            />
            <Text style={styles.statusText}>
              {monitoring ? 'Monitoring' : 'Idle'}
            </Text>
          </View>
        </View>

        {/* Monitoring toggle card */}
        <TouchableOpacity
          style={[
            styles.monitorCard,
            monitoring ? styles.monitorCardActive : styles.monitorCardIdle,
          ]}
          activeOpacity={0.85}
          onPress={() => setMonitoring((m) => !m)}
        >
          <View style={styles.monitorIconWrap}>
            <Ionicons
              name={monitoring ? 'pulse' : 'pause-circle'}
              size={28}
              color="#fff"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.monitorTitle}>
              {monitoring ? 'Crash detection active' : 'Monitoring paused'}
            </Text>
            <Text style={styles.monitorSubtitle}>
              {monitoring
                ? 'Watching for sudden impacts'
                : 'Tap to resume monitoring'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Emergency contacts card */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => router.push('/contacts')}
        >
          <View style={styles.cardIconWrap}>
            <Ionicons name="people" size={22} color={ACCENT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>Emergency contacts</Text>
            <Text style={styles.cardValue}>
              {contactCount === 0
                ? 'None configured'
                : `${contactCount} configured`}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
        </TouchableOpacity>

        {contactCount === 0 && (
          <View style={styles.warningBanner}>
            <Ionicons name="alert-circle" size={16} color="#B8860B" />
            <Text style={styles.warningText}>
              Add at least one contact so RideGuard can alert someone in a
              crash.
            </Text>
          </View>
        )}

        {/* Carry mode card */}
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
          <View style={styles.cardIconWrap}>
            <Ionicons name="briefcase" size={22} color={ACCENT} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>Carry mode</Text>
            <Text style={styles.cardValue}>{carryMode}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C4C4C4" />
        </TouchableOpacity>

        {/* Quick stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Rides today</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Alerts sent</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{contactCount}</Text>
            <Text style={styles.statLabel}>Contacts</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPillActive: {
    backgroundColor: '#E8F5E9',
  },
  statusPillIdle: {
    backgroundColor: '#F0F0F0',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#444',
  },
  monitorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  monitorCardActive: {
    backgroundColor: ACCENT,
  },
  monitorCardIdle: {
    backgroundColor: '#B0B0B0',
  },
  monitorIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monitorTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  monitorSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '700',
    marginTop: 2,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 12,
    marginTop: -4,
    marginBottom: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#8A5A00',
    lineHeight: 17,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: ACCENT,
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    fontWeight: '600',
  },
});

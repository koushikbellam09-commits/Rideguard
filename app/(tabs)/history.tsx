/**
 * app/(tabs)/history.tsx
 * RideGuard — History screen: shows real alert attempts logged by
 * crashAlertService.js (SMS/WhatsApp sends, successes and failures).
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { getAlertLog } from '../../crashAlertService';

const ACCENT = '#D32F2F';

function formatTimestamp(ts: number) {
  const date = new Date(ts);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) return `Today, ${time}`;

  const dateStr = date.toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
  });
  return `${dateStr}, ${time}`;
}

function channelLabel(channel: string) {
  if (channel === 'sms') return 'SMS';
  if (channel === 'whatsapp') return 'WhatsApp';
  return 'No channel';
}

function channelIcon(channel: string): keyof typeof Ionicons.glyphMap {
  if (channel === 'sms') return 'chatbubble';
  if (channel === 'whatsapp') return 'logo-whatsapp';
  return 'close-circle';
}

export default function HistoryScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const log = await getAlertLog();
    setEntries(log);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="time-outline" size={36} color="#C4C4C4" />
          </View>
          <Text style={styles.emptyTitle}>No alerts yet</Text>
          <Text style={styles.emptySubtitle}>
            Any crash alerts RideGuard sends will show up here, including
            whether they were delivered successfully.
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item, i) => `${item.timestamp}-${i}`}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View
                style={[
                  styles.iconWrap,
                  item.success ? styles.iconWrapSuccess : styles.iconWrapFail,
                ]}
              >
                <Ionicons
                  name={channelIcon(item.channel)}
                  size={20}
                  color={item.success ? '#1E8E3E' : ACCENT}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>
                  {item.success
                    ? `Alert sent via ${channelLabel(item.channel)}`
                    : 'Alert failed to send'}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {formatTimestamp(item.timestamp)}
                </Text>
                {item.sentTo && item.sentTo.length > 0 && (
                  <Text style={styles.cardMeta}>
                    Sent to {item.sentTo.length} contact
                    {item.sentTo.length > 1 ? 's' : ''}
                  </Text>
                )}
                {item.error && (
                  <Text style={styles.cardError}>{item.error}</Text>
                )}
                {item.note && (
                  <Text style={styles.cardNote}>{item.note}</Text>
                )}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 19,
  },
  list: { padding: 20 },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSuccess: { backgroundColor: '#E8F5E9' },
  iconWrapFail: { backgroundColor: '#FDECEC' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  cardSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  cardMeta: { fontSize: 12, color: '#666', marginTop: 4 },
  cardError: { fontSize: 12, color: ACCENT, marginTop: 4 },
  cardNote: { fontSize: 12, color: '#B8860B', marginTop: 4 },
});

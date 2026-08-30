import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const RIDE_DETECTION_TASK = 'ride-auto-start-task';
const SPEED_THRESHOLD_KMH = 15;
const SUSTAINED_DURATION_MS = 10000;

let speedAboveThresholdSince = null;

TaskManager.defineTask(RIDE_DETECTION_TASK, ({ data, error }) => {
  if (error) {
    console.error('Ride detection task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const latest = locations[locations.length - 1];
    const speedKmh = (latest.coords.speed || 0) * 3.6;

    if (speedKmh >= SPEED_THRESHOLD_KMH) {
      if (!speedAboveThresholdSince) { 
        speedAboveThresholdSince = Date.now();
      } else if (Date.now() - speedAboveThresholdSince >= SUSTAINED_DURATION_MS) {
        global.onRideAutoDetected?.();
        speedAboveThresholdSince = null;
      }
    } else {
      speedAboveThresholdSince = null;
    }
  }
});

export async function startBackgroundRideDetection() {
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

  if (fgStatus !== 'granted' || bgStatus !== 'granted') {
    console.warn('Location permissions not granted for auto-detection');
    return false;
  }

  await Location.startLocationUpdatesAsync(RIDE_DETECTION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 15000,
    distanceInterval: 50,
    showsBackgroundLocationIndicator: false,
    foregroundService: {
      notificationTitle: 'RideGuard is watching',
      notificationBody: 'Monitoring for ride activity in the background',
    },
  });

  return true;
}

export async function stopBackgroundRideDetection() {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(RIDE_DETECTION_TASK);
  if (isRegistered) {
    await Location.stopLocationUpdatesAsync(RIDE_DETECTION_TASK);
  }
}
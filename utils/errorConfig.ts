import { LogBox } from 'react-native';

// Suppress specific warnings in development
if (__DEV__) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Sending `onAnimatedValueUpdate` with no listeners registered',
    'VirtualizedLists should never be nested',
  ]);
}

// In production, suppress all console.error to prevent Metro red screen
// Errors will still be logged but won't show the red screen overlay
if (!__DEV__) {
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    // Log to native console but don't show Metro overlay
    originalConsoleError.apply(console, args);
  };
}

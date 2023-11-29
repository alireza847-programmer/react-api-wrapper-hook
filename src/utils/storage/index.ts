let storage: { default: Storage | null } = { default: null };

try {
  if (typeof window !== "undefined" && window.localStorage) {
    storage = { default: window.localStorage };
  } else {
    storage = require("@react-native-async-storage/async-storage");
  }
} catch (error) {
  // Handle the case when AsyncStorage is not available
  console.error("AsyncStorage is not available:", error);
}

export default storage;

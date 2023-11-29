let storage = { default: null };
try {
    if (typeof window !== "undefined" && window.localStorage) {
        console.log("web");
        storage = { default: window.localStorage };
    }
    else {
        console.log("mobile");
        storage = require("@react-native-async-storage/async-storage");
    }
}
catch (error) {
    // Handle the case when AsyncStorage is not available
    console.error("AsyncStorage is not available:", error);
}
export default storage;

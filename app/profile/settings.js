import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export const Settings = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Toggle for dark and light theme
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true); // Toggle for notifications

  // Simulated subscription end date
  const subscriptionEndDate = '2024-12-31';

  const handleThemeChange = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleNotificationsToggle = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

  const handleSubscriptionRenewal = () => {
    Alert.alert('Subscription', 'Your subscription will end on ' + subscriptionEndDate);
  };

  const handleOtherSettings = () => {
    Alert.alert('Other Settings', 'More settings options coming soon!');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#121212' : '#f4f4f4' }]}>
      <Text style={[styles.header, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>Settings</Text>

      {/* Theme Settings */}
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>
          Dark Theme
        </Text>
        <Switch
          value={isDarkTheme}
          onValueChange={handleThemeChange}
        />
      </View>

      {/* Subscription End Details */}
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>
          Subscription End Date
        </Text>
        <TouchableOpacity onPress={handleSubscriptionRenewal}>
          <Text style={styles.subscriptionText}>View Details</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications */}
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>
          Notifications
        </Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={handleNotificationsToggle}
        />
      </View>

      {/* Other Settings */}
      <TouchableOpacity style={styles.otherSettingsButton} onPress={handleOtherSettings}>
        <Text style={styles.otherSettingsText}>Other Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
  subscriptionText: {
    color: '#007bff',
    fontSize: 16,
  },
  otherSettingsButton: {
    marginTop: 40,
    paddingVertical: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  otherSettingsText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

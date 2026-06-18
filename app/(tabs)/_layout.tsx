import { Tabs, router } from 'expo-router';
import { HomeTabProvider, useHomeTab } from '@/components/HomeTabContext';
import { Home, PlusCircle, User } from 'lucide-react-native';
import React from 'react';

function TabsNavigator() {
  const { activeHomeTab } = useHomeTab();
  const formTab = activeHomeTab === 1 ? '1' : '0';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4E71FF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0eef8',
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="tambah-catatan"
        options={{
          title: 'Tambah',
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={24} />,
        }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push({
              pathname: '/(tabs)/tambah-catatan',
              params: { tab: formTab },
            });
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <HomeTabProvider>
      <TabsNavigator />
    </HomeTabProvider>
  );
}

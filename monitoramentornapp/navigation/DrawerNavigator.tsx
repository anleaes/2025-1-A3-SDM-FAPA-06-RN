import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import HomeScreen from '../screens/HomeScreen';
import CEquipamentoScreen from '../screens/CEquipamentoScreen';
import EquipamentoScreen from '../screens/EquipamentoScreen';
 


export type DrawerParamList = {
  Home: undefined;
  CEquipamento: undefined;
  Equipamento: undefined;
  CreateCategory: undefined; 
  // EditCategory: { category: CEquipamento };
  // Products: undefined;
  // Socialnetworks: undefined;  
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#4B7BE5',
        drawerLabelStyle: { marginLeft: 0, fontSize: 16 },
        drawerStyle: { backgroundColor: '#fff', width: 250 },
        headerStyle: { backgroundColor: '#4B7BE5' },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color}  />,
          title: 'Início',
        }}
      />
      <Drawer.Screen
        name="CEquipamento"
        component={CEquipamentoScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          title: 'Classes de Equipamento',
        }}
      />
      <Drawer.Screen
        name="Equipamento"
        component={EquipamentoScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          title: 'Equipamento',
        }}
      />
    </Drawer.Navigator>  
  );
};

export default DrawerNavigator;

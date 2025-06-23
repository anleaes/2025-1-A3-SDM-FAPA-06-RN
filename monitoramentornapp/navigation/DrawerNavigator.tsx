import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import CEquipamentoScreen from '../screens/CEquipamentoScreen';
import CreateCategoryScreen from '../screens/CreateCategoryScreen';
import EditCategoryScreen from '../screens/EditCategoryScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import SocialnetworksScreen from '../screens/SocialnetworksScreen';


export type DrawerParamList = {
  Home: undefined;
  CEquipamento: undefined;
  CreateCategory: undefined; 
 // EditCategory: { category: CEquipamento };
  Products: undefined;
  Socialnetworks: undefined;  
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
          title: 'Categorias',
        }}
      />
      <Drawer.Screen
        name="CreateCategory"
        component={CreateCategoryScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Nova categoria' }}
      />
      <Drawer.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Editar categoria' }}
      />
      <Drawer.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />,
          title: 'Produtos',
        }}
      />
      <Drawer.Screen
        name="Socialnetworks"
        component={SocialnetworksScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="logo-facebook" size={size} color={color} />,
          title: 'Redes Socias',
        }}
      />      
    </Drawer.Navigator>  
  );
};

export default DrawerNavigator;

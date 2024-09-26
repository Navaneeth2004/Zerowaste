import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,CardStyleInterpolators } from '@react-navigation/stack';
import React from 'react';
/*Importing Registration-login*/
import { Registration } from './app/registration-login/registration';
import { Login } from './app/registration-login/login';
/*Importing Profile Sceens*/
import { BaseProfile } from './app/profile/baseprofile';
import { Personaldetails } from './app/profile/personaldetails';
import { BaseTicket } from './app/profile/ticket/baseticket';
import { CreateTicket } from './app/profile/ticket/createticket';
import { ViewTicket } from './app/profile/ticket/viewticket';
import { AboutUs } from './app/profile/aboutus';
import { BaseActivity } from './app/profile/activity/baseactivity';
/*Activity Section*/
import { RecycledWaste } from './app/profile/activity/sellers/recycledwaste'
import { BoughtProduct } from './app/profile/activity/productsbought';
/*Importing Seller Screens*/
import { RecycleBin } from './app/seller/recyclebin';
import { SelectedWaste } from './app/collector/selectedwaste';
import { AddWaste } from './app/seller/addwaste';
import { ViewWaste } from './app/seller/viewwaste';
import { ViewProduct } from './app/shop/viewproduct';
import { Subscription } from './app/profile/subscription';
import { Settings } from './app/profile/settings';
import { Cart } from './app/shop/cart';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Registration" component={Registration} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Profile" component={BaseProfile}
        options={{
          headerShown:false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid}}/>
        <Stack.Screen name="Activity" component={BaseActivity}/>
        <Stack.Screen name="Personal Details" component={Personaldetails}/>
        <Stack.Screen name="About Us" component={AboutUs}/>
        <Stack.Screen name="Ticket" component={BaseTicket}/>
        <Stack.Screen name="Create Ticket" component={CreateTicket}/>
        <Stack.Screen name="Ticket Name" component={ViewTicket}/>
        <Stack.Screen name="Recycle Bin" component={RecycleBin} 
        options={{
          headerShown:false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid}}/>
        <Stack.Screen name="Jobs" component={SelectedWaste} 
        options={{
          headerShown:false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid}}/>
        <Stack.Screen name="Create Post" component={AddWaste}/>
        <Stack.Screen name="Waste Details" component={ViewWaste}/>
        <Stack.Screen name="Recycled Waste" component={RecycledWaste}/>
        <Stack.Screen name="Bought Products" component={BoughtProduct}/>
        <Stack.Screen name="Subscription" component={Subscription}/>
        <Stack.Screen name="Settings" component={Settings}/>
        <Stack.Screen name="Cart" component={Cart}/>
        <Stack.Screen name="Shop" component={ViewProduct}
        options={{
          headerShown:false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

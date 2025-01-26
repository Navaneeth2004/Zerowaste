import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,CardStyleInterpolators } from '@react-navigation/stack';
import React from 'react';
import Toast from 'react-native-toast-message';
import { TouchableOpacity } from 'react-native';
import 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
/*Importing storage*/
import { UserProvider } from './app/storage';
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
import { RecycledWaste } from './app/profile/activity/recycledwaste'
import { BoughtProduct } from './app/profile/activity/productsbought';
/*Importing Seller Screens*/
import { RecycleBin } from './app/seller/recyclebin';
import { SelectedWaste } from './app/collector/selectedwaste';
import { AddWaste } from './app/seller/addwaste';
import {SubscribeWaste} from './app/profile/subscribewaste';
import { PaymentScreen } from './app/profile/paymentscreen';
import { ViewWaste } from './app/seller/viewwaste';
import { ViewProduct } from './app/shop/viewproduct';
import { Subscription } from './app/profile/subscription';
import { Schedule } from './app/profile/scheduleinfo';
import { Settings } from './app/profile/settings';
import { Cart } from './app/shop/cart';
import { Profile } from './app/profile/profile';
import{ Product }from './app/shop/product';
import { Buyproduct } from './app/shop/buyproduct';

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            cardStyle: { backgroundColor: 'white' },
            cardOverlayEnabled: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        >
          <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
          <Stack.Screen name="Registration" component={Registration} options={{headerShown:false}} />
          <Stack.Screen name="BaseProfile" component={BaseProfile} options={{headerShown:false}}/>
          <Stack.Screen
            name="Activity"
            component={BaseActivity}
            options={{
              headerStyle: {
                backgroundColor: '#303132',
              },
              headerTintColor: 'white', 
            }}
          />
          <Stack.Screen name="Personal Details" component={Personaldetails} />
          <Stack.Screen name="About Us" component={AboutUs} />
          <Stack.Screen
            name="Ticket"
            component={BaseTicket}
            options={{
              headerStyle: {
                backgroundColor: '#303132',
              },
              headerTintColor: 'white', 
            }}
          />
          <Stack.Screen
            name="Create Ticket"
            component={CreateTicket}
            options={{
              headerStyle: {
                backgroundColor: '#303132',
              },
              headerTintColor: 'white', 
            }}
          />
          <Stack.Screen name="Ticket Name" component={ViewTicket} />
          <Stack.Screen name="Schedule Pickup" component={SubscribeWaste} />
          <Stack.Screen name="Recycle Bin" component={RecycleBin} options={{headerShown:false}}/>
          <Stack.Screen name="Jobs" component={SelectedWaste} options={{headerShown:false}}/>
          <Stack.Screen name="Create Post" component={AddWaste} />
          <Stack.Screen name="Waste Details" component={ViewWaste} />
          <Stack.Screen
            name="Recycled Waste"
            component={RecycledWaste}
            options={{
              headerStyle: {
                backgroundColor: '#303132',
              },
              headerTintColor: 'white', 
            }}
          />
          <Stack.Screen
            name="Bought Products"
            component={BoughtProduct}
            options={{
              headerStyle: {
                backgroundColor: '#303132',
              },
              headerTintColor: 'white', 
            }}
          />
          <Stack.Screen name="Subscription" component={Subscription} />
          <Stack.Screen
            name="Schedule"
            component={Schedule}
            options={{
              headerStyle: {
                backgroundColor: '#303132',
              },
              headerTintColor: 'white', 
            }}
          />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Product" component={Product} />
          <Stack.Screen name="Buy" component={Buyproduct} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="Shop" component={ViewProduct} options={{headerShown:false}}/>
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </UserProvider>
  );
}

import React, { useEffect} from 'react';

import Dashboard  from "../Dashboard"

import { createStackNavigator } from '@react-navigation/stack';
import SpecialMovement from '../SpecialMovement';
import SpecialMovementDetails from '../SpecialMovement/SpecialMovementDetails';
import Profile from '../Profile';
import Help from '../Help';
import Hires from '../Hire'
import DispatchOrders from '../DispatchOrders';
import Transactions from '../Transactions';
import NewDispatch from '../Dispatch/NewDispatch';
import DispatchAddress from '../Dispatch/DispatchAddress';
import DispatchCartSummary from '../Dispatch/DispatchCartSummary';
import RideHome from '../RideShare/RideHome';
import RideConfirm from '../RideShare/RideConfirm';
import RidePaymentMethod from '../RideShare/RidePaymentMethod';
import RideOrderDetails from '../RideShare/RideOrderDetails';
import RideOrders from '../RideShare/RideOrders';
import HireDetails from '../Hire/HireDetails';
import useNotificationProvider from '../../SharedComponents/useNotificationProvider';
import { useSelector } from 'react-redux';
import DispatchOrderDetails from '../DispatchOrders/DispatchOrderDetails';

export default function ProtectedRoute(props){
    const Stack = createStackNavigator();
    const {value, status} = useSelector(store => store.user);
    const initGeo = useNotificationProvider({user:value});

    useEffect(()=>{
      console.log(value, "User value")
    }, []);

    return(

    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={Dashboard}/>
      <Stack.Screen name="Help" component={Help}/>
      <Stack.Screen name="Profile" component={Profile}/> 
      <Stack.Screen name="SpecialMovement" component={SpecialMovement}/>
      <Stack.Screen name="SpecialMovementDetails" component={SpecialMovementDetails} />
      <Stack.Screen name="Hires" component={Hires} />
      <Stack.Screen name="DispatchOrders" component={DispatchOrders} />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="NewDispatch" component={NewDispatch} />
      <Stack.Screen name="DispatchAddress" component={DispatchAddress} />
      <Stack.Screen name="DispatchCartSummary" component={DispatchCartSummary} />
      <Stack.Screen name="RideShareHome" component={RideHome} />
      <Stack.Screen name="RideShareConfirm" component={RideConfirm} />
      <Stack.Screen name="RidePaymentMethod" component={RidePaymentMethod} />
      <Stack.Screen name="RideOrderDetails" component={RideOrderDetails} />
      <Stack.Screen name="RideOrders" component={RideOrders} />
      <Stack.Screen name="HireDetails" component={HireDetails} />
      <Stack.Screen name="DispatchOrderDetails" component={DispatchOrderDetails} />

    </Stack.Navigator>  

      )
}
;


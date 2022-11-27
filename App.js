import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login'
import Find from './Screens/Find'
import SignUp from './Screens/SignUp'
import Home from './Screens/Home'
import TestList from './Screens/TestList'
import Question from './Screens/Question'
import SelectStrategy from './Screens/SelectStrategy'
import GradedQuestionList from './Screens/GradedQuestionList'
import CheckStrategy from './Screens/CheckStrategy'
import CheckPromport from './Screens/CheckPromport'
const Stack = createStackNavigator();

 export default function App() {
   return (
     <NavigationContainer>
       <Stack.Navigator initialRouteName='Login'>
         <Stack.Screen name = "Login" component = {Login}/>
         <Stack.Screen name = "Find" component = {Find}/>
         <Stack.Screen name = "SignUp" component = {SignUp}/>
         <Stack.Screen name = "Home" component = {Home}/>
         <Stack.Screen name = "TestList" component = {TestList}/>
         <Stack.Screen name = "Question" component = {Question}/>
         <Stack.Screen name = "SelectStrategy" component = {SelectStrategy}/>
         <Stack.Screen name = "GradedQuestionList" component = {GradedQuestionList}/>
         <Stack.Screen name = "CheckStrategy" component = {CheckStrategy}/>
         <Stack.Screen name = "CheckPromport" component = {CheckPromport}/>
       </Stack.Navigator>
     </NavigationContainer>
   );
 }

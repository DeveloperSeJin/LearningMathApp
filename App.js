import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login'
import Find from './Screens/Find'
import Authentication from './Screens/Authentication'
import Main from './Screens/Main'
import TestList from './Screens/TestList'
import Question from './Screens/Question'
import SelectStrategy from './Screens/SelectionStrategy'
import GradedQuestionList from './Screens/GradedQuestionList'

const Stack = createStackNavigator();

 export default function App() {
   return (
     <NavigationContainer>
       <Stack.Navigator initialRouteName='Login'>
         <Stack.Screen name = "Login" component = {Login}/>
         <Stack.Screen name = "Find" component = {Find}/>
         <Stack.Screen name = "Authentication" component = {Authentication}/>
         <Stack.Screen name = "Main" component = {Main}/>
         <Stack.Screen name = "TestList" component = {TestList}/>
         <Stack.Screen name = "Question" component = {Question}/>
         <Stack.Screen name = "SelectStrategy" component = {SelectStrategy}/>
         <Stack.Screen name = "GradedQuestionList" component = {GradedQuestionList}/>
       </Stack.Navigator>
     </NavigationContainer>
   );
 }

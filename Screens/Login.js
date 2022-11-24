import Input from '../Components/Input';
import {View, StyleSheet, Image,TouchableOpacity} from 'react-native';
import find from '../assets/find.png'
import SignUp from '../assets/SignUp.png'
import LogIn from '../assets/LogIn.png'

const Login = (props) => {
    return (
        <View style = {styles.LoginLocation}>
            <Input></Input>
            <Input></Input>
            <TouchableOpacity
                onPress={()=>{
                    props.navigation.navigate("Home")
                }}>
                    <Image
                        style={{width:400,height:100}}
                        source={LogIn}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            <View style = {{
                flexDirection: 'row'
            }}>
                <TouchableOpacity
                    onPress={()=>{
                        props.navigation.navigate("Find")
                    }}>
                    <Image
                        style={{width:100,height:100}}
                        source={find}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{
                        props.navigation.navigate("SignUp")
                    }}>
                    <Image
                        style={{width:100,height:100}}
                        source={SignUp}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    LoginLocation: {
      width:'70',
      marginTop:200,
      marginLeft :200,
      marginRight:200,
      fontSize:25,
      padding:10
    },
  });

export default Login;
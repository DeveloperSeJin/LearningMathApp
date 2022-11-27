import {View, Text, Button, Image, TouchableOpacity, Touchable, StyleSheet} from 'react-native'
import Start from '../assets/Start.png'
import check from '../assets/check.png'

const Home = (props) => {
    const {params} = props.route
    const stu_id = params?params.stu_id:null;
    
    return (
        <View
            style = {styles.LoginLocation}>
            <Text>NAME</Text>
            <Text>CLASS AND STUDENTS</Text>
            <TouchableOpacity
                    onPress={()=>{
                        props.navigation.navigate("TestList",
                        {stu_id:stu_id})
                    }}>
                <Image
                    style={{width:400,height:100}}
                    source={Start}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <TouchableOpacity
                    onPress={()=>{
                        props.navigation.navigate("GradedQuestionList")
                    }}>
                <Image
                    style={{width:400,height:100}}
                    source={check}
                    resizeMode="contain"
                />
            </TouchableOpacity>
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

export default Home
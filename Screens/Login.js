import {View, StyleSheet, Image,TouchableOpacity, TextInput} from 'react-native';
import find from '../assets/find.png'
import SignUp from '../assets/SignUp.png'
import LogIn from '../assets/LogIn.png'
import {useState} from 'react';
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";

const Login = (props) => {
    const [flag,setFlag] = useState(true);
    const [ID, setID] = useState("");
    const [password, setPassword] = useState("");
    const [studentInfo, setStudentInfo] = useState();
    
    const readfromDB = async() => {
        try{
            const data = await getDocs(collection(db, "student"))
            
            setStudentInfo(data.docs.map(doc=>(
                {...doc.data(), id: doc.id}
                )))
        } catch(error) {
            console.log(error.message)
        }
    }
    const changeID = (event) => {
        setID(event)
      }
    const changePassword = (event) => {
        setPassword(event)
    }

    if (flag) {
        readfromDB()
        setFlag(false)
    }

    const login2Home = () => {
        let have = false
        studentInfo?.map((item) => {
            if (item.studentid == ID &&
                item.password == password) {
                    have = true
                    props.navigation.navigate("Home",
                    {stu_id:item.studentid})
            }
        })
        if (!have) {
            alert("아이디 또는 비밀번호가 틀렸습니다.")
        }
    }
    return (
        <View style = {styles.LoginLocation}>
            <TextInput
            value = {ID}
            onChangeText = {changeID}
            style = {styles.TextBar}
            />
            <TextInput
            value = {password}
            onChangeText = {changePassword}
            style = {styles.TextBar}
            />
            <TouchableOpacity
                onPress={login2Home}>
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
      width:"90%",
      marginTop:200,
      fontSize:25,
      padding:10
    },
    TextBar: {
        width:'100%',
        backgroundColor:"#cecece",
        marginTop:20,
        fontSize:25,
        padding:10
      },
  });

export default Login;
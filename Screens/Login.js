import {View, StyleSheet, Image,TouchableOpacity, TextInput, ImageBackground, Text} from 'react-native';
import login from '../assets/login.png'
import {useState} from 'react';
import background from '../assets/background.png'
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";

const Login = (props) => {
    const [flag,setFlag] = useState(true);
    const [ID, setID] = useState("");
    const [password, setPassword] = useState("");
    const [studentInfo, setStudentInfo] = useState();
    const [promport, setPromport] = useState()
    
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

    const getPromport = async() => {
        try {
            const data = await getDocs(collection(db, "promport"))
            setPromport(data.docs.map(doc=>(
                {...doc.data(), id: doc.id}
                )))
        } 
        catch(error) {
            console.log(error.message)
        }
    }
    if (flag) {
        readfromDB()
        getPromport()
        setFlag(false)
    }

    const login2Home =() => {
        let have = false
        studentInfo?.map(async (item) => {
            if (item.studentid == ID &&
                item.password == password) {                    
                    have = true
                    let itemList = []
                    try {
                        const q = query(collection(db,"answer"), where ('student_id', "==", ID))
                        const data = await getDocs(q)

                        data.docs.map(doc=>(
                            itemList.push(doc.data())
                        ))
                    }catch (error) {
                        console.log(error)
                    }
                    props.navigation.navigate("Home",
                    {stu_id:item.studentid,
                     progress : itemList.length / promport.length})
            }
        })
        if (!have) {
            alert("아이디 또는 비밀번호가 틀렸습니다.")
        }
    }
    return (
        <ImageBackground
            source={background}
            style ={{width:'100%', height:'100%', margin : 'auto', backgroundColor : '#98BEAF'}}
        >
            <View
                style ={{marginTop:130, marginLeft :10, marginRight:20, backgroundColor:'#FBFAFA', width: 390, height:300}}
            >
                <Text
                    style={{marginLeft:10, marginTop:10, fontSize:15}}
                >ID:</Text>
                <TextInput
                value = {ID}
                onChangeText = {changeID}
                //style ={{ height:50, width:'100%', padding:10}}
                style ={{marginLeft:10, width:'100%', marginTop:10}}
                />
                <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginLeft:10,
                    marginRight:10
                }}
                />
                <Text
                    style={{marginTop:30, marginLeft:10, fontSize:15}}
                >Password:</Text>
                <TextInput
                value = {password}
                onChangeText = {changePassword}
                style ={{marginLeft:10, width:'100%', marginTop:10}}
            />
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginLeft:10,
                    marginRight:10
                }}
            />
            <TouchableOpacity
                onPress={()=>{
                    props.navigation.navigate("Find")
                }}>
                <Text
                    style ={{marginLeft:10, marginTop:20, fontSize:15, color : '#6E7AE5', textDecorationLine :'underline'}}
                    >forgot your password?</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{marginTop:10}}
                    onPress={()=>{
                        props.navigation.navigate("SignUp")
                    }}>
                    <Text
                        style ={{marginLeft:10,marginTop:25, fontSize:15, color : '#6E7AE5', textDecorationLine :'underline'}}
                    >signup</Text>
                </TouchableOpacity>
                </View>
                <TouchableOpacity
                style = {{width:100}}
                onPress={login2Home}>
                    <Image
                        style={{width:390, height:50, marginLeft:12}}
                        source={login}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
        </ImageBackground>
        
    );
}


export default Login;
import {TouchableOpacity, Text, View, TextInput, Image, ImageBackground} from 'react-native';
import {useState} from 'react';
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import background from '../assets/background.png'
import cancle from '../assets/cancle.png'
import find from '../assets/find.png'

const Find = (props) => {
    const [flag,setFlag] = useState(true);
    const [name, setName] = useState("");
    const [ID, setID] = useState();
    const [password, setPassword] = useState();
    const [studentInfo, setStudentInfo] = useState();
    const [phoneNumber, setPhoneNumber] = useState("");

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

    const changeName = (event) => {
        setName(event)
    }  

    const changePhone = (event) => {
        setPhoneNumber(event)
    }  
    if (flag) {
        readfromDB()
        setFlag(false)
    }

    const findIdNPas = async () => {
        studentInfo?.map((item) => {
            if (item.phone_number == phoneNumber &&
                item.name == name) {
                    setID(item.studentid)
                    setPassword(item.password)
                }
        })
    }

    return (
        <ImageBackground
            source={background}
            style ={{width:'100%', height:'100%', margin : 'auto', backgroundColor : '#98BEAF'}}
        >
            <View
                style ={{marginTop:130, marginLeft :10, marginRight:20, backgroundColor:'#FBFAFA', width: 390, height:250}}
            >
                <TouchableOpacity
                    style = {{width:100}}
                    onPress={()=>{
                        props.navigation.navigate("Login")
                    }}>
                    <Image
                        style={{width:20, height:20, marginLeft:360, marginTop:10}}
                        source={cancle}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text
                    style={{marginLeft:10, fontSize:15}}
                >enter your name</Text>
                <TextInput
                    value = {name}
                    onChangeText = {changeName}
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
                    style={{marginLeft:10, marginTop:10, fontSize:15}}
                >enter your Phone Number</Text>
                <TextInput
                    value = {phoneNumber}
                    onChangeText = {changePhone}
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
                    style = {{marginLeft: 10, marginTop:10, fontSize : 15}}
                >your ID : {ID}</Text>
                <Text
                    style = {{marginLeft: 10,marginTop:10, fontSize : 15}}
                >your password : {password}</Text>
            </View>
            <TouchableOpacity
                style = {{width:100}}
                onPress={findIdNPas}>
                    <Image
                        style={{width:390, height:100, marginLeft:12}}
                        source={find}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
        </ImageBackground>
    );
}

export default Find
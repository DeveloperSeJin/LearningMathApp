import {TouchableOpacity, Text, View, TextInput, Image, ImageBackground} from 'react-native';
import {useState} from 'react';
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import signup from '../assets/signup.png'
import background from '../assets/background.png'
import cancle from '../assets/cancle.png'

const SignUp = (props) => {
    const [flag,setFlag] = useState(true);
    const [ID, setID] = useState("");
    const [name, setName] = useState("");
    const [myClass, setClass] = useState("");
    const [password, setPassword] = useState("");
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

    const changeID = (event) => {
        setID(event)
      }
    const changePassword = (event) => {
        setPassword(event)
    }
    const changeClass = (event) => {
        setClass(event)
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

    const signupAccount = async () => {
        let idList = []
        studentInfo?.map((item) => {
            idList.push(item.studentid)
        })
        if (idList.includes(ID)) {
            alert("이미 있는 아이디입니다.")
        } else if (name == "" || myClass == "" || password == "" ||
                    phoneNumber == "") {
            alert("정보를 입력해주세요")

        }
         else {
            try {
                await addDoc(collection(db, "student"), {
                    studentid : ID,
                    name : name,
                    class : myClass,
                    password:password,
                    solved: false,
                    phone_number:phoneNumber
                })
                alert("회원가입 완료")
                props.navigation.navigate("Login")
            } catch(error) {
                console.log(error.message)
            }
        }
    }

    return (
        <ImageBackground
            source={background}
            style ={{width:'100%', height:'100%', margin : 'auto', backgroundColor : '#98BEAF'}}
        >   
            <View
                style ={{marginTop:40, marginLeft :10, marginRight:20, backgroundColor:'#FBFAFA', width: 390, height:420}}
            >
                <TouchableOpacity
                    onPress={()=>{
                        props.navigation.navigate("Login")
                    }}>
                    <Image
                        style={{width:20, height:20, marginLeft:360, marginTop:10}}
                        source={cancle}
                    />
                </TouchableOpacity>
                <Text
                    style={{marginLeft:10, fontSize: 15}}
                >enter your ID</Text>
                <TextInput
                    value = {ID}
                    onChangeText = {changeID}
                    style ={{marginLeft:10, width:'100%', marginTop:5}}
                />
                <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginLeft:10,
                    marginRight:10
                }}/>
            <Text
                style={{marginLeft:10, marginTop:20, fontSize: 15}}
            >enter your Password</Text>
            <TextInput
                value = {password}
                onChangeText = {changePassword}
                style ={{marginLeft:10, width:'100%', marginTop:5}}
            />
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginLeft:10,
                    marginRight:10
                }}/>
            <Text
                style={{marginLeft:10, marginTop:20, fontSize: 15}}
            >enter your name</Text>
            <TextInput
                value = {name}
                onChangeText = {changeName}
                style ={{marginLeft:10, width:'100%', marginTop:5}}
            />
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginLeft:10,
                    marginRight:10
                }}/>
            <Text
                style={{marginLeft:10, marginTop:20, fontSize: 15}}
            >enter your Class</Text>
            <TextInput
                value = {myClass}
                onChangeText = {changeClass}
                style ={{marginLeft:10, width:'100%', marginTop:5}}
            />
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginLeft:10,
                    marginRight:10
                }}/>
            <Text
                style={{marginLeft:10, marginTop:20, fontSize: 15}}
            >enter your Phone Number</Text>
            <TextInput
                value = {phoneNumber}
                onChangeText = {changePhone}
                style ={{marginLeft:10, width:'100%', marginTop:5}}
            />
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginLeft:10,
                    marginRight:10
                }}/>
            </View>
            <TouchableOpacity
                style = {{width:100}}
                onPress={signupAccount}>
                    <Image
                        style={{width:390, height:100, marginLeft:12}}
                        source={signup}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
        </ImageBackground>
    );
}

export default SignUp
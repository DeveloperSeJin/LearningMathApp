import {TouchableOpacity, Text, View, TextInput, Button} from 'react-native';
import {useState} from 'react';
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";


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
        <View>
            <Text>enter your name</Text>
            <TextInput
                value = {name}
                onChangeText = {changeName}
            />
            <Text>enter your Phone Number</Text>
            <TextInput
                value = {phoneNumber}
                onChangeText = {changePhone}
            />
            <Button
                title = "Find"
                onPress={findIdNPas}
            />
            <Text>{ID}</Text>
            <Text>{password}</Text>
        </View>
    );
}

export default Find
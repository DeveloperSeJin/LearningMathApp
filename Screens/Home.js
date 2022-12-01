import {View, Text, Button, Image, TouchableOpacity, Touchable, StyleSheet} from 'react-native'
import Start from '../assets/Start.png'
import check from '../assets/check.png'
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import { useState } from 'react'

const Home = (props) => {
    const {params} = props.route
    const stu_id = params?params.stu_id:null;

    const [flag,setFlag] = useState(true);
    const [solved, setSolved] = useState()
    const [promport, setPromport] = useState()
    const [progress, setProgress] = useState(0)

    const readfromDB = async() => {
        try {
            const student_data = await getDocs(collection(db, "student"))
            student_data.docs.map(doc=>{
                if(doc.data().studentid == stu_id) {
                    setSolved(doc.data().solved)
                }
            })
        } 
        catch(error) {
            console.log(error.message)
        }
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

    const getProgress = async() => {
        try{
            var itemList = []
            const q = query(collection(db,"answer"), where ('student_id', "==", stu_id))
            const data = await getDocs(q)

            data.docs.map(doc => (
                itemList.push(doc.data())))
            setProgress(itemList.length)
        } catch (error) {
            console.log(error)
        }
    }

    if(flag){
        getPromport()
        getProgress()
        readfromDB()
        setFlag(false)
    }

    return (
        <View
            style = {styles.LoginLocation}>
            <Text>NAME</Text>
            <Text>CLASS AND STUDENTS</Text>
            <Text>{progress} / {promport?.length}</Text>
            <TouchableOpacity
                    disabled = {solved}
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
                    disabled = {!solved}
                    onPress={()=>{
                        props.navigation.navigate("GradedQuestionList",
                        {stu_id:stu_id})
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
      width:70,
      marginTop:200,
      marginLeft :200,
      marginRight:200,
      fontSize:25,
      padding:10
    },
  });

export default Home
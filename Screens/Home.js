import {View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native'
import {db} from '../firebaseConfig'
import background from '../assets/background.png'
import start from '../assets/start.png'
import checkScore from '../assets/checkScore.png'
import * as Progress from 'react-native-progress';
import paper from '../assets/paper.png'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import { useState } from 'react'

const Home = (props) => {
    const {params} = props.route
    const stu_id = params?params.stu_id:null;
    const progr = params?params.progress:null;

    const [flag,setFlag] = useState(true);
    const [solved, setSolved] = useState()
    const [promport, setPromport] = useState()
    const [progress, setProgress] = useState(0)
    const [name, setName] = useState()
    const [myclass, setClass] = useState()

    const readfromDB = async() => {
        try {
            const student_data = await getDocs(collection(db, "student"))
            student_data.docs.map(doc=>{
                if(doc.data().studentid == stu_id) {
                    setSolved(doc.data().solved)
                    setName(doc.data().name)
                    setClass(doc.data().class)
                    console.log(doc.data())
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
        <View>
            <Text
                style={{marginTop :50, marginLeft:10}}
            >{progress + "/" + promport?.length}</Text>
            {console.log(progr)}
            <Progress.Bar 
                progress={(progr)}  
                width={390} height={20} 
                color = {'rgba(134, 121, 217, 1)'}
                style ={{marginLeft : 10}}
            />
            <ImageBackground 
                    source = {paper}
                    style ={{marginTop:20, marginLeft :10, marginRight:20, width: 390, height:80}}
                    >
                <Text
                    style={{fontSize:20, marginTop : 10, marginLeft :30}}
                >hello {name}</Text>
                <Text
                    style={{fontSize:20, marginTop : 10, marginLeft :30}}
                >your class : {myclass}</Text>
            </ImageBackground>
            <Text></Text>
            <TouchableOpacity
                    disabled = {solved}
                    onPress={()=>{
                        props.navigation.navigate("TestList",
                        {stu_id:stu_id,
                        progress:progr})
                    }}>
                <Image
                    style={{width:400,height:100, marginTop:10}}
                    source={start}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <TouchableOpacity
                    disabled = {!solved}
                    onPress={()=>{
                        props.navigation.navigate("GradedQuestionList",
                        {stu_id:stu_id,
                        progress : progr})
                    }}>
                <Image
                    style={{width:400,height:100, marginTop:30}}
                    source={checkScore}
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
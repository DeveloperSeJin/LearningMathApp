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
    const questionNum = 8
    const [student, setStudent] = useState();
    const [flag,setFlag] = useState(true);
    const [showResult, setShowResult] = useState (true);

    const readfromDB = async() => {
        try {
            const student_data = await getDocs(collection(db, "student"))
            setStudent(student_data.docs.map(doc=>(
                {...doc.data(), id: doc.id}
            )))
        } 
        catch(error) {
            console.log(error.message)
        }
    }
    const getCheck = async() => {
        try{
            let itemList = []
            const data = await getDocs(collection(db, "questionCheck"))
            
            data.docs.map(doc=>{
                if (doc.data().student_id == stu_id) {
                    itemList.push(doc.data())
                }
            })

            if (itemList.length == questionNum) {
                setShowResult(false)
                solveQuestion(true)
            }
            else {
                setShowResult(true)
                solveQuestion(false)
            }
        } catch(error) {
            console.log(error.message)
        }
    }

    const solveQuestion = async(check) => {
        let result
        
        student?.map((item)=> {
            if (item.student_id == stu_id) {
                result = item.id
            }
        })
        try {
            const docRef = doc(db, "student", result);
            await updateDoc(docRef, {
                solved:check
            });
            console.log("success")
            readfromDB()
        } catch (error) {
            console.log(error.message);
        }
    }

    if(flag){
        readfromDB()
        getCheck()
        setFlag(false)
    }

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
                    disabled = {showResult}
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
      width:'70',
      marginTop:200,
      marginLeft :200,
      marginRight:200,
      fontSize:25,
      padding:10
    },
  });

export default Home
import {TouchableOpacity, Text, View, Image, TextInput} from 'react-native';
import {useState} from 'react';
import {db} from '../firebaseConfig'
import home from '../assets/home.png'
import submit from '../assets/submit.png'
import back from '../assets/back.png'

import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";

const QuestionAnswer = (props) => {
    const {params} = props.route
    const question_id = params? params.question_id:null;
    const stu_id = params?params.stu_id:null;
    const progr = params?params.progress:null;

    const [flag, setFlag] = useState(true)
    const [question, setQuestion] = useState()
    const [student_answer, setStudentAnswer] = useState("")
    const [answer, setAnswer] = useState()

    const readfromDB = async() => {
        try{
            const q = query(collection(db,"question"), where ('question_id', "==", question_id))
            const data = await getDocs(q)
            data.docs.map(doc => (setQuestion(doc.data())))

        } catch(error) {
            console.log(error.message)
        }
    }

    const getAnswer = async() => {
        try{
            const q = query(collection(db,"question_answer"), where ('student_id', "==", stu_id))
            const data = await getDocs(q)
            setAnswer(data.docs.map(doc => ({...doc.data(), id:doc.id})))
            data.docs.map(
                doc => {
                    if (doc.data().question_id == question_id) {
                        setStudentAnswer(doc.data().answer)
                    }
                })
        } catch(error) {
            console.log(error.message)
        }
    }

    const saveAnswer = async() => {
        var pk
        var check = false
        answer?.map((item) => {
            if(item.question_id == question_id) {
                pk = item.id
                check = true
            }
        })
        if(check) {
            const docRef = doc(db, "question_answer", pk);
            await updateDoc(docRef, {
                answer:student_answer
            });
        } else {
            await addDoc(collection(db, "question_answer"), {
                question_id:question_id,
                student_id:stu_id,
                answer:student_answer
            })
        }
        props.navigation.navigate("SelectStrategy", 
                {question_id : question_id,
                 stu_id:stu_id,
                progress:progr})
    }
    const changeText = (event) => {
        setStudentAnswer(event)
      }

    if (flag) {
        readfromDB()
        getAnswer()
        setFlag(false)
    }
    return (
                <View>
                        <TouchableOpacity
                            onPress = { ()=>props.navigation.navigate("Home",
                                        {stu_id:stu_id,
                                        progress : progr})}>
                            <Image
                                style={{width:30,height:30, marginTop:50, marginLeft:20}}
                                source={home}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <Text
                            style = {{marginTop:20, marginLeft:20}}
                        >Q. {question?.question_id} {question?.title}</Text>
                        <View
                            style ={{ marginLeft :10, marginRight:20, backgroundColor:'#F6FAC2', width: 390, height:100}}
                        >
                            <Text
                                style={{marginTop : 10, marginLeft : 10, marginRight:10}}
                            >{question?.main_question}</Text>
                        </View>
                        <TextInput
                            value = {student_answer}
                            multiline = {true}
                            style = {{backgroundColor : '#F6FAC2', marginLeft:10, marginRight:10, width: 390, height:100, marginTop:20}}
                            onChangeText = {changeText}
                        />
                        <View
                            style ={{flexDirection:'row'}}
                            >
                            <TouchableOpacity
                                onPress={()=>{
                                    props.navigation.navigate("TestList",
                                        {stu_id:stu_id,
                                        progress:progr})
                                }}
                            >
                            <Image
                                style={{width:20, height:100, marginRight:100}}
                                source={back}
                                resizeMode="contain"
                            />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={saveAnswer}
                            >
                                <Image  
                                    style={{width:200, height:100, marginLeft:100}}
                                    source={submit}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>    
                        </View>
                </View>
    )

}

export default QuestionAnswer
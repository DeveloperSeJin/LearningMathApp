import {TouchableOpacity, Text, View, Button, TextInput} from 'react-native';
import {useState} from 'react';
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";

const QuestionAnswer = (props) => {
    const {params} = props.route
    const question_id = params? params.question_id:null;
    const stu_id = params?params.stu_id:null;
    const [flag, setFlag] = useState(true)
    const [question, setQuestion] = useState()
    const [student_answer, setStudentAnswer] = useState("")
    const [answer, setAnswer] = useState()

    const readfromDB = async() => {
        try{
            const q = query(collection(db,"question"), where ('question_id', "==", question_id))
            const data = await getDocs(q)
            setQuestion(data.docs.map(doc => ({...doc.data(), id:doc.id})))

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
                 stu_id:stu_id})
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
            {question?.map((item, idx) => {
                return (
                    <View
                        key = {idx}
                    >
                        <Text>{item.main_question}</Text>
                        <TextInput
                            value = {student_answer}
                            onChangeText = {changeText}
                        />
                        <Button
                            title ="submit"
                            onPress={saveAnswer}
                        />
                        <Button
                            title = "home"
                            onPress={() => {
                                props.navigation.navigate("Home",
                                    {stu_id:stu_id})}}
                        />
                        <Button
                            title = "prior"
                            onPress={()=>{
                                props.navigation.navigate("TestList",
                                    {stu_id:stu_id})
                            }}
                        />
                    </View>
                )
            })}
        </View>
    )

}

export default QuestionAnswer
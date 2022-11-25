import {TouchableOpacity, Text, View, TextInput, Button} from 'react-native';
import {useState} from 'react';
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";

const Question = (props) => {
    const {params} = props.route
    const strategy_id = params? params.strategy_id:null;
    const question_id = params? params.question_id:null;
    const [promport, setPromport] = useState()
    const [flag,setFlag] = useState(true);
    const [promport_num, setPromport_num] = useState(1)
    const [count, setCount] = useState(0)
    const [studentAnswer, setStudentAnswer] = useState("");

    const sortJSON = function(data, key, type) {
        if (type == undefined) {
          type = "asc";
        }
        return data.sort(function(a, b) {
          var x = a[key];
          var y = b[key];
          if (type == "desc") {
            return x > y ? -1 : x < y ? 1 : 0;
          } else if (type == "asc") {
            return x < y ? -1 : x > y ? 1 : 0;
          }
        });
      };

      const changeText = (event) => {
        setStudentAnswer(event)
      }

      const addAnswer = async (id, ans) => {
        try {
            await addDoc(collection(db, "answer"), {
                student_answer:studentAnswer,
                answer_check:checkAnswer(ans),
                feedback:"",
                promport_id:id,
                // student_id:stuID
            })
            setStudentAnswer("")
        } catch (error) {
            console.log(error.message);
        }
        console.log("success")
      }

      const checkAnswer = (ans) => {
        if (ans == studentAnswer){
            return "true"
        } else {
            return "false"
        }
      }
      const getPromport = async () => {
        try{
            const data = await getDocs(collection(db, "promport"))
            let itemList = []
            data.docs.map(
                doc => {
                    if (doc.data().strategy_id == strategy_id) {
                        itemList.push(doc.data())
                    }
                })
                setCount(itemList.length)
            setPromport(sortJSON(itemList,"promport_num"));
        } catch(error) {
            console.log(error.message)
        }
    }
    if(flag){
        getPromport()
        setFlag(false)
    }

    return (
        <View>
            {promport?.map((item, idx) => {
                if (item.strategy_id == strategy_id && 
                    promport_num == item.promport_num) {
                    return (
                        <View
                            key = {idx}
                        >
                            <Text>{item.promport_num}</Text>
                            <Text>{item.content}</Text>
                            <TextInput
                                value = {studentAnswer}
                                onChangeText = {changeText}
                            ></TextInput>
                            <Button
                                title = "submit"
                                onPress = {() => {
                                    setPromport_num(promport_num + 1)
                                    if (count == item.promport_num) {
                                        props.navigation.navigate("SelectStrategy",
                                            {question_id : question_id})       
                                    }
                                    addAnswer(item.promport_id, item.answer)
                                    }}
                            />
                        </View>
                    ) 
                }
            })}
        </View>
    );
}

export default Question
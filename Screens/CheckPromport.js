import {TouchableOpacity, Text, View, TextInput, Button} from 'react-native';
import {useState} from 'react';
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import React, { useEffect } from 'react';
import { getgid } from 'process';

const CheckPromport = (props) => {
    const {params} = props.route
    const strategy_id = params? params.strategy_id:null;
    const question_id = params? params.question_id:null;
    const stu_id = params?params.stu_id:null;
    const [promport, setPromport] = useState()
    const [flag,setFlag] = useState(true);
    const [promport_num, setPromport_num] = useState(1)
    const [count, setCount] = useState(0)
    const [feedback, setFeedback] = useState("");
    const [answer, setAnswer] = useState();
    
    const sortJSON = function(data, key) {
        return data.sort(function(a, b) {
          var x = a[key];
          var y = b[key];

        return x < y ? -1 : x > y ? 1 : 0;
        });
      };
      
    const getANswer = async() => {
        try{
            const data = await getDocs(collection(db, "answer"))
            
            setAnswer(data.docs.map(doc=>(
                {...doc.data(), id: doc.id}
                )))
        } catch(error) {
            console.log(error.message)
        }
    }

      const changeText = (event) => {
        setFeedback(event)
      }

      const addFeedBack = async (prompID) => {
        let result
        answer?.map((item)=> {
            if (item.promport_id == prompID) {
                result = item.id
            }
        })
        try {
            const docRef = doc(db, "answer", result);
            await updateDoc(docRef, {
                feedback : feedback
            });
            getANswer()
            console.log("success")
        } catch (error) {
            console.log(error.message);
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
        getANswer()
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
                                <Text>------------------------------</Text>
                                {answer.map((doc, idx) => {
                                    if (doc.student_id == stu_id && doc.promport_id == item.promport_id) {
                                        return <Text key = {idx}>{doc.student_answer}      {doc.answer_check}   feedback : {doc.feedback}</Text>
                                    }
                                })}
                                <TextInput
                                    value = {feedback}
                                    onChangeText = {changeText}
                                />
                                <Button
                                    title ="submit FeedBack"
                                    onPress = {() => {
                                        addFeedBack(item.promport_id)}}
                                />
                                <Button
                                    title = "prior"
                                    onPress = {() => {
                                    if(promport_num > 1) {
                                        setPromport_num(promport_num - 1)
                                        }
                                    }}
                                />
                                <Button
                                    title = "next"
                                    onPress = {() => {
                                    if (promport_num < count) {
                                        setPromport_num(promport_num + 1)
                                    }
                                }}
                                />
                                <Button
                                    title = "go2Strategy"
                                    onPress = {() => {
                                    props.navigation.navigate("SelectStrategy",
                                        {question_id : question_id,
                                            stu_id:stu_id})
                                    }}
                                />
                            </View>
                        )
                }
            })}
        </View>
    );
}

export default CheckPromport
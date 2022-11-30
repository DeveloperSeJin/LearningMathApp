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
    const stu_id = params?params.stu_id:null;
    const [promport, setPromport] = useState()
    const [flag,setFlag] = useState(true);
    const [promport_num, setPromport_num] = useState(1)
    const [count, setCount] = useState(0)
    const [studentAnswer, setStudentAnswer] = useState("");
    const [answer, setAnswer] = useState();
    const [chance, setChance] = useState(1);
    const [show, setShow] = useState(false);

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

      const getAnswer = async() => {
        try{
            const q = query(collection(db,"answer"), where ('student_id', "==", stu_id))
            const data = await getDocs(q)
            setAnswer(data.docs.map(doc => ({...doc.data(), id:doc.id})))

        } catch(error) {
            console.log(error.message)
        }
    }
    
    const wellcome = async() => {
        try{
            let itemList = []
            const q = query(collection(db,"answer"), where ('student_id', "==", stu_id))
            const data = await getDocs(q)
            data.docs.map(doc => {
                itemList.push(doc.data())
            })
            setAnswer(data.docs.map(doc => ({...doc.data(), id:doc.id})))

            const promport_data = await getDocs(collection(db, "promport"))
            let promport_List = []
            promport_data.docs.map(
                doc => {
                    if (doc.data().strategy_id == strategy_id) {
                        promport_List.push(doc.data())
                    }
                })
            promport_List.map((item) => {
                if (item.promport_num == 1) {
                    itemList.map((doc) => {
                        if (doc.promport_id == item.promport_id) {
                            console.log("전에 풀었던 문제 발견")
                            console.log(doc.promport_id)
                            setShow(true)
                            setStudentAnswer(doc.student_answer)
                        }
                    })
                }
            })
        } catch(error) {
            console.log(error.message)
        }
    }

      const changeText = (event) => {
        setStudentAnswer(event)
      }
      
      const addAnswer = async (id, bool) => {
        try {
            var pk
            var check = false

            answer.map((item) => {
                console.log(item.promport_id)
                if (item.promport_id == id) {
                    pk = item.id
                    check = true
                    console.log("step1")
                    console.log(item.id)

                }
            })
            if (check) {
                console.log(pk)
                const docRef = doc(db, "answer", pk);
                    await updateDoc(docRef, {
                        student_answer:studentAnswer,
                        answer_check:bool,
                    });
            }else {
                console.log("step2")
                await addDoc(collection(db, "answer"), {
                    student_answer:studentAnswer,
                    answer_check:bool,
                    feedback:"",
                    promport_id:id,
                    student_id:stu_id
                })
            }
            console.log("step3")
            getAnswer()
            console.log("success")
        } catch (error) {
            console.log(error.message);
        }
      }

      const getMyAnswer = (id) => {
        console.log("getMyAnswer : ", id)
        var bool = false
        answer?.map((item) => {
            if(parseInt(item.promport_id) == id) {
                console.log(item.student_answer)
                setStudentAnswer(item.student_answer)
                bool = true
            }
        })
        if (!bool) {
            setStudentAnswer("")
        }
      }

      const checkAnswer = (id, ans) => {
        //맞았을 때
        if (ans == studentAnswer){
            go2strategy(promport_num)
            setPromport_num(promport_num + 1)
            setChance(1)
            addAnswer(id, "true")
            getMyAnswer(parseInt(id) + 1)
            alert("true")
        } else {//틀렸을 때
            if (chance >= 3) {
                go2strategy(promport_num)
                setPromport_num(promport_num + 1)
                addAnswer(id, "false")
                getMyAnswer(parseInt(id) + 1)
                alert("false")
            } else {
                setChance(chance + 1)
                alert("think again")
            }
        }
      }

      const cantSubmit = (id) => {
        var bool = false

        answer?.map((item) => {
            if (parseInt(item.promport_id) == id) {
                bool = true
                setShow(true)
            }
        })

        if (!bool) {
            setShow(false)
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
        wellcome()
        getPromport()
        setFlag(false)
    }

    const go2strategy = async(num) => {
        if (count <= num) {
            try {
                await addDoc(collection(db, "strategyCheck"), {
                    strategy_id:strategy_id,
                    student_id:stu_id
                })
            } catch (error) {
                console.log(error.message);
            }
            props.navigation.navigate("SelectStrategy",
                {question_id : question_id,
                 stu_id:stu_id})
        }
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
                                />
                                <Button
                                    title = "submit"
                                    disabled={show}
                                    onPress = {() => {
                                        checkAnswer(item.promport_id, item.answer)
                                        }}
                                />
                                <Button
                                    title = "prior"
                                    onPress = {() => {
                                    if(promport_num > 1) {
                                        getMyAnswer(parseInt(item.promport_id) - 1)
                                        setPromport_num(promport_num - 1)
                                        cantSubmit(parseInt(item.promport_id) - 1)
                                        }
                                    }}
                                />
                                <Button
                                    title = "next"
                                    onPress = {() => {
                                    if (promport_num < count) {
                                        getMyAnswer(parseInt(item.promport_id) + 1)
                                        setPromport_num(promport_num + 1)
                                        cantSubmit(parseInt(item.promport_id) + 1)
                                    }
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
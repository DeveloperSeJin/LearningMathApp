import {View, TextInput, Text, Button, TouchableOpacity, Image, ScrollView} from 'react-native'
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import {useState} from 'react'
import questionImg from '../assets/questionImg.png'
import solved from '../assets/solved.png'
import home from '../assets/home.png'
import ax from '../assets/ax.png'
import triangle from '../assets/triangle.png'
import circle from '../assets/circle.png'

const GradedQuestionList = (props) => {
    const {params} = props.route
    const stuID = params? params.stu_id:null;
    const progr = params?params.progress:null;
    
    const [Question, SetQeustion] = useState();
    const [flag,setFlag] = useState(true);
    const [Strategy, setStrategy] = useState();
    const [Promport, setPromport] = useState();
    const [Answer, setAnswer] = useState();

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

    const getQuestion = async () => {
        try{
            const data = await getDocs(collection(db, "question"))
            let itemList = []
            data.docs.map( 
                (doc) => {itemList.push(doc.data())})
            SetQeustion(sortJSON(itemList,"question_id"))

            // SetQeustion(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
        } catch(error) {
            console.log(error.message)
        }
    }
    const getStrategy = async () => {
        try{
            const data = await getDocs(collection(db, "strategy"))

            setStrategy(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
        } catch(error) {
            console.log(error.message)
        }
    }

    const getPromport = async () => {
        try{
            const data = await getDocs(collection(db, "promport"))

            setPromport(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
        } catch(error) {
            console.log(error.message)
        }
    }

    const getAnswer = async () => {
        try{
            const data = await getDocs(collection(db, "answer"))

            setAnswer(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
        } catch(error) {
            console.log(error.message)
        }
    }
    const checkQuestion = (qid) => {
        var check = 0;
        var num = 0;

        Answer?.map((item) => {
            if (item.student_id === stuID) {
                Promport?.map((doc) => {
                    if(doc.promport_id === item.promport_id) {
                        Strategy?.map((get)=> {
                            if(get.question_id === qid) {
                                num++;
                                if (get.strategy_id === doc.strategy_id) {
                                    if(item.answer_check === "true") {
                                        check++;
                                    }
                                }
                            }
                        })
                    }
                })
            }
        })
        if (check == 0) {
            return ax
        } else if ( check == num ) {
            return circle
        }  else {
            return triangle
        }
    }

    if(flag){
        getQuestion()
        getStrategy()
        getPromport()
        getAnswer()
        setFlag(false)
    }

    const showReport = () => {
        var num = 0
        var score = 0
        Answer?.map((item) => {
            if (stuID == item.student_id && item.answer_check == 'true') {
                score++;
            }
        })

        num = Promport?.length
        return score + '/' + num
    }

    
      
    return (
        <View>
            <TouchableOpacity
                onPress = { ()=>props.navigation.navigate("Home",
                    {stu_id:stuID,
                    progress : progr})}>
                <Image
                    style={{width:30,height:30, marginTop:50, marginLeft:20}}
                    source={home}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <Text
                style ={{marginTop :20, fontSize :30, marginLeft:50}}
            >your score : {showReport()}</Text>
            <ScrollView>
            {Question?.map((item, idx) => {
                return(
                    
                    <TouchableOpacity 
                        key = {idx}
                         onPress ={()=> {
                            props.navigation.navigate("CheckStrategy",
                            {question_id:item.question_id,
                             stu_id:stuID,
                            progress:progr})
                         }}
                    >
                        <Image
                            style={{width:100,height:100, marginTop:20}}
                            source={checkQuestion(item.question_id)}
                            resizeMode="contain"
                        />
                        <Text
                            style ={{marginBottom:30}}
                        >{item.title}</Text>
                    </TouchableOpacity>
                )
            })}
            <View style = {{marginBottom:150}}></View>
            </ScrollView>
        </View>
    );
}

export default GradedQuestionList
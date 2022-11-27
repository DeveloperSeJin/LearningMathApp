import {View, TextInput, Text, Button, TouchableOpacity} from 'react-native'
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import {useState} from 'react'


const GradedQuestionList = (props) => {
    const {params} = props.route
    const stuID = params? params.stu_id:null;

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
            return "X"
        } else if ( check == num ) {
            return "V"
        }  else {
            return "*"
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
        let show;
        if (stuID == "001") {
            show = <Text>hi</Text>
        }
        return(show);
    }

    
      
    return (
        <View>
            <Text>{stuID}</Text>
            {showReport()}
            {Question?.map((item, idx) => {
                return(
                    
                    <TouchableOpacity 
                        key = {idx}
                         onPress ={()=> {
                            props.navigation.navigate("CheckStrategy",
                            {question_id:item.question_id,
                             stu_id:stuID})
                         }}
                    >
                        <Text>{item.question_id} {item.main_question} {checkQuestion(item.question_id)}</Text>
                        <Text>-------------------------------------------------------</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    );
}

export default GradedQuestionList
import {Image, TouchableOpacity, Text} from 'react-native'
import people from '../assets/people.png'
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import {useState} from 'react'

const TestList = (props) => {
    const {params} = props.route
    const stu_id = params?params.stu_id:null;

    const [question, setQuestion] = useState();
    const [flag,setFlag] = useState(true);
    const [questionCheck, setQuestionCheck] = useState([]);

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
                doc => {itemList.push(doc.data())})
            setQuestion(sortJSON(itemList,"question_id"));
        } catch(error) {
            console.log(error.message)
        }
    }

    const getCheck = async() => {
        try {
            const data = await getDocs(collection(db, "questionCheck"))
            let itemList = []
            data.docs.map(
                doc => {
                    if (doc.data().student_id == stu_id) {
                        itemList.push(doc.data().question_id)
                    }
                })
                setQuestionCheck(sortJSON(itemList,"question_id"))
        } catch(error) {
            console.log(error.message)
        }
    }

    if(flag){
        getCheck()
        getQuestion()
        setFlag(false)
    }

    const showCheck = (id) => {
        if(questionCheck.includes(id)){
            return true
        }
        else {
            return false
        }
    }

    return (
        question?.map((item,idx) => (
            <TouchableOpacity
            key = {idx}
            disabled = {showCheck(item.question_id)}
            onPress={()=>{
                props.navigation.navigate("SelectStrategy", 
                {question_id : item.question_id,
                 stu_id:stu_id})
            }}>
                <Image
                    style={{width:400,height:100}}
                    source={people}
                    resizeMode="contain"
                />
                <Text>{item.title}</Text>
                <Text>{}</Text>
            </TouchableOpacity>
        ))
    );
}

export default TestList
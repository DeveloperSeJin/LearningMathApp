import {Image, TouchableOpacity, Text, Button, View, ScrollView, ImageBackground} from 'react-native'
import {db} from '../firebaseConfig'
import questionImg from '../assets/questionImg.png'
import solved from '../assets/solved.png'
import submit from '../assets/submit.png'
import home from '../assets/home.png'
import paper from '../assets/paper.png'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import {useState} from 'react'
const TestList = (props) => {
    const {params} = props.route
    const stu_id = params?params.stu_id:null;
    const progr = params?params.progress:null;

    const [question, setQuestion] = useState();
    const [flag,setFlag] = useState(true);
    const [id, setID] = useState()
    const [question_check, setQuestion_check] = useState([]);
    
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

    const getStudent = async() => {
        try {
            const data = await getDocs(collection(db, "student"))

            data.docs.map(doc => {
                if (doc.data().studentid == stu_id) {
                    setID(doc.id)
                }
            })
        } catch (error) {
            console.log(error.message)
        }
    }
    const getQuestionCheck = async() => {
        try {
            const data = await getDocs(collection(db, "questionCheck"))
            let itemList = []
            data.docs.map(
                doc => {
                    if (doc.data().student_id == stu_id) {
                        itemList.push(doc.data().question_id)
                    }
                })
                setQuestion_check(sortJSON(itemList,"question_id"))
        } catch(error) {
            console.log(error.message)
        }
    }

    const getCheck = async() => {
        var returnValue = confirm("문제제출하면 다시 풀 수 없습니다. 제출하시겠습니까?")
        if (returnValue) {
            console.log(id)
            try {
                const docRef = doc(db, "student", id);
                await updateDoc(docRef, {
                    solved:true
                });
                console.log("success")
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    if(flag){
        getStudent()
        getQuestion()
        getQuestionCheck()
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
            <ImageBackground
                source = {paper}
                style={{flexDirection:'row', height:80, marginTop:20}}
            >
                <Text
                    style={{marginTop:20, marginLeft:20,fontSize:20}}
                >choose a Question</Text>
                <TouchableOpacity
                onPress={getCheck}
            >
                <Image
                    style={{width:150, height:100, marginLeft:50}}
                    source={submit}
                    resizeMode="contain"
                />
                </TouchableOpacity>
            </ImageBackground>
            <ScrollView>
            {question?.map((item,idx) => (
                <TouchableOpacity
                    key = {idx}
                    onPress={()=>{
                        props.navigation.navigate("QuestionAnswer", 
                            {question_id : item.question_id,
                            stu_id:stu_id,
                            progress : progr})
                    }}>
                    <Image
                        style={{width:100,height:100, marginTop : 15}}
                        source={question_check?.includes(item.question_id)?solved:questionImg}
                        resizeMode="contain"
                    />
                    <Text
                        style ={{marginBottom:20}}
                    >{item.title}</Text>
                </TouchableOpacity>
            ))}
            </ScrollView>
        </View>
    );
}

export default TestList
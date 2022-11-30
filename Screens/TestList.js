import {Image, TouchableOpacity, Text, Button, View} from 'react-native'
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
    const [id, setID] = useState()
    
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
        setFlag(false)
    }

    return (
        <View>
            {question?.map((item,idx) => (
            <TouchableOpacity
            key = {idx}
            onPress={()=>{
                props.navigation.navigate("QuestionAnswer", 
                {question_id : item.question_id,
                 stu_id:stu_id})
            }}>
                <Image
                    style={{width:400,height:100}}
                    source={people}
                    resizeMode="contain"
                />
                <Text>{item.title}</Text>
            </TouchableOpacity>
        ))}
        <Button
            title = "submit"
            onPress={getCheck}
        />
        </View>
    );
}

export default TestList
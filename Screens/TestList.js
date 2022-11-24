import {Image, TouchableOpacity, Text} from 'react-native'
import people from '../assets/people.png'
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import {useState} from 'react'

const TestList = (props) => {
    const [question, setQuestion] = useState();
    const [flag,setFlag] = useState(true);

    const getQuestion = async () => {
        try{
            const data = await getDocs(collection(db, "question"))
            setQuestion(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
        } catch(error) {
            console.log(error.message)
        }
    }

    if(flag){
        getQuestion()
        setFlag(false)
    }

    return (
        question?.map((item,idx) => (
            <TouchableOpacity
            key = {idx}
            onPress={()=>{
                props.navigation.navigate("SelectStrategy", 
                {question_id : item.question_id})
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
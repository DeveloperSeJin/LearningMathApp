import {useState} from 'react';
import {Image, TouchableOpacity} from 'react-native'
import people from '../assets/people.png'

const TestList = (props) => {
    const [PeopleInfo, setPeopleInfo] = useState(["a","b"]);

    return (
        PeopleInfo.map((item,idx) => (
            <TouchableOpacity
            key = {idx}
            onPress={()=>{
                props.navigation.navigate("SelectStrategy")
            }}>
                <Image
                    style={{width:400,height:100}}
                    source={people}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        ))
    );
}

export default TestList
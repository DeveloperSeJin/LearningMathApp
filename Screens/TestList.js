import {useState} from 'react';
import {Image} from 'react-native'
import People from '../assets/People.png'

const TestList = () => {
    const [People, setPeople] = useState("");
    return (
        People.map((item,idx) => (
            <TouchableOpacity
            key = {idx}
            onPress={()=>{
                props.navigation.navigate("StudentInformation")
            }}>
                <Image
                    style={{width:400,height:100}}
                    source={People}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        ))
    );
}

export default TestList
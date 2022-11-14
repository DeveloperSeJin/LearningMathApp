import {TouchableOpacity, Text, View} from 'react-native';
import {useState} from 'react';

const SelectionStrategy = (props) => {
    return (
        <View>
            <TouchableOpacity
            onPress={()=>{
                props.navigation.navigate("Question")
            }}>
            <Text>Strategy1</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={()=>{
                props.navigation.navigate("Question")
            }}>
            <Text>Strategy2</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={()=>{
                props.navigation.navigate("Question")
            }}>
            <Text>Strategy3</Text>
        </TouchableOpacity>
        </View>
    );
}

export default SelectionStrategy
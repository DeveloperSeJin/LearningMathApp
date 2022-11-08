import {View, StyleSheet, TextInput} from 'react-native';
import {useState} from 'react';

const Input = () => {
    const [UserInfo, setUserInfo] = useState("a")

    const onChangeInput = (event) => {
        setUserInfo(event)
    }

    return (
        <View style={styles.TextBar}>
            <TextInput
            value = {UserInfo}
            onChangeText = {onChangeInput}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    TextBar: {
      width:'100%',
      backgroundColor:"#cecece",
      marginTop:20,
      fontSize:25,
      padding:10
    },
  });

export default Input;
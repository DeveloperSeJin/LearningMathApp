import { Image } from "react-native";

const LogoTitle = () => {
    return(
        <Image 
          style={{width:40,height:40}}
          source={require('../assets/home.png')}
        />
    );
}

export default LogoTitle;
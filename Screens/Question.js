import {TouchableOpacity, Text, View, TextInput, Button, Image} from 'react-native';
import {useState} from 'react';
import {db} from '../firebaseConfig'
import back from '../assets/back.png'
import front from '../assets/front.png'
import home from '../assets/home.png'
import submit from '../assets/submit.png'
import goStrategy from '../assets/goStrategy.png'

import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";

const Question = (props) => {
    const {params} = props.route
    const strategy_id = params? params.strategy_id:null;
    const question_id = params? params.question_id:null;
    const stu_id = params?params.stu_id:null;
    const progr = params?params.progress:null;

    const [promport, setPromport] = useState()
    const [flag,setFlag] = useState(true);
    const [promport_num, setPromport_num] = useState(1)
    const [count, setCount] = useState(0)
    const [studentAnswer, setStudentAnswer] = useState("");
    const [answer, setAnswer] = useState();
    const [chance, setChance] = useState(1);
    const [show, setShow] = useState(false);

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

      const getAnswer = async() => {
        try{
            const q = query(collection(db,"answer"), where ('student_id', "==", stu_id))
            const data = await getDocs(q)
            setAnswer(data.docs.map(doc => ({...doc.data(), id:doc.id})))

        } catch(error) {
            console.log(error.message)
        }
    }
    
    const wellcome = async() => {
        try{
            let itemList = []
            const q = query(collection(db,"answer"), where ('student_id', "==", stu_id))
            const data = await getDocs(q)
            data.docs.map(doc => {
                itemList.push(doc.data())
            })
            setAnswer(data.docs.map(doc => ({...doc.data(), id:doc.id})))

            const promport_data = await getDocs(collection(db, "promport"))
            let promport_List = []
            promport_data.docs.map(
                doc => {
                    if (doc.data().strategy_id == strategy_id) {
                        promport_List.push(doc.data())
                    }
                })
            promport_List.map((item) => {
                if (item.promport_num == 1) {
                    itemList.map((doc) => {
                        if (doc.promport_id == item.promport_id) {
                            console.log((item.answer.split(";"))[0] != "guess" || (item.answer.split(";"))[0] != "goto")
                            console.log("?????? ????????? ?????? ??????")
                            console.log(doc.promport_id)
                            if ((item.answer.split(";"))[0] != "guess" && (item.answer.split(";"))[0] != "goto") {
                                setShow(true)
                            }
                            setStudentAnswer(doc.student_answer)
                        }
                    })
                }
            })
        } catch(error) {
            console.log(error.message)
        }
    }

      const changeText = (event) => {
        setStudentAnswer(event)
      }
      
      const addAnswer = async (id, bool) => {
        try {
            var pk
            var check = false

            answer.map((item) => {
                console.log(item.promport_id)
                if (item.promport_id == id) {
                    pk = item.id
                    check = true
                    console.log("step1")
                    console.log(item.id)

                }
            })
            if (check) {
                console.log(pk)
                const docRef = doc(db, "answer", pk);
                    await updateDoc(docRef, {
                        student_answer:studentAnswer,
                        answer_check:bool,
                    });
            }else {
                console.log("step2")
                await addDoc(collection(db, "answer"), {
                    student_answer:studentAnswer,
                    answer_check:bool,
                    feedback:"",
                    promport_id:id,
                    student_id:stu_id
                })
            }
            console.log("step3")
            getAnswer()
            console.log("success")
        } catch (error) {
            console.log(error.message);
        }
      }

      const getMyAnswer = (id) => {
        console.log("getMyAnswer : ", id)
        var bool = false
        answer?.map((item) => {
            if(parseInt(item.promport_id) == id) {
                console.log(item.student_answer)
                setStudentAnswer(item.student_answer)
                bool = true
            }
        })
        if (!bool) {
            setStudentAnswer("")
        }
      }

      const checkAnswer = (id, ans) => {
        var qus = ans.split(";")[0]
        var result = false
        console.log(qus)
        console.log(ans.split(";").pop())
        if (qus == 'short') {
            console.log('go short')
            result = shortProcess(ans.split(";").pop())
        } else if (qus == 'long') {
            console.log('go long')
            result = longProcess(ans.split(";").pop())
        } else if (qus == 'guess') {
            console.log('go guess')
            result = guessProcess(ans.replace("guess;", ""))
        } else if (qus == 'goto') {
            console.log('go goto')
            result = gotoProcess(ans.replace("goto;", ""))
        }
        console.log(result)

        if (result){  //????????? ???
            go2strategy(promport_num)
            setPromport_num(promport_num + 1)
            setChance(1)
            addAnswer(id, "true")
            getMyAnswer(parseInt(id) + 1)
            alert("true")
        } else {//????????? ???
            if (qus == 'guess') {
                setPromport_num(promport_num + 1)
                addAnswer(id, "false")
                getMyAnswer(parseInt(id) + 1)
            } else if (qus == 'goto') {
                setPromport_num(promport_num + parseInt(ans.split(";")[1]))
                addAnswer(id, "false")
                getMyAnswer(parseInt(id) + parseInt(ans.split(";")[1]))
                alert("false")
            }
            else {
                if (chance >= 3) {
                    go2strategy(promport_num)
                    setPromport_num(promport_num + 1)
                    if (qus == 'long') {
                        addAnswer(id, "")
                    }
                    else {
                        addAnswer(id, "false")
                    }
                    getMyAnswer(parseInt(id) + 1)
                    alert("false")
                } else {
                    setChance(chance + 1)
                    alert("think again")
                }
            }
        }
      }
      
      function inWords (num) {
        const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

        if ((num = num.toString()).length > 9) return 'overflow';
        var mat = ('000000000' + num).substring(num.length)
        var n = mat.match(/(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
        return str;
    }

      const guessProcess = (answer) => {//answer??? ??????
        //?????? ?????? checkAnswer?????? if????????? ???????????? ????????????
        //guess????????? 3?????? ?????? ?????? ?????? ??? ?????????
        //guess;Karla:42;Faye:51????????? ?????? ??? ?????? split?????? ????????? ???????????? ???
        //split?????? ????????? 1?????? ???????????? short??? ????????? ????????? ??????
        var result = false
        var compare
        console.log("answer", answer)
        console.log("length", answer.split(";").length)
        if ((compare = answer.split(";")).length > 1) {// ?????? ??????
            var stu_clasi = studentAnswer.split(";")// Kerla:42   Faye:51
            // ?????? ??????
            console.log(stu_clasi)
            console.log(compare)
            if (inWords((stu_clasi[0]).split(":")[1]) != undefined && 
                    inWords((stu_clasi[1]).split(":")[1]) != undefined){//??????
                        console.log("num num")
                if(((stu_clasi[0]).split(":")[1]).replace(/ /g, "") == ((compare[0]).split(":")[1]).replace(/ /g, "") && 
                        ((stu_clasi[1]).split(":")[1]).replace(/ /g, "") == ((compare[1]).split(":")[1]).replace(/ /g, "")) {
                    result = true
                }
            }
            // ?????? ??????
            else if (inWords((stu_clasi[0]).split(":")[1]) == undefined && 
                    inWords((stu_clasi[1]).split(":")[1]) == undefined){
                        console.log("str str")
                if(((stu_clasi[0]).split(":")[1]).replace(/ /g,"") == inWords((compare[0]).split(":")[1]).replace(/ /g,"") && 
                        ((stu_clasi[1]).split(":")[1]).replace(/ /g,"") == inWords((compare[1]).split(":")[1]).replace(/ /g,"")) {
                    result = true
                }
            }
            // ?????? ??????
            else if (inWords((stu_clasi[0]).split(":")[1]) != undefined && 
                    inWords((stu_clasi[1]).split(":")[1]) == undefined){
                        console.log("num str")
                if(((stu_clasi[0]).split(":")[1]) == ((compare[0]).split(":")[1]) && 
                        ((stu_clasi[1]).split(":")[1]).replace(/ /g,"") == inWords((compare[1]).split(":")[1]).replace(/ /g,"")) {
                    result = true
                }
            }
            // ?????? ??????
            else if (inWords((stu_clasi[0]).split(":")[1]) == undefined && 
                    inWords((stu_clasi[1]).split(":")[1]) != undefined){
                        console.log("str num")
                if((stu_clasi[0]).split(":")[1] == inWords((compare[0]).split(":")[1]).replace(/ /g,"") && 
                        ((stu_clasi[1]).split(":")[1]).replace(/ /g,"") == ((compare[1]).split(":")[1]).replace(/ /g,"")) {
                    result = true
                }
            }
        } else {// ?????? ??????
            result = shortProcess(compare[0])
        }
        //split?????? ????????? 2??? ;?????? ????????? :?????? ????????? ????????? ??????  
        //?????? shortProcess??? ???????????? ?????? (;?????? ????????? ??? length??? 1??????)
        return result
      }

      const gotoProcess = (answer) => {
        //?????? ?????? ?????????
        //0?????????????????? ????????? ???, ????????? 0 return ????????? 0?????? ????????? ??????
        //1?????? ???????????? shortProcess??? ????????? ??????
        console.log(answer)
        var check_answer = answer.split(";")
        console.log(check_answer)
        var result = shortProcess(check_answer[1])

        return result
      }

      const shortProcess = (answer) => {
        var result = false;
        var clasi
        var stu_clasi
        var stu_answer = (studentAnswer.toLowerCase()).replace(/miles|yards|sections|inches|times|days|\$|feet|/g, "")
        //answer??? ?????? studentAnswer??? ????????? ??? ???
        //???????????? ??? ????????????
        console.log(answer)
        if (answer.replace(/ /g,"") == stu_answer.replace(/ /g,"")) {
            console.log(answer.replace(/ /g,""))
            console.log(stu_answer.replace(/ /g,""))
            result = true
        }

        console.log(answer)
        console.log(inWords(answer))
        if (inWords(answer) != undefined){//??????
            console.log("????????????")
            console.log(stu_answer)
            if (inWords(answer).toUpperCase() == stu_answer.toUpperCase()) {
                result = true
            }
        } else {
            if((stu_clasi = stu_answer.split(".")).length < 2) {//??????????????? ???????????? ????????? ????????? ??????
                stu_clasi = stu_answer.split("/")
            }

            if((clasi = answer.split(".")).length == 2) {//??????    
                var digits = 10 ** clasi[1].length
                var molecule = parseFloat(answer) * digits
                var fraction =  molecule + "/" + digits

                console.log(inWords(clasi[0]))
                console.log(stu_clasi)
                if (inWords(clasi[0]).replace(/ /g, "") == stu_clasi[0].replace(/ /g, "") && 
                        inWords(clasi[1]).replace(/ /g, "") == stu_clasi[1].replace(/ /g, "")) {//.?????? ????????? ????????? ????????????
                    result = true
                } else if (fraction == stu_answer.replace(/ /g,"")) {//????????? ????????????
                    result = true
                } else if (((inWords(molecule).replace('and','')).replace(/ /g,"")) == stu_clasi[0].replace(/ /g,"") &&
                                inWords(digits).replace(/ /g,"") == stu_clasi[1].replace(/ /g,"")) {//????????? ????????? ?????? ?????????
                    result = true
                }
            } else if((clasi = answer.split("/")).length == 2) {//??????
                var mixedNumber = clasi[0].split(' ')//???????????? ?????? length??? 2 ????????? 1
                var digits2 = clasi[1]//??????
                var molecule2 = clasi[0]//??????
                var str = inWords(molecule2) + "/" + inWords(digits2)
                console.log("digits2",digits2)
                console.log("molecule2",molecule2)
                console.log("str", str)

                if (mixedNumber.length > 1) {// ????????? ??? ???
                    console.log("?????????")
                    console.log(mixedNumber)
                    var num = mixedNumber[0]// ???????????? ?????? ???????????? ?????????
                    molecule2 = mixedNumber[1]//???????????? ??? ??????
                    str = inWords(num) + inWords(molecule2) + "/" + inWords(digits2) //????????? ??????
                    var improper_molecule = (parseInt(num) * parseInt(digits2)) + parseInt(molecule2)//????????? ??????
                    var improper = improper_molecule + "/" + digits2//?????????
                    var decimal = ((improper_molecule / digits2).toFixed(3)).toString()//??????
                    var strDecimal = inWords((decimal.split(".")[1])[0]) + inWords((decimal.split(".")[1])[1]) +
                                        inWords((decimal.split(".")[1])[2])
                    
                    if (str.replace(/ /g,"") == stu_answer.replace(/ /g,"")) {//????????? ?????????
                        result = true
                    } else if (improper == stu_answer.replace(/ /g, "")) {//???????????? ?????????
                        result = true
                    } else if (inWords(improper_molecule).replace("and","").replace(/ /g,"") == stu_clasi[0].replace("and","").replace(/ /g, "") &&
                                inWords(digits2).replace(/ /g,"") == stu_clasi[1].replace(/ /g, "")) {//???????????? ?????????
                        result = true
                    } else if (decimal == stu_answer.replace(/ /g,"")) {//????????? ?????????
                        result = true
                    } else if (inWords(decimal.split(".")[0]).replace(/ /g,"") == stu_clasi[0].replace(/ /g,"") && 
                                    strDecimal.replace(/ /g,"") == stu_clasi[1].replace(/ /g,"")) {//????????? ???????????? ?????????
                        result = true
                    }
                } else {//?????? ??????
                    var decimal = ((molecule2 / digits2).toFixed(3)).toString()//??????

                    if (str.replace(/ /g,"") == stu_answer.replace(/ /g,"")) {//???????????? ??????
                        result = true
                    } else if (decimal.replace(/ /g," ") == stu_answer.replace(/ /g, "")) {//???????????? ??????
                        result = true
                    } else if (inWords(decimal.split(".")[0]) == stu_clasi[0].replace(/ /g, "") && 
                                    strDecimal.replace(/ /g,"") == stu_clasi[1].replace(/ /g, "")) {//???????????? ?????? ??????
                        result = true
                    }
                }
            } else {//??????
                if (answer.toUpperCase() == stu_answer.replace(/ /g,"").toUpperCase()) {
                    result = true
                }
            }
        }
        return result
      }

      const longProcess = (answer) => {
        //?????? ???????????? answer, studentanswer ??? ??? ???????????? ??????
        //?????? ??????????????? ?????? ????????? ?????? ??????
        var result = false
        if (answer.replace(/ /g,"") == studentAnswer.replace(/ /g,"")) {//????????? ?????????
            result = true
        }
        return result
      }

      const cantSubmit = (id) => {
        var bool = false

        answer?.map((item) => {
            if (parseInt(item.promport_id) == id) {
                bool = true
                setShow(true)
            }
        })
        promport?.map((item) => {
            if (item.promport_id == id && ((item.answer.split(";"))[0] == "guess" || (item.answer.split(";"))[0] == "goto")) {
                setShow(false)
            }
        })
        if (!bool) {
            setShow(false)
        }
      }

      const getPromport = async () => {
        try{
            const data = await getDocs(collection(db, "promport"))
            let itemList = []
            data.docs.map(
                doc => {
                    if (doc.data().strategy_id == strategy_id) {
                        itemList.push(doc.data())
                    }
                })
            setCount(itemList.length)
            setPromport(sortJSON(itemList,"promport_num"));
        } catch(error) {
            console.log(error.message)
        }
    }
    if(flag){
        wellcome()
        getPromport()
        setFlag(false)
    }

    const go2strategy = async(num) => {
        if (count <= num) {
            try {
                await addDoc(collection(db, "strategyCheck"), {
                    strategy_id:strategy_id,
                    student_id:stu_id
                })
            } catch (error) {
                console.log(error.message);
            }
            props.navigation.navigate("SelectStrategy",
                {question_id : question_id,
                 stu_id:stu_id,
                progress:progr})
        }
    }

    return (
        <View
            style ={{marginTop:50}}    
        >
            {promport?.map((item, idx) => {
                if (item.strategy_id == strategy_id && 
                    promport_num == item.promport_num) {
                        return (
                            <View
                                key = {idx}
                            >
                            <View
                                style ={{flexDirection:'row'}}
                            >
                            <TouchableOpacity
                                onPress = { ()=>props.navigation.navigate("Home",
                                    {stu_id:stu_id,
                                    progress : progr})}>
                                <Image
                                    style={{width:30,height:30, marginLeft:20, marginRight:100}}
                                    source={home}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>    
                            <TouchableOpacity
                                onPress = {() => {
                                    if(promport_num > 1) {
                                        getMyAnswer(parseInt(item.promport_id) - 1)
                                        setPromport_num(promport_num - 1)
                                        cantSubmit(parseInt(item.promport_id) - 1)
                                        }
                                    }}
                            >
                                <Image
                                    style ={{width:30, height:20,marginLeft:130}}
                                    source = {back}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => {
                                    if (promport_num < count) {
                                        getMyAnswer(parseInt(item.promport_id) + 1)
                                        setPromport_num(promport_num + 1)
                                        cantSubmit(parseInt(item.promport_id) + 1)
                                    }
                                }}
                            >
                                <Image
                                    style ={{width:30, height:20,marginLeft:30}}
                                    source = {front}
                                />
                            </TouchableOpacity>
                            </View>
                                
                            <View
                                style ={{ marginLeft :10, marginRight:20, backgroundColor:'#F6FAC2', width: 390, height:100, marginTop:20}}
                                key = {idx}
                            >
                                <Text>{item.promport_num}</Text>
                                <Text>{item.content}</Text>
                            </View>
                            <View
                                style ={{ marginLeft :10, marginRight:20, backgroundColor:'#F6FAC2', width: 390, height:100, marginTop:20}}
                            >
                                {console.log(item.answer)}
                                <TextInput
                                    value = {studentAnswer}
                                    onChangeText = {changeText}
                                />
                            </View>
                            <TouchableOpacity
                                onPress = {() => props.navigation.navigate("SelectStrategy",
                                {question_id : question_id,
                                stu_id:stu_id,
                                progress:progr})}
                            >
                                <Image
                                    style ={{width:50, height:20, marginLeft:20, marginTop:20}}
                                    source = {goStrategy}
                                />
                            </TouchableOpacity>
                                <TouchableOpacity
                                    onPress = {() => {
                                        checkAnswer(item.promport_id, item.answer)
                                        }}
                                    disabled ={show}
                                >
                                    <Image  
                                        style={{width:200, height:100, marginLeft:200}}
                                        source={submit}
                                        resizeMode="contain"
                                    />
                            </TouchableOpacity> 
                            </View>
                        )
                }
            })}
        </View>
    );
}

export default Question
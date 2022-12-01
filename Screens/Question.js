import {TouchableOpacity, Text, View, TextInput, Button} from 'react-native';
import {useState} from 'react';
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";

const Question = (props) => {
    const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

    const {params} = props.route
    const strategy_id = params? params.strategy_id:null;
    const question_id = params? params.question_id:null;
    const stu_id = params?params.stu_id:null;
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
                            console.log("전에 풀었던 문제 발견")
                            console.log(doc.promport_id)
                            setShow(true)
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
            result = shortProcess(ans)
        } else if (qus == 'long') {
            result = longProcess(ans)
        } else if (qus == 'guess') {
            result = guessProcess(ans)
        } else if (qus == 'goto') {
            result = gotoProcess(ans)
        }
        console.log(result)

        if (result){  //맞았을 때
            go2strategy(promport_num)
            setPromport_num(promport_num + 1)
            setChance(1)
            addAnswer(id, "true")
            getMyAnswer(parseInt(id) + 1)
            alert("true")
        } else {//틀렸을 때
            if (qus == 'guess') {
                setPromport_num(promport_num + 1)
                addAnswer(id, "false")
                getMyAnswer(parseInt(id) + 1)
            } else if (qus == 'goto') {
                setPromport_num(promport_num + parseInt(ans.split(";")[1]))
                addAnswer(id, "false")
                getMyAnswer(parseInt(id) + 1)
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
        if ((num = num.toString()).length > 9) return 'overflow';
        n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
        return str;
    }

      const guessProcess = (answer) => {//answer가 정답
        //이거 위에 checkAnswer에서 if문으로 여러가지 분류하고
        //guess문제는 3번의 기회 없이 그냥 쭉 가는겨
        //guess;Karla:42;Faye:51문제가 있음 맨 첨에 split으로 한번더 구분해야 함
        //split해서 길이가 1이면 숫자니까 short의 숫자랑 똑같이 구분
        var result = false
        var compare

        if ((compare = answer.split(";")).length > 1) {// 문자 정답
            var stu_clasi = studentAnswer.split(";")// Kerla:42   Faye:51
            // 숫자 숫자
            if (inWords((stu_clasi[0]).split(":")[1]) != undefined && 
                    inWords((stu_clasi[1]).split(":")[1]) != undefined){//숫자
                if(((stu_clasi[0]).split(":")[1]) == ((compare[0]).split(":")[1]) && 
                        ((stu_clasi[1]).split(":")[1]) == ((compare[1]).split(":")[1])) {
                    result = true
                }
            }
            // 문자 문자
            else if (inWords((stu_clasi[0]).split(":")[1]) == undefined && 
                    inWords((stu_clasi[1]).split(":")[1]) == undefined){
                if(inWords((stu_clasi[0]).split(":")[1]) == ((compare[0]).split(":")[1]).replace(/ /g,"") && 
                        inWords((stu_clasi[1]).split(":")[1]) == ((compare[1]).split(":")[1]).replace(/ /g,"")) {
                    result = true
                }
            }
            // 숫자 문자
            else if (inWords((stu_clasi[0]).split(":")[1]) != undefined && 
                    inWords((stu_clasi[1]).split(":")[1]) == undefined){
                if(((stu_clasi[0]).split(":")[1]) == ((compare[0]).split(":")[1]) && 
                        inWords((stu_clasi[1]).split(":")[1]) == ((compare[1]).split(":")[1]).replace(/ /g,"")) {
                    result = true
                }
            }
            // 문자 숫자
            else if (inWords((stu_clasi[0]).split(":")[1]) == undefined && 
                    inWords((stu_clasi[1]).split(":")[1]) != undefined){
                if(inWords((stu_clasi[0]).split(":")[1]) == ((compare[0]).split(":")[1]).replace(/ /g,"") && 
                        ((stu_clasi[1]).split(":")[1]) == ((compare[1]).split(":")[1])) {
                    result = true
                }
            }
        } else {// 숫자 정답
            result = shortProcess(compare)
        }
        //split해서 길이가 2면 ;으로 나누고 :으로 나눠서 숫자만 비교  
        //그냥 shortProcess로 넘겨주면 될듯 (;으로 나눴을 때 length가 1이면)
        return result
      }

      const gotoProcess = (answer) => {
        //얘는 그냥 숫자임
        //0번째인덱스는 틀렸을 때, 맞으면 0 return 틀리면 0번째 인덱스 리턴
        //1번째 인덱스는 shortProcess에 넘기면 될듯
        var check_answer = answer.split(";")
        var result = shortProcess(check_answer[1])

        return result
      }

      const shortProcess = (answer) => {
        var result = false;
        var clasi
        var stu_clasi
        //answer가 정답 studentAnswer가 학생이 쓴 답
        //공백제거 후 똑같은거
        if (answer == studentAnswer.replace(/ /g,"")) {
            result = true
        }

        if (inWords(answer) != undefined){//숫자
            if (inWords(answer).toUpperCase == studentAnswer.toUpperCase) {
                result = true
            }
        } else {
            if((stu_clasi = studentAnswer.split(".")).length < 2) {//소수점으로 나눠지지 않으면 분수로 나눔
                stu_clasi = studentAnswer.split("/")
            }

            if((clasi = answer.split(".")).length == 2) {//소수    
                var digits = 10 ** clasi[1].length
                var molecule = parseFloat(answer) * digits
                var fraction =  molecule + "/" + digits

                if (inWords(clasi[0]) == stu_clasi[0] && 
                        inWords(clasi[1]) == stu_clasi[1]) {//.으로 구분해 문자로 똑같은거
                    result = true
                } else if (fraction == studentAnswer.replace(/ /g,"")) {//소수를 분수화함
                    result = true
                } else if (((inWords(molecule).replace('and','')).replace(/ /g,"")) == stu_clasi[0].replace(/ /g,"") &&
                                inWords(digits).replace(/ /g,"") == stu_clasi[1].replace(/ /g,"")) {//소수를 분수화 한걸 문자화
                    result = true
                }
            } else if((clasi = answer.split("/")).length == 2) {//분수
                var mixedNumber = clasi[0].split(' ')//대분수일 경우 length가 2 아니면 1
                var digits2 = inWords(clasi[1])//분모
                var molecule2 = inWords(clasi[0])//분자
                var str = molecule2 + "/" + digits2

                if (mixedNumber.length > 1) {// 대분수 일 때
                    var num = inWords(mixedNumber[0])// 대분수에 있는 붙어있는 자연수
                    molecule2 = inWords(mixedNumber[1])//대분수일 때 분자
                    str = num + molecule2 + "/" + digits2 //대분수 문자
                    var improper_molecule = num * digits2 + parseInt(molecule2)//가분수 분자
                    var improper = improper_molecule + "/" + digits2//가분수
                    var decimal = ((improper_molecule / digits2).toFixed(3)).toString()//소수

                    if (str.replace(/ /g,"") == studentAnswer.replace(/ /g,"")) {//대분수 문자화
                        result = true
                    } else if (improper == studentAnswer.replace(/ /g, "")) {//가분수로 만들기
                        result = true
                    } else if (inWords(improper_molecule) == stu_clasi[0].replace(/ /g, "") &&
                                inWords(digits2) == stu_clasi[1].replace(/ /g, "")) {//가분수에 문자로
                        result = true
                    } else if (decimal == studentAnswer.replace(/ /g,"")) {//소수로 만들기
                        result = true
                    } else if (inWords(decimal.split(".")[0]) == stu_clasi[0].replace(/ /g, " ") && 
                                inWords(decimal.split(".")[1]) == stu_clasi[1].replace(/ /g, " ")) {//소수로 만들어서 문자로
                        result = true
                    }
                } else {//일반 분수
                    var decimal = ((molecule2 / digits2).toFixed(3)).toString()//소수

                    if (str.replace(/ /g,"") == studentAnswer.replace(/ /g,"")) {//일반분수 문자
                        result = true
                    } else if (decimal.replace(/ /g," ") == studentAnswer.replace(/ /g, "")) {//일반분수 소수
                        result = true
                    } else if (inWords(decimal.split(".")[0]) == stu_clasi[0].replace(/ /g, " ") && 
                                    inWords(decimal.split(".")[1]) == stu_clasi[1].replace(/ /g, " ")) {//일반분수 소수 문자
                        result = true
                    }
                }
            } else {//문자
                if (answer.toUpperCase() == studentAnswer.replace(/ /g,"").toUpperCase()) {
                    result = true
                }
            }
        }
        return result
      }

      const longProcess = (answer) => {
        //가장 간단한건 answer, studentanswer 둘 다 공백제거 비교
        //이건 선생님한테 채점 맡기고 일단 보류
        var result = false
        if (answer.replace(/ /g,"") == studentAnswer.replace(/ /g,"")) {//대분수 문자화
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
                 stu_id:stu_id})
        }
    }

    return (
        <View>
            {promport?.map((item, idx) => {
                if (item.strategy_id == strategy_id && 
                    promport_num == item.promport_num) {
                        return (
                            <View
                                key = {idx}
                            >
                                <Text>{item.promport_num}</Text>
                                <Text>{item.content}</Text>
                                <TextInput
                                    value = {studentAnswer}
                                    onChangeText = {changeText}
                                />
                                <Button
                                    title = "submit"
                                    disabled={show}
                                    onPress = {() => {
                                        checkAnswer(item.promport_id, item.answer)
                                        }}
                                />
                                <Button
                                    title = "prior"
                                    onPress = {() => {
                                    if(promport_num > 1) {
                                        getMyAnswer(parseInt(item.promport_id) - 1)
                                        setPromport_num(promport_num - 1)
                                        cantSubmit(parseInt(item.promport_id) - 1)
                                        }
                                    }}
                                />
                                <Button
                                    title = "next"
                                    onPress = {() => {
                                    if (promport_num < count) {
                                        getMyAnswer(parseInt(item.promport_id) + 1)
                                        setPromport_num(promport_num + 1)
                                        cantSubmit(parseInt(item.promport_id) + 1)
                                    }
                                }}
                                />
                            </View>
                        )
                }
            })}
        </View>
    );
}

export default Question
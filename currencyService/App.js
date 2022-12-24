/**
 * "StAuth10244: I Jongeun Kim, 000826393 certify that this material is my original work. 
 * No other person's work has been used without due acknowledgement. 
 * I have not made my work available to anyone else."
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import Clock from 'react-live-clock';
import * as Font from 'expo-font';


const App = () => {      
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currency, setCurrency] = useState('usd');
  const [country, setCountry] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');  
  const [resultC, setResultC] = useState([]);
  
  
  useEffect(()=>{
    async function fontData(){
      await Font.loadAsync({
        "DancingScript-Bold" : require("./assets/fonts/DancingScript-Bold.ttf"),
        "DancingScript-Medium" : require("./assets/fonts/DancingScript-Medium.ttf"),
        "DancingScript-Regular" : require("./assets/fonts/DancingScript-Regular.ttf"),
        "DancingScript-SemiBold" : require("./assets/fonts/DancingScript-SemiBold.ttf"),      
        "Lobster-Regular" : require("./assets/fonts/Lobster-Regular.ttf"),
        "MarkoOne-Regular" : require("./assets/fonts/MarkoOne-Regular.ttf")
      });
    }        
    fontData();
  }, []);
  
  async function getCurrency(currency){
    try{
      const url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/' + currency + '.json';      
      const response = await fetch(url);
      const response_org = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json');
      const json = await response.json();      
      const json_org = await response_org.json();
      switch(currency){
        case 'usd':
          setData(json.usd);
          break;
        case 'eur':
          setData(json.eur);
          break;
        case 'krw':
          setData(json.krw);
          break;
        case 'cad':
          setData(json.cad);
          break;
      }      
      setCountry(json_org);
      
    }catch(error){
      console.error(error);
    }finally{
      setLoading(false);
    }
  }
  
  async function getResult(){        
    try{
      const url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/' + search + '.json';
      console.log(url);
      const response = await fetch(url);
      const json = await response.json();
      const currencyArray = json[search];
      const codeArray = [];
      const keys_list = Object.keys(currencyArray);
      for(var key in keys_list){
        var key = keys_list[key];
        const cList = {"code": key, "unit": currencyArray[key]};
        codeArray.push(cList);
      }
      setResultC(codeArray);
    }catch(e){
      console.error(e);
    }
  }

  useEffect(()=>{
    getCurrency(currency);
  }, [currency]);  
  
  
  const stringify = JSON.stringify(country);   
  const codesList = JSON.parse(stringify, (key, value)=>{
    if(typeof value ==='string'){
      return value.toUpperCase();
    }
    return value;
  });

  
  const keys_list = Object.keys(codesList);    
  // console.log(keys_list[0]);
  const codeArray = [];
  for(var key in keys_list){
    var key = keys_list[key];
    const cList = {"code": key, "unit": codesList[key]};
    codeArray.push(cList);
  }
  // console.log(testArray.length);
  //console.log(testArray);
  const currencies = ['usd', 'cad', 'eur', 'krw','cop','jpy','cny','hkd','rub','inr'];
  const btnLabels = ['usd', 'eur', 'cad', 'krw'];

  
  function codeTransform(code){
    const str = code.substr(0, 2)
    const tCode = str.toUpperCase()+'.png';
    return tCode;
  }

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.itemList, backgroundColor]}>
      <Text style={[styles.itemTitle, textColor]}>{item.code} - {item.unit}</Text>
    </TouchableOpacity>
  );

  const renderingList = ({item}) =>{
    const backgroundColor = item.code === selectedId ? "#F9A825" : "#FDD835";
    const color = item.code === selectedId ? 'white' : 'black';
    return(      
        <Item
        item={item}
        onPress={() => setSelectedId(item.code)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />      
    );
  };
  
  return (    
    <View style={[styles.container,{flexDirection: "Column"}]}>
      <View>
        <Layout
        label = "Today's Currency"
        buttons={btnLabels}
        selectedValue={currency}
        setSelectedValue={setCurrency}>
          <View style={styles.output}>           
            {currencies.map((currency)=>(
              <View style={styles.box}>
                <Image source={{uri: 'https://www.countryflagicons.com/FLAT/64/'+ codeTransform(currency)}} style={{width:80, height: 50}}/>
                <Text style={styles.countryLabel}>{country[currency]}</Text>
                <Text style={styles.digits}>{data[currency]}</Text>
              </View>
            ))}         
          </View>        
        </Layout>    
      </View>
      <View style={{height: 300, flexDirection:"row"}}>
        <FlatList data={codeArray}
        renderItem={renderingList}/>
        <View style={[styles.container, {flex:3, backgroundColor: "#FDD835", marginLeft: 18}]}>
          <View style={{flexDirection:"row"}}>
            <Text style={{alignSelf: 'center'}}>Get the currency value with</Text>
            <TextInput style={styles.textInput}
            onChangeText={search=>setSearch(search)}/>
            <Text style={{alignSelf: 'center', marginRight: 5}}>as base currency</Text>            
            <Button color="black" 
            title="Search"
            onPress={getResult}/>
          </View>
          <View>
            <FlatList 
            style={{height: 200}}
            data={resultC}
            horizontal={false}
            numColumns={5}
            columnWrapperStyle={{ marginTop: 20, borderLeftWidth: 2 }}
            renderItem={({item}) => <Text>&nbsp;{item.code} : {item.unit}&nbsp;&nbsp;&nbsp;&nbsp;</Text>}/>
          </View>
        </View>
      </View>        
    </View>    
  );

};

const Layout = ({
  label,
  children,
  buttons,
  selectedValue,
  setSelectedValue
}) => (
  <View style={{flex:1, backgroundColor: "white"}}>
      <Text style={styles.title}>{label}</Text>
      <View style={styles.timer}>
        <View style={{justifyContent: 'center'}}><Clock format={'MMM DD'} /></View>
        <View style={{justifyContent: 'center'}}><Clock format={'HH:mm:ss'} ticking={true}/></View>
        <View style={{justifyContent: 'center'}}><Clock format={'dddd'} /></View>          
      </View>
      <View style={styles.row}>
          {buttons.map((button)=>(
            <TouchableOpacity
            key={button}
            onPress={()=>setSelectedValue(button)}
            style={[styles.button, selectedValue === button && styles.selected]}>
              <Text style={[styles.buttonLabel, selectedValue === button && styles.selectedLabel]}>
                {button}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.container}>
            {children}
          </View>
      </View>            
  </View>      
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  box: {
    width: 210,
    height: 95,
    marginBottom: 70,
    marginTop: 70,
    flexDirection: "column",
    alignItems:"center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  textInput :{
    height: 40,
    width: '10%',
    fontSize: 12,
    borderRadius: 10, 
    borderColor: 'gray', 
    borderWidth: 2, 
    paddingLeft: 10,
    marginRight: 5,
    marginLeft: 5,
  },
  btn_search: {
    marginLeft : 10,
    color: "black",
  },
  title :{
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 50,
    fontFamily: 'DancingScript-Bold'

  },
  itemTitle :{
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 13,  
    fontFamily: 'MarkoOne-Regular',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  },
  itemList: {
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 16,
  },
  timer :{
    textAlign: "center",    
    fontSize: 25,
    fontFamily: 'Lobster-Regular',
    flexDirection: "row",
    justifyContent: 'space-evenly',
    marginBottom: 50,
  },
  output : {
    flex: 1,    
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 25,    
    justifyContent: "space-between",
    marginTop: 50,
    height: "auto",
  },
  digits :{
    textAlign: "center",    
    fontSize: 20,
    fontFamily: 'Lobster-Regular',
  },
  countryLabel : {
    textAlign: "center",
    fontFamily: 'MarkoOne-Regular',
    fontSize: 20,  
    marginTop: 30,  
    marginBottom: 10,   
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: "oldlace",
    alignSelf: "flex-start",
    marginHorizontal: "1%",
    marginBottom: 6,
    minWidth: "48%",
    textAlign: "center"
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: "1000",
    color: "coral",
    textTransform: "uppercase",
  },
  selected: {
    backgroundColor: "coral",
    borderWidth: 0
  },
  selectedLabel: {
    color: "white"
  },
});

export default App;
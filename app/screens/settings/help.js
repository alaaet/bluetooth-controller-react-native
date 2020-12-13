import React ,{useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView
  } from 'react-native';
  import { globalStyles, globalColors } from '../../styles/global';
  import {useTheme} from '../../components/theme/ThemeProvider';
  import Collapsible from 'react-native-collapsible';
  import Accordion from 'react-native-collapsible/Accordion';
  import Separator from "../../components/separator";

  function  Help () {
    const {colors, isDark, setScheme} = useTheme();
    const [activeSections,setActiveSections]=useState([" "]);
    const separatorColor = colors.separator;
    const SECTIONS = [
        {
          title: 'Assembly & Installation',
          content: ['Lorem ipsum...','Lorem ipsum...','Lorem ipsum...'],
        },
        {
          title: 'App Features',
          content: ['Lorem ipsum...','Lorem ipsum...','Lorem ipsum...'],
        },
    
        {
          title: 'Guarantee & Return Policy',
          content: ['Lorem ipsum...','Lorem ipsum...','Lorem ipsum...'],
        },
        {
            title: 'Fixing & Maintenance',
            content: ['Lorem ipsum...','Lorem ipsum...','Lorem ipsum...'],
          },
      ];
   const renderSectionTitle = section => {
        return (
          <View style={styles.content}>
            
          </View>
        );
      };
      const renderHeader = section => {
        return (
          <View style={styles.header}>
            <Text style={styles.titleText}>{section.title}</Text>
          </View>
        );
      };
      const renderContent = section => {
        return (
          <View style={styles.content}>
            <Text style={styles.title}>{section.content[0]}</Text>
            <Separator color={separatorColor} ml={1} mr={1}/>
            <Text style={styles.title}>{section.content[1]}</Text>
            <Separator color={separatorColor} ml={1} mr={1}/>
            <Text style={styles.title}>{section.content[2]}</Text>
            <Separator color={separatorColor} ml={1} mr={1}/>
          </View>
        );
      };
      const UpdateSections = (val) => {
        setActiveSections(val);
      };
    return (
        <View style={{...globalStyles.container, backgroundColor:colors.background }}>
            <ScrollView>
                <Accordion
                    sections={SECTIONS}
                    activeSections= {activeSections}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    onChange={val=>UpdateSections(val)}
        />
                <View style={styles.textcontainer}>
                    <Text style={{fontSize:16,color:colors.text}}>If you did not find the required information, please contact us at: <Text style={{fontSize:16,color:globalColors.yellow}}>info@smoothly-awake.de</Text> </Text>
                
                </View>
            </ScrollView> 
        </View>  
        )
  }
  export default Help;
  const styles = StyleSheet.create({
    content: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
      },
      header: {
        alignSelf:"center",
        justifyContent:"center",
       width: '100%',
       backgroundColor : globalColors.blue,
       padding: 20,
       borderRadius: 5,
      marginVertical:5,
      },
      title:{
          marginVertical:10,
          fontSize: 18, 
      }
     , titleText: {
        fontSize: 18,
      },
      textcontainer:{
          marginTop:20,
          display:"flex",
          
      }
  });

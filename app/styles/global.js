import { StyleSheet } from "react-native";
export const globalColors = 
{
  yellow :"#f9ce40",
  blue: "#76bae7",
  black:"#000000",
  white: "#ffffff",
  grey:"#f4f3f4",
  grey2:"#D3D3D3",
  Darkgrey:"#767577",

};
export const lightColors = {
  background: '#FFFFFF',
  primary: '#512DA8',
  text: '#121212',
  error: '#D32F2F',
  header:'#f0f0f0',
  period:"grey",
  Picker:globalColors.white,
  separator:globalColors.grey2,
  card:globalColors.white,

};

// Dark theme colors
export const darkColors = {
  background: '#434343',
  primary: '#B39DDB',
  text: '#FFFFFF',
  error: '#EF9A9A',
  header:'#555555',
  period:'#FFFFFF',
  Picker:'#303030',
  separator:'#b8b8b8',
  card:'#303030'
  
};
export const globalStyles = StyleSheet.create({
  
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: globalColors.yellow,
  },
  toastText: {
    fontSize: 18,
  
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor:"white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
    textAlign: "center",
  },

});

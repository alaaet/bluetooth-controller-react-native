import { StyleSheet } from "react-native";

export const globalColors = 
{
  yellow :"#f9ce40",
  blue: "#76bae7",
  black:"#000000",
  white: "#ffffff"
};

export const globalStyles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: globalColors.yellow,
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "white",
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

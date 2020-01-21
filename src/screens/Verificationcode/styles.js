import { StyleSheet, Platform } from 'react-native';

export const CELL_SIZE = 40;
export const CELL_BORDER_RADIUS = 10;
export const DEFAULT_CELL_BG_COLOR = '#fff';
export const NOT_EMPTY_CELL_BG_COLOR = '#3557b7';
export const ACTIVE_CELL_BG_COLOR = '#f7fafe';

export default StyleSheet.create({
  inputWrapper: {
    backgroundColor: 'white',
  },

  inputLabel: {
    paddingTop: 100,
    marginVertical: 25,
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
   
  },

  icon: {
    width: 217 / 2.4,
    height: 158 / 2.4,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  inputSubLabel: {
    paddingTop: 30,
    color: '#000',
    textAlign: 'center',
  },
  inputWrapStyle: {
    height: CELL_SIZE,
    marginTop: 30,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },

  input: {
    margin: 0,
    height: CELL_SIZE,
    width: CELL_SIZE,
    lineHeight: 35,
    ...Platform.select({
      web: {
        lineHeight: 35,
      },
    }),
    fontSize: 20,
    borderRadius: CELL_BORDER_RADIUS,
    color: '#3759b8',
    backgroundColor: '#fff',

    // IOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    // Android
    elevation: 3,
  },

  nextButton: {
    marginTop: 40,
    borderRadius: 20,
    minHeight: 40,
    backgroundColor: '#1778F2',
    alignSelf: 'center',
    flex: 1,
    width: 100,
    
  },

  nextButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginTop: 10,
  },
  closebtn:{
    width: 30, 
    height: 30,
    marginTop:50,
    marginLeft:20
  },
});

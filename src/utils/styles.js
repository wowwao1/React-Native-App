
export const getShadow = ({ width = 0, height = 0, color = "#aaaaaa", opacity = 0.3, radius = 5 } = {}) => {
 return {
   shadowColor: color,
   shadowOffset: {
     width,
     height,
   },
   shadowOpacity: opacity,
   shadowRadius: radius,

   elevation: 3,
 }
}

export const anotherStyle = () => {
 return {
   fontStyle: 'normal',
   color: "#ffaa22"
 }
}
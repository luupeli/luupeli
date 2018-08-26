import React from 'react'
import Confetti from 'react-confetti'

const imageWidthR = () => {              // Here we try to measure the window size in order to resize the bone image accordingly
    const windowWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    )
    return Math.round(windowWidth * 1.0)
}

const imageHeightR = () => {              // Here we try to measure the window size in order to resize the bone image accordingly
    const windowHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    )
    return Math.round(windowHeight * 1.0)
}


const cherryBlossomizer = (style) => {
    if (style==='cherry-blossom' || style==='dark-blossom') {
        
    
    var colors = ['#ffc3e1','#ffd2e8','#ffe1f0','#fff0f7','#ffffff']
    var numberOfPieces = 75
    if (style==='dark-blossom') {
        colors = ['#190a12','#331524','#4c1f36','#662a48','#7f345a']
        var numberOfPieces = 125
    }
     

      return (<Confetti width={imageWidthR()} height={imageHeightR()} colors={colors} numberOfPieces={numberOfPieces} run={true} gravity={0.035} />)
    }
    else {
        return null;
    } 
}

export default cherryBlossomizer

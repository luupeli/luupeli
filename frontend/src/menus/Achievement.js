

const getGoal = (score,games) => {   
    if (score<12500) {
        return 12500
    }
    else if (score<25000 || games<3) {
        return 25000
    } else if (score<50000 || games<5) {
        return 50000
    }
    else if (score<100000 || games<8) {
        return 100000
    }
    else if (score<200000 || games<12) {
        return 200000
    }
    else if (score<350000 || games<15) {
        return 350000
    }
    else if (score<500000 || games<20) {
        return 500000
    }
    else if (score<1000000 || games<25) {
        return 1000000
    }
    else {
        return 25000000
    }
}
const getIndex = (score,games) => {
    if (score<12500) {
        return 0
    }
    else if (score<25000 || games<3) {
        return 1
    } else if (score<50000 || games<5) {
        return 2
    }
    else if (score<100000 || games<8) {
        return 3
    }
    else if (score<200000 || games<12) {
        return 4
    }
    else if (score<350000 || games<15) {
        return 5
    }
    else if (score<500000 || games<20) {
        return 6
    }
    else if (score<1000000 || games<25) {
        return 7
    }
    else {
        return 8
    }
}
const getGames = (score,games) => {
    if (score<12500) {
        return 0
    }
    else if (score<25000 || games<3) {
        return 3
    } else if (score<50000 || games<5) {
        return 5
    }
    else if (score<100000 || games<8) {
        return 8
    }
    else if (score<200000 || games<12) {
        return 12
    }
    else if (score<350000 || games<15) {
        return 15
    }
    else if (score<500000 || games<20) {
        return 20
    }
    else if (score<1000000 || games<25) {
        return 25
    }
    else {
        return 500
    }
}



export default {getGoal,getIndex,getGames}
// ScoreTier marks the amount of points that needs to be accumulated for an achievement tier
const scoreTier1 = 12500
const scoreTier2 = 25000
const scoreTier3 = 50000
const scoreTier4 = 100000
const scoreTier5 = 200000
const scoreTier6 = 350000
const scoreTier7 = 500000
const scoreTier8 = 1000000
const scoreTier9 = 25000000

// ScoreTier marks the amount of played games that needs to be accumulated for an achievement tier
const gamesTier1 = 3
const gamesTier2 = 6
const gamesTier3 = 9
const gamesTier4 = 12
const gamesTier5 = 16
const gamesTier6 = 20
const gamesTier7 = 25
const gamesTier8 = 30
const gamesTier9 = 1000

// For the first two tiers it's enough to accumulate either the number of played games OR the amount of required points.
// From tier 3 onward, both the score requirement and the played games requirement needs to be met in order for the tier to get unlocked
// The final tier is intentionally set as semi-unreachable, as there really isn't infinite amount of new content (themes) to unlock.

const getGoal = (score,games) => {   
    if (score<scoreTier1 && games<gamesTier1) {
        return scoreTier1
    }
    else if (score<scoreTier2 && games<gamesTier2) {
        return scoreTier2
    } 
    else if (score<scoreTier3 || games<gamesTier3) {
        return scoreTier3
    }
    else if (score<scoreTier4 || games<gamesTier4) {
        return scoreTier4
    }
    else if (score<scoreTier5 || games<gamesTier5) {
        return scoreTier5
    }
    else if (score<scoreTier6 || games<gamesTier6) {
        return scoreTier6
    }
    else if (score<scoreTier7 || games<gamesTier7) {
        return scoreTier7
    }
    else if (score<scoreTier8 || games<gamesTier8) {
        return scoreTier8
    }
    else {
        return scoreTier9
    }
}
const getIndex = (score,games) => {
    if (score<scoreTier1 && games<gamesTier1) {
        return 0
    }
    else if (score<scoreTier2 && games<gamesTier2) {
        return 1
    } 
    else if (score<scoreTier3 || games<gamesTier3) {
        return 2
    }
    else if (score<scoreTier4 || games<gamesTier4) {
        return 3
    }
    else if (score<scoreTier5 || games<gamesTier5) {
        return 4
    }
    else if (score<scoreTier6 || games<gamesTier6) {
        return 5
    }
    else if (score<scoreTier7 || games<gamesTier7) {
        return 6
    }
    else if (score<scoreTier8 || games<gamesTier8) {
        return 7
    }
    else {
        return 8
    }
}
const getGames = (score,games) => {
    if (score<scoreTier1 && games<gamesTier1) {
        return gamesTier1
    }
    else if (score<scoreTier2 && games<gamesTier2) {
        return gamesTier2
    } 
    else if (score<scoreTier3 || games<gamesTier3) {
        return gamesTier3
    }
    else if (score<scoreTier4 || games<gamesTier4) {
        return gamesTier4
    }
    else if (score<scoreTier5 || games<gamesTier5) {
        return gamesTier5
    }
    else if (score<scoreTier6 || games<gamesTier6) {
        return gamesTier6
    }
    else if (score<scoreTier7 || games<gamesTier7) {
        return gamesTier7
    }
    else if (score<scoreTier8 || games<gamesTier8) {
        return gamesTier8
    }
    else {
        return gamesTier9
    }
}



export default {getGoal,getIndex,getGames}
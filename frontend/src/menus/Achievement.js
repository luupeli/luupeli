// ScoreTier marks the amount of points that needs to be accumulated for an achievement tier
const scoreTier1 = 12500
const scoreTier2 = 25000
const scoreTier3 = 60000
const scoreTier4 = 125000
const scoreTier5 = 250000
const scoreTier6 = 450000
const scoreTier7 = 750000
const scoreTier8 = 1250000
const scoreTier9 = 2500000

// ScoreTier marks the amount of played games that needs to be accumulated for an achievement tier
const gamesTier1 = 2
const gamesTier2 = 4
const gamesTier3 = 6
const gamesTier4 = 8
const gamesTier5 = 10
const gamesTier6 = 12
const gamesTier7 = 15
const gamesTier8 = 18
const gamesTier9 = 22

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
        return scoreTier9 + scoreTier9*(Math.floor(score/scoreTier9))
    }
}

const getRank = (index) => {
    if (index===0) {
        return 'Luuneofyytti'
    }
    if (index===1) {
        return 'Luunoviisi'
    }
    if (index===2) {
        return 'Luuoppilas'
    }
    if (index===3) {
        return 'Luukisälli'
    }
    if (index===4) {
        return 'Luuntuntija'
    }
    if (index===5) {
        return 'Luuammattilainen'
    }
    if (index===6) {
        return 'Luuartisaani'
    }
    if (index===7) {
        return 'Luupätijä'
    }
    if (index===8) {
        return 'Luuekspertti'
    }
    if (index===9) {
        return 'Luumestari'
    }
    if (index>9 && index<20) {
        return 'Luumestari, '+(index-8)+'. Dan'
    }
    if (index>19) {
        return 'Luusensei, '+(index-19)+'. Dan'
    }
    
    return 'Tuntematon'
}

const getIndex = (score,games) => {
    if (score<scoreTier1 && games<gamesTier1) {
        return 1
    }
    else if (score<scoreTier2 && games<gamesTier2) {
        return 2
    } 
    else if (score<scoreTier3 || games<gamesTier3) {
        return 3
    }
    else if (score<scoreTier4 || games<gamesTier4) {
        return 4
    }
    else if (score<scoreTier5 || games<gamesTier5) {
        return 5
    }
    else if (score<scoreTier6 || games<gamesTier6) {
        return 6
    }
    else if (score<scoreTier7 || games<gamesTier7) {
        return 7
    }
    else if (score<scoreTier8 || games<gamesTier8) {
        return 8
    }
    else {
        return 9+ (Math.floor(score/scoreTier9))
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



export default {getGoal,getIndex,getGames, getRank}
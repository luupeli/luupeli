import React from 'react'
import { Redirect } from 'react-router-dom'
import '../styles/App.css'
import '../styles/Crt.css'
// import skelly from '../skelly'
import { injectGlobal } from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import RandomTextGenerator from 'react-scrolling-text';
import { Animated } from 'react-animated-css';
import cherryBlossomizer from './CherryBlossom';
import emoji from 'node-emoji'
import Sound from 'react-sound'
import achievement from './Achievement'
import userStatistics from '../services/userStatistics'


/**
 * This is the index page for the site. You can for example login from here or start creating the game.
 * 
 */

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // These are CSS style settings which are hopefully in a different place in the future
            allStyles: [{
                style: 'normo',
                background: 'background-normo',
                flairLayerD: 'none',
                flairLayerC: 'none',
                flairLayerB: 'none',
                flairLayerA: 'none',
                highlight: '#222211',
                primary: '#555544',
                secondary: '#999988',
                tertiary: '#EEEECC',
                overlay: null,
                music: '435958__greek555__trap-beat.mp3'
            }, {
                style: 'normo',
                background: 'background-normo-fancy',
                flairLayerD: 'normo-flair',
                flairLayerC: 'none',
                flairLayerB: 'none',
                flairLayerA: 'none',
                highlight: '#222211',
                primary: '#555544',
                secondary: '#999988',
                tertiary: '#EEEECC',
                overlay: null,
                music: '435958__greek555__trap-beat.mp3'
            }, {
                style: 'fallout',
                background: 'background-fallout',
                flairLayerD: 'none',
                flairLayerC: 'none',
                flairLayerB: 'none',
                flairLayerA: 'none',
                highlight: '#55DD55',
                primary: '#33BB33',
                secondary: '#229922',
                tertiary: '#115511',
                overlay: 'crt',
                music: '51239__rutgermuller__8-bit-electrohouse.wav'
            }, {
                style: 'fallout88',
                background: 'background-fallout88',
                flairLayerD: 'none',
                flairLayerC: 'none',
                flairLayerB: 'none',
                flairLayerA: 'none',
                highlight: '#ffe34c',
                primary: '#d4b100',
                secondary: '#bb9b00',
                tertiary: '#776100',
                overlay: 'crt88',
                music: '51239__rutgermuller__8-bit-electrohouse.wav'
            }, {
                style: 'deep-blue',
                background: 'background-deep-blue',
                flairLayerD: 'none',
                flairLayerC: 'none',
                flairLayerB: 'none',
                flairLayerA: 'none',
                highlight: '#5599FF',
                primary: '#0033BB',
                secondary: '#002299',
                tertiary: '#000055',
                overlay: null,
                music: '351717__monkeyman535__cool-chill-beat-loop.wav'
            }, {
                style: 'steel',
                background: 'background-steel',
                flairLayerD: 'none',
                flairLayerC: 'none',
                flairLayerB: 'none',
                flairLayerA: 'none',
                highlight: '#DFDFFF',
                primary: '#BBBBFF',
                secondary: '#9999DD',
                tertiary: '#555599',
                overlay: null,
                music: '324920__frankum__cinematic-guitar-loop-and-fx.mp3'
            }, {                                        // KEY
                style: 'blood-dragon',                  // Name of the visual theme
                background: 'background-blood-dragon',  // reference to the css background styling
                flairLayerD: 'none',                    // on top of the background, a visual style can use up to 4 layers ouf 'flair'
                flairLayerC: 'grid',                    // Layer D is the bottom most layer of flair, while layer A is the top most
                flairLayerB: 'none',                    //
                flairLayerA: 'blinder',                 //
                highlight: '#ff9de1',                   // Each theme specficies four color codes. Highlight is mostly for the fonts.
                primary: '#ff5db1',                     // Primary is the second most brightest theme color
                secondary: '#ff2596',                   // Secondary is the middle color of the theme
                tertiary: '#ef007c',                    // Tertiary is the darkest color of the theme
                overlay: null,                          // Overlay can be used to add an extra layer of vfx on top of the viewport. Optional!
                music: '351717__monkeyman535__cool-chill-beat-loop.wav'
            }, {                                        // KEY
                style: 'blood-dragon',                  // Name of the visual theme
                background: 'background-blood-dragon',  // reference to the css background styling
                flairLayerD: 'grid-sub',                // on top of the background, a visual style can use up to 4 layers ouf 'flair'
                flairLayerC: 'grid',                    // Layer D is the bottom most layer of flair, while layer A is the top most
                flairLayerB: 'grid-flair',              //
                flairLayerA: 'blinder',                 //
                highlight: '#ff9de1',                   // Each theme specficies four color codes. Highlight is mostly for the fonts.
                primary: '#ff5db1',                     // Primary is the second most brightest theme color
                secondary: '#ff2596',                   // Secondary is the middle color of the theme
                tertiary: '#ef007c',                    // Tertiary is the darkest color of the theme
                overlay: null,                          // Overlay can be used to add an extra layer of vfx on top of the viewport. Optional!
                music: '346193__frankum__techno-80-base-loop.mp3'
            }, {
                style: 'cherry-blossom',
                background: 'background-cherry',
                flairLayerD: 'none',
                flairLayerC: 'none',
                flairLayerB: 'none',
                flairLayerA: 'none',
                highlight: '#331524',
                primary: '#662a48',
                secondary: '#cc5490',
                tertiary: '#FF69B4',
                overlay: 'cherry-confetti',
                music: '418263__4barrelcarb__eastern-strings.mp3'
            }, {
                style: 'dark-blossom',
                background: 'background-dark-cherry',
                flairLayerD: 'none',
                flairLayerC: 'none',
                flairLayerB: 'none',
                flairLayerA: 'none',
                highlight: '#FF69B4',
                primary: '#cc5490',
                secondary: '#662a48',
                tertiary: '#331524',
                overlay: 'cherry-confetti',
                music: '418263__4barrelcarb__eastern-strings.mp3'
            }
            ],
            styleIndex: 0,
            style: 'normo',
            background: 'background-normo',
            flairLayerD: 'none',
            flairLayerC: 'none',
            flairLayerB: 'none',
            flairLayerA: 'none',
            highlight: '#222211',
            primary: '#555544',
            secondary: '#999988',
            tertiary: '#EEEECC',
            overlay: null,
            music: '435958__greek555__trap-beat.mp3',
            user: null,
            totalScore: -1,
            totalGames: -1,
            maxStyle: -1,
            admin: false,
            attractMode: 0,
            attractAnimation: true,
            loopTheMusic: false,
            bestPlayers: [],
            musicStartTime: ''
        }

        // The method sets the first style as default if none are chosen.
        // This occurs when you open the page for the first time
        if (localStorage.getItem('styleIndex')!==null) {
            this.setState({maxStyle: localStorage.getItem('styleIndex')})
        }
        
        if (localStorage.getItem('styleIndex') === null) {
            localStorage.setItem('styleIndex', 0)
        }

        localStorage.setItem('allStyles', JSON.stringify(this.state.allStyles))   // Array must be converted to JSON before storing it into localStorage!
        this.changeCss = this.changeCss.bind(this)
        this.setThemeColors = this.setThemeColors.bind(this)

    }

    // If someone is logged in he will be set in the state as the user
    componentDidMount() {
        this.setState({
            styleIndex: 0,
            
        })
        const loggedUserJSON = sessionStorage.getItem('loggedLohjanLuunkeraajaUser')
    
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)

            this.setState({ user })
            if (user.role === "ADMIN") {
                this.setState({ admin: true })
            }
        }
        this.getBestPlayers()
    }
    /**
   * With the component mounting, the game time measuring tick() is set at 1000 milliseconds.
   */
    componentWillMount() {

        this.interval = setInterval(() => this.tick(), 1000);
    }
    /**
     * At component unmount the interval needs to be cleared.
     */
    componentWillUnmount() {
        clearInterval(this.interval);
    }


    tick() {
        if (this.state.attractMode % 20 > 16 || (this.state.attractMode % 80 > 7 && this.state.attractMode % 80 < 10) || (this.state.attractMode % 80 > 47 && this.state.attractMode % 80 < 50)) {
            this.setState({ attractMode: this.state.attractMode + 1, attractAnimation: false })
        } else {
            this.setState({ attractMode: this.state.attractMode + 1, attractAnimation: true })
        }

        if (this.state.user!==null) {
            if (this.state.totalGames===-1 && this.state.totalScore===-1) {
        
        
        

        userStatistics.getTotalGamesForIndividual(this.state.user.id)
            .then((response) => {
                this.setState({
                    totalGames: response.data.length
                })
            })
        userStatistics.getTotalScore(this.state.user.id)
            .then((response) => {
                if (response.data.length !== 0) {
                    this.setState({
						totalScore: response.data
					})
                }
            })
         
         } else if (this.state.maxStyle===-1) {
            this.setState({maxStyle: achievement.getIndex(this.state.totalScore,this.state.totalGames)})   
            localStorage.setItem('maxStyle', achievement.getIndex(this.state.totalScore,this.state.totalGames))
         }
        }
    }

    // This event chooses the next css style settings from the list
    changeCss(event) {
        var next = parseInt(localStorage.getItem('styleIndex'), 10) + 1
        var localMaxStyle = localStorage.getItem('maxStyle')
        var maxStyleNow=this.state.maxStyle
        if (localMaxStyle!==null) {
            maxStyleNow=Math.max(maxStyleNow,localMaxStyle)
        }
        if (maxStyleNow===-1) {
            maxStyleNow=1  // The first two themes are free, no matter what!
        }

        var override=false
	
        if (this.state.allStyles[next] != null && (maxStyleNow>=next || this.state.admin || override)) {
            localStorage.setItem('styleIndex', next)
            this.setState({
                styleIndex: next,
                style: 'placeholder-next-theme-name'
            })
        } else  {
            localStorage.setItem('styleIndex', 0)
            this.setState({
                styleIndex: 0,
                style: 'placeholder-last-theme-name'
            })
            next = 0
        }
        console.log('new style index is now: ' + next)
    }

    setThemeColors(i) {
        injectGlobal`
    :root {   
      --highlight: ${this.state.highlight}   
      --primary: ${this.state.primary}
      --secondary: ${this.state.secondary}
      --tertiary: ${this.state.tertiary}
      }
    }`

        if (this.state.styleIndex !== localStorage.styleIndex && this.state.allStyles[localStorage.styleIndex] !== undefined) {
            this.setState({
                styleIndex: localStorage.styleIndex,
                style: this.state.allStyles[localStorage.styleIndex].style,
                background: this.state.allStyles[localStorage.styleIndex].background,
                flairLayerD: this.state.allStyles[localStorage.styleIndex].flairLayerD,
                flairLayerC: this.state.allStyles[localStorage.styleIndex].flairLayerC,
                flairLayerB: this.state.allStyles[localStorage.styleIndex].flairLayerB,
                flairLayerA: this.state.allStyles[localStorage.styleIndex].flairLayerA,
                highlight: this.state.allStyles[localStorage.styleIndex].highlight,
                primary: this.state.allStyles[localStorage.styleIndex].primary,
                secondary: this.state.allStyles[localStorage.styleIndex].secondary,
                tertiary: this.state.allStyles[localStorage.styleIndex].tertiary,
                overlay: this.state.allStyles[localStorage.styleIndex].overlay,
                music: this.state.allStyles[localStorage.styleIndex].music
            })
        }
    }

    adminButtons() {
        if (this.state.admin) {
            return (
                <Row className="show-grid">
                    <Col>
                        <Animated animationIn="bounceInRight" animationInDelay={50} isVisible={true}>
                            <button
                                id="adminPageButton"
                                className="menu-button"
                                onClick={() => this.props.history.push('/admin')}>
                                Ylläpitäjälle
                            </button>
                        </Animated>
                    </Col>
                </Row>
            )
        } else if (this.state.user !== null) {
            return (
                <Row className="show-grid">
                    <Col>
                        <Animated animationIn="bounceInRight" animationInDelay={50} isVisible={true}>
                            <button
                                id="profilePageButton"
                                className="menu-button"
                                onClick={() => this.props.history.push('/users/' + this.state.user.id)}>
                                Profiili
                            </button>
                        </Animated>
                    </Col>
                </Row>
            )
        } else {
            return (
                <div>
                </div>
            )
        }
    }

    gameTitle() {

        if (this.state.style === 'fallout') {
            return (
                <h1 className="game-title">
                    <RandomTextGenerator
                        charList={['é', 'ä', 'í', 'ƒ', 'ñ', '*', 'π', '[', ']', 'k', '¥', 'å']}
                        text={'Luupeli'}
                        interval={24}
                        timePerChar={240}
                    />
                </h1>

            )
        }
        else {
            let inEffect = 'zoomInDown slower'
            let outEffect = 'zoomOutUp slower'
            let titleVisibility = this.state.attractAnimation
            if (!this.state.attractAnimation && this.state.attractMode % 40 > 35) {
                titleVisibility = false
            } else {
                titleVisibility = true
            }
            if (this.state.attractMode % 160 >= 120) {
                inEffect = 'rotateIn faster'
                outEffect = 'rotateOut faster'
            }
            else if (this.state.attractMode % 160 >= 80) {
                inEffect = 'bounceInLeft slower'
                outEffect = 'bounceOutRight slower'
            }
            else if (this.state.attractMode % 160 >= 40) {
                inEffect = 'flipInX slower'
                outEffect = 'flipOutY slower'
            }
            return (
                <div id="styleNames" className={this.state.style}>
                    <div className="home-flex-title">
                        <div className="score">

                            <Animated animationIn={inEffect} animationOut={outEffect} animationInDelay="100" animationOutDelay="100" isVisible={titleVisibility}><h1 className="game-title">L</h1></Animated>
                        </div>
                        <div className="score">
                            <Animated animationIn={inEffect} animationOut={outEffect} animationInDelay="150" animationOutDelay="150" isVisible={titleVisibility}><h1 className="game-title">u</h1></Animated>
                        </div>
                        <div className="score">
                            <Animated animationIn={inEffect} animationOut={outEffect} animationInDelay="200" animationOutDelay="200" isVisible={titleVisibility}><h1 className="game-title">u</h1></Animated>
                        </div>
                        <div className="score">
                            <Animated animationIn={inEffect} animationOut={outEffect} animationInDelay="250" animationOutDelay="250" isVisible={titleVisibility}><h1 className="game-title">p</h1></Animated>
                        </div>
                        <div className="score">
                            <Animated animationIn={inEffect} animationOut={outEffect} animationInDelay="300" animationOutDelay="300" isVisible={titleVisibility}><h1 className="game-title">e</h1></Animated>
                        </div>
                        <div className="score">
                            <Animated animationIn={inEffect} animationOut={outEffect} animationInDelay="350" animationOutDelay="350" isVisible={titleVisibility}><h1 className="game-title">l</h1></Animated>
                        </div>
                        <div className="score">
                            <Animated animationIn={inEffect} animationOut={outEffect} animationInDelay="400" animationOutDelay="400" isVisible={titleVisibility}><h1 className="game-title">i</h1></Animated>
                        </div>
                    </div>
                </div>
            )
        }
    }

    loggedInButtons() {
        if (this.state.user === null) {
            return (
                <div>
                    <Row className="show-grid">
                        <Col>
                            <Animated animationIn="bounceInLeft" animationInDelay={100} isVisible={true}>
                                <button
                                    id="homeMenuLoginButton"
                                    className="menu-button"
                                    onClick={() => this.props.history.push('/login')}>
                                    Kirjaudu sisään
                                </button>
                            </Animated>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col>
                            <Animated animationIn="bounceInRight" animationInDelay={200} isVisible={true}>
                                <button
                                    id="homeMenuSignUpButton"
                                    className="menu-button"
                                    onClick={() => this.props.history.push('/register')}>
                                    Luo käyttäjätili
                                </button>
                            </Animated>
                        </Col>
                    </Row>
                </div>
            )
        } else {
            return (
                <div>
                    <Row className="show-grid">
                        <Col>
                            <Animated animationIn="bounceInLeft" animationInDelay={150} isVisible={true}>
                                <button
                                    id='logout-button'
                                    className='menu-button'
                                    onClick={() => this.props.history.push('/login')}>
                                    Kirjaudu ulos
                                </button>
                            </Animated>
                        </Col>
                    </Row>
                </div>
            )
        }
    }

    // When logging out you will be removed from the sessionstorage
    logOut = async (event) => {
        event.preventDefault()
        try {
            window.sessionStorage.removeItem('loggedLohjanLuunkeraajaUser')
            this.setState({
                user: null,
                admin: false
            })
            localStorage.setItem('maxStyle', 0)
        } catch (error) {
            console.log(error)
        }
    }

    getBestPlayers() {
        userStatistics.getTop50()
            .then((response) => {
                this.setState({ bestPlayers: response.data })
                console.log(this.state.bestPlayers)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    attractMode() {
        var effects = [];
        effects.push('bounceOutLeft slower')
        effects.push('bounceOutRight slower')
        let heartEmoji = emoji.get('yellow_heart')
        if (this.state.attractMode % 80 <= 20 && this.state.bestPlayers.length>0) {   // Only show highscores if the database has actually output some names!
            // var scores = []
            var scorers = []
            var trueScorers = []
            if (this.state.bestPlayers.length > 10) {
                trueScorers = this.state.bestPlayers.slice(0, 10)
            } else {
                trueScorers = this.state.bestPlayers
            }
            scorers.push('Luu Skywalker'); scorers.push('Luuno Turhapuro'); scorers.push('Princess Luua'); scorers.push('Sorbusten Ritari'); scorers.push('Keisari Luupatine'); scorers.push('Mr. Kitiini'); scorers.push('Bonefish!'); scorers.push('Luufemma'); scorers.push('Luubi-Wan Luunobi'); scorers.push('Luunkerääjä')
            var firstHalf = trueScorers.slice(0, 5)
            var secondHalf = trueScorers.slice(5, 10 + 1)
            // const placeholderScores = scorers.map((scoree,i) =>
            const placeholderScoresFirst = firstHalf.map((scoree, i) =>
                <Animated animationIn="bounceInUp slower" animationOut={effects[i % 2]} animationInDelay={1500 + (i * 500)} animationOutDelay={i * 50} isVisible={this.state.attractAnimation}>
                    <div className="home-highscore">
                        <div className="score">
                            <h5>
                                {i + 1}. {scoree.user.username.toUpperCase()}
                            </h5>
                        </div>
                        <div className="score">
                            <h5>
                                {/* {10000-(i*740)+(Math.round(this.state.attractMode/80)*(2000-(i*40)))} */}
                                {scoree.total}
                            </h5>
                        </div>
                    </div>
                </Animated>
            )
            const placeholderScoresLast = secondHalf.map((scoree, i) =>
                <Animated animationIn="bounceInUp slower" animationOut={effects[i % 2]} animationInDelay={50 + (i * 500)} animationOutDelay={(i * 50)} isVisible={this.state.attractAnimation}>
                    <div className="home-highscore">
                        <div className="score">
                            <h5>
                                {i + 6}. {scoree.user.username.toUpperCase()}
                            </h5>
                        </div>
                        <div className="score">
                            <h5>
                                {/* {10000-(i*740)+(Math.round(this.state.attractMode/80)*(2000-(i*40)))} */}
                                {scoree.total}
                            </h5>
                        </div>
                    </div>

                </Animated>
            )
            var titleVisible = true
            if (this.state.attractMode % 80 >= 15) { titleVisible = this.state.attractAnimation }
            var showScores = placeholderScoresFirst
            if (this.state.attractMode % 80 >= 10) {
                showScores = placeholderScoresLast
            }
            return (
                <div>
                    <div className="home-highscore-top">
                        <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight slower" animationInDelay={1000} animationOutDelay={0} isVisible={titleVisible}>
                            <h3>
                                TOP {trueScorers.length} LUUPÄÄT
		                    </h3>
                        </Animated>
                    </div>
                    {showScores}
                </div>
            )
        } else {
            var lines = [];
            var heading = ''
            if (this.state.attractMode % 80 <= 40) {
                heading = 'CREDITS'
                lines.push('Helena Parviainen')
                lines.push('Kerem Atak')
                lines.push('Peppi Mattsson')
                lines.push('Timo Leskinen')
                lines.push('Tuomas Honkala')
                lines.push('Ville Hänninen')
                lines.push('Toteutettu ohjelmistotuotantoprojektina Helsingin Yliopiston Tietojenkäsittelytieteen laitokselle ' + heartEmoji)
            }
            else if (this.state.attractMode % 80 <= 50) {
                heading = 'Luupeli features audio from Freesound.org'
                lines.push('Chiptune Intro #1 by Fred1712')
                lines.push('Electro success sound by Mativve')
                lines.push('Error.wav by Autistic Lucario')
                lines.push('Retro Bonus Pickup SFX by suntemple')
                lines.push('Trap-Beat by greek555')
                lines.push('Cinematic Guitar Loop by frankum')
            }
            else if (this.state.attractMode % 80 <= 60) {
                heading = 'Freesound.org continued...'
                lines.push('Cool Chill Beat Loop by monkeyman535')
                lines.push('Techno 80 - base loop by frankum')
                lines.push('8-bit ElectroHouse by RutgerMuller')
                lines.push('Eastern Strings by 4barrelcarb')
                lines.push('Used under Creative Commons (CC) license. The Luupeli devs kindly thank these content creators! ' + heartEmoji)
            } else if (this.state.attractMode % 320 <= 80) {
                heading = 'LUUPELI TIEDOTTAA'
                lines.push('Miksi sinä vielä luet tätä?')
                lines.push('Mene pelaamaan siitä!')
                lines.push('Opettele uusi luu!')
                lines.push('Tai kaksi!')
                lines.push('Jaa minäkö?')
                lines.push('Olisin mieluummin purjehtimassa!')
            } else if (this.state.attractMode % 320 <= 160) {
                heading = 'LUUPELI MUISTUTTAA'
                lines.push('Laiska tyäs huomiseen lykkää.')
                lines.push('Laiskalla hiki syödessä, vilu työtä tehdessä.')
                lines.push('Laiska ei sua, ahkera sua yltäkyllin.')
                lines.push('Tekee vanhakin, jos ei muuta niin hiljaa kävelee.')
                lines.push('Se ei pelaa, joka pelkää!!')
            } else if (this.state.attractMode % 320 <= 240) {
                heading = 'LUUPELI ANELEE'
                lines.push('Haluan, että lopetat näiden lukemisen.')
                lines.push('Kierros alkaa näiden tekstien jälkeen alusta.')
                lines.push('Tuhlaat aikaasi jos jäät katsomaan tuleeko näitä lisää.')
                lines.push('Ei tule.')
                lines.push('Pelaa Luupeliä! ' + heartEmoji)
            } else if (this.state.attractMode % 320 <= 320) {
                let watermelon = emoji.get('watermelon')
                let cherries = emoji.get('cherries')
                let grapes = emoji.get('grapes')
                let banana = emoji.get('banana')
                let strawberry = emoji.get('strawberry')
                let mushroom = emoji.get('mushroom')
                heading = 'HEDELMÄBONUKSET'
                lines.push(watermelon + ' ...... 5 000 pts')
                lines.push(cherries + ' ..... 10 000 pts')
                lines.push(grapes + ' ..... 25 000 pts')
                lines.push(banana + ' ..... 50 000 pts')
                lines.push(strawberry + ' .... 250 000 pts')
                lines.push(mushroom + ' ....... SECRET!!')
            }

            const rollingMessage = lines.map((line, i) =>
                <Animated animationIn="bounceInUp slower" animationOut={effects[i % 2]} animationInDelay={1500 + (i * 500)} animationOutDelay={i * 50} isVisible={this.state.attractAnimation}>
                    <div className="home-highscore">
                        <div className="score">
                            <h5>
                                {line.toUpperCase()}
                            </h5>
                        </div>
                    </div>
                </Animated>
            )

            return (
                <div>
                    <div className="home-highscore-top">
                        <Animated animationIn="bounceInUp slower" animationOut="bounceOutRight slower" animationInDelay={1000} animationOutDelay={0} isVisible={this.state.attractAnimation}>
                            <h3>
                                {heading}
                            </h3>
                        </Animated>
                    </div>
                    {rollingMessage}
                </div>
            )
        }
    }
    startTheMusic() {
        this.setState({ loopTheMusic: true, musicStartTime: new Date().getTime() })
    }

    musicPlayer() {
        if (this.state.loopTheMusic) {
            return (
                <Sound
                    url={"/sounds/" + this.state.music}
                    playStatus={Sound.status.PLAYING}
                    // playFromPosition={0 /* in milliseconds */}
                    onLoading={this.handleSongLoading}
                    onPlaying={this.handleSongPlaying}
                    onFinishedPlaying={this.handleSongFinishedPlaying}
                    loop={this.state.loopTheMusic}
                />

            )
        }
        else if (!this.state.loopTheMusic) {
            return (
                <Sound
                    url={"/sounds/" + this.state.music}
                    playStatus={Sound.status.STOPPED}
                    // playFromPosition={0 /* in milliseconds */}
                    onLoading={this.handleSongLoading}
                    onLoad={this.startTheMusic()}
                    onPlaying={this.handleSongPlaying}
                    onFinishedPlaying={this.handleSongFinishedPlaying}
                    loop={this.state.loopTheMusic}
                />

            )
        } else { return null }
    }


    render() {
        if (process.env.NODE_ENV !== 'test') {
            // skelly()
        }
        if (this.state.redirect) {
            this.setState({ redirect: false })
            return (
                <Redirect to=
                    {
                        {
                            pathname: this.state.redirectTo,
                            state: {
                                allStyles: this.state.allStyles,
                                styleIndex: this.state.styleIndex
                            }
                        }
                    }
                />
            )
        }

        // This index will pick the proper style from style list
        let i = parseInt(localStorage.getItem('styleIndex'), 10)
        this.setThemeColors(i)

        var loggedText = 'Anonyymi Pelaaja'

        if (this.state.user !== null) {

            loggedText = this.state.user.username //|'+this.state.user.id+ ' (' + this.state.totalScore + '|' + this.state.totalGames + ')!'
            
            if (loggedText.length>18) {
                loggedText = this.state.user.username
            }
            else if (loggedText.length>10) {
                loggedText = 'Hei, ' + this.state.user.username + '!'
            }
            else {
                loggedText = 'Tervetuloa, '+loggedText+'!'
            }
            
            if (this.state.cheatsActivated) {
                loggedText=loggedText+ '= CHEATER!'
            }
        }

        var themeButtonText = 'Teema '+i+': '+this.state.style
        if (this.state.attractMode % 15>8) {
         themeButtonText = 'Teemoja avattu: '+Math.max(2,this.state.maxStyle)+'/'+this.state.allStyles.length
        }

        return (
            <div id="homeMenu" className="App">
                {this.musicPlayer()}
                <div className="menu">
                    <div className={this.state.overlay}>
                        {cherryBlossomizer(this.state.style)}
                        <div className={this.state.background}>
                            <div id="styleName" className={this.state.style}>
                                <div
                                    className={this.state.flairLayerA}>
                                </div>
                                <div
                                    className={this.state.flairLayerB}>
                                </div>
                                <div
                                    className={this.state.flairLayerC}>
                                </div>
                                <div
                                    className={this.state.flairLayerD}>
                                </div>

                                {this.gameTitle()}
                                <Row className="show-grid">
                                    <Col xs={10} xsOffset={1} md={4} sm={4} mdOffset={4} smOffset={4}>
                                        <Row className="show-grid">
                                            <Col>
                                                <Animated animationIn="bounceInLeft" animationInDelay={0} isVisible={true}>
                                                    <button
                                                        className="menu-button gamelink"
                                                        id="proceedToSelectGameMode"
                                                        onClick={() => this.props.history.push('/play', {mode: 'gamemode'})}>
                                                        Pelaa
                                                    </button>
                                                </Animated>
                                            </Col>
                                        </Row>
                                        {this.adminButtons()}
                                        {this.loggedInButtons()}
                                        <Row className="show-grid">
                                            <Col>
                                                <Animated animationIn="bounceInLeft" animationInDelay={300} isVisible={true}>
                                                    <button
                                                        className="menu-button"
                                                        id="bestPlayers"
                                                        onClick={() => this.props.history.push('/leaderboard')}>
                                                        &#9733; Pistetaulukko &#9733;
                                                    </button>
                                                </Animated>
                                            </Col>
                                        </Row>
                                        <Row className="show-grid">
                                            <Animated animationIn="bounceInRight" animationInDelay={500} isVisible={true}>
                                                <button
                                                    id="themeChangeButton"
                                                    className="menu-button"
                                                    onClick={this.changeCss}>
                                                    {themeButtonText}
                                                </button>
                                            </Animated>
                                        </Row>
                                        <h5><div className="username">
                                            {loggedText}
                                        </div>
                                        </h5>
                                        <div className={this.state.style} />
                                    </Col>
                                </Row>
                                {this.attractMode()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Home

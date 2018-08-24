import React from 'react'

class NavBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand navbar-link" href="/">
                            Luupeli
                        </a>
                        <button
                            className="navbar-toggle collapsed"
                            data-toggle="collapse"
                            data-target="#navcol-1"
                        >
                            <span className="sr-only">
                                Toggle navigation
                            </span>
                            <span className="icon-bar" />
                            <span className="icon-bar" /><span className="icon-bar" />
                        </button>
                    </div>
                    <div className="collapse navbar-collapse" id="navcol-1">
                        <ul className="nav navbar-nav" />
                    </div>
                </div>
            </nav>
        )
    }
}
export default NavBar
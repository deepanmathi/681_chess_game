import React from 'react';
import { Link } from 'react-router-dom';
import app from './base';
const { firebase } = window;
const NavItem = props => {
    const pageURI = window.location.pathname+window.location.search;
    const liClassName = (props.path === pageURI) ? "nav-item active" : "nav-item";
    const aClassName = props.disabled ? "nav-link disabled" : "nav-link"
    return (
        <li className={liClassName}>
            <a href={props.path} className={aClassName}>
                {props.name}
                {(props.path === pageURI) ? (<span className="sr-only">(current)</span>) : ''}
            </a>
        </li>
    );
};


class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
    }

    logOut() {
        localStorage.clear();
        firebase.auth().signOut().then(function() {
            console.log('User signed out');
        }).catch(function(error) {
            console.log(error);
        });
        window.location.hash = "/";
        location.reload();
    }

    render() {
        let button;
        let windowLoc = window.location.hash;
        if (windowLoc === '#/home' || windowLoc.indexOf('#/room/') !== -1) {

                button = <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={this.logOut}>Log Out</button>
        }
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-dark">
                <a className="navbar-brand" href="/"><p style={{color: 'white'}}>ChessBoard</p></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">

                    </ul>
                    {
                        button
                    }
                </div>
            </nav>
        )
    }
}

export default Navigation;

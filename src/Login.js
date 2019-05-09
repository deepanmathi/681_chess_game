import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import app from './base';
import chessLogo from './chess_logo.png';
import Card from "react-bootstrap/Card";
import './Register.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            successMessage: '',
            firstName: '',
            lastName: '',
            dateOfBirth: ''
        };
        this.loginErrorMessage = '';
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        this.setState({'errorMessage': ''});
        this.setState({'successMessage': ''});
    }

    login(e) {
        e.preventDefault();
        app.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
            sessionStorage.setItem('userID', u.user.email);
            sessionStorage.setItem('user',JSON.stringify(u));
            window.location.hash = `#/home`;
            location.reload();
        }).catch((error) => {
            this.loginErrorMessage = 'Invalid username or password';
            this.setState(
                {'errorMessage': 'Invalid username or password'});
        });
    }

    signup(e){
        e.preventDefault();
        app.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
            this.setState({successMessage: 'User successfully registered, please Login now'});
        }).catch((error) => {
                this.setState(
                    {'errorMessage': 'Unable to register user. '+error.message});
            })
    }
    render() {
        return (
<div className="container">
<div className="row">
    <div className="col-lg-6">
        <img src={chessLogo} style={{width: 420, height: 320}} alt="Chess-Logo" />
    </div>
    <div className="col-lg-6">
        <Card>
            <Card.Body>
                <div className="col-md-4">
                    <span>{this.state.errorMessage}</span>
                    <span>{this.state.successMessage}</span>
                </div>
                <div className="col-md-8">
                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input value={this.state.email} onChange={this.handleChange} type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input value={this.state.password} onChange={this.handleChange} type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                        </div>
                        <button type="submit" onClick={this.login} className="btn btn-primary">Login</button>
                        {/*<button onClick={this.signup} style={{marginLeft: '25px'}} className="btn btn-success">Signup</button>*/}
                        <p>
                            Don't have an account? <Link to={`/signUp`}>Sign Up</Link>
                        </p>
                    </form>
                </div>
            </Card.Body>
        </Card>
            </div>
</div>
</div>
        );
    }
}
export default Login;

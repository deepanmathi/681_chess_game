import React, { Component } from 'react';
import chessLogo from "./chess_logo.png";
import app from "./base";
import * as firebase from "firebase";
import Card from "react-bootstrap/Card";
import './Register.css';
import isEmail from 'validator/lib/isEmail';
import PasswordValidator from 'password-validator';
import { Link } from "react-router-dom";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            errorMessage: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            startDate: '',
            formErrors: [],
            confirmPassword: '',
            successMessage: ''
        };
        this.signup = this.signup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.password_validate = this.password_validate.bind(this);
        this.login = this.login.bind(this);
    }

    signup(e){
        e.preventDefault();
        if (this.validateForm()) {
            app.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
                console.log(u);
                console.log('Test Inside '+JSON.stringify(u));
                console.log(u.user.uid);
                const game = firebase.database().ref("users").child(u.user.uid).push();
                const user = {
                    email: this.state.email,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName
                };
                    game
                        .set(user)
                        .then(() => {}, (err) => {
                            throw err;
                        });
                    this.setState({successMessage: 'User successfully registered. Please login to the app from the Login screen now'})
                }).then((u)=>{})
                    .catch((error) => {
                        console.log(error);
                        this.setState({errorMessage: error.message})

                    })
        }
        console.log(this.state.formErrors);
    }

    validateForm () {
        const error = [];
        if (this.state.firstName.length === 0) {
            error.push('First Name is required');
        }
        if (this.state.lastName.length === 0) {
            error.push('Last Name is required');
        }
        if (this.state.email.length === 0) {
            error.push('Email Address is required');
        } else {
            if (!isEmail(this.state.email)){
                error.push('Please enter a valid email address');
            }
        }
        if (this.state.password.length > 0) {
            /*PasswordValidator.is().min(8);
            PasswordValidator.is().max(16);
            PasswordValidator.has().uppercase();
            PasswordValidator.has().lowercase();
            PasswordValidator.has().digits();*/
            if (!this.password_validate(this.state.password)) {
                error.push('Password must contain one uppercase, lowercase, digit, special character and minimum 8 chars');
            }
        } else {
            error.push('Password is required');
        }

        if (this.state.confirmPassword.length > 0) {
            if (!this.state.confirmPassword === this.state.password) {
                error.push('Password and Confirm password do not match');
            }
        } else {
            error.push('Confirm Password is needed');
        }

        this.setState({formErrors: error});
        return error.length === 0;
    };

     password_validate(p) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(p);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        this.setState({'errorMessage': ''});
        this.setState({'successMessage': ''});
    }

    login() {
         window.location.hash = "/";
         location.reload();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <img src={chessLogo} style={{width: 400, height: 320}} alt="Chess-Logo" />
                        <br />
                        <ul>
                            {this.state.formErrors.map(function (value, index) {
                                return <li key={index} style={{color: 'red'}}>{value}</li>;
                            })}
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <Card>
                            <Card.Body>
                                <div className="col-md-12">
                                    <span style={{color:'red'}}>{this.state.errorMessage}</span>
                                    <span style={{color:'green'}}>{this.state.successMessage}</span>
                                </div>
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">First Name</label>
                                        <input value={this.state.firstName} onChange={this.handleChange} type="text" name="firstName" className="form-control" id="fName" aria-describedby="emailHelp" placeholder="First Name" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Last Name</label>
                                        <input value={this.state.lastName} onChange={this.handleChange} type="text" name="lastName" className="form-control" id="lName" aria-describedby="emailHelp" placeholder="Last Name" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Email address</label>
                                        <input value={this.state.email} onChange={this.handleChange} type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">Password</label>
                                        <input value={this.state.password} onChange={this.handleChange} type="password" name="password" className="form-control" id="password" placeholder="Password" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">Confirm Password</label>
                                        <input value={this.state.confirmPassword} onChange={this.handleChange} type="password" name="confirmPassword" className="form-control" id="confirmPassword" placeholder="Confirm Password" />
                                    </div>
                                    <button onClick={this.signup} style={{marginLeft: '25px'}} className="btn btn-success">Signup</button>
                                    &nbsp;&nbsp;<Link to={`/`}>Back to Login</Link>
                                </form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>

        )
    }
}
export default Register;

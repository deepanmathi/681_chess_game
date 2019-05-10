import React, { Component } from 'react';
import Table from "react-bootstrap/Table";
const { firebase } = window;
class GameRoom extends Component {

    constructor(props) {
        super(props);
        this.fetchGames = this.fetchGames.bind(this);
        this.play = this.play.bind(this);
        this.state = {
            userName: this.props.email,
            stateExistingGame: []
        };
        this.existingGames = [];
    }

    componentDidMount() {
        let windowLoc = window.location.hash;
        this.fetchGames();
        this.setState({
            stateExistingGame: this.existingGames
        });
    }

    fetchGames() {
        const db = firebase.database().ref("/games");
        ["p1_email","p2_email"].forEach((name) => {
            const ref = db.orderByChild(name).equalTo(this.state.userName);
            ref.on('value', (ref) => {
                if (ref.val()){
                    const key = Object.keys(ref.val());
                    const value = Object.values(ref.val());
                    value.map((val) => {
                        this.existingGames.push(val);
                        this.setState({
                            stateExistingGame: [...this.state.stateExistingGame, val]
                        })
                    });
                }
                
            });
        });
    }

  play(e) {
  // console.log(e.target.name);
  }

    renderTableData() {
        if (this.existingGames.length > 0) {
            return this.existingGames.map((player, index) => {
                const { p1_email, p2_email, p1_token, p2_token, status } = player;
                let link = '';
                 if (p1_email === this.state.userName) {
                    if (status === 'In Progress') {
                        link = domain() + "/#/home/" + p1_token;
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{p2_email}</td>
                                
                                <td><a href={domain() + "/#/home/" + p1_token+"/In-Progress"}>Click to Play</a></td>
                                <td>{status}</td>
                            </tr>
                        )
                    }else if (status === 'Complete') {
                        link = domain() + "/#/home/" + p1_token;
                        console.log(link);
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{p2_email}</td>
                                <td><a href={domain() + "/#/home/" + p1_token+"/Complete"}>View Results</a></td>
                                <td>{status}</td>
                            </tr>
                        )
                    }
                    
                } else if (p2_email === this.state.userName) {
                    if (status === 'In Progress') {
                        link = domain() + "/#/home/" + p2_token;
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{p1_email}</td>
                                <td><a href={domain() + "/#/home/" + p2_token+"/In-Progress"}>Click to Play</a></td>
                                <td>{status}</td>
                            </tr>
                        )
                    } else if(status === 'Complete') {
                        link = domain() + "/#/home/" + p2_token;
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{p1_email}</td>
                                <td><a href={domain() + "/#/home/" + p2_token+"/Complete"}>View Results</a></td>
                                <td>{status}</td>
                            </tr>
                        )
                    }
                    
                }
                
            })
        }
        
    }

    render() {

        return (
            <div>
                <b>My Ongoing games:</b>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Opponent Player</th>
                        <th>Game Link</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.renderTableData()
                    }
                    </tbody>
                </Table>
            </div>

        )
    }

}
function play (token)  {
    console.log(token);
}
function parse(tree) {
    if (!tree) return [];
    const keys = Object.keys(tree);
    const id = keys[0];
    const game = tree[id];
    return [id, game];
}
function domain() {
    const { hostname, port } = window.location;
    if (port) {
        return `http://${hostname}:${port}`;
    } else {
        return `http://${hostname}`;
    }
}
export default GameRoom;


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
        console.log(windowLoc);
        this.fetchGames();
        this.setState({
            stateExistingGame: this.existingGames
        });
    }

    fetchGames() {
        const db = firebase.database().ref("/player");
        ["p1_email"].forEach((name) => {
            const ref = db.orderByChild(name).equalTo(this.state.userName);
            ref.on('value', (ref) => {
                const key = Object.keys(ref.val());
                    const value = Object.values(ref.val());
                    value.map((val) => {
                        this.existingGames.push(val);
                        this.setState({
                            stateExistingGame: [...this.state.stateExistingGame, val]
                        })
                    });
                    /*const [id, game] = parse(ref.val());
                if (!id) return;*/
            });
        });
    }

  play(e) {
  // console.log(e.target.name);
  }

    renderTableData() {
        return this.existingGames.map((player, index) => {
            const { p1_email, p2_email, token } = player;
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{p2_email}</td>
                    <td><a target="_blank" href={domain() + "/#/home/" + token}>Click to Play</a></td>
                </tr>
            )
        })
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


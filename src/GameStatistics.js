import React, { Component } from 'react';
import Table from 'react-bootstrap/Table'
import { any } from "prop-types";
const { firebase } = window;
class GameStatistics extends Component {

    constructor(props) {
        super(props);
        this.fetchPlayerRecords = this.fetchPlayerRecords.bind(this);
        this.renderTableData = this.renderTableData.bind(this);
        this.state = {
            playerStats: []
        }
    }

    componentDidMount() {
        this.fetchPlayerRecords();
    }

    fetchPlayerRecords() {
        let userArray = [];
        let playerMap = new Map();

        firebase.database().ref('/games').on('value', function(snapshot) {
            console.log('Snapshot '+JSON.stringify(snapshot.val()));
            snapshot.forEach(function(childSnapshot) {
                let obj = {
                    totalMatchesPlayed: 0,
                    won: 0,
                    lost: 0,
                    noResult: 0,
                    inProgress: 0
                };
                let obj2 = {
                    totalMatchesPlayed: 0,
                    won: 0,
                    lost: 0,
                    noResult: 0,
                    inProgress: 0
                };
                let item = childSnapshot.val();
                item.key = childSnapshot.key;
                let user1Stat = playerMap.get(item.p1_email);
                let user2Stat = playerMap.get(item.p2_email);
                if (!user1Stat) {
                    user1Stat = obj;
                }
                if (!user2Stat) {
                    user2Stat = obj2;
                }
                user1Stat.totalMatchesPlayed ++;
                user2Stat.totalMatchesPlayed ++;
                if (item.status === 'In Progress') {
                    user1Stat.inProgress++;
                    user2Stat.inProgress++;
                } else if (item.status === 'Complete') {
                    if (item.p1_email === item.winner) {
                        user1Stat.won++;
                        user2Stat.lost++;
                    } else if (item.p2_email === item.winner) {
                        user1Stat.lost++;
                        user2Stat.won++;
                    }
                }
                playerMap.set(item.p1_email, user1Stat);
                playerMap.set(item.p2_email, user2Stat);
                console.log(item);
            });
            for (let [k, v] of playerMap) {
                v.email = k;
                userArray.push(v);
            }
        });
        this.setState({playerStats: userArray});
    };

    renderTableData() {
        console.log('Method called');
        console.log('kjahSJKAHD'+JSON.stringify(this.state.playerStats));
        return this.state.playerStats.map((player, index) => {
            console.log('kjashdkjas'+JSON.stringify(player));
            const { totalMatchesPlayed, won,lost,noResult,inProgress,email } = player;
            return (
                <tr key={email}>
                    <td>{index}</td>
                    <td>{email}</td>
                    <td>{totalMatchesPlayed}</td>
                    <td>{won}</td>
                    <td>{lost}</td>
                    <td>{noResult}</td>
                    <td>{inProgress}</td>
                </tr>
            )
        })
    }

    render() {
        return(
            <div>
                <hr />
                This is a test of Leaderboard
                <Table responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Games Played</th>
                        <th>Won</th>
                        <th>Lost</th>
                        <th>No Result</th>
                        <th>In Progress</th>
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
export default GameStatistics;

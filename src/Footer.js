import React from 'react';

const divStyle = {
};

class Footer extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-light bg-dark">
<div className="col-md-6">
                            <ul >
                                <li style={{color: 'white'}}>FAQ</li>
                                <li style={{color: 'white'}}>About Us</li>
                                <li style={{color: 'white'}}>Contribute</li>
                            </ul>
</div>

                        <a className="navbar-brand" href="mailto:sdas22@masonlive.gmu.edu"><p style={{color: 'white'}}>Contact Us</p></a>



            </nav>
        )
    }
}

export default Footer;

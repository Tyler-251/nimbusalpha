import React from "react";
import "../styles/Header.css";
import { signOut, fetchUserAttributes, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';

const headerLeftStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    height: "100%",
}

function Header() {
    const [userInfo, setUserInfo] = React.useState('');
    React.useEffect(() => {  // ON MOUNT
        const fetchUser = async () => {
            try {
                const user = await fetchUserAttributes();
                setUserInfo(user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        fetchUser();
    }, []);

    return (
        <header>
            <div className="header-left" style={headerLeftStyle}>
                <h1>Nimbus Calendar Manager</h1>
                <a href="https://tylerrussell.me/nimbus" style={{"color":"white", "textDecoration": "none", "paddingLeft": "10px"}}>Learn About This Project Here</a>
            </div>
            <div className="header-right">
                <h2>Logged in as: {userInfo.email || "..."}</h2>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        </header>
    );
    }

export default Header;
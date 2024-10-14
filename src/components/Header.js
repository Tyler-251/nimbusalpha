import React from "react";
import "../styles/Header.css";
import { signOut, fetchUserAttributes, getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';


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
            <h1>Nimbus Calendar Manager</h1>
            <div className="header-right">
                <h2>Logged in as: {userInfo.email || "..."}</h2>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        </header>
    );
    }

export default Header;
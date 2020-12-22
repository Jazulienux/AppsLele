import { withRouter, Redirect } from 'react-router';
import React, { useCallback, useContext } from 'react';
import { AuthContext } from '../auth/Auth';
import { login } from '../api/api';

const Login = ({ history }) => {
    const handleLogin = useCallback(
        async (event) => {
            event.preventDefault();
            const { email, password } = event.target.elements;
            try {
                const user = {
                    email: email.value,
                    password: password.value
                }
                await login(user).then(res => {
                    if (res.status === 0) {
                        alert(res.notif)
                    }
                    else {
                        localStorage.setItem("usertoken", res.notif);
                        history.push('/');
                        window.location.reload(true);
                    }
                })
            } catch (error) {
                alert(error)
            }
        },
        [history],
    )

    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <div className="wrapper-nav">
            <div className="form-wrapper">
                <h1 style={{ marginBottom: "5%" }}>Login Page Admin</h1>
                <form onSubmit={handleLogin} noValidate>
                    <div className="email">
                        <label htmlFor="email" style={{ marginBottom: "3%" }}>Email</label>
                        <input type="text" className="" placeholder="Email" name="email" required noValidate></input>
                    </div>
                    <div className="password">
                        <label htmlFor="password" style={{ marginBottom: "3%" }}>Password</label>
                        <input type="password" className="" placeholder="Password" name="password" required noValidate></input>
                    </div>
                    <div className="createAccount">
                        <button type="submit">Login</button>
                        {/* <small style={{ marginTop: "10px" }}>Go To Testing Menu</small> */}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default withRouter(Login);

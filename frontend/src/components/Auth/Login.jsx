import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/userSlice';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        // Stop the browser from refreshing the page when the form is submitted.
        // Instead, let JavaScript (using axios and async/await)
        // send the login request and handle the response without reloading the page.
        e.preventDefault();
        try {
            const response = await axios.post(
                `${API_BASE_URL}/login`,
                { username, password }
            );
            const userRole = response.data.user?.role || 'user';
            const userName = response.data.user?.username || username;

            dispatch(login({ token: response.data.token, role: userRole, username: userName }));
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('username', userName);

            if (userRole === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (error) {
          
            setError('Invalid username or password');
            console.error('Error logging in', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleLogin}>
               
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
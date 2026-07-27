import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();// explained in login
        try {
            // navigae we use it in javascrtip i run direcly when we wrie i 
            // bu <link> this we put it in jsx and run when the user click on it
            await axios.post(`${API_BASE_URL}/register`, { username, password });
            navigate('/login');// we want to navigate afer successful registration to the login page
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Error registering', error);
        }
    };

    return (
        <div>
            <h2>Register</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleRegister}>

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
                <button type="submit">Register</button>
            </form>

            {/* we use link here because he user decide if he wan to go to login*/}
            {/* if we use navigate here it will automaticly go to login page */}
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;

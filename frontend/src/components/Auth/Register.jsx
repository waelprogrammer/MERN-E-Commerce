import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api'; // to not right always localhost:5000 we create a config file and export the base url from it

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();// explained in login
        try {
            // navigae we use it in javascrtip i run direcly when we write it
            // but <link> this we put it in jsx and run when the user click on it
            await axios.post(`${API_BASE_URL}/register`, { username, password });// backedn receive is in req.body two things
            navigate('/login');// we want to navigate afer successful registration to the login page
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Error registering', error);// for detailed error for debugging
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
                    onChange={(e) => setUsername(e.target.value)} // e is an event object that is passed
                    // to the event handler function when an event occurs. In this case,
                    //  it represents the change event triggered by the input field.
                    //  The onChange event is fired whenever the value of the input field changes
                    // (e.g., when the user types something). The event object contains information about the event,
                    //  including the target element (the input field) and its current value. By accessing e.target.value,
                    //  we can retrieve the current value of the input field and update the username state accordingly.
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

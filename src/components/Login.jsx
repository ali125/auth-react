import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import useInput from '../hooks/useInput';
import useToggle from '../hooks/useToggle';

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser, userAttributes] = useInput('user', ''); // useState('');
    const [pwd, setPwd] = useState('');

    const [errMsg, setErrMsg] = useState("");
    const [check, toggleCheck] = useToggle('persist', false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        if (!user || !user) {
            setErrMsg("Invalid Entry");
            return;
        }

        try {
            const response = await axios.post(
                '/auth',
                JSON.stringify({ user, pwd }),
                {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            // setUser('');
            resetUser();
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 400) {
                setErrMsg('Missing username or password');
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized");
            } else {
                setErrMsg("Login Failed");
            }
            errRef.current.focus();
            console.log(err);
        }
    }

    return (
        <section>
            <p
                ref={errRef}
                className={classNames('p-2 bg-red-300 rounded mb-2', {
                    'block': errMsg,
                    'hidden': !errMsg
                })}
                aria-live="assertive"
            >
                {errMsg}
            </p>
            <h1 className='text-center text-2xl mb-3 font-medium text-slate-200'>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label className='text-white my-1 flex items-center' htmlFor='username'>Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    className='text-black py-2 px-3 rounded-md w-full focus:outline-sky-700 mb-3'
                    required
                    {...userAttributes}
                />

                <label className='text-white my-1 flex items-center' htmlFor='password'>Password:</label>
                <input
                    type="password"
                    id="password"
                    className='text-black py-2 px-3 rounded-md w-full focus:outline-sky-700 mb-3'
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    value={pwd}
                />

                <button className='w-full my-3 text-center bg-green-600 px-5 py-3 rounded-md shadow disabled:bg-slate-400' disabled={!user || !pwd}>
                    Sign In
                </button>  

                <div>
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={toggleCheck}
                        checked={check}
                    />
                    <label className='ml-1' htmlFor="persist">Trust This Device</label>
                </div>
            </form>
            <p className='text-center w-full text-white'>
                Need an Account? <br />
                <span>
                    {/* @todo put router link here */}
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>
    );
}

export default Login;

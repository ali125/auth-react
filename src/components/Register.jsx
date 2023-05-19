import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Close, Check, Info } from '@mui/icons-material';
import axios from '../api/axios';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user]);
 
    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match)
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg("");
    }, [user, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }

        try {
            const response = await axios.post(
                '/register',
                JSON.stringify({ user, pwd }),
                {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response.data);
            console.log(response.accessToken);
            console.log(JSON.stringify(response));
            setSuccess(true);
            // clear input fields
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg("Registration Failed");
            }
            errRef.current.focus();
            console.log(err);
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
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
                    <h1 className='text-center text-2xl mb-3 font-medium text-slate-200'>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label className='text-white my-1 flex items-center' htmlFor='username'>
                            Username:
                            <span className={validName ? "text-green-500 block" : 'hidden'}>
                                <Check />
                            </span>
                            <span className={validName || !user ? "hidden" : 'text-red-500 block'}>
                                <Close />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            className='text-black py-2 px-3 rounded-md w-full focus:outline-sky-700 mb-3'
                            onChange={(e) => setUser(e.target.value)}
                            required
                            aria-invalid={validName ? 'false' : 'true'}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />

                        <p
                            id="uidnote"
                            className={classNames('text-white text-sm bg-gray-800 py-2 px-3 rounded w-full shadow', {
                                'block': userFocus && user && !validName,
                                'hidden': !(userFocus && user && !validName)
                            })}
                        >
                            <Info />
                            4 to 24 characters.<br/>
                            Must begin with a letter.<br/>
                            Letters, numbers, underscores, hyphens allowed.
                        </p>

                        <label className='text-white my-1 flex items-center' htmlFor='password'>
                            Password:
                            <span className={validPwd ? "text-green-500 block" : 'hidden'}>
                                <Check />
                            </span>
                            <span className={validPwd || !pwd ?  "hidden" : 'text-red-500 block'}>
                                <Close />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            className='text-black py-2 px-3 rounded-md w-full focus:outline-sky-700 mb-3'
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            aria-invalid={validPwd ? 'false' : 'true'}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />

                        <p
                            id="pwdnote"
                            className={classNames('text-white text-sm bg-gray-800 py-2 px-3 rounded w-full shadow', {
                                'block': pwdFocus && pwd && !validPwd,
                                'hidden': !(pwdFocus && pwd && !validPwd)
                            })}
                        >
                            <Info />
                            8 to 24 characters.<br/>
                            Must include uppercase and lowercase letters, a number and a special character.<br/>
                            Allowed special characters:
                            <span aria-label="exclamation mark">!</span>
                            <span aria-label="at symbol">@</span>
                            <span aria-label="hashtag">#</span>
                            <span aria-label="dollar sign">$</span>
                            <span aria-label="percent">%</span>
                        </p>

                        <label className='text-white my-1 flex items-center' htmlFor='confirm_pwd'>
                            Confirm Password:
                            <span className={validMatch && matchPwd ? "text-green-500 block" : 'hidden'}>
                                <Check />
                            </span>
                            <span className={validMatch || !matchPwd ?  "hidden" : 'text-red-500 block'}>
                                <Close />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            className='text-black py-2 px-3 rounded-md w-full focus:outline-sky-700 mb-3'
                            onChange={(e) => setMatchPwd(e.target.value)}
                            required
                            aria-invalid={validMatch ? 'false' : 'true'}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />

                        <p
                            id="confirmnote"
                            className={classNames('text-white text-sm bg-gray-800 py-2 px-3 rounded w-full shadow', {
                                'block': matchFocus && matchPwd && !validMatch,
                                'hidden': !(matchFocus && matchPwd && !validMatch)
                            })}
                        >
                            <Info />
                            Must match the first password input field.
                        </p>

                        <button className='w-full my-3 text-center bg-green-600 px-5 py-3 rounded-md shadow disabled:bg-slate-400' disabled={!validName || !validPwd || !validMatch ? true : false}>
                            Sign Up
                        </button>  
                    </form>
                    <p className='text-center w-full text-white'>
                        Already registered? <br />
                        <span>
                            {/* @todo put router link here */}
                            <a href="#">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    );
}

export default Register


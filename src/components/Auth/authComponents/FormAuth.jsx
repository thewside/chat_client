import {useState, useEffect, useRef} from 'react'
import {Link, useNavigate} from "react-router-dom";
import {SignLogo} from './SignLogo.jsx';
import { fetchServer } from '../scripts/authServer.js';
import '../forms.scss';
import {showTooltipLogin, showTooltipPassword, hideTooltips} from  '../scripts/controlTooltips.js';
import {validationForms} from '../scripts/validationForms.js';

const ADRESS = "http://127.0.0.1:8015/auth"; //config
window.localStorage.setItem("Authorization-token", "12345"); //simulate token

const AUTH_OPTIONS = {
    login: {
        submitText: "Войти",
        text: 'Впервые здесь?',
        buttonText: "Зарегистрироваться",
    },
    registration: {
        submitText: "Создать аккаунт",
        text: 'Eсть аккаунт?',
        buttonText: "Войти",
    }
};

export const FormAuth = ({connectionState, switchForms, routes}) => {
    let navigate = useNavigate();

    const {LOGIN, REGISTRATION, CHAT} = routes;
    const {connection, setConnection} = connectionState;
    useEffect(()=>{
        let key = window.localStorage.getItem('Authorization-token');
        if(key) { 
            console.log(key)
            //fetch to server, check in db
            //route to chat
        }
    },[connection, setConnection]);

    const [tooltip, setTooltip] = useState({
        login: {
            value: "",
            visibility: "hidden"
        },
        password: {
            value: "",
            visibility: "hidden"
        }
    });

    const [mode, setMode] = useState(
        switchForms === LOGIN ?
            AUTH_OPTIONS.registration :
            AUTH_OPTIONS.login
    );
    useEffect(() => {
        hideTooltips(setTooltip);
        setMode( switchForms === LOGIN ?
                AUTH_OPTIONS.registration :
                AUTH_OPTIONS.login
        );
    }, [switchForms])

    const [submitCooldown, setSubmitCooldown] = useState(false);
    useEffect(() => {
        if (submitCooldown) {
            let timeout = setTimeout(() => {
                setSubmitCooldown(false);
            },1000);
            return () => clearTimeout(timeout)
        }
    }, [submitCooldown, setSubmitCooldown]);


    const loginRef = useRef();
    const passwordRef = useRef();
    const newSubmit = async (e) => {
        if(submitCooldown) {
            e.preventDefault();
            return
        }
        setSubmitCooldown(true);

        const loginRaw = loginRef.current.value;
        const passwordRaw = passwordRef.current.value;
        const isValidated = validationForms(loginRaw, passwordRaw);
        
        if (isValidated.error && isValidated.login && isValidated.password) {
            showTooltipLogin(setTooltip, isValidated.login)
            showTooltipPassword(setTooltip, isValidated.password)
            e.preventDefault()
            return
        }
        if (isValidated.error && isValidated.login) {
            showTooltipLogin(setTooltip, isValidated.login)
            e.preventDefault()
            return
        };
        if (isValidated.error && isValidated.password) {
            showTooltipPassword(setTooltip, isValidated.password)
            e.preventDefault()
            return
        };

        hideTooltips(setTooltip);
        const type = switchForms !== LOGIN ? LOGIN.slice(1) : REGISTRATION.slice(1)
        
        const recievedAuthData = await fetchServer(ADRESS, {
            type: type,
            login: loginRaw,
            password: passwordRaw
        })
        .catch(() => {
            return {error: "Нет связи с сервером авторизации"}
        });

        if(recievedAuthData.error){
            showTooltipLogin(setTooltip, recievedAuthData.error)
            e.preventDefault()
            return
        }

        if(recievedAuthData.message) {
            const {type, message} = recievedAuthData;
            if(type === "registration") {
                showTooltipLogin(setTooltip, message)
                e.preventDefault()
                return
            }
            if(type === "auth-password") {
                showTooltipPassword(setTooltip, message)
                e.preventDefault()
                return
            }
            if(type === "auth-login") {
                showTooltipLogin(setTooltip, message)
                e.preventDefault()
                return
            }
        };
        
        console.log(recievedAuthData)
        if(recievedAuthData.authToken){
            console.log(recievedAuthData)
            navigate(CHAT, {replace: true});
        }
    };

    return (
        <div className='auth-container'>
            <div className='form-container'>
                <SignLogo />
                <form className='form'>
                    <input
                        type="text"
                        className="form-login"
                        placeholder="login"
                        ref={loginRef}
                        onFocus={() => hideTooltips(setTooltip)}
                    />
                    <input
                        type="password"
                        className="form-password"
                        placeholder="password"
                        ref={passwordRef}
                        onFocus={() => hideTooltips(setTooltip)}
                    />
                    <div
                        className='form-submit'
                        onClick={newSubmit}
                    >
                        {mode.submitText}
                    </div>
                </form>
                <div className='tooltips'>
                    <div
                        onClick={()=>{ hideTooltips(setTooltip); loginRef.current.focus() }}
                        className='tooltip-login'
                        style={{ visibility: tooltip.login.visibility }}
                    >
                        <h1 className='tooltip-login-text'>{tooltip.login.value}</h1>
                        <div className='tooltip-login-border' />
                    </div>
                    <div
                        onClick={(e)=>{  hideTooltips(setTooltip);  passwordRef.current.focus()  }}
                        className='tooltip-password'
                        style={{ visibility: tooltip.password.visibility }}
                    >
                        <h1 className='tooltip-password-text'>{tooltip.password.value}</h1>
                        <div className='tooltip-password-border' />
                    </div>
                </div>
                <div className='switch-container'>
                    <div className="switch-text">
                        {mode.text}
                        </div>
                    <Link className='switch-link' to={switchForms}>
                        {mode.buttonText}
                        </Link>
                </div>
            </div>
        </div>
    )
};
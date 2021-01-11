import React, {useState, useEffect, useContext} from 'react';
import GoogleLogin from 'react-google-login'
import {useHttp} from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';
import {AuthContext} from '../context/AuthContext';
import './AuthPage.css';

const clientId = '573054707008-n6gc2nku822ale1dagf6m6d8go5emrpa.apps.googleusercontent.com';

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const {loading, error, request, clearError} = useHttp();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = (event) => {
    setForm({...form, [event.target.name]: event.target.value});
  };

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form});
      message(data['message']);
      // console.log('Data', data);
    } catch (e) {
    }
  };

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form});
      auth.login(data.token, data.userId);
      message(data['message']);
      // console.log('Data', data);
    } catch (e) {
    }
  };

  const responseGoogle = async (res) => {
    try {
      // console.log('Login Success: currentUser:', res.profileObj);
      await request('/api/auth/register', 'POST', {
        email: res.profileObj.email,
        password: res.profileObj.email
      });
      message('Created');
    } catch (e) {
      console.log('register error');
    }
    try {
      const data = await request('/api/auth/login', 'POST', {
        email: res.profileObj.email,
        password: res.profileObj.email
      });
      auth.login(data.token, data.userId);
      message('Welcome!');
      // console.log('Data', data);
    } catch (e) {
      console.log('login error');
    }
  };

  const onFailure = () => {
    message(`Failed to login. 😢`);
  };

  return (
    <div className='row d-flex'>

      <div className='col s6'>
        <div className="card blue-grey darken-1">
          <div className="card-content white-text">
            <span className="card-title">Authorization</span>
            <p>I am a very simple card</p>

            <div className="input-field">
              <input
                id="email"
                type="email"
                className="validate"
                name='email'
                onChange={changeHandler}
                value={form.email}
              />
              <label htmlFor="email">Email</label>
              <span className="helper-text" data-error="wrong" data-success="right">Helper text</span>
            </div>

            <form className="input-field">
              <input
                id="password"
                type="password"
                className="validate"
                name='password'
                onChange={changeHandler}
                value={form.password}
                autoComplete="on"
              />
              <label htmlFor="password">Password</label>
              <span className="helper-text" data-error="wrong" data-success="right">Helper text</span>
            </form>

          </div>
          <div className="card-action">
            <a href="https://materializecss.com/">This is a link</a>
            <hr/>
            <button
              className='btn yellow darken-3'
              style={{marginRight: 30}}
              onClick={loginHandler}
              disabled={loading}
            >
              LogIn
            </button>
            <button
              className='btn yellow darken-3'
              onClick={registerHandler}
              disabled={loading}
            >
              Registration
            </button>
            <hr/>
            <div>
              <GoogleLogin
                clientId={clientId}
                buttonText="Sing In"
                onSuccess={responseGoogle}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                style={{marginTop: '100px'}}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='AuthPage'>
      </div>
    </div>
  );
};
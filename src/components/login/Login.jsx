// import { auth } from 'firebase';
import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FirebaseContext from '../../firebase/Context';
import { setAuthUserAsync, setTenantIdAsync, setRolesAsync, setEmployeeIdAsync, setTenantNameAsync} from './loginSlice';
import loginBackground from '../../assets/images/image.png'
import './Login.css';
import { Button, Form, TextField, Text, Divider } from '@adobe/react-spectrum';
import bugsy from '../../assets/svgs/bugsy.svg';
import { setEmployeeProfileAsync } from '../myprofile/myProfileSlice';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [error, setError] = useState(null);
    const history = useHistory();
    const dispatch = useDispatch();
    const authUser = useSelector((store) => store.auth.authUser);

    // componentDidMount
    // useEffect(() => {
    //     if (authUser) {
    //         history.push('/myprofile')
    //     }
    // }, []);

    const firebase = useContext(FirebaseContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        await firebase.doSignInWithEmailAndPassword(email, password, tenantId)
        .then((response)=>{
            // console.log("Response ", response)
            firebase.user(response.user.uid)
            .once("value")
            .then(user=>{
                // console.log("Users in User ", user.val());
                // console.log('user.val() && user.val().tenants[tenantId]', user.val() , user.val().tenants[tenantId]);
                if(user.val() && user.val().tenants[tenantId]){
                    localStorage.setItem('tenantId', JSON.stringify({tenantId: tenantId}));
                    localStorage.setItem('authUser', JSON.stringify(response));
                    
                    const userRoles = Object.keys(user.val().tenants[tenantId].roles)
                    // console.log('LOGGED IN USER', user.val());

                    const employeeId = user.val().tenants[tenantId].employeeId;

                    // firebase.tenants(tenantId)
                    // .once("value", 
                    //    snapshot=>{
                    //     console.log("TENANT", snapshot.val())
                  
                    // })

                    // console.log('USER ROLES', userRoles);
                    //To print COVET IT Users
                    
                    firebase.tenants(tenantId)
                        .once('value')
                        .then(client=>{
                            console.log(`Tenants for ${tenantId} `, client.val())
                            dispatch(setTenantNameAsync(client.val().name));
                        })
                        .catch(err=>{
                            console.log(`Error in reading ${tenantId} tenants `, err);
                            // setError(err);
                        })

         
                    dispatch(setEmployeeIdAsync(employeeId))
                    dispatch(setAuthUserAsync(JSON.parse(JSON.stringify(response))))
                    dispatch(setTenantIdAsync(tenantId));
                    dispatch(setRolesAsync(userRoles));
                   
                    history.push('/myprofile')
                } else {
                    
                    setError({code: 'auth/wrong-tenantid', message: 'Wrong Tenant ID'});
                    // throw Error("Invalid Tenant ID")
                    // let tenantError = new Error('auth/wrong-tenantid');
                    
                }
                
            })
            .catch(error=>{
               setError(error)
            })
            
        })
        .catch(error=>{
            // console.error('Login ', error)
            setError(error)
        })
    }

    // console.log('ERROR', error);

    return (
        <div className="container-login" style={{backgroundImage: `url(${loginBackground})`}}>
            <div className="login-image-bg"></div>
            <div className="login-tag-line">Services You Can Bank Upon. Performanze Optimized!</div>
            <div className="login-right">
                <div className="login-right-contents">
                <div style={{height: '100px', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                    <img src={bugsy} alt="company-logo"/>
                </div>
                <div className="login-company-name">
                    Bugsy CRM
                </div>

            <Form onSubmit={(e) => onSubmit(e)}>
                {/* {console.log(error ? error.code === 'auth/user-not-found' ? false : true : null)} */}
                <TextField validationState={error ? error.code === 'auth/user-not-found' ? 'invalid' : 'valid' : null} label="Email" placeholder="abc@adobe.com" onChange={(e) => setEmail(e)} />
                <TextField validationState={error ? error.code === 'auth/wrong-password' ? 'invalid' : 'valid' : null} type="password" label="Password"  placeholder="1234" onChange={(e) => setPassword(e)}/>
                <TextField validationState={error ? error.code === 'auth/wrong-tenantid' ? 'invalid' : 'valid' : null} label="Tenant ID" isRequired placeholder="Tenant ID" onChange={(e) => setTenantId(e.toUpperCase())}/>
                {/* <Checkbox>Remember me</Checkbox> */}
                <Button variant="cta" type="submit" marginTop="20px" isDisabled={email === '' || password === '' || tenantId === ''}>Login</Button>
            </Form>

            <div className="login-error-message">
                <Text>{error ? error.message : null}</Text>
            </div>

                <div className="login-divider">
                    <Divider size="S"/>
                        <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', padding: '20px'}}>
                        <Text UNSAFE_style={{textAlign: 'center'}}>© Bugsy CRM, Inc. All Rights Reserved 2021</Text>
                        <Text UNSAFE_style={{textAlign: 'center'}}>v1.2 Build 2.0</Text>
                    </div>
                </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Login

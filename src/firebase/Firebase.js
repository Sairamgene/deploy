import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  };

class Firebase {
  constructor(){
    app.initializeApp(config)

    this.serverValue = app.database.ServerValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;
    this.auth = app.auth()
    this.tenantId=''
    this.employeeId = ''

    this.db = app.database()
    this.storage = app.storage()
    // this.googleProvider = new app.auth.GoogleAuthProvider();
    // this.facebookProvider = new app.auth.FacebookAuthProvider();
    // this.facebookProvider.addScope('email')
    // this.googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
  }
  onAuthUserListener = (next, fallback) =>{
    // if (tenantId && tenantId.tenantId)
    //   this.tenantId= `${tenantId.tenantId}_`
    return this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();
            
            console.log('Firebase dbUser ', this.tenantId)
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }

            // merge auth and db user
            if(!dbUser.tenantId.map(tenant => {return tenant.tenantId}).includes(this.tenantId)){
              fallback();
            }

            // Extract employeeId
            dbUser.tenantId.forEach(tenant => {
              if (this.tenantId === tenant.tenantId) {
                this.employeeId = tenant.employeeId;
              }
            });


            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };
            console.log('onAuthListener ', authUser)
            next(authUser);
          }).catch(error=>{
             console.log('onAuthStatusChanged ', error)
          });;
      } else {
        fallback();
      }
  })}

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
 
  doSignInWithEmailAndPassword = (email, password, tenantId) =>{
    if(tenantId)
      this.tenantId= tenantId
    console.log("Firebase tenantid during signIn", this.tenantId)
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  doSignOut = () => { 
    this.tenantId=""
    localStorage.removeItem('tenantId')
    localStorage.removeItem('authUser')
    this.auth.signOut()
    
  };
 
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
  
//   doSignInWithGoogle = () =>
//     this.auth.signInWithPopup(this.googleProvider);

//   doSignInWithFacebook = () =>
//     this.auth.signInWithPopup(this.facebookProvider);
//     // this.auth.signInWithRedirect(this.facebookProvider)
 
  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
    });
    
  user = (uid) => {
      // if(this.tenant){
      //   tenant= `${tenant}_`
      // } else {
      //   tenant= ''
      // }
    
      return this.db.ref(`users/${uid}`);
  
      
  }
  
  users = () => {
      
      return this.db.ref(`users`)
       
  }

  message = uid => this.db.ref(`messages/${uid}`);
 
  messages = () => this.db.ref('messages');

  tenants = (tenantId) => {
    console.log('TENANTS', `tenants/${tenantId}`)
    return this.db.ref(`tenants/${tenantId}`) 
  }

  setTenantId = (tenantId)=>{
    // localStorage.setItem('tenantId', JSON.stringify({tenantId}))
    this.tenantId= `${tenantId}`
  }

  employees = (id)=>{
      console.log("Searching Employees for Tenant:", this.tenantId, `${this.tenantId}employees/`)
      // https://bugsy-crm.firebaseio.com/COVET_employees/
      const tenantId_ = `${this.tenantId}_`

      if(id) {
        console.log(`${tenantId_}employees/${id}`)
        const test=  this.db.ref(`${tenantId_}employees/${id}`)
        test.once("value")
          .then( emp => {
            console.log("Employee Firebase ", emp.val())
          }
          ).catch(err=>{
            console.log("Firebase Employee ", err)
          })
        return test
      } else {
        console.log(`${tenantId_}employees/`)
        return this.db.ref(`${tenantId_}employees`)
      }
  } 

  immigration = (employeeId, caseId) => {
    const path = `${this.tenantId}_immigration/${employeeId}`;
    if (caseId) {
      return this.db.ref(`${path}/${caseId}`);
    } else {
      return this.db.ref(path); //return all related to specific employee
    }
  }

  immigrationQuestionnaire = (employeeId, caseId) => {
    const path = `${this.tenantId}_immigration/${employeeId}/${caseId}/questionnaires`;
    return this.db.ref(path);
  }

  immigrationTimelineEvents = (employeeId, caseId) => {
    const path = `${this.tenantId}_immigration/${employeeId}/${caseId}/timelineEvents`;
    return this.db.ref(path);
  }

  clients = (tenantId, id=null)=>{
    console.log("Searching Clients for Tenant ", tenantId, `${tenantId}clients/`)
    const tenantId_ = `${tenantId}_`
    if(id) {
      return this.db.ref(`${tenantId_}clients/${id}`)
    }else{
      return this.db.ref(`${tenantId_}clients/`)
    }
  } 



}


export default Firebase;






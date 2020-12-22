import axios from 'axios'


export const login = user => {
    return axios.post("users/login",{
        email : user.email,
        password : user.password,
        },{
            headers: { "Content-type": "application/json" }
        }).then(resp=>{
            return resp.data
        }).catch(err=>{
            console.log(err);
        })
}
import axios from "axios";

const url = "http://127.0.0.1:8000/api/";

export async function getToken(data) {
    const resp = await axios.post(url + "token/",data,{
        withCredentials: true,
      })

    return resp;
}

export async function registerUser(data) {
    const resp = await axios.post(url + "user/register/",data,{
        withCredentials: true,
      })

    return resp;
}

export async function update_access_token(data) {
    const resp = await axios.post(url + "token/refresh/",data,{
        withCredentials: true,
      })

    return resp;
}

export async function get_notes(token) {
    const resp = await axios.get(url + "notes/",{
        withCredentials: true,
        headers:{
          "Authorization":"Bearer " + token 
        }
      })

    return resp;
}
export async function add_note_for_user(token, noteD) {
    const resp = await axios.post(url + "notes/",noteD,{
        withCredentials: true,
        headers:{
          "Authorization":"Bearer " + token 
        }
      })

    return resp;
}
export async function update_note_for_user(token, noteD, noteID) {
    const resp = await axios.put(url + "notes/"+noteID, noteD,{
        withCredentials: true,
        headers:{
          "Authorization":"Bearer " + token 
        }
      })

    return resp;
}
export async function delete_note_for_user(token, noteID) {
    const resp = await axios.delete(url + "notes/"+noteID,{
        withCredentials: true,
        headers:{
          "Authorization":"Bearer " + token 
        }
      })

    return resp;
}
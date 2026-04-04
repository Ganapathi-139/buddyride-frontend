const BASE_URL = 'https://buddyride-backend-production.up.railway.app/api';
const tokens = {
  get access()  { return localStorage.getItem('br_access'); },
  get refresh() { return localStorage.getItem('br_refresh'); },
  save(a,r){localStorage.setItem('br_access',a);localStorage.setItem('br_refresh',r);},
  clear(){localStorage.removeItem('br_access');localStorage.removeItem('br_refresh');localStorage.removeItem('br_user');},
};
const currentUser = {
  get(){const u=localStorage.getItem('br_user');return u?JSON.parse(u):null;},
  save(u){localStorage.setItem('br_user',JSON.stringify(u));},
  clear(){localStorage.removeItem('br_user');},
};
async function apiFetch(path,options={}){
  const headers={'Content-Type':'application/json',...options.headers};
  if(tokens.access)headers['Authorization']=`Bearer ${tokens.access}`;
  let res;
  try{res=await fetch(`${BASE_URL}${path}`,{...options,headers});}
  catch{return{data:null,error:'Cannot reach server. Check your internet connection.'};}
  if(res.status===401&&tokens.refresh){
    try{
      const rr=await fetch(`${BASE_URL}/auth/refresh`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refreshToken:tokens.refresh})});
      if(rr.ok){const{tokens:t}=await rr.json();tokens.save(t.access,t.refresh);headers['Authorization']=`Bearer ${t.access}`;res=await fetch(`${BASE_URL}${path}`,{...options,headers});}
      else{tokens.clear();window.dispatchEvent(new Event('buddyride:logout'));return{data:null,error:'Session expired. Please log in again.'};}
    }catch{tokens.clear();return{data:null,error:'Session expired.'};}
  }
  const data=await res.json().catch(()=>({}));
  if(!res.ok)return{data:null,error:data.error||`Error ${res.status}`};
  return{data,error:null};
}
export{BASE_URL,tokens,currentUser,apiFetch};

let API_BASE = import.meta.env.VITE_API_URL

export async function request(path, data = {}){
    let res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    let response = await res.json();
    console.log(res)

    if(res.status == 401){
        localStorage.clear()
        window.location.reload()     
    }
    
    if(!res.ok){
        return {error: response.error}
    }

    return response
}


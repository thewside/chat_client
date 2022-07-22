export const fetchServer = async (ADRESS, data) => {
    const payload = JSON.stringify(data);
    const response = await fetch(ADRESS,{
            method: 'POST',
            headers:{
                "Access-Control-Request-Method": "POST",
                'Content-Type':'application/json'
            },
            body: payload
    });
    let result = await response.json();
    return result
}
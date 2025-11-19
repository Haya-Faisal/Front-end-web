async function astronotdata() {
    let apiurl="http://api.open-notify.org/astros.json";
    let response=await fetch(apiurl). catch(err=>consolr.error(err))
    console.log(response)
    let data=await response.json()
    let people=data.people

    for (person of people){
        let listitem=document.createElement("li")
        listitem.innerHTML=`<b>${person.craft}:</b> ${person.name}`;
        infoList.appendChild(listitem)
    }   
}

astronotdata();
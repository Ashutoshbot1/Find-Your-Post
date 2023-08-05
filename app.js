const ipDisplay=document.querySelector("#ip-address span");
const startBtn=document.getElementById("get-started");

let latitude,longitude;

window.onload=getIpAddress();

async function getIpAddress(){

    const response= await fetch('https://api64.ipify.org?format=json');

    if(!response.ok){
        ipDisplay.innerHTML=`Ip Not Found`
        return;
    }
    const data=await response.json();
    console.log(data.ip);

    ipDisplay.innerHTML=data.ip;

}




startBtn.addEventListener("click",getPost);


async function getPost(){

    document.querySelector(".home-page").style.display="none";
    document.querySelector(".get-post-page").style.display="block";

    document.querySelector(".post-ip-address span").innerHTML=ipDisplay.innerHTML;


    const apiKey=`5c6378501066d983eed5ccf17c7599c150d50467`;


    const url=`http://ip-api.com/json/${ipDisplay.innerHTML}`

    const response=await fetch(url);
    const data=await response.json();

    // console.log(data);

    displayMap(data);
    displayGeoDetails(data);
    displayMoreInfo(data);
    getPostsInfo(data);


}


// ------- display map ---------

function displayMap(data){

    const frame=document.getElementById("g-map");
    // https://maps.google.com/maps?q=35.856737, 10.606619&z=15&output=embed
    frame.src=`https://maps.google.com/maps?q=${data.lat}, ${data.lon}&z=15&output=embed`
}


// ------- displayy geo details --------

function displayGeoDetails(data){
    document.querySelector("#lat span").innerHTML=data.lat;
    document.querySelector("#long span").innerHTML=data.lon;
    document.querySelector("#city span").innerHTML=data.city;
    document.querySelector("#oragnisation span").innerHTML=data.org;
    document.querySelector("#region span").innerHTML=data.region;
    document.querySelector("#hostname span").innerHTML=data.as;
}


// ----------- display more info -------------

function displayMoreInfo(data){

    let timeZone=new Date().toLocaleString("en-US", { timeZone: `${data.timezone}` });
    // console.log(timeZone);

    document.querySelector("#time-Zone span").innerHTML=data.timezone;
    document.querySelector("#date-time span").innerHTML=timeZone;
    document.querySelector("#pincode span").innerHTML=data.zip;
    // document.querySelector("#message .sp").innerHTML="1";
}


// --------- get posts -----------

async function getPostsInfo(data){
    url=`https://api.postalpincode.in/pincode/${data.zip}`;
    
    const response= await fetch(url);
    const postData=await response.json();

    // console.log(postData);

    displayPosts(postData);

    document.querySelector("#message span").innerHTML=postData[0].Message;

}


//  --------------- display posts --------------

function displayPosts(data){


    const postsArray=data[0].PostOffice;
    // console.log(postsArray);

    const postContainer=document.querySelector(".post-office-container");

    postsArray.forEach(
        (pos)=>{
            const post=document.createElement("div");
            post.id="post-office-details";

            post.innerHTML=`
            
                <p id="name">${pos.Name}</p>
                <p id="branch-type">${pos.BranchType}</p>
                <p id="delivery-status">${pos.DeliveryStatus}</p>
                <p id="district">${pos.District}</p>
                <p id="division">${pos.Division}</p>

            `;

            postContainer.appendChild(post);

            
        }
    )

    
}



document.getElementById("search").addEventListener("click",

async ()=>{
        const searchPost=document.querySelector("#input").value;

        const url=`http://ip-api.com/json/${ipDisplay.innerHTML}`

        const response=await fetch(url);
        const data=await response.json();

        const url2=`https://api.postalpincode.in/pincode/${data.zip}`;
    
        const response2= await fetch(url2);
        const postData=await response2.json();

        // console.log(postData);
        const postsArray=postData[0].PostOffice;
        console.log(postsArray);

        const postContainer=document.querySelector(".post-office-container");

        postContainer.innerHTML="";

        postsArray.forEach(
            (pos)=>{
                if(pos.Name===searchPost){
                    console.log("inside");
                    const post=document.createElement("div");
            
                    post.id="post-office-details";

                    post.innerHTML=`

                        <p id="name">${pos.Name}</p>
                        <p id="branch-type">${pos.BranchType}</p>
                        <p id="delivery-status">${pos.DeliveryStatus}</p>
                        <p id="district">${pos.District}</p>
                        <p id="division">${pos.Division}</p>

                    `;

                    postContainer.appendChild(post);
                }
            }

        )

        if(!postContainer.firstChild){
            postContainer.innerHTML="<p class='para'>0 Results Found : wait for 3sec to search again</p>";

            setTimeout(()=>{
                postContainer.innerHTML="";

                getPost(data);
            },3000)
        }


        
    }
)




// ---------------- search-function ---------------- //



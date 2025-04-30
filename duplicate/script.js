const button1 = document.getElementById("image1");
const textA = document.getElementById("text1");
const button2 = document.getElementById("image2");
const textB = document.getElementById("text2");

button1.addEventListener("click", event =>{
    if( textA.style.display === "none"){
        textA.style.display = "block";
    }else{
    textA.style.display = "none";}
})
button2.addEventListener("click", event =>{
    if( textB.style.display === "none"){
        textB.style.display = "block";
    }else{
    textB.style.display = "none";}
})
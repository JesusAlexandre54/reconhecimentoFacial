
const video =document.getElementById('video');

function iniciarCamera(){
    navigator.getUserMedia=(
        navigator.getUserMedia ||
        navigator.webkitGetUserMedio ||
        navigator.mozGetUser ||
        navigator.msGetUser );
    navigator.getUserMedia({video:{}},
        stream => video.srcObject = stream,
        err => console.log(err)
        )
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(iniciarCamera);

video.addEventListener('play',()=>{
    try{
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {width:video.width, height:video.height};
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async() => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        console.log(detections);
        
    }, 500);}catch{
        err => console.log(err)
    }
})
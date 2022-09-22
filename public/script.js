const socket = io('/')

//access video audio
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video')
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: 'peerjs',
    host: '/',
    port: '443'
});


let myVideoStream
navigator.mediaDevices.getUserMedia({

    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })


    socket.on('user-connected', (userId) => {
        connecToNewUser(userId, stream);
    })

    let text = jQuery('input');
    jQuery('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {
            console.log("send message" + text.val());
            socket.emit('message', text.val());
            text.val('')
        }

    })
    socket.on('createMessage', message => {
        jQuery('ul').append(`<li clas="message"> <b>user </b> <br/> jQuery{message} </li>`);
        scrollToBottom();
    })

})
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})



const connecToNewUser = (userId, stream) => {
    // call user 
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

const scrollToBottom = () => {
    let d = jQuery('.main__chat_window');
    d.scrollTop(d.prop('scrollHeight'));
}
//Mute our video
const muteUnmute = ()=>{
    const enabled =myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        setUnmuteButton();
        myVideoStream.getAudioTracks()[0].enabled=false;
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}


const setMuteButton =()=>{
    const html =`
    <i class="fa-solid fa-microphone"></i>
    <span>Mute </span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;

}
const setUnmuteButton =()=>{
    const html =`
    <i class="unmute fa-solid fa-microphone-slash"></i>
    <span>Unmute </span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;

}


//stop video
const playstop = ()=>{

    const enabled =myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        setPlayVideo();
        myVideoStream.getVideoTracks()[0].enabled=false;
    }else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}


const setPlayVideo =()=>{
    const html =`
    <i class="stop_video fa-solid fa-video-slash"></i>
    <span>play video</span>
    `
    document.querySelector('.main__playstop_button').innerHTML = html;

}

const setStopVideo =()=>{
    const html =`
    <i class="fa-solid fa-video"></i>
    <span>Stop video</span>
    `
    document.querySelector('.main__playstop_button').innerHTML = html;

}







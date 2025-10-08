// -------------------------------
// Video & Audio Control Functions
// -------------------------------

// Use global stream & peer connection defined in main script
let screenStream = null;

// Toggle audio (mute / unmute)
function toggleAudio() {
  const audioTrack = window.localStream?.getAudioTracks()[0];
  if (audioTrack) {
    audioTrack.enabled = !audioTrack.enabled;
    console.log(audioTrack.enabled ? "Microphone unmuted" : "Microphone muted");
    // Update icon
    const muteBtn = document.getElementById('mute-btn');
    const icon = muteBtn.querySelector('i');
    if (audioTrack.enabled) {
      icon.className = 'fas fa-microphone';
      muteBtn.classList.remove('muted');
    } else {
      icon.className = 'fas fa-microphone-slash';
      muteBtn.classList.add('muted');
    }
  } else {
    console.warn("No audio track found.");
  }
}

// Toggle video (on / off)
function toggleVideo() {
  const videoTrack = window.localStream?.getVideoTracks()[0];
  if (videoTrack) {
    videoTrack.enabled = !videoTrack.enabled;
    console.log(videoTrack.enabled ? "Camera enabled" : "Camera disabled");
    // Update icon
    const videoBtn = document.getElementById('video-btn');
    const icon = videoBtn.querySelector('i');
    if (videoTrack.enabled) {
      icon.className = 'fas fa-video';
      videoBtn.classList.remove('muted');
    } else {
      icon.className = 'fas fa-video-slash';
      videoBtn.classList.add('muted');
    }
  } else {
    console.warn("No video track found.");
  }
}

// Toggle screen sharing (start / stop)
async function toggleScreenShare() {
  if (!screenStream) {
    // Start screen share
    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenVideo = document.createElement('video');
      addVideoStream(screenVideo, screenStream);

      const screenTrack = screenStream.getVideoTracks()[0];

      // When user manually stops screen share
      screenTrack.onended = () => {
        stopScreenShare();
      };

      console.log("✅ Screen sharing started");
    } catch (err) {
      console.error("❌ Error starting screen share:", err);
    }
  } else {
    // Stop screen share manually
    stopScreenShare();
  }
}

// Stop screen sharing and revert to camera
function stopScreenShare() {
  if (screenStream) {
    screenStream.getTracks().forEach(track => track.stop());
    screenStream = null;
  }

  // Revert to camera
  const cameraTrack = window.localStream?.getVideoTracks()[0];
  if (cameraTrack) {
    window.peerConnection.getSenders().forEach(sender => {
      if (sender.track && sender.track.kind === 'video') {
        sender.replaceTrack(cameraTrack);
      }
    });
  }

  console.log("🧭 Screen sharing stopped and camera restored");
}

// -------------------------------
// Attach to Buttons
// -------------------------------
// You can call these from your HTML like:
// <button onclick="toggleAudio()">Mute/Unmute</button>
// <button onclick="toggleVideo()">Video On/Off</button>
// <button onclick="toggleScreenShare()">Share/Stop Screen</button>

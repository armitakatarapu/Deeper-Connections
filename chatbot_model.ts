import { Hume, HumeClient } from 'hume';

const vari1 = "2ZzhuZXY0YyKXb7cq3wqzPXABK5UWmvznRGLNk9vwecW6XqK";
const vari2 = "RK1DGWHlzjUlWHFFqZsVcZJma7qtSZkAWeeaYrt4fkV2GXu2wKYsUUnBBT5fDAkE";

const client = new HumeClient({
  apiKey: import.meta.env.vari1  
  ,secretKey: vari2  
});


const vari3 = "6e37bc8c-07c7-4afe-85a5-bf71352c1f68";
const socket = await client.empathicVoice.chat.connect({
  configId: import.meta.env.vari3 || null
});
socket.on('open', handleWebSocketOpenEvent);
socket.on('message', handleWebSocketMessageEvent);
socket.on('error', handleWebSocketErrorEvent);
socket.on('close', handleWebSocketCloseEvent);

import {
  convertBlobToBase64,
  ensureSingleValidAudioTrack,
  getAudioStream,
  getBrowserSupportedMimeType,
} from 'hume';
let recorder: MediaRecorder | null = null;
let audioStream: MediaStream | null = null;
const mimeType: MimeType = (() => {
  const result = getBrowserSupportedMimeType();
  return result.success ? result.mimeType : MimeType.WEBM;
})();
async function captureAudio(): Promise<void> {
  
  audioStream = await getAudioStream();
  
  ensureSingleValidAudioTrack(audioStream);
  
  recorder = new MediaRecorder(audioStream, { mimeType });
  
  recorder.ondataavailable = async ({ data }) => {
    
    if (data.size < 1) return;
    
    const encodedAudioData = await convertBlobToBase64(data);
    
    const audioInput: Omit<Hume.empathicVoice.AudioInput, 'type'> = {
      data: encodedAudioData,
    };
    
    socket?.sendAudioInput(audioInput);
  };
  const timeSlice = 100;
  recorder.start(timeSlice);
}
async function handleWebSocketOpenEvent(): Promise<void> {
  console.log('Web socket connection opened');
  await captureAudio();
}

import {
  convertBase64ToBlob,
  getBrowserSupportedMimeType
} from 'hume';
const audioQueue: Blob[] = [];
let isPlaying = false;
let currentAudio: : HTMLAudioElement | null = null;
const mimeType: MimeType = (() => {
  const result = getBrowserSupportedMimeType();
  return result.success ? result.mimeType : MimeType.WEBM;
})();
function playAudio(): void {
  if (!audioQueue.length || isPlaying) return;
  isPlaying = true;
  const audioBlob = audioQueue.shift();
  if (!audioBlob) return;
  const audioUrl = URL.createObjectURL(audioBlob);
  currentAudio = new Audio(audioUrl);
  currentAudio.play();
  currentAudio.onended = () => {
    isPlaying = false;
    if (audioQueue.length) playAudio();
  };
}
function handleWebSocketMessageEvent(
  message: Hume.empathicVoice.SubscribeEvent
): void {
  switch (message.type) {
    case 'audio_output':
      const audioOutput = message.data;
      const blob = convertBase64ToBlob(audioOutput, mimeType);
      audioQueue.push(blob);
      if (audioQueue.length === 1) playAudio();
      break;
  }
}
function stopAudio(): void {
  currentAudio?.pause();
  currentAudio = null;
  isPlaying = false;
  audioQueue.length = 0;
}
function handleWebSocketMessageEvent(
  message: Hume.empathicVoice.SubscribeEvent
): void {
  switch (message.type) {
    case 'audio_output':
      const audioOutput = message.data;
      const blob = convertBase64ToBlob(audioOutput, mimeType);
      audioQueue.push(blob);
      if (audioQueue.length === 1) playAudio();
      break;
    case 'user_interruption':
      stopAudio();
      break;
  }
}

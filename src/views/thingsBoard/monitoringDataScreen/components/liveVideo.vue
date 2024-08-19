<template>
  <div class="live-video-container">
    <video
      class="video-container"
      :id="'videoRef' + props.deviceId"
      ref="videoRef"
      autoplay
      controls
      DisablePictureInPicture="true"
    >
    </video>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import flvjs from 'flv.js';

  const props = defineProps({
    deviceId: {
      type: String,
      required: true,
    },
  });

  const flvPlayer = ref<any>(null);
  const videoRef = ref(null);
  const url = computed(() => {
    return `https://srmew.com/inspectapi/api/Device/video/${props.deviceId}`;
  });

  const fetchUrl = async () => {
    return new Promise(async (resolve) => {
      const response = await fetch(url.value);
      resolve(response.json());
    });
  };

  onMounted(async () => {
    if (flvjs.isSupported()) {
      const res: any = await fetchUrl();
      const videoElement = document.getElementById('videoRef' + props.deviceId);
      flvPlayer.value = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        hasAudio: false,
        url: res.body!.Url.replace('http', 'https'),
        enableWorker: true,
        enableStashBuffer: false,
        autoCleanupSourceBuffer: true,
        autoCleanupMaxBackwardDuration: 60,
        stashInitialSize: 128,
        reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等。
      });
      flvPlayer.value.attachMediaElement(videoRef.value);
      flvPlayer.value.load();
      flvPlayer.value.play().catch(() => {});
      setInterval(judgeProgress, 30 * 1000);
    }
  });

  const judgeProgress = () => {
    if (flvPlayer.value) {
      //将进度条拉到最右边
      flvPlayer.value.currentTime = flvPlayer.value.buffered.end(0) - 0.01;
    }
  };

  onBeforeUnmount(() => {
    if (flvPlayer.value) {
      flvPlayer.value.destroy();
    }
  });
</script>

<style lang="less" scoped>
  //进度条
  video::-webkit-media-controls-timeline {
    display: none;
  }
  .live-video-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #000000;
    .video-container {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
</style>

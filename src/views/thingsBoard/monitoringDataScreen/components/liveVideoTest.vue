<template>
  <div class="live-video-test-container">
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
  import axios from 'axios';

  const props = defineProps({
    deviceId: {
      type: String,
      required: true,
    },
  });

  const flvPlayer = ref<any>(null);
  const videoRef = ref(null);
  const url = computed(() => {
    return `https://open.ys7.com/api/lapp/v2/live/address/get`;
  });

  const fetchUrl = async () => {
    return new Promise(async (resolve) => {
      const {
        data: { data },
      } = await axios.get(`http://140.210.193.47:40001/ezopen/token`);
      const params = new URLSearchParams();
      params.append('accessToken', data.token);
      params.append('deviceSerial', props.deviceId);
      params.append('protocol', '4');
      const response = await fetch(url.value, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });
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
        url: res.data.url,
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
  .live-video-test-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #000000;
    .video-container {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }
</style>

<template>
  <div class="live-video-test-container">
    <video
      class="video-container"
      :id="'videoRef' + props.deviceId"
      ref="videoRef"
      autoplay
      playsinline
    ></video>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { WRtcPlayerAsync } from './wrtc.sdk.js';

  const props = defineProps({
    deviceId: {
      type: String,
      required: true,
    },
  });

  const videoRef = ref<HTMLVideoElement | null>(null);
  const sdk = ref(new WRtcPlayerAsync());

  onMounted(() => {
    videoRef.value!.srcObject = sdk.value.stream;
    const dev_data = {
      url: `webrtc://wrtc.dvr168.org/play/${props.deviceId}`,
      username: 'admin',
      passwd: 'admin',
      nettype: 'IPV4',
      channelid: '1',
    };
    sdk.value.play(dev_data);
  });

  onBeforeUnmount(() => {
    sdk.value.close();
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

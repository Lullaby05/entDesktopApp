<template>
  <div class="help-center-container">
    <!-- <pdf
      :page="page"
      :source="pdfSrc"
      @progress="onProgress"
      @loaded="onLoaded"
    ></pdf>
    <div>
      <button @click="prevPage">Previous</button>
      <button @click="nextPage">Next</button>
    </div> -->
    <iframe
      :src="url"
      sandbox="allow-same-origin allow-scripts"
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
  const url = computed(() => {
    // 部署pdfjs的服务地址
    const aws_server = `pdfjs/web/viewer.html`;
    // 'https://business.api.xkrsecure.com/pdfjs/web/viewer.html';

    // pdf文件名称
    const pdf_name = 'guide.pdf';

    return `${aws_server}?file=docs/${pdf_name}`;
  });
</script>

<style lang="less" scoped>
  /* 添加你的样式 */
  .help-center-container {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    // overflow: hidden;
  }
</style>

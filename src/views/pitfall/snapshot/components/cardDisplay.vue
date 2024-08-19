<template>
  <div v-if="titleShow" class="card-display-title">
    <!-- <a-divider direction="vertical" :size="6" /> -->
    {{ title }}
  </div>
  <div class="card-display-content">
    <div v-for="item in filterItems" :key="item.id">
      <div
        class="content-items"
        :style="{ flexDirection: item.needWrap ? 'column' : 'row' }"
      >
        <div :class="item.needWrap ? 'field-wrap' : ''">{{ item.field }}:</div>
        <div v-if="item.type === 'image' && item.value" class="img-container">
          <a-upload
            ref="imageRef"
            :show-remove-button="false"
            :show-upload-button="false"
            list-type="picture-card"
            action="/"
            :default-file-list="item.value"
            @preview="handlePreview"
          />
          <!-- <div class="upload-img">
            <a
              v-for="url in item.value"
              :key="url.url"
              :href="url.url"
              target="_blank"
            >
              <img :src="url.url" />
            </a>
          </div> -->
        </div>
        <div v-else-if="item.type === 'sign' && item.value">
          <img class="sign-img" :src="item.value" />
        </div>
        <div v-else-if="item.type === 'signArray' && item.value">
          <div class="sign-list">
            <div
              class="sign-img"
              v-if="item.value.length"
              v-for="(url, index) in item.value"
              :key="index"
            >
              <img :src="url" />
            </div>
          </div>
        </div>
        <slot
          v-else-if="item.type === 'slot'"
          :name="item.slotName || 'default'"
        ></slot>
        <div v-else :style="{ color: item.textColor }">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';

  const props = defineProps({
    cardItems: {
      type: Object,
      default: () => {
        return {
          title: '',
          items: [],
        };
      },
    },
  });

  const { title = '', items = [] } = props.cardItems;

  const filterItems = items
    .filter((ele: any) => ele.visible === undefined || ele.visible)
    .map((ele: any) => {
      if (ele.type === 'image') {
        return {
          ...ele,
          value: ele.value
            ? ele.value.map((url: any) => {
                if (url.fileType === 'video') {
                  return {
                    url: url.postUrl,
                    sourceUrl: url.fileUrl,
                  };
                }
                return {
                  url: url.fileUrl,
                  sourceUrl: url.fileUrl,
                };
              })
            : '',
        };
      }
      return { ...ele };
    });

  const titleShow = ref(title !== '');

  const imageRef = ref(null);

  const handlePreview = (file: any) => {
    window.open(file.sourceUrl);
  };
</script>
<style lang="less" scoped>
  .card-display-title {
    margin: 56px 0 28px;

    .arco-divider-vertical {
      margin-right: 2px;
      border-left: 1px solid #409eff;
    }
  }

  .card-display-content {
    width: 500px;
    white-space: break-spaces;
    overflow-wrap: anywhere;
    .content-items {
      display: flex;
      .field-wrap {
        flex: 0 0 auto !important;
        width: 140px;
      }
      div:first-child {
        text-align: right;
        flex: 0 0 140px;
        margin-right: 20px;
      }

      div {
        line-height: 28px;
      }

      .img-container {
        margin-top: 13px;
      }
    }
  }
  .sign {
    border: 1px solid #999999;
  }
</style>

<style lang="less">
  .image-modal-body {
    text-align: center;
    .modalImage {
      width: 500px;
      height: 500px;
    }
  }
  .upload-img {
    display: flex;
    flex-wrap: wrap;
    a {
      margin-right: 8px;
      margin-bottom: 8px;
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
  .sign-img {
    border: 1px solid #999999;
    width: 200px;
    height: 100px;
    background-color: #ffffff;
  }
  .sign-list {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    .sign-img {
      position: relative;
      border: 1px solid #999999;
      margin: 0px 10px 10px 0px;
      background-color: #ffffff;
      img {
        width: 200px;
        height: 100px;
      }
    }
  }
</style>

<script lang="ts" setup>
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app";
import { usePageAuth } from "@/hooks/usePageAuth";
import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only";
import { useUserStore } from "@/store";

usePageAuth();
const user = useUserStore();
onLaunch(async () => {});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
@import "sard-uniapp/index.scss";

page,
.sar-portal {
  --sar-primary: #f6631b;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

view,
text,
image,
button,
input,
textarea {
  box-sizing: border-box;
}

button::after {
  border: 0;
}

.hide-scrollbar {
  /* Webkit browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.center {
  align-items: center;
  display: flex;
}
.common_bg {
  flex-shrink: 0;
  background: linear-gradient(180deg, #f8e4db 0%, #faf2ee 100px, #f6f6f6 400px);
}
page,
.sar-portal {
  --sar-swiper-dot-active-bg: #ffffff;
  --sar-swiper-dot-bg: rgba(255, 255, 255, 0.3);
}
</style>

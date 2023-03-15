<template>
  <div class="homepage">
    <HomeSwiper :banner="data.banner"></HomeSwiper>
    <div class="live">
      <h1>乐享生活100+</h1>
      <div class="live-list">
        <div class="live-item" v-for="index in 10" v-if="data.sports.length!==0">
          <div class="live-btn">
            <img 
            :src="data.sports[index].menuThumbnail" 
            :alt="data.sports[index].displayName">
            <h3>{{data.sports[index].displayName}}</h3>
          </div>
        </div>
        <a-button type="primary" size="large" @click="router.push('/product')">立即享受生活</a-button>
      </div>
    </div>

  </div>
</template>

<script setup>
import HomeSwiper from "./Home/HomeSwiper.vue";
import * as api from "../api/index";
import { reactive } from "vue";
import { useRouter } from "vue-router";
// 设置异步请求后台api
let result = await api.getHomepage();
const router = useRouter();

// 响应式对象
const data = reactive({ banner: result.banner, sports: result.sports });
console.log(result);
</script>
<style lang="less" scoped>
.homepage {
  padding-top: 46px;
  height: 575px;
  position: relative;
}

.live {
  width: 1200px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 40px;
  h1 {
    font-size: 30px;
  }

  .live-list {
    display: flex;
    flex-wrap: wrap;
    .live-item {
      width: 240px;
    }
    .live-btn {
      display: flex;
      height: 73px;
      width: 200px;
      background-color: #fff;
      border-radius: 8px 8px 25px 8px;
      margin-bottom: 30px;
      box-shadow: 5px 5px 5px #ccc;
      align-items: center;
      justify-content: center;
      position: relative;
      img {
        position: absolute;
        width: 80px;
        height: 80px;
        left: -15px;
        top: -15px;
      }
      h3 {
        font-weight: 900;
        font-size: 20px;
      }
    }
  }
}
</style>


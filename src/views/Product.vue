<template>
  <div class="loading" v-show="data.isLoading">
    <Loading progress="data.progess"></Loading>
  
  </div>
  <div class="product" v-show="!data.isLoading" id="product">
    <!-- v-if判断初始值存不存在，避免一开始没有初始值报错
        v-for循环渲染-->
    <div class="desc"
    :class="{ active: data.descIndex == i }"
    v-if="data.products[data.pIndex]"
      v-for="(desc, i) in data.products[data.pIndex].desc">
      <h1 class="title">{{desc.title}}</h1>
      <p class="content">{{desc.content}}</p>
    </div>
    <div class="prod-list" :class="{hidden:store.state.isFullscreen}">
      <!-- 两边白色展示栏 -->
      <h1><SketchOutlined></SketchOutlined>产品推荐</h1>
      <div class="products">
        <div class="prod-item" 
        :class="{active:pI == data.pIndex}"
        v-for="(prod,pI) in data.products" @click="changeMode(prod,pI)">
          <div class="prod-title">
            {{prod.title}}
          </div>
          <div class="img">
            <img :src="prod.imgsrc" :alt="prod.title">
          </div>
          <!-- 阻止向上传递 -->
          <a-button type="primary" block @click.stop="addBuycart(prod)">
            <template #icon>
              <ShoppingCartOutlined></ShoppingCartOutlined>
            </template>
            加入购物车
          </a-button>
 
        </div>
      </div>
    </div>
    <div class="scene-list " :class="{hidden:store.state.isFullscreen}">
      <h3><RadarChartOutlined></RadarChartOutlined>切换使用场景</h3>

      <div class="scenes">
        <div class="scene-item" 
        :class="{active:index == data.sceneIndex}"
        v-for="(scene,index) in data.scenes" @click="changeHdr(scene,index)">
          <img :src="`./files/hdr/${scene}.jpg`" :alt="scene">
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import Loading from "../components/Loading.vue";
import {
  SketchOutlined,
  RadarChartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons-vue";
import {useRoute} from "vue-router";
import {onMounted,reactive} from "vue"
import * as api from "../api/index.js"
import {useStore} from "vuex"
import Base3d from "../utils/Base3d";
const route = useRoute();
const store = useStore();
console.log(route);
const data = reactive({
  products:[],
  isLoading:true,
  scenes:[],
  pIndex:0,
  sceneIndex:0,
  base3d:{},
  descIndex:0,
  progress:0,
});
onMounted(async ()=>{
  let result = await api.getProducts();
  data.isLoading = false;
  data.products = result.list;
  data.scenes = result.hdr;
  data.base3d = new Base3d("#product");
  data.base3d.onProgress((e)=>{
    let progressNum = e.loaded / e.total;
    progressNum = progressNum.toFixed(2)*100;
    data.progress = progressNum;

  });

  
});
function changeMode(prod,pI){
  data.pIndex = pI;
  console.log('PI:',pI);
  data.base3d.setModel(prod.modelName);

}
function changeHdr(scene,index){
  data.sceneIndex = index;
  data.base3d.setEnvMap(scene);
}

// 加入购物车按钮事件
function addBuycart(prod){
  let product = {...prod,num:1};
  let index = 0;
  // 判断是否重复点击，逻辑就是判断点击的id和购物车列表中有无相同
  let isExist = store.state.buycarts.some((item,i)=>{
    if(product.id == item.id){
      
      index = i;
      
      return true;
    }else{
      return false;
    }

  });
  // 相同的话直接执行数量增加事件
  if(isExist){
    store.commit("addBuycartsNum",index);
    

  }else{
    // 不相同则新建
    store.commit("addBuycarts",product);

  }
  
}
// 控制鼠标滚动
window.addEventListener('mousewheel',(e)=>{
  if(e.deltaY>0){
    store.commit('setFullscreen',true);

  }
  if(e.deltaY<0){
    store.commit('setFullscreen',false);

  }

});
window.addEventListener('mousewheel',(e)=>{
  let duration = data.base3d.animateAction._clip.duration;
  let time = data.base3d.animateAction.time;
  let index = Math.floor(time / duration * 4);
  data.descIndex = index;
  

});

</script>

<style lang="less" scoped>
.desc{
  position: fixed;
  z-index: 100000;
  background-color: rgba(255, 255, 255, 0.5);
  width: 600px;
  top: 100px;
  left: 50%;
  margin-left: -300px;
  transition: all 0.5s;
  transform: translate(-100vw,0);
  padding: 15px;
}
.desc.active{
  transform: translate(0,0);
}
.prod-list{
  width: 300px;
  height: 100vh;
  padding: 60px 0 0;
  position: fixed;
  z-index: 100000;
  transition: all 0.5s;
  background-color: rgba(255, 255, 255, 0.8);
  left: 0;
  top: 0;
  h1{
    font-size: 20px;
    font-weight: 900;
    padding: 10px 25px 0;
  }
  .products{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .prod-item{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 250px;
      background-color: #fff;
      border-radius: 20px;
      overflow: hidden;
      margin: 10px 0;
      box-shadow: 5px 5px 10px #666;
      transition: all 0.3s;
      &.active{
        box-shadow: 5px 5px 10px #666,0 0 20px red;

      }
      &:hover{
      transform: translate(0px,-5px);
      box-shadow: 5px 5px 10px #666,0 0 20px orange;
      // background-color: orange ;
    }
    img{
      width: 190px;
    }
    .prod-title{
      padding: 0 20px;
    }

    }

  }

}
.prod-list.hidden{
  transform: translate(-100%,0);
}
.scene-list{
  width: 300px;
  height: 100vh;
  padding: 60px 0 0;
  position: fixed;
  z-index: 100000;
  transition: all 0.5s;
  background-color: rgba(255, 255, 255, 0.8);
  right: 0;
  top: 0;
  h3{
    font-size: 20px;
    font-weight: 900;
    padding: 0 30px;
  }
  .scenes{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .scene-item{
    padding: 6px 0;
    &.active{
        box-shadow: 5px 5px 10px #666,0 0 20px red;

      }
    img{
      width: 250px;
      border-radius: 10px;
      box-shadow: 5px 5px 10px #666;
      transition: all 0.3s;
      &:hover{
        transform: translate(0px, -5px);
        box-shadow: 5px 5px 10px #666,0 0 20px orange;
      }
    }
  }

}
.scene-list.hidden{
  transform: translate(100%,0);

}

</style>
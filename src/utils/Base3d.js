// import * as THREE from "three"
// import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
// // 导入轨道控制器
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// class Base3d{
//   constructor(selector){
//     this.container = document.querySelector(selector);
//     this.camera;
//     this.scene;
//     this.renderer;
//     this.init();
//   }
//   init(){
//     // 初始化场景
//     this.initScene();
//     // 初始化摄像头
//     this.initCamera();

//     //渲染器初始化
//     this.initRenderer();
//         // 控制器
//         this.initControls();
//   }
// initScene() {
//     this.scene = new THREE.Scene();
//     this.setEnvMap("000");
//   }
//   initCamera() {
//     this.camera = new THREE.PerspectiveCamera(
//       45,
//       window.innerWidth / window.innerHeight,
//       0.25,
//       200
//     );
//     this.camera.position.set(-1.8, 0.6, 2.7);
//   }
//   initRenderer() {
//     this.renderer = new THREE.WebGLRenderer({ antialias: true });
//     // 设置屏幕像素比
//     this.renderer.setPixelRatio(window.devicePixelRatio);
//     // 渲染的尺寸大小
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//     // 色调映射
//     this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     this.renderer.toneMappingExposure = 3;
//     this.container.appendChild(this.renderer.domElement);
//   }
//   setEnvMap(hdr) {
//     new RGBELoader().setPath("./files/hdr/").load(hdr + ".hdr", (texture) => {
//       texture.mapping = THREE.EquirectangularReflectionMapping;
//       this.scene.background = texture;
//       this.scene.environment = texture;
//     });
//   }
//   render() {
//     var delta = this.clock.getDelta();
//     this.mixer && this.mixer.update(delta);
//     this.renderer.render(this.scene, this.camera);
//   }
//   animate() {
//     this.renderer.setAnimationLoop(this.render.bind(this));
//   }
//   initControls() {
//     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//   }
//   // 

// }

// export default Base3d;
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// 导入控制器，轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入模型解析器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class Base3d {
  constructor(selector, onFinish) {
    this.container = document.querySelector(selector);
    this.camera;
    this.scene;
    this.renderer;
    this.model;
    this.panzi;
    this.animateAction;
    this.clock = new THREE.Clock();
    this.onFinish = onFinish;
    this.init();
    this.animate();
    this.progressFn;
  }
  onProgress(fn) {
    this.progressFn = fn;
  }
  init() {
    //   初始化场景
    this.initScene();
    // 初始化相机
    this.initCamera();

    // 初始化渲染器
    this.initRenderer();
    // 控制器
    // this.initControls();
    // 添加物体
    this.addMesh();

    // 监听场景大小改变，调整渲染尺寸
    window.addEventListener("resize", this.onWindowResize.bind(this));

    // 监听滚轮事件
    window.addEventListener("mousewheel", this.onMouseWheel.bind(this));
  }
  initScene() {
    this.scene = new THREE.Scene();
    this.setEnvMap("000");
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.25,
      200
    );
    this.camera.position.set(-1.8, 0.6, 2.7);
  }
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // 设置屏幕像素比
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // 渲染的尺寸大小
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // 色调映射
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 3;
    this.container.appendChild(this.renderer.domElement);
  }
  setEnvMap(hdr) {
    new RGBELoader().setPath("./files/hdr/").load(hdr + ".hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.background = texture;
      this.scene.environment = texture;
    });
  }
  render() {
    var delta = this.clock.getDelta(); //获取帧之间的时间差，便于更新
    this.mixer && this.mixer.update(delta); //混合循环机制中更新混合器，保证后续展示动画执行
    this.renderer.render(this.scene, this.camera);
  }
  animate() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  setModel(modelName){
    return new Promise((resolve,reject) => {
      const loader = new GLTFLoader().setPath("files/gltf/");
      loader.load(modelName,(gltf)=>{
        this.model&&this.model.removeFromParent();
        
        this.model = gltf.scene.children[0]; //子元素的第一个就是模型
        if('bag2.glb'==modelName&&!this.panzi){
          // this.panzi = gltf.scene.children[5];
          
          // this.scene.add(this.panzi)
          this.scene.add(gltf.scene);
          // 修改摄像头为模型摄像头
          this.camera = gltf.cameras[0]
          // 调用动画
          this.mixer = new THREE.AnimationMixer(gltf.scene.children[1]); //动画混合器，播放动画
          this.animateAction = this.mixer.clipAction(gltf.animations[0]); //调度加载动画
          // 设置动画播放时长
          this.animateAction.setDuration(20).setLoop(THREE.LoopOnce); //设置播放20s，只播放一次
          // 设置播放完动画后停止
          this.animateAction.clampWhenFinished = true;



          // 设置灯光
          this.spotlight1 = gltf.scene.children[2].children[0];
          this.spotlight1.intensity = 1;
          this.spotlight2 = gltf.scene.children[3].children[0];
          this.spotlight2.intensity = 1;
          this.spotlight3 = gltf.scene.children[4].children[0];
          this.spotlight3.intensity = 1;

          
        }
        this.scene.add(this.model);
        resolve(this.modelName+"模型添加成功");

      },(e)=>{
        // 模型加载进度
        this.onProgress(e);
      });
      
    });


  }
  async addMesh(){
    let res = await this.setModel("bag2.glb"); //添加物体下面的玻璃展台
    this.onFinish(res);
  }
  onWindowResize() {
    this.camera.aspect = window.innerWidth/window.innerHeight; //相机视口随窗口变换
    this.camera.updateProjectionMatrix(); //更新投影矩阵
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    // this.render();
  }
  onMouseWheel(e) {
    // console.log(this.animateAction);
    // 设置播放速度,先监听滚轮方向
    let timeScale = e.deltaY > 0 ? 1 : -1;
    this.animateAction.setEffectiveTimeScale(timeScale);
    this.animateAction.paused = false;
    // 播放动画
    this.animateAction.play();
    // 防抖
    if(this.timeoutid){
      clearTimeout(this.timeoutid);
    }
    this.timeoutid = setTimeout(()=>{
      this.animateAction.halt(0.5);
    },300)
    console.log(this.timeoutid);
  }
}

export default Base3d;

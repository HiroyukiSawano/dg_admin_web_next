<template>
  <div class="el-page">
    <el-card>
      <template #header>
        <div class="el-card__title">旋转球体特效</div>
      </template>
      <div class="sphere-container">
        <div class="sphere" id="sphere"></div>
      </div>

    </el-card>
    <el-card>
      <template #header>
        <div class="el-card__title">旋转大楼特效</div>
      </template>
      <ul>
        <li><a href="#"><em>40</em><span>国国国国国</span></a></li>
        <li><a href="#"><em>30</em><span>国国国国国</span></a></li>
        <li><a href="#"><em>20</em><span>国国国国国</span></a></li>
        <li><a href="#"><em>10</em><span>国国国国国</span></a></li>
        <li></li>
    </ul>

    </el-card>
  </div>
</template>
<script setup>
import { onMounted, nextTick } from 'vue'

defineOptions({
  value: 'effectSphere3D',
})
onMounted(async () => {
  await nextTick()
  // 动态生成球体表面的小方块
  const sphere = document.getElementById('sphere');
  const radius = 150;
  const cubeSize = 4;
  const numCubes = 1000; // 调整这个数值来改变球体的密度

  for (let i = 0; i < numCubes; i++) {
      const cube = document.createElement('div');
      cube.className = 'cube';

      // 使用球面坐标生成点
      const phi = Math.acos(-1 + (2 * i) / numCubes);
      const theta = Math.sqrt(numCubes * Math.PI) * phi;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      cube.style = {}
      // cube.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
      // cube.style.width = '4px';
      // cube.style.height = '4px';
      Object.assign(cube.style, {
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
        position: 'absolute',
        width: '4px',
        height: '4px',
        background: '#00ff00',
        transformStyle: 'preserve-3d',
      });

      // 设置随机颜色
      const hue = Math.floor(Math.random() * 360);
      cube.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

      sphere.appendChild(cube);
  }
})
</script>

<style lang="scss" scoped>
.el-page {
  height: 100%;
}
:deep(.el-card) {
  height: 100%;
}
.sphere-container {
    position: relative;
    width: 320px;
    height: 320px;
    transform-style: preserve-3d;
    animation: rotate 20s infinite linear;
}

@keyframes rotate {
    from { transform: rotateX(0deg) rotateY(0deg); }
    to { transform: rotateX(360deg) rotateY(360deg); }
}

.sphere {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-style: preserve-3d;
    transform: translate(-50%, -50%);
}

/* 球体的几何结构 */
.cube:nth-child(1) { transform: translateZ(150px); }
.cube:nth-child(2) { transform: translateZ(140px) rotateY(90deg); }
.cube:nth-child(3) { transform: translateZ(130px) rotateY(180deg); }
.cube:nth-child(4) { transform: translateZ(120px) rotateY(270deg); }
.cube:nth-child(5) { transform: translateY(150px) rotateX(90deg); }
.cube:nth-child(6) { transform: translateY(-150px) rotateX(-90deg); }
/* 更多立方体可以添加到这里 */




 ul,
        li {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        ul {
            /* 设置中心线 及高度*/
            width: 1px;
            height: 470px;
            margin: 70px auto;
            background-color: #0bb20c;
            /* 3d场景 */
            transform-style: preserve-3d;
            /* 动画 */
            animation: Rotate 15s linear infinite;



        }

        @keyframes Rotate {

            /* rotateX为上下视角调整  rotateY为旋转角*/
            0% {
                transform: rotateX(-10deg) rotateY(0deg)
            }

            100% {
                transform: rotateX(-10deg) rotateY(360deg)
            }

        }

        ul>li {
            position: absolute;
            bottom: 0;
            left: -100px;
            /* 此处-100px为了中心线局中 */
            width: 200px;
            height: 200px;
            border-top-right-radius: 100%;
            background-color: rgba(0, 0, 0, .25);
            border: 1px solid red;

        }

        ul>li:nth-child(1) {
            height: 400px;
            /* rotateY为360除以扇面哥说依次增加     translateZ为0使中心相交增大的话会使扇面分散   translateX为了边缘沿中轴旋转将相交点偏移为宽度200的一半 */
            transform: rotateY(90deg) translateZ(0px) translateX(100px);
        }

        ul>li:nth-child(2) {
            height: 300px;
            transform: rotateY(180deg) translateZ(0px) translateX(100px);
        }

        ul>li:nth-child(3) {
            height: 200px;
            transform: rotateY(270deg) translateZ(0px) translateX(100px);
        }

        ul>li:nth-child(4) {
            height: 100px;
            transform: rotateY(360deg) translateZ(0px) translateX(100px);
        }

        /* 底部圆盘 */
        ul>li:nth-child(5) {
            width: 500px;
            height: 500px;
            left: -250px;
            border-radius: 100%;
            transform: rotateX(-90deg) translateZ(250px);
        }

        /* 文本内容 */
        ul>li>a {
            display: inline-block;
            position: absolute;
            top: 0;
            right: -50px;
            text-align: center;
        }

        ul>li>a>em {
            font-style: normal;
        }

        ul>li>a>span {
            display: block;
        }
</style>

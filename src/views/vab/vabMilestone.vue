<template>
  <div>
    <el-card :header="$t('ec.menu.name.vabMilestone')">
      <div class="ec-milestone-group" :style="`padding:24px ${100 / segment / 4}%`">
        <div class="ec-milestone" v-for="row, row_index in datas" :key="row_index">
          <div class="ec-milestone-item" v-for="column, column_index in row" :key="column_index" :style="styleColumn(column)">
            <div class="ec-milestone-item__tail" :style="styleTail(row, row_index, column, column_index)"></div>
            <div class="ec-milestone-item__arrow" :style="styleArrow(column)"></div>
            <div class="ec-milestone-item__icon"></div>
            <div class="ec-milestone-item__content">
              <div class="ec-milestone-item__title">{{column.title}}</div>
              <div class="ec-milestone-item__description">{{column.description}}</div>
            </div>
            <div class="ec-milestone-item__action">
            </div>
          </div>
          <div v-if="row_index < datas.length - 1" class="ec-milestone-seam" :style="styleSeam(row, row_index)"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { chunk } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/modules/systemStore'
defineOptions({ name: 'vabMilestone' })
const milestones = ref([])

const { breakpoint, language } = storeToRefs(useSystemStore())
console.log(language.value)
console.log(breakpoint.value)
const segment = computed(() => {
  const gird = { xl: 6, lg: 4, md: 3, sm: 2, xs: 1, es: 1 }
  return gird[breakpoint.value] || 6
})
// const datas = computed(()=> {
//   const row = Math.ceil(milestones.value.length / segment.value)
//   const groups = []
//   for (let i = 0; i < row; i++) {
//     groups.push(milestones.value.slice(i * segment.value, (i + 1) * segment.value))
//   }
//   return groups
// })
const datas = computed(() => {
  return chunk(milestones.value, segment.value)
})
const styleColumn = (column) => {
  return `flex: 0 0 ${100 / segment.value}%; max-width: ${100 / segment.value}%; border-color: ${column.color};`
}
const styleArrow = (column) => {
  return `background-image: linear-gradient(135deg, ${column.color} 0%, transparent 50%);`
}
const styleTail = (row, row_index, column, column_index) => {
  const index = row_index % 2 === 0 ? column_index + 1 : column_index - 1
  const start_color = column.color
  const end_color = row[index] ? row[index].color : column.color
  return `background-image: linear-gradient(90deg, ${start_color} 50%, ${end_color} 100%);`
}
const styleSeam = (row, row_index) => {
  const start_color = row.at(-1).color
  const end_color = datas.value[row_index + 1] ? datas.value[row_index + 1][0].color : start_color
  const seam_width = (100 / segment.value) * 0.15
  const seam_direction = row_index % 2 === 0 ? 'left' : 'right'
  return `
    ${seam_direction}: 100%;
    border-${seam_direction}: 0;
    border-top-${seam_direction}-radius: 0;
    border-bottom-${seam_direction}-radius: 0;
    width: ${seam_width}%;
    background-image: linear-gradient(180deg, #fff, #fff), linear-gradient(180deg, ${start_color}, ${end_color});
  `
}
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
onMounted(() => {
  if (language.value === 'en') {
    milestones.value = [
      { id: '1', title: 'Earth Birth', description: 'At the beginning of its birth, the primitive Earth was covered in high-temperature magma, similar to volcanic eruptions.', color: getRandomColor() },
      { id: '2', title: 'Primitive Life Birth', description: 'The characteristic of primitive life is the ability to metabolize and reproduce through genetics or variation', color: getRandomColor() },
      { id: '3', title: 'Blue Algae Birth', description: 'Scientists have studied the oldest fossils and found that the primitive Earth had extremely high temperatures.', color: getRandomColor() },
      { id: '4', title: 'Neoproterozoic Ice Age', description: 'This period is currently the earliest known Great Ice Age.', color: getRandomColor() },
      { id: '5', title: 'Eukaryotic Organisms', description: 'Prokaryotes only have cell membranes, while eukaryotes also have organelle membranes.', color: getRandomColor() },
      { id: '6', title: 'Multicellular Organisms', description: 'Curly algae lived in the northern United States today, while this newly discovered fossil species lived in Gabon.', color: getRandomColor() },
      { id: '7', title: 'Pre Cambrian Ice Age', description: 'At that time, many places on Earth were covered with thick ice layers, with the thickest reaching several meters or even thousands of meters.', color: getRandomColor() },
      { id: '8', title: 'Eukaryotic Algae Diversity', description: 'Due to the genetic variability provided by sexual reproduction, it is possible to further increase biodiversity.', color: getRandomColor() },
      { id: '9', title: 'Ice Age', description: 'The surface of the Earth is almost covered with ice and snow, and life is mainly in the form of microorganisms.', color: getRandomColor() },
      { id: '10', title: 'Awakening Cold Environment', description: 'Most of the surface ocean is oxidized, while the subsurface is mainly oxygen deficient seawater.', color: getRandomColor() },
      { id: '11', title: 'Large Multicellular Life', description: 'The oldest and largest benthic multicellular algal community discovered in the pre Cambrian period.', color: getRandomColor() },
      { id: '12', title: 'Cambrian Explosion', description: 'Over 20 million years ago, species rapidly originated and emerged; Arthropods, Brachiopods, Demodex,', color: getRandomColor() },
      { id: '13', title: 'Trilobite Era', description: 'The latest trilobite disappeared during the mass extinction of the Permian period 250 million years ago.', color: getRandomColor() },
      { id: '14', title: 'First Vertebrate Species', description: 'Jawless fish have a wide mouth and a bony plate on their head, which may be a power generating organ.', color: getRandomColor() },
      { id: '15', title: 'Early Paleozoic Great Ice Age', description: 'Ice moraines are found in France, Spain, Canada, North America, North Africa, and the Soviet Union', color: getRandomColor() },
      { id: '16', title: 'Silurian Mass Extinction', description: 'Causing the Earth to enter the Andean Sahara Ice Age.', color: getRandomColor() },
      { id: '17', title: 'Terrestrial Vertebrates', description: 'Plants gradually grow, and terrestrial life becomes more complex.', color: getRandomColor() },
      { id: '18', title: 'Rooted Plant Born', description: 'In the Late Carboniferous, plants formed root systems and moved inland, leading to a further increase in atmospheric oxygen content.', color: getRandomColor() },
      { id: '19', title: 'Late Paleozoic Great Ice Age', description: 'The Late Paleozoic Great Ice Age was the largest series of multi episode glacial events since the Phanerozoic era.', color: getRandomColor() },
      { id: '20', title: 'Plants Nocturnal Sensitivity', description: 'The bite marks are symmetrically arranged on both sides of the leaf veins, and the closer they are to the midrib, the more obvious the difference in bite marks.', color: getRandomColor() },
      { id: '21', title: 'Earth Reshuffle', description: 'Many terrestrial plants have become extinct, leading to a decrease in oxygen concentration.', color: getRandomColor() },
      { id: '22', title: 'Dinosaurs', description: 'Million years ago in the Triassic period, it perished in the late Cretaceous period about 65 million years ago.', color: getRandomColor() },
      { id: '23', title: 'Birds', description: 'Birds have developed a series of morphological structures and physiological functions adapted to flying life during their long evolutionary process.', color: getRandomColor() },
      { id: '24', title: 'Flowering Plants', description: 'Flowering plants may have originated in the Jurassic period or even earlier, millions of years earlier than the recognized oldest fossil record.', color: getRandomColor() },
      { id: '25', title: 'Dinosaurs Extinction', description: 'Meteorites impact the Earth, causing many species of life to appear and then disappear.', color: getRandomColor() },
      { id: '26', title: 'Quaternary Glacial Maximum', description: 'The Quaternary glacial period is shorter than the previous two, and the current climate is colder than many periods in history.', color: getRandomColor() },
    ]
  } else {
    milestones.value = [
      { id: '1', title: '地球诞生', description: '原始地球在诞生之初，表面是高温的岩浆，类似于火山喷发。', color: getRandomColor() },
      { id: '2', title: '原始生命诞生', description: '原始生命的特点是能够新陈代谢，并且可以繁殖遗传或变异', color: getRandomColor() },
      { id: '3', title: '蓝藻诞生', description: '科学家研究最古老的化石，得出原始地球温度极高。', color: getRandomColor() },
      { id: '4', title: '新太古代大冰期', description: '这段时间是目前已知最早的大冰期。', color: getRandomColor() },
      { id: '5', title: '真核生物诞生', description: '原核生物只有细胞膜，而真核生物，还有细胞器膜等。', color: getRandomColor() },
      { id: '6', title: '简单多细胞生物诞生', description: '卷曲藻生活在今天美国北部地区，而这一新发现化石的物种生活在加蓬。', color: getRandomColor() },
      { id: '7', title: '前寒武纪大冰期', description: '当时地球上的许多地方都覆盖着厚厚的冰层，最厚的冰层达几百米甚至上千米。', color: getRandomColor() },
      { id: '8', title: '真核藻类多样性', description: '由于有性繁殖提供了遗传变异性，从而有可能进一步增加了生物的多样性。', color: getRandomColor() },
      { id: '9', title: '冰河时期', description: '地球表面几乎被冰雪覆盖，生命以微生物的形式为主。', color: getRandomColor() },
      { id: '10', title: '在寒冷的环境中苏醒', description: '表面海洋大部分被氧化，在表面下主要为缺氧的海水。', color: getRandomColor() },
      { id: '11', title: '大型的多细胞生命诞生', description: '在前寒武纪发现的年龄最古老、个体最巨大的底栖多细胞藻类植物群。', color: getRandomColor() },
      { id: '12', title: '寒武纪生命大爆发', description: '在2000多万年，物种迅速起源，出现；节肢动物，腕足动物，蠕形动物，', color: getRandomColor() },
      { id: '13', title: '三叶虫时代', description: '最晚的三叶虫于二亿五千万年前二叠纪结束时的生物集群灭绝中消失。', color: getRandomColor() },
      { id: '14', title: '第一种脊椎动物', description: '无颚鱼类嘴很宽，头部有骨板，或许是发电器官。', color: getRandomColor() },
      { id: '15', title: '早古生代大冰期', description: '冰碛在法国，西班牙，加拿大，北美，北非和苏联等地', color: getRandomColor() },
      { id: '16', title: '志留纪大规模灭绝', description: '导致地球进入安第斯-撒哈拉冰河时期。', color: getRandomColor() },
      { id: '17', title: '陆地脊椎动物诞生', description: '植物逐步生长，陆地生命变得复杂。', color: getRandomColor() },
      { id: '18', title: '有根植物诞生', description: '晚石炭世，植物形成根系，向内陆移动，大气氧含量再次增加。', color: getRandomColor() },
      { id: '19', title: '晚古生代大冰期', description: '晚古生代大冰期是显生宙以来规模最大的一系列多幕式的冰河事件。', color: getRandomColor() },
      { id: '20', title: '植物的感夜性出现', description: '咬痕呈对称状排列于叶脉两侧，离中脉越近，咬痕差异越明显。', color: getRandomColor() },
      { id: '21', title: '地球大洗牌', description: '许多陆地植物灭绝，氧气浓度降低。', color: getRandomColor() },
      { id: '22', title: '恐龙诞生', description: '恐龙最早出现在2.4亿年前的三叠纪，灭亡于约6500万年前的白垩纪晚期', color: getRandomColor() },
      { id: '23', title: '鸟类诞生', description: '鸟类在漫长的演化过程中产生了一系列适应于飞翔生活的形态结构和生理机能。', color: getRandomColor() },
      { id: '24', title: '开花植物诞生', description: '开花植物可能起源于侏罗纪甚至更早时期，比公认的最古老的化石记录要早数百万年。', color: getRandomColor() },
      { id: '25', title: '恐龙灭绝', description: '陨石撞击地球在地球上，曾经有很多生物种类出现后又消失了。', color: getRandomColor() },
      { id: '26', title: '第四纪大冰期', description: '第四纪大冰期比前两次时间要短，现在的气候也比历史上很多时期要寒冷', color: getRandomColor() },
    ]
  }
})
</script>
<style lang="scss" scoped>
$--ec-milestone-border-width: 5px;
.ec-milestone-group {
  padding: 50px 0;
  .ec-milestone {
    position: relative;
    display: flex;
    width: 100%;

    .ec-milestone-item {
      display: flex;
      flex-direction: column;
      position: relative;
      flex: 1;
      padding: $--ec-milestone-border-width * 8 $--ec-milestone-border-width * 2 $--ec-milestone-border-width * 7 $--ec-milestone-border-width * 2;
      text-align: center;
      .ec-milestone-item__title {
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 500;
      }
      .ec-milestone-item__description {
        font-size: 12px;
        color: #919398;
      }
      .ec-milestone-item__tail {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        transform: translate(0,-50%);
        height: $--ec-milestone-border-width;
      }
      .ec-milestone-item__icon {
        box-sizing: content-box;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%,-50%);
        width: $--ec-milestone-border-width * 1.5;
        height: $--ec-milestone-border-width * 1.5;
        border-width: $--ec-milestone-border-width;
        border-style: solid;
        border-color: inherit;
        border-radius: 100%;
        background-color: #fff;
        box-shadow: 0 0 0 $--ec-milestone-border-width #fff;
      }
      .ec-milestone-item__arrow {
        position: absolute;
        top: $--ec-milestone-border-width * 3.5;
        left: 50%;
        transform: translate(-50%, 0%) rotate(45deg);
        width: $--ec-milestone-border-width * 3.5;
        height: $--ec-milestone-border-width * 3.5;
      }
      .ec-milestone-item__action {
        margin-top: auto;
      }
    }
    .ec-milestone-seam {
      position: absolute;
      top: -$--ec-milestone-border-width * 0.5;
      bottom: -$--ec-milestone-border-width * 0.5;
      border: $--ec-milestone-border-width solid transparent;
      border-radius: 10000px;
      background-clip: content-box, border-box;
      background-origin: content-box, border-box;
    }
  }

  .ec-milestone:nth-child(even) {
    flex-direction: row-reverse;
  }
  .ec-milestone:first-child .ec-milestone-item:first-child::before,
  .ec-milestone:nth-child(even):last-child .ec-milestone-item:last-child::before,
  .ec-milestone:nth-child(odd):last-child .ec-milestone-item:last-child::before {
    content: "";
    position: absolute;
    top: 0;
    transform: translate(0%, -50%);
    width: 100%;
    height: 6px;
    z-index: 2;
  }
  .ec-milestone:first-child .ec-milestone-item:first-child::before,
  .ec-milestone:nth-child(even):last-child .ec-milestone-item:last-child::before {
    left: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 50%);
  }
  .ec-milestone:nth-child(odd):last-child .ec-milestone-item:last-child::before {
    right: 0;
    background: linear-gradient(-90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 50%);
  }
}
</style>

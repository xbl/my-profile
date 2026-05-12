<script setup lang="ts">
import { computed } from 'vue'
import pptManifest from '@/config/ppt-manifest.json'

type SkillGroup = {
  icon: string
  title: string
  items: string[]
}

type Experience = {
  title: string
  period: string
  role?: string
  result?: string
  bullets: string[]
}

type Certificate = {
  title: string
  src: string
  className?: string
}

const pptIcons = computed(() => pptManifest.icons)

function iconSrc(name: string | null | undefined): string {
  if (!name) return ''
  return `/ppt-assets/${name}`
}

function contactIconAt(index: number): string {
  const list = pptIcons.value.contact
  return iconSrc(list?.[index])
}

function skillIconAt(index: number): string {
  const list = pptIcons.value.skillSections
  return iconSrc(list?.[index])
}

const influenceIconSrc = computed(() => iconSrc(pptIcons.value.influence))
const headerWorkSrc = computed(() => iconSrc(pptIcons.value.headerWorkTeal))
const headerEarlySrc = computed(() => iconSrc(pptIcons.value.headerEarlyPurple))
const headerCertSrc = computed(() => iconSrc(pptIcons.value.headerCertPurple))

const contactItems = [
  { icon: '☎', text: '+86 158 1115 0519' },
  { icon: '✉', text: 'blxie@Inspiregroup.com' },
  { icon: '✹', text: '公众号：谢小呆的碎碎念' },
]

const skillGroups: SkillGroup[] = [
  {
    icon: '▣',
    title: '咨询技能',
    items: [
      '科技组织诊断评估',
      '问题分析和解构能力',
      '组织转型框架、演进路线与方案设计',
      '具备结构化思维和战略性思维',
      '优秀的沟通表达，培训、演讲能力',
      '出色的工作汇报、PPT呈现能力',
      '转型方法论的积累与总结',
      '与他人/客户建立良好合作关系',
      '保持行业洞察力、持续学习能力',
    ],
  },
  {
    icon: '✣',
    title: '基础技能',
    items: [
      '开发方法：AI4SE、DevOps、敏捷、精益',
      '研发效能指标框架设计',
      '工程实践：SDD、持续集成、整洁代码、主干开发、重构、前后端 TDD 等',
      '编程语言：Java、JavaScript 等开发语言',
      '工具平台：Jenkins、Gitlab、SonarQube、Docker 等',
      '其他：DDD 微服务设计、Event Storming 建模',
    ],
  },
]

const influenceItems = [
  '中国电子学会《BizDevSecOps标准》核心专家成员',
  '中国信息通信研究院《研发运营一体化（DevOps）能力成熟度模型 第2部分：敏捷开发管理》标准及评估指南制定专家',
  '公开演讲：QECon《平台工程 2.0：面向 AI 构建下一代 DevOps 平台》、腾讯云TVP《大模型时代的新质生产力》、DevOpsDays《BizDevSecOps 行业生态建设和发展趋势》、Qcon《探索软件开发新工序：LLM+赋能研发效能提升》、DevOpsDays《金融企业的DevOps 规模化转型》等',
]

const workExperiences: Experience[] = [
  {
    title: '中国上海银行 – 企业内部 DevOps 产品设计',
    period: '2025.09 – 2026.04',
    role: '专家咨询顾问',
    result: '产出上海银行内部研发流程产品设计',
    bullets: [
      '根据内部研发流程、角色分工进行 DevOps 产品需求分析，产出高阶产品设计；',
      '梳理 DevOps 信息架构；',
      '使用 AI 产出前端可交互的产品原型；',
      '探索 AI 时代的产品设计方法；',
      '产出高阶 AI 时代团队研发流程；',
    ],
  },
  {
    title: 'OOCL 東方海外貨櫃航運有限公司 - 2025上海毕业生训练营',
    period: '2025.08 – 2025.09',
    role: '2025 年毕业生训练营班主任',
    bullets: [
      '为 10 名不同角色（BA、QA、Dev）设计为期 1 个月课程（包括：软件工程知识、团队协作实践、AI Coding、模拟项目演练）；',
      '课程预习材料、培训材料、培训练习及课后作业；',
      '观察学员的学习情况调整课程内容，给予学员反馈评价；',
    ],
  },
  {
    title: '安辉大众 – DevOps Process Engineering',
    period: '2025.03 – 2025.04',
    role: 'DevOps 专家',
    result: '在三家供应商并行服务的复杂场景中脱颖而出，成为客户与供应商双方公认的关键负责人，有效保障了项目整体的平稳推进。',
    bullets: ['DevOps 持续交付能力评估；', '制定 DevOps 改进方案和具体实施举措；'],
  },
  {
    title: '海柔创新 – DevOps 工程能力提升',
    period: '2024.9 – 2024.11',
    role: 'DevOps 专家',
    bullets: ['DevOps 成熟度调研评估；', '制定效能提升改进方案；'],
  },
  {
    title: '中国银河证券 – 研发效能二期-规模化推广',
    period: '2024.07 – 2025.02',
    role: '项目经理',
    result: '建设内部教练体系、建设内部教练晋级机制；内化DevOps 成熟度标准，建立DevOps内审机制，辅导8+项目通过内部3级认证。',
    bullets: ['建立内部教练体系，包含教练等级职责、晋升机制、KPI等；', '规模化推广策略；', '建立内部过级认证机制；'],
  },
  {
    title: '中国上海银行 – DevOps 工具平台规划&设计',
    period: '2023.11 – 2024.07',
    role: '专家顾问',
    bullets: ['研发流程重塑', '建设和梳理研发工艺规范', '设计“里程碑”管理功能的业务流程图和原型图', '制定研发工艺标准等'],
  },
  {
    title: '中国银河证券 – 研发效能提升',
    period: '2023.07 – 2024.03',
    role: '项目经理',
    result: '4个月时间实现3个项目组达到信通院3级标准，三个项目组共 2580 次提交、净增 7.8万行代码、流水线触发 5300余次、生产发布超过45+次、以及 258 次质量红线拦截，组织了 20+ 场培训，引入了 49 项DevOps工程实践，沉淀 15+ 篇以上组织级规范，以及 20 余篇工程实践演示材料，测试报告等文档',
    bullets: ['制定效能提升改进方案和落地计划', '牵引建设测试管理体系', '带领咨询顾问辅导团队，提升团队研发效能', '沉淀研发规范等'],
  },
  {
    title: '中国民生银行 – 敏捷转型二期',
    period: '2023.02 – 2023.10',
    role: '技术侧咨询负责人',
    bullets: ['制定敏捷试点推广策略', '制定敏稳双态的研发模式和协作模式，基于民生特点探索精益模式，并展开试点', '敏捷/精益团队研发效能提升辅导', '制定Tech Lead 胜任力模型和认证答辩机制等'],
  },
  {
    title: '中国国际金融股份有限公司（中金公司） – 研发效能转型规模化',
    period: '2022.02 – 2022.12',
    role: '技术侧咨询负责人',
    result: '共培养了 14 名内部教练，其中达成中级技术教练 2名，初级技术教练 6名，培养中的初级教练6名。培养、认证了 Scrum Master 初级34人，中级3人2023年8月完成内部11个团队研发效能认证',
    bullets: ['制定中金研发效能规模化推广策略', '组建规模化推进小组，提炼 效能提升 课程培训体系', '建设内部Technical Master教练队伍，推进研发效能规模化', '持续优化DevOps工具平台'],
  },
  {
    title: '中国国际金融股份有限公司（中金公司） – 研发效能转型试点',
    period: '2021.08 – 2022.02',
    role: '技术侧咨询负责人',
    result: '6 个团队在2022年通过信通院的DevOps 3级认证，15+ 团队通过内部的敏捷管理3级认证。沉淀了中金从“产品创设”到“运营反馈”端到端的五级成熟度模型，可根据团队特点在评估子域设置不同的得分权重。标杆团队需求交付周期从25天下降至10天，持续集成响应时间从4小时下降至5分钟，编译构建时间从15分钟下降至3分钟，投产频率从2次/月提升至1-2次/周。',
    bullets: ['试点团队提升工程能力，通过信通院DevOps 3级认证', '研发度量体系建设和改进机制', '通过过级完善 DevOps 工具平台，从需求、分支模型、持续集成、自动化部署等', '牵引建设自动化测试队伍', '试点团队工程能力提升，进行工程实践的培训和辅导，解决项目中的实际问题', '根据中金特点，制定中金内部研发体系成熟度'],
  },
  {
    title: '中国工商银行 – 研发效能规模化转型',
    period: '2021.05 – 2022.06',
    role: '研发效能规模化条线负责人',
    result: '协同工行建立效能项目推进组，通过现状调研，输出「4+4+1」研发效能全面提升方案，并沉淀成为 Thoughtworks 内部效能提升的标准框架。覆盖全行科技人员超过1万人，选拔出5类内部教练超过 100+人。年度关键数据需求项开发周期缩短31%，生产投产次数增加了149%，应用达标内部成熟度3级数量增加13倍，生产补丁降低 5%',
    bullets: ['负责工行 研发效能规模化推广条线', '根据工行特点制定研发效能成熟度模型及评估指南', '内部教练体系建设', '课程培训体系建设'],
  },
  {
    title: '广州建设银行网络金融部 – 敏捷转型',
    period: '2021.03 – 2021.04',
    bullets: ['组织团队敏捷及技术培训，如：Scrum、DevOps等', '梳理研发流程、建立规范制度，如：开发规范、测试规范、代码评审规范，前、后端、测试协作规范等', '与团队结对工作，解决工作中的问题，推进技术实践落地'],
  },
  {
    title: '郑州中原银行 – 研发效能转型',
    period: '2020.06 – 2020.12',
    role: '技术侧咨询负责人',
    result: '6个月的时间，需求交付周期从30天降低至9.9 天，研发周期从十几天降低至 7.1天，单元测试覆盖从53%提升至84.2%，接口测试 100% 覆盖，需求吞吐量从15个/月提升至37个/月，生产问题个数一直保持良好状态，Sonar 技术债 2020年 10 底清零。通过信通院持续交付 3 级水平。',
    bullets: ['辅导团队通过信通院 DevOps 3级认证', '制定效能转型策略', '建立度量指标体系，推进度量驱动改进', '依据DevOps 能力模型对团队进行评估，识别痛点，制定提升改进计划', '组织团队DevOps 评级相关技术培训，如：整洁代码、自动化测试、持续集成、自动化部署等', '建立规范制度，如：开发规范、测试规范、代码评审规范，前、后端、测试协作规范等', '提升团队研发效能，推进技术实践落地', '提升组织级 DevOps 平台能力，推动DevOps 平台改进'],
  },
  {
    title: '郑州中原银行 – 敏捷转型',
    period: '2019.05 – 2020.01',
    role: '技术咨询师',
    result: '沉淀中原银行内部的敏捷成熟度模型，并沉淀出标准的敏捷技术实践课程，4个标杆团队从成熟度1级提升至3级。',
    bullets: ['敏捷相关工程实践培训，如：整洁代码、代码评审、自动化测试、测试驱动开发、持续集成等', '根据客户需求及项目现状进行定制化培训', '建立规范制度，如：开发规范、测试规范、代码评审规范，前、后端、测试协作规范等', '提升开发团队的技术能力，推进工程实践的落地', '解决开发团队在落地工程实践中遇到的问题', '在总行组织编程大赛，担任出题人及评委'],
  },
  {
    title: '奔驰戴姆勒',
    period: '2017.09 – 2019.04',
    role: '技术负责人（TL）',
    bullets: ['在项目中发现前端技术陈旧，升级重构困难，提出微前端解决方案，得到客户认可，并成功落地', '为客户培训 Event Storming，提供Event Storming 帮助客户更好的理解领域驱动设计（DDD）', '在项目外得知客户有了解 Service Mesh 的需要，给用户进行了 从0 到 1的培训'],
  },
]

const earlyExperiences: Experience[] = [
  { title: '海海科技（海底捞内部创业）', period: '2014.03–2017.09', role: '技术负责人', bullets: ['组建研发团队', '搭建前后端技术架构', '技术选型', '技术人员招聘、项目管理等'] },
  { title: '海底捞信息部', period: '2013.09–2014.03', role: '技术经理', bullets: ['新应用/系统架构评估', '外部厂商选型', '外包厂商交付物结果验收'] },
  { title: '完美世界-信息部', period: '2011.09–2013.09', role: '初级架构师', bullets: ['新系统技术选型', '技术架构设计', '技术人员招聘'] },
  { title: '美空网', period: '2009–2011', role: '前端开发', bullets: ['前端开发', '网站前端重构', '前端组件化'] },
  { title: '清华大学计算中心', period: '2007–2009', role: '前后端开发', bullets: ['项目进度跟进', '后端开发', '前端页面开发'] },
]

const printResume = () => window.print()

const certificateImages: Certificate[] = [
  { title: '全民数字素养与技能培训基地（华东师范大学）企业讲师', src: '/resume-assets/pdf-image-07-p7.jpeg', className: 'wide' },
  { title: '聘书封面', src: '/resume-assets/pdf-image-06-p7.jpeg', className: 'cover' },
  { title: '凤凰项目沙盘教练', src: '/resume-assets/pdf-image-05-p7.jpeg' },
  { title: 'Exin DevOps Master', src: '/resume-assets/pdf-image-04-p7.jpeg' },
  { title: 'CAC 敏捷教练证书', src: '/resume-assets/pdf-image-03-p7.jpeg' },
  { title: '中国软件行业协会 敏捷教练证书', src: '/resume-assets/pdf-image-02-p7.jpeg', className: 'wide' },
]
</script>

<template>
  <div class="resume-shell">
    <button class="print-button" type="button" @click="printResume">打印 / 导出 PDF</button>

    <section class="page page-cover">
      <div class="cover-corner" />
      <aside class="profile-panel">
        <div class="portrait-frame">
          <img src="/resume-assets/pdf-image-01-p1.jpeg" alt="谢保龙头像" />
        </div>

        <h1>谢保龙</h1>
        <p class="headline">Inspire（前 Thoughtworks 中国区）<br />研发效能业务总监</p>
        <p class="summary">
          17+年软件工程从业经验。带领团队聚焦国内大型客户的 AI4SE、DevOps、敏捷转型工作以及研发效能相关咨询业务。<br />
          服务客户：OOCL、大众安徽、海柔创新、中国工商银行、中国建设银行、中金公司、银河证券、民生银行、上海银行、中原银行、中央国债登记结算有限责任公司等
        </p>

        <ul class="contact-list">
          <li v-for="(item, ci) in contactItems" :key="item.text">
            <span class="contact-icon">
              <img v-if="contactIconAt(ci)" class="contact-icon-img" :src="contactIconAt(ci)" alt="" />
              <span v-else class="contact-fallback">{{ item.icon }}</span>
            </span>
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </aside>

      <main class="cover-main">
        <section v-for="(group, gi) in skillGroups" :key="group.title" class="skill-block">
          <h2>
            <img
              v-if="skillIconAt(gi)"
              class="skill-heading-icon"
              :src="skillIconAt(gi)"
              alt=""
            />
            <span v-else class="skill-heading-fallback">{{ group.icon }}</span>
            {{ group.title }}
          </h2>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </section>
      </main>

      <section class="influence-block">
        <h2>
          <img v-if="influenceIconSrc" class="skill-heading-icon" :src="influenceIconSrc" alt="" />
          <span v-else class="skill-heading-fallback">⚑</span>
          影响力
        </h2>
        <ul>
          <li v-for="item in influenceItems" :key="item">{{ item }}</li>
        </ul>
      </section>
      <span class="page-number">1</span>
    </section>

    <section class="page page-work">
      <div class="decor decor-top" />
      <header class="page-header teal">
        <span class="header-icon">
          <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
          <span v-else>♟</span>
        </span>
        <span>Inspire（前 Thoughtworks 中国区）工作经历</span>
      </header>
      <article v-for="item in workExperiences.slice(0, 5)" :key="item.title" class="experience-item">
        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.period }}</p>
        <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
        <p v-if="item.result" class="result">成果：{{ item.result }}</p>
        <ul>
          <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
      <span class="page-number">2</span>
    </section>

    <section class="page page-work">
      <div class="decor decor-top" />
      <header class="page-header teal">
        <span class="header-icon">
          <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
          <span v-else>♟</span>
        </span>
        <span>Inspire（前 Thoughtworks 中国区）工作经历</span>
      </header>
      <article v-for="item in workExperiences.slice(5, 9)" :key="item.title" class="experience-item">
        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.period }}</p>
        <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
        <p v-if="item.result" class="result">成果：{{ item.result }}</p>
        <ul>
          <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
      <span class="page-number">3</span>
    </section>

    <section class="page page-work compact">
      <div class="decor decor-top" />
      <header class="page-header teal">
        <span class="header-icon">
          <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
          <span v-else>♟</span>
        </span>
        <span>Inspire（前 Thoughtworks 中国区）工作经历</span>
      </header>
      <article v-for="item in workExperiences.slice(9, 12)" :key="item.title" class="experience-item">
        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.period }}</p>
        <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
        <p v-if="item.result" class="result">成果：{{ item.result }}</p>
        <ul>
          <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
      <span class="page-number">4</span>
    </section>

    <section class="page page-work compact">
      <div class="decor decor-top" />
      <header class="page-header teal">
        <span class="header-icon">
          <img v-if="headerWorkSrc" class="header-icon-img" :src="headerWorkSrc" alt="" />
          <span v-else>♟</span>
        </span>
        <span>Inspire（前 Thoughtworks 中国区）工作经历</span>
      </header>
      <article v-for="item in workExperiences.slice(12)" :key="item.title" class="experience-item">
        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.period }}</p>
        <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
        <p v-if="item.result" class="result">成果：{{ item.result }}</p>
        <ul>
          <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
      <span class="page-number">5</span>
    </section>

    <section class="page page-work compact">
      <div class="decor decor-top" />
      <header class="page-header purple">
        <span class="header-icon">
          <img v-if="headerEarlySrc" class="header-icon-img" :src="headerEarlySrc" alt="" />
          <span v-else>♟</span>
        </span>
        <span>早期工作经历</span>
      </header>
      <article v-for="item in earlyExperiences" :key="item.title" class="experience-item">
        <h3>{{ item.title }}</h3>
        <p class="meta">{{ item.period }}</p>
        <p v-if="item.role" class="meta">担任：{{ item.role }}</p>
        <p v-if="item.result" class="result">成果：{{ item.result }}</p>
        <ul>
          <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
      <span class="page-number">6</span>
    </section>

    <section class="page page-certificates">
      <div class="decor decor-top" />
      <div class="decor decor-left" />
      <header class="page-header purple">
        <span class="header-icon">
          <img v-if="headerCertSrc" class="header-icon-img" :src="headerCertSrc" alt="" />
          <span v-else>♙</span>
        </span>
        <span>证书</span>
      </header>
      <div class="certificate-grid">
        <figure v-for="certificate in certificateImages" :key="certificate.src" :class="certificate.className">
          <img :src="certificate.src" :alt="certificate.title" />
          <figcaption>{{ certificate.title }}</figcaption>
        </figure>
      </div>
      <span class="page-number">7</span>
    </section>
  </div>
</template>

<style scoped>
:global(:root) {
  --resume-teal: #073f4d;
  --resume-green: #6fa27b;
  --resume-purple: #685386;
  --resume-ink: #111111;
  --resume-muted: #e9eef0;
}

.resume-shell {
  min-height: 100vh;
  padding: 28px 16px 48px;
  background:
    radial-gradient(circle at 12% 8%, rgba(7, 63, 77, 0.08), transparent 28rem),
    #eef2f4;
}

.print-button {
  position: sticky;
  top: 16px;
  z-index: 10;
  display: block;
  margin: 0 auto 20px;
  border: 0;
  border-radius: 999px;
  padding: 10px 18px;
  color: #fff;
  background: var(--resume-teal);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(7, 63, 77, 0.18);
}

.page {
  position: relative;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto 24px;
  overflow: hidden;
  color: var(--resume-ink);
  background: #fff;
  box-shadow: 0 16px 45px rgba(20, 32, 40, 0.16);
  break-after: page;
  page-break-after: always;
  font-family: Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.page::after {
  content: '';
  position: absolute;
  right: -58px;
  bottom: -58px;
  width: 170px;
  height: 170px;
  border-radius: 999px;
  background: var(--resume-muted);
  z-index: 0;
}

.page-cover {
  display: grid;
  grid-template-columns: 42% 58%;
  grid-template-rows: auto 1fr;
  padding: 15mm 16mm 12mm;
  column-gap: 14mm;
}

.cover-corner {
  position: absolute;
  top: 0;
  left: 0;
  width: 42mm;
  height: 45mm;
  background: var(--resume-teal);
}

.page-cover::before {
  content: '';
  position: absolute;
  top: -26mm;
  right: -24mm;
  width: 62mm;
  height: 62mm;
  border-radius: 999px;
  background: var(--resume-muted);
}

.profile-panel,
.cover-main,
.influence-block,
.page-header,
.experience-item,
.certificate-grid {
  position: relative;
  z-index: 1;
}

.portrait-frame {
  width: 54mm;
  height: 54mm;
  margin: -1mm auto 6mm;
  overflow: hidden;
  border: 1.6mm solid var(--resume-teal);
  border-radius: 999px;
  background: #fff;
}

.portrait-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 18%;
}

.profile-panel h1 {
  margin: 0 0 2mm;
  text-align: center;
  font-size: 25pt;
  font-weight: 900;
  line-height: 1.05;
}

.headline {
  margin: 0 0 5mm;
  color: var(--resume-teal);
  font-size: 13.4pt;
  font-weight: 900;
  line-height: 1.28;
}

.summary {
  margin: 0 0 5mm;
  font-size: 11.2pt;
  font-weight: 500;
  line-height: 1.28;
  text-align: justify;
}

.contact-list {
  display: grid;
  gap: 3mm;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 11.3pt;
}

.contact-list li {
  display: grid;
  grid-template-columns: 8mm 1fr;
  align-items: center;
  gap: 4mm;
}

.contact-icon {
  display: grid;
  width: 8mm;
  height: 8mm;
  place-items: center;
  border-radius: 999px;
  color: #fff;
  background: var(--resume-teal);
  font-size: 10pt;
  font-weight: 700;
  overflow: hidden;
}

.contact-icon-img {
  width: 68%;
  height: 68%;
  object-fit: contain;
}

.contact-fallback {
  font-size: 10pt;
  line-height: 1;
}

.skill-heading-icon {
  width: 1.15em;
  height: 1.15em;
  object-fit: contain;
  flex-shrink: 0;
}

.skill-heading-fallback {
  display: inline-block;
  min-width: 1em;
}

.page-header .header-icon img.header-icon-img {
  width: 1em;
  height: 1em;
  object-fit: contain;
  display: block;
}

.skill-block + .skill-block {
  margin-top: 8mm;
}

.skill-block h2,
.influence-block h2,
.page-header {
  display: inline-flex;
  align-items: center;
  gap: 4mm;
  min-width: 58mm;
  margin: 0 0 5mm;
  padding: 2.2mm 6mm;
  color: #fff;
  background: var(--resume-green);
  font-size: 13.5pt;
  font-weight: 700;
  line-height: 1;
}

.skill-block ul,
.influence-block ul,
.experience-item ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.skill-block li,
.influence-block li,
.experience-item li {
  position: relative;
  padding-left: 6mm;
  font-weight: 500;
}

.skill-block li::before,
.influence-block li::before,
.experience-item li::before {
  content: '•';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--resume-green);
  font-weight: 900;
}

.skill-block li {
  margin-bottom: 1.8mm;
  font-size: 11.4pt;
  line-height: 1.25;
}

.skill-block li:first-child,
.skill-block li:nth-child(2),
.skill-block li:nth-child(3),
.skill-block li:nth-child(4),
.skill-block li:nth-child(5),
.skill-block li:nth-child(6) {
  font-weight: 700;
}

.influence-block {
  grid-column: 1 / -1;
  align-self: end;
  margin-top: 6mm;
}

.influence-block h2 {
  min-width: 60mm;
}

.influence-block li {
  margin-bottom: 1.5mm;
  font-size: 9.8pt;
  line-height: 1.26;
}

.page-work,
.page-certificates {
  padding: 15mm 16mm 14mm;
}

.decor {
  position: absolute;
  border-radius: 999px;
  background: var(--resume-muted);
  z-index: 0;
}

.decor-top {
  top: -30mm;
  right: -23mm;
  width: 62mm;
  height: 62mm;
}

.decor-left {
  left: -34mm;
  bottom: 20mm;
  width: 52mm;
  height: 52mm;
}

.page-header {
  min-width: 118mm;
  margin-bottom: 7mm;
  padding: 3.1mm 6mm;
  font-size: 14pt;
}

.page-header.teal {
  background: var(--resume-teal);
}

.page-header.purple {
  background: var(--resume-purple);
}

.header-icon {
  font-size: 14pt;
}

.experience-item {
  margin-bottom: 6mm;
  break-inside: avoid;
  page-break-inside: avoid;
}

.compact .experience-item {
  margin-bottom: 5.4mm;
}

.experience-item h3 {
  margin: 0 0 1mm;
  font-size: 13.1pt;
  font-weight: 900;
  line-height: 1.25;
}

.experience-item .meta,
.experience-item .result {
  margin: 0;
  font-size: 11.6pt;
  font-weight: 500;
  line-height: 1.38;
}

.experience-item .result {
  text-align: justify;
}

.experience-item ul {
  margin-top: 1.6mm;
}

.experience-item li {
  margin-bottom: 1.05mm;
  font-size: 10.8pt;
  line-height: 1.36;
}

.compact .experience-item li,
.compact .experience-item .meta,
.compact .experience-item .result {
  font-size: 10.7pt;
  line-height: 1.32;
}

.certificate-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4.5mm 6mm;
  align-items: start;
}

.certificate-grid figure {
  margin: 0;
  text-align: center;
  break-inside: avoid;
}

.certificate-grid img {
  width: 100%;
  max-height: 62mm;
  object-fit: contain;
}

.certificate-grid figcaption {
  margin-top: 2mm;
  font-size: 11pt;
  font-weight: 500;
  line-height: 1.25;
}

.certificate-grid figure:nth-child(3),
.certificate-grid figure:nth-child(4),
.certificate-grid figure:nth-child(5) {
  grid-column: auto;
}

.certificate-grid figure:nth-child(n + 3):not(.wide) img {
  max-height: 68mm;
}

.certificate-grid .wide {
  grid-column: span 1;
}

.certificate-grid .cover img {
  max-height: 58mm;
}

.certificate-grid figure:nth-child(3) {
  grid-column: 1 / 2;
}

.certificate-grid figure:nth-child(4) {
  grid-column: 2 / 3;
}

.certificate-grid figure:nth-child(5) {
  grid-column: 3 / 4;
}

.certificate-grid figure:nth-child(6) {
  grid-column: 1 / 3;
}

.certificate-grid figure:nth-child(6) img {
  max-height: 46mm;
}

.page-number {
  position: absolute;
  right: 7mm;
  bottom: 5mm;
  z-index: 2;
  font-size: 11pt;
  color: #111;
}

@media (max-width: 900px) {
  .page {
    width: min(100%, 210mm);
    min-height: auto;
  }

  .page-cover {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    row-gap: 10mm;
  }

  .influence-block {
    grid-column: auto;
  }
}

@page {
  size: A4;
  margin: 0;
}

@media print {
  :global(html),
  :global(body),
  :global(#app) {
    width: 210mm;
    margin: 0;
    background: #fff !important;
  }

  .resume-shell {
    padding: 0;
    background: #fff;
  }

  :global(.app-root) {
    min-height: auto;
    padding: 0 !important;
  }

  .print-button {
    display: none;
  }

  .page {
    width: 210mm;
    height: 296mm;
    min-height: 296mm;
    margin: 0;
    box-shadow: none;
    overflow: hidden;
    page-break-after: auto;
    break-after: auto;
  }

  .page-cover {
    display: grid;
    grid-template-columns: 42% 58%;
    grid-template-rows: auto 1fr;
    row-gap: 0;
  }

  .influence-block {
    grid-column: 1 / -1;
  }

  .page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  .page-certificates {
    page-break-after: auto !important;
    break-after: auto !important;
  }
}
</style>

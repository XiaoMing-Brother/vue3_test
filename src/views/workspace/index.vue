<template>
  <div class="workspace">
    <div class="workspace-header">
      <h1>工作台</h1>
      <p>欢迎来到您的个人工作台</p>
    </div>

    <div class="workspace-content">
      <div class="card-grid">
        <div class="art-custom-card">
          <div class="card-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="card-content">
            <h3>数据统计</h3>
            <p>查看系统数据统计信息</p>
          </div>
        </div>

        <div class="art-custom-card">
          <div class="card-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="card-content">
            <h3>文档管理</h3>
            <p>管理您的文档和资料</p>
          </div>
        </div>

        <div class="art-custom-card">
          <div class="card-icon">
            <el-icon><Setting /></el-icon>
          </div>
          <div class="card-content">
            <h3>系统设置</h3>
            <p>配置系统相关设置</p>
          </div>
        </div>

        <div class="art-custom-card">
          <div class="card-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="card-content">
            <h3>用户管理</h3>
            <p>管理系统用户信息</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 工作台逻辑
</script>

<style lang="scss" scoped>
.workspace {
  padding: 20px;

  &-header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      font-size: 32px;
      color: #333;
      margin-bottom: 10px;
    }

    p {
      font-size: 16px;
      color: #666;
    }
  }

  &-content {
    max-width: 1200px;
    margin: 0 auto;
  }
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.art-custom-card {
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: var(--art-main-bg-color);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .card-icon {
    font-size: 48px;
    color: var(--el-color-primary);

    margin-bottom: 16px;
    text-align: center;
  }

  .card-content {
    text-align: center;

    h3 {
      font-size: 18px;
      color: #333;
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
  }
}
</style>

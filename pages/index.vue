<template>
  <b-row class="blog-list-wrapper">
    <b-col md="6" xl="4">
      <b-card tag="article" no-body>
        <b-img src="/images/default_image.jpg" class="card-img-top" />
        <b-card-body>
          <b-card-title> 巨粽電子商務平台正式上線 </b-card-title>
          <b-media no-body>
            <b-media-aside vertical-align="center" class="mr-50">
              <b-avatar
                href="javascript:void(0)"
                size="24"
                src="/images/avatar.jpg"
              />
            </b-media-aside>
            <b-media-body>
              <small class="text-muted mr-50">by</small>
              <small>
                <b-link class="text-body">Odin</b-link>
              </small>
              <span class="text-muted ml-75 mr-50">|</span>
              <small class="text-muted">2021/08/10</small>
            </b-media-body>
          </b-media>
          <div class="my-1 py-25">
            <b-badge pill class="mr-75" variant="danger"> 重要 </b-badge>
          </div>
          <b-card-text class="blog-content-truncate">
            巨粽電子商務平台正式上線，我們是一群從老電子商務平台出來的工程師們，
            我們經歷過1111的各式慘烈狀況，也經歷過無數的攻擊，我們深知經營電商的辛苦，
            所以巨粽致力於最人性化的UI、最好的效能、最佳的搜尋引擎優化(SEO)和最優惠的價格，
            讓您在電商/微商的路上，獲得最大的助力，讓我們為您聚(巨)集最多的消費群眾(粽)，
            謝謝您選擇了我們，我們將繼續提供更好的服務，更完善的功能
          </b-card-text>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  // mounted() {
  //     this.$nuxt.$emit('test', '1123123');
  // }
}
</script>

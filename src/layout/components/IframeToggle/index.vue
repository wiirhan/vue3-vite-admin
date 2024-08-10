<script setup lang="ts">
import useTagsViewStore from '@/store/modules/tagsView';
import { useRoute } from 'vue-router';
import InnerLink from '../InnerLink/index.vue';

const route = useRoute()
const tagsViewStore = useTagsViewStore()
</script>

<template>
  <transition-group name="fade-transform">
    <InnerLink v-for="(item, index) in tagsViewStore.iframeViews" v-show="route.path === item.path" :key="item.path"
      :iframe-id="`iframe${index}`" :src="item.meta.link as any" />
  </transition-group>
</template>

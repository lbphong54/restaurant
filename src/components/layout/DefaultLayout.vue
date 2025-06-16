<template>
<div class="min-h-screen flex flex-col relative">
    <!-- Headr -->
<PageHeader />
    <!-- Main -->
<main class="flex-grow">
    <RouterView></RouterView>
</main>
    <!-- Footer -->
<PageFooter />
</div>
</template>

<script>
import PageFooter from './PageFooter.vue';
import PageHeader from './PageHeader.vue';

export default {
  components: {
    PageFooter,
    PageHeader
  }
};

</script>

<style>

</style>
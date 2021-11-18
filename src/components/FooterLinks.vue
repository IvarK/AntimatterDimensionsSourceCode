<script>
import FooterLink from "@/components/FooterLink";

export default {
  components: {
    FooterLink
  },
  computed: {
    isVisible() {
      return this.$viewModel.subtab !== Tab.eternity.studies.key;
    }
  }
};
</script>

<template>
  <div
    v-if="isVisible"
    class="o-footer"
  >
    <FooterLink href="https://example.com">
      Example
    </FooterLink>
    |
    <FooterLink
      href="about.html"
      onclick="SecretAchievement(33).unlock()"
    >
      Donate
    </FooterLink>
    |
    <FooterLink href="changelog.html">
      Changelog
    </FooterLink>
    |
    <FooterLink href="https://discord.gg/ST9NaXa">
      Discord
    </FooterLink>
    |
    <FooterLink href="https://www.reddit.com/r/AntimatterDimensions/">
      Subreddit
    </FooterLink>
  </div>
</template>

<style scoped>
.o-footer {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-size: 1.5rem;
}
</style>

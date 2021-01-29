<template>
  <v-container>
    <v-row class="ma-4" justify="center" align="center">
      <v-alert v-if="error" type="error">
        データの取得に失敗しました。
      </v-alert>
      <v-skeleton-loader
        v-if="!loaded && !error"
        width="400"
        elevation="10"
        type="list-item-avatar-three-line, image, article"
      />
      <v-card v-if="loaded && !error" width="400" class="mt-10" elevation="10">
        <v-card-title class="white--text mt-n10 py-0">
          <v-row class="flex-column" justify="center" align-content="center">
            <v-col>
              <v-layout justify-center>
                <div class="outer_avatar" :class="`avatar_${userPlatform}`">
                  <v-avatar size="80">
                    <v-img :src="userAvaterUrl" />
                  </v-avatar>
                </div>
              </v-layout>
            </v-col>
            <v-col class="pt-0">
              <p class="text-center user-identifier">
                {{ userIdentifier }}
                <v-icon dense>mdi-{{ userPlatformIcon }}</v-icon>
              </p>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider class="mx-4" />
        <v-card-text>
          <div class="font-weight-bold ml-2 mb-2">現在のレジェンド</div>
          <div class="current-legend">
            <v-img
              gradient="to bottom, rgba(0,0,0,.4), rgba(0,0,0,.8)"
              class="blur"
              height="150"
              :src="currentLegendBgImageUrl"
            />
            <img
              class="ml-0 pl-0 current-legend-image"
              :src="currentLegendImageUrl"
            />
            <div class="current-legend-name">{{ currentLegendName }}</div>
          </div>

          <div class="font-weight-bold ml-2 mb-2">ランクマッチ(現在)</div>
          <v-row class="flex-column" justify="center" align-content="center">
            <v-col align="center">
              <v-progress-circular
                class="mx-0"
                :rotate="-90"
                :size="100"
                :width="10"
                :value="currentUserRankScorePercentage"
                :color="currentUserRankScoreColor"
              >
                <v-img max-width="60px" :src="currentUserRankScoreImage" />
              </v-progress-circular>
            </v-col>
            <v-col align="center">
              <div class="current-rank-score">
                {{ currentUserRankScoreValue }} RP /
                {{ currentUserRankScoreRange[1] }} RP
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    userIdentifier: {
      // username
      type: String,
      required: true,
    },
    userPlatform: {
      // "origin", "xbl", "psn"
      type: String,
      required: true,
    },
  },
  data: () => ({
    userAvaterUrl: '',
    userPlatformIcon: '', // "laptop", "controller-classic", ""
    rankReferenceData: [0, 1200, 2800, 4800, 7200, 10000],
    currentLegendBgImageUrl: '',
    currentLegendImageUrl: '',
    currentLegendName: '',
    currentUserRankScore: '',
    currentUserRankScoreColor: '',
    currentUserRankScoreImage: '',
    currentUserRankScoreValue: 0,
    currentUserRankScoreRange: [],
    currentUserRankScorePercentage: 0,
    loaded: false,
    error: false,
  }),
  watch: {
    userIdentifier() {
      this.getUserData()
    },
    currentUserRankScoreValue() {
      const rank = this.currentUserRankScoreValue
      this.currentUserRankScorePercentage = this.validateRankValue(rank)
      if (rank < 1200) {
        // Bronze
        this.currentUserRankScoreColor = 'brown lighten-2'
      } else if (rank >= 1200 && rank < 2800) {
        // Silver
        this.currentUserRankScoreColor = 'blue-grey lighten-2'
      } else if (rank >= 2800 && rank < 4800) {
        // Gold
        this.currentUserRankScoreColor = 'amber lighten-2'
      } else if (rank >= 4800 && rank < 7200) {
        // Platinum
        this.currentUserRankScoreColor = 'cyan lighten-2'
      } else if (rank >= 4800 && rank < 10000) {
        // Diamond
        this.currentUserRankScoreColor = 'light-blue lighten-2'
      } else if (rank >= 10000) {
        // Master
        this.currentUserRankScoreColor = 'deep-purple lighten-2'
      }
    },
  },
  created() {
    this.getUserData()
  },
  methods: {
    validateRankValue(rankValue) {
      const rankRef = this.rankReferenceData.sort(function (a, b) {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      })

      let rankLowerValue, rankUpperValue
      if (rankValue === 0) {
        rankUpperValue = rankRef[1]
        rankLowerValue = rankRef[0]
      } else if (rankValue >= rankRef.slice(-1)[0]) {
        rankUpperValue = rankRef.slice(-1)[0]
      } else {
        rankUpperValue = rankRef[rankRef.findIndex((x) => x > rankValue)]
        rankLowerValue = rankRef[rankRef.findIndex((x) => x > rankValue) - 1]
      }

      this.currentUserRankScoreRange = [rankLowerValue, rankUpperValue]
      if (rankValue === 0) {
        return 0
      } else if (rankLowerValue === rankValue) {
        return Math.abs(
          Math.floor(
            (rankValue - rankLowerValue) / (rankUpperValue - rankLowerValue)
          )
        )
      } else if (rankRef[rankRef.length - 1] <= rankValue) {
        return 100
      } else {
        return Math.abs(
          Math.floor(
            ((rankValue - rankLowerValue) / (rankUpperValue - rankLowerValue)) *
              100
          )
        )
      }
    },
    async getUserData() {
      this.error = false
      this.loaded = false
      try {
        const userData = await this.$axios.$get(
          `/profile/${this.userPlatform}/${this.userIdentifier}`
        )
        this.userAvaterUrl = userData.data.platformInfo.avatarUrl
        this.currentLegendBgImageUrl =
          userData.data.segments[1].metadata.bgImageUrl
        this.currentLegendImageUrl = userData.data.segments[1].metadata.imageUrl
        this.currentLegendName = userData.data.segments[1].metadata.name
        this.currentUserRankScoreImage =
          userData.data.segments[0].stats.rankScore.metadata.iconUrl
        this.currentUserRankScore =
          userData.data.segments[0].stats.rankScore.metadata.iconUrl
        this.currentUserRankScoreValue =
          userData.data.segments[0].stats.rankScore.value
        switch (this.userPlatform) {
          case 'origin':
            this.userPlatformIcon = 'origin'
            break
          case 'xbl':
            this.userPlatformIcon = 'microsoft-xbox'
            break
          case 'psn':
            this.userPlatformIcon = 'sony-playstation'
            break
          default:
            this.userPlatformIcon = ''
            break
        }
        if (userData.data.segments[0].stats.rankScore.value === 0) {
          try {
            const RankData = await this.$axios.$get(
              `/profile/${this.userPlatform}/${this.userIdentifier}/sessions`
            )
            this.currentUserRankScoreImage =
              RankData.data.items[0].matches[0].stats.rankScore.metadata.rankScoreInfo.image
            this.currentUserRankScore =
              RankData.data.items[0].matches[0].stats.rankScore.metadata.rankScoreInfo.name
            this.currentUserRankScoreValue =
              RankData.data.items[0].matches[0].stats.rankScore.value
            this.loaded = true
          } catch (e) {
            this.error = true
            this.loaded = false
          }
        } else {
          this.loaded = true
        }
      } catch (e) {
        this.error = true
        this.loaded = false
      }
    },
    async getRankData() {
      try {
        const RankData = await this.$axios.$get(
          `https://public-api.tracker.gg/v2/apex/standard/profile/${this.userPlatform}/${this.userIdentifier}/sessions`
        )
        this.currentUserRankScoreImage =
          RankData.data.items[0].matches[0].stats.rankScore.metadata.rankScoreInfo.image
        this.currentUserRankScore =
          RankData.data.items[0].matches[0].stats.rankScore.metadata.rankScoreInfo.name
        this.currentUserRankScoreValue =
          RankData.data.items[0].matches[0].stats.rankScore.value
      } catch (e) {
        this.error = true
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.outer_avatar {
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.user-identifier {
  font-family: 'Bebas Neue';
  font-size: 26px;
}

.avatar_origin {
  background: linear-gradient(to right, #f12711, #f5af19);
}

.avatar_psn {
  background: linear-gradient(to right, #0575e6, #021b79);
}

.avatar_xbl {
  background: linear-gradient(to right, #56ab2f, #a8e063);
}

.avatar_ {
  background: none;
}

.blur {
  filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='flt-shu6paqx' x='0' y='0' width='1' height='1' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='2' result='flt-shu6paqx-2'/%3E%3CfeMorphology operator='dilate' radius='2'/%3E%3CfeMerge%3E%3CfeMergeNode/%3E%3CfeMergeNode in='flt-shu6paqx-2'/%3E%3C/feMerge%3E%3C/filter%3E%3C/svg%3E#flt-shu6paqx");
}

.current-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  width: 100%;
  height: 150px;
  margin-bottom: 80px;

  .current-legend-image {
    position: absolute;
    top: 0;
    left: -10px;
    height: 200px;
    @media screen and (max-width: 425px) {
      top: -10px;
      height: 160px;
    }
  }

  .current-legend-name {
    margin-right: 20px;
    position: absolute;
    color: #ffffff;
    font-size: 36px;
    font-family: 'Bebas Neue';
    @media screen and (max-width: 425px) {
      font-size: 26px;
    }
  }
}

.current-rank-score {
  font-family: 'Bebas Neue';
  font-size: 26px;
}
</style>

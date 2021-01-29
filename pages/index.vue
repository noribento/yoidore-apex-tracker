<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="6">
        <v-select
          v-model="selectedUser"
          :items="users"
          item-text="userIdentifier"
          item-value="userIdentifier"
          label="ユーザーを選択..."
          dense
          solo
          required
        ></v-select>
      </v-col>
      <v-col cols="12">
        <user-card
          v-if="userSelected"
          :user-identifier="selectedUser"
          :user-platform="selectedPlatform"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    userSelected: false,
    selectedUser: '',
    selectedPlatform: '',
    users: [
      { userIdentifier: 'yaita_soba_dayoo', userPlatform: 'origin' },
      { userIdentifier: 'tatuki1521', userPlatform: 'psn' },
      { userIdentifier: 'Pooh_TKG20', userPlatform: 'origin' },
      { userIdentifier: 'akikan_810', userPlatform: 'psn' },
      { userIdentifier: 'eita-ro0', userPlatform: 'psn' },
      { userIdentifier: 'Ngenos-1912-', userPlatform: 'psn' },
    ],
  }),
  watch: {
    selectedUser() {
      this.userSelected = true
      this.selectedPlatform = this.users[
        this.users.findIndex(
          ({ userIdentifier }) => userIdentifier === this.selectedUser
        )
      ].userPlatform
    },
  },
}
</script>

<template>
  <div class="hello">
    <input
      v-model="states"
      type="text"
      v-if="!isHidden"
    >
  
    <div class="status-line">
      <small>Status: {{ connectStatus }}</small>
    </div>
    <button v-if="!isHidden" v-on:click="start(); isHidden = true">Start</button>
    <table>
      <thead>
        <tr>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in results" v-bind:key="result.address">
          <td>{{ result.address }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Addresses extends Vue {
  @Prop() private msg!: string;
  private readyState: number = 0;
  private hideStart: boolean = false;
  private webSocketPriv: WebSocket | undefined;
  private connectStates: string = '';
  private addresses: object[] = [];


  set results(value) {
    this.addresses = value;
  }
  get results() {
    return this.addresses;
  }
  set states(value) {
    this.connectStates = value;
  }
  get states() {
    return this.connectStates;
  }
  get isHidden() {
    return this.hideStart;
  }
  set isHidden(value) {
    this.hideStart = value;
  }
  get connectStatus() {
    return ['Connecting', 'Ready', 'Closing', 'Closed'][ this.readyState ];
  }
  private start() {
    this.webSocketPriv = new WebSocket('ws://localhost:3000/addresses?states='
      + this.connectStates.split(',').join('+'));
    this.webSocketPriv.onopen = this.webSocketPriv.onerror = this.webSocketPriv.onclose = () => {
      this.readyState = this.webSocketPriv ? this.webSocketPriv.readyState : 0;
    };
    this.webSocketPriv.onmessage = (event) => {
      this.results.unshift({address : event.data});
    };
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

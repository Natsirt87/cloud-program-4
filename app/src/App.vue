<script setup>
import { ref, onMounted } from "vue";
const queryData = ref();

async function load() {
  // Call the API method for load

  const response = await fetch("/api/load", { method: "PUT" });
  console.log(await response.json());
}

function clear() {
  // TODO: Call the API method for clear
}

function query(firstName, lastName) {
  // TODO: Call the API method for query
}
</script>

<template>
  <header class="flex justify-center">
    <h1 class=" text-4xl mt-3">Dimpsey Time :(</h1>
    
  </header>

  <hr class="border-none h-[1px] bg-white bg-opacity-40 mx-4 my-4">

  <main class="px-2">
    <!-- Row for load and clear buttons -->
    <div class="flex justify-center gap-4 sm:gap-10 mt-10">
      <button 
        type="button"
        class="squishy-button bg-blue-500 focus:ring-4 focus:ring-blue-500/50 shadow-lg shadow-slate-800 px-14 sm:px-20 py-3"
        @click="load"
      >
        Load
      </button>

      <button
        type="button"
        class="squishy-button bg-red-500 focus:ring-4 focus:ring-red-500/50 shadow-lg shadow-slate-800 px-14 sm:px-20 py-3"
      >
        Clear
      </button>
    </div>

    <!-- Row for inputs -->
    <form class="flex justify-center mt-10 gap-2 flex-col sm:gap-10 sm:flex-row">
      <div class="mb-4">
        <input id="first-name" type="text" placeholder="First Name" class="input-field focus:outline-none focus:ring-2 focus:ring-white/20">
      </div>

      <div class="mb-4">
        <input id="last-name" type="text" placeholder="Last Name" class="input-field focus:outline-none focus:ring-2 focus:ring-white/20">
      </div>
    </form>

    <div class="flex justify-center gap-4 sm:gap-10 mt-5">
      <button 
        type="button"
        class="squishy-button bg-purple-500 focus:ring-4 focus:ring-purple-500/50 shadow-lg shadow-slate-800 px-14 sm:px-20 py-3"
      >
        Query
      </button>
    </div>

    <div v-if="queryData != undefined" class="flex flex-col gap-4 items-center mt-10">
      <span v-for="user in queryData" class="flex justify-center gap-4">
        <span v-for="(value, key) in user">
          {{ key }}: {{ value }}
        </span>
      </span>
    </div>

  </main>
</template>

<style scoped>
.input-field {
  appearance: none;
  border-width: 1px;
  border-radius: 0.25rem;
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  color:rgb(55, 65, 81);
  line-height: 1.25;
}
.squishy-button {
  border-radius: 7px;
  color: white;
  outline: none;
  display: flex;
  transition: all 0.2s ease
}

.squishy-button:active {
  transform: scale(1, 0.88);
}

</style>

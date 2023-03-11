<script setup>
import { ref } from "vue";
const queryData = ref();

const firstName = ref();
const lastName = ref();

const loadLoading = ref(false);
const clearLoading = ref(false);
const queryLoading = ref(false);

const message = ref();
const error = ref(false);

let timeout = 0;

async function load() {
  // Call the API method for load
  loadLoading.value = true;

  try {
    const response = await fetch("/api/load", { method: "PUT" });
    console.log(await response.json());
    message.value = "Finished loading data."
  } catch {
    message.value = "Something went wrong loading data, please try again."
    error.value = true;
  }
  
  clearTimeout(timeout);
  timeout = setTimeout(() => { message.value = ""; error.value = false; }, 4000);

  loadLoading.value = false;
}

async function clear() {
  // Call the API method for clear
  clearLoading.value = true;

  try {
    const response = await fetch("/api/clear", { method: "DELETE" });
    console.log(await response.json());
    message.value = "Finished clearing data.";
  } catch {
    message.value = "Something went wrong while loading, please try again.";
    error.value = true;
  }

  
  clearTimeout(timeout);
  timeout = setTimeout(() => { message.value = ""; error.value = false; }, 3000);

  queryData.value = undefined;

  clearLoading.value = false;

}

async function query() {
  // Call the API method for query
  queryLoading.value = true;

  let queryString = "";

  if (firstName.value && lastName.value) {
    queryString = `?firstName=${firstName.value}&lastName=${lastName.value}`;
  } else if (firstName.value) {
    queryString = `?firstName=${firstName.value}`;
  } else if (lastName.value) {
    queryString = `?lastName=${lastName.value}`;
  }

  try {
    const response = await fetch("/api/query" + queryString);
    const body = (await response.json()).body;

    const queryResult = body.map((value) => {
      let { etag, timestamp, partitionKey, rowKey, ...resultValue } = value;

      resultValue = { name: `${value.partitionKey} ${value.rowKey}`, ...resultValue };

      return resultValue;
    });

    queryData.value = queryResult;

    if (queryResult.length == 0) {
      message.value = "Nothing in the database was found with that name, sorry :(";
    }
  } catch {
      message.value = "Something went wrong during querying, please try again.";
      error.value = true;
  }

  clearTimeout(timeout);
  timeout = setTimeout(() => { message.value = ""; error.value = false; }, 4000);

  queryLoading.value = false;
}
</script>

<template>
  <header class="flex justify-center">
    <h1 class=" text-4xl my-7">Tristan Commons Cloud Program 4 (<span class="italic">a.k.a. "Dimptacular"</span>)</h1>
    
  </header>

  <hr class="border-none h-[1px] bg-white bg-opacity-40 mx-4 mb-4">

  <main class="px-2 mt-5">

    <p class="text-center italic text-lg my-3" :class="{'text-red-400': error}">{{ message }} <br> </p>

    <!-- Row for load and clear buttons -->
    <div class="flex justify-center gap-4 sm:gap-10 mt-5">
      <button 
        type="button"
        class="squishy-button bg-blue-500 focus:ring-4 focus:ring-blue-500/50 shadow-lg shadow-slate-800 w-full sm:w-44 py-3"
        :class="{ 'opacity-60': loadLoading}"
        :disabled="loadLoading"
        @click="load"
      >
        <svg v-if="loadLoading" class="h-6 w-6 animate-spin" viewBox="3 3 18 18">
          <path
            class="fill-blue-800"
            d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"></path>
          <path
            class="fill-blue-100"
            d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
        </svg>

        <span v-else>Load</span>
      </button>

      <button 
        type="button"
        class="squishy-button bg-red-500 focus:ring-4 focus:ring-blue-500/50 shadow-lg shadow-slate-800 w-full sm:w-44 py-3"
        :class="{ 'opacity-60': clearLoading}"
        :disabled="clearLoading"
        @click="clear"
      >
        <svg v-if="clearLoading" class="h-6 w-6 animate-spin" viewBox="3 3 18 18">
          <path
            class="fill-blue-800"
            d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"></path>
          <path
            class="fill-blue-100"
            d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
        </svg>

        <span v-else>Clear</span>
      </button>
    </div>


    <!-- Row for inputs -->
    <form class="flex justify-center mt-10 gap-2 flex-col sm:gap-10 sm:flex-row">
      <div class="mb-4">
        <input 
          type="text" 
          placeholder="First Name" 
          class="input-field focus:outline-none focus:ring-2 focus:ring-white/20"
          v-model="firstName"
        >
      </div>

      <div class="mb-4">
        <input 
          type="text" 
          placeholder="Last Name" 
          class="input-field focus:outline-none focus:ring-2 focus:ring-white/20"
          v-model="lastName"
        >
      </div>
    </form>


    <div class="flex justify-center gap-4 sm:gap-10 mt-5 w-full">
      <button 
        type="button"
        class="squishy-button bg-purple-500 focus:ring-4 focus:ring-blue-500/50 shadow-lg shadow-slate-800 w-full sm:w-64 py-3"
        :class="{ 'opacity-60': queryLoading}"
        :disabled="queryLoading"
        @click="query"
      >
        <svg v-if="queryLoading" class="h-6 w-6 animate-spin" viewBox="3 3 18 18">
          <path
            class="fill-blue-800"
            d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"></path>
          <path
            class="fill-blue-100"
            d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
        </svg>

        <span v-else>Query</span>
      </button>
    </div>
    <ul v-if="queryData != undefined" class="mt-10 text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      
      
      <li v-for="user in queryData" :key="user.name" class="mb-5">
        
        <hr class="mb-5 w-60 mx-auto opacity-25">
        <li v-for="(value, key) in user">

          <span v-if="key === 'name'" class="font-bold mx-1"> {{ value }}</span>
          <span v-else> {{ key }} = {{ value }}</span>
          
        </li>
      </li>
      
    </ul>

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
  display: flex;
  justify-content: center;
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

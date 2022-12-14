<script setup>
    import {
        computed,
        ref,
        unref,
    } from 'vue';

    import { useMicrobiomeStore } from './stores/microbiome.js';
    import Average from './components/Average.vue';
    import FileLoader from './components/FileLoader.vue';
    import Microbe from './components/Microbe.vue';

    const averages = [
        { Name: 'Akkermansia', Goal: '> 66%' },
        { Name: 'Alistipes', Goal: '33-66%' },
        { Name: 'Bifidobacterium', Goal: '> 66%' },
        { Name: 'Enterococcus', Goal: '< 33%' },
        { Name: 'Escherichia', Goal: '< 33%' },
        { Name: 'Faecalibacterium', Goal: '> 66%' },
        { Name: 'Klebsiella', Goal: '< 33%' },
        { Name: 'Lactobacillus', Goal: '33-66%' },
        { Name: 'Methanobacteria', Goal: '< 33%' },
        { Name: 'Parabacteroides', Goal: '> 66%' },
        { Name: 'Prevotella', Goal: '> 66%' },
        { Name: 'Staphylococcus', Goal: '< 33%' },
        { Name: 'Fungi', Goal: '< 33%' },
    ];
    const store = useMicrobiomeStore();
    const tab = ref('Summary');
    const tabs = [
        'Summary',
        'Phylum',
        'Class',
        'Order',
        'Family',
        'Genus',
        'Species',
        'Subspecies',
        'Strain',
    ];

    const categorized = computed(() => {
        return store.getCategorized(unref(tab));
    });
    const species = computed(() => {
        var species = Array.from(new Set([
            ...store.Species,
            ...store.Strain,
            ...store.Subspecies,
        ]));
        species.sort((a,b) => {
            a = a.Name;
            b = b.Name;
            return a.localeCompare(b);
        });
        return [
            'Bifidobacterium',
            'Lactobacillus',
        ].reduce((ret, x) => {
            ret.push({
                Name: x,
                Rows: species.filter((y) => {
                    return x == y.Genus;
                })
            });
            return ret;
        }, []);
    });

    function onFileChange(e) {
        var input = e.target;
        store.parseCsv(input.files[0]);
    }
</script>

<template>
    <div class="no-data" v-if="!store.csv.length">
        <FileLoader @change="onFileChange"></FileLoader>
    </div>
    <template v-else-if="tab == 'Summary'">
        <header>
            <select v-model="tab">
                <option :value="t" v-for="t in tabs">{{t}}</option>
            </select>
            <input class="filter" placeholder="Filter" type="text" v-model="store.Filter">
            <i class="cursor-pointer mdi mdi-backspace" @click="store.Filter = ''" v-show="store.Filter"></i>
            <FileLoader>
                <i class="mdi mdi-file-plus"></i>
            </FileLoader>
        </header>
        <div class="averages results">
            <header>Your percentile compared to other people.</header>
            <Average class="result" :data="store[avg.Name]" :key="avg.Name" v-slot="{ average }" v-for="avg in averages">
                <span class="amount">{{average}}%</span>
                <span>{{avg.Name}}</span>
                <span class="goal">Goal: {{avg.Goal}}</span>
            </Average>
        </div>
        <div class="results" v-for="x in species">
            <header>{{x.Name}}</header>
            <Microbe class="result" :data="row" v-for="row in x.Rows" :key="row.Name"></Microbe>
        </div>
    </template>
    <div class="results" v-else>
        <Microbe class="result" :data="row" v-for="row in categorized" :key="row"></Microbe>
    </div>
</template>

<style lang="less">
    #app {
        @apply flex flex-col min-h-0 min-w-0;

        > header {
            @apply bg-white border-b flex flex-wrap h-14 items-center px-2 space-x-2 sticky top-0 z-10;
        }

        .filter {
            @apply border flex-1 px-2 py-1 rounded focus:outline-none focus:ring-2;
        }

        .no-data {
            @apply absolute flex flex-1 inset-0 items-center justify-center;
        }

        .results {
            @apply min-w-0 lg:grid lg:grid-cols-2 2xl:grid-cols-4;

            > header {
                @apply bg-white border-y font-medium px-5 py-4 shadow sticky text-xl top-14 lg:col-span-2 2xl:col-span-4;
            }

            .result {
                @apply cursor-default m-4 overflow-hidden rounded transition hover:ring-1;
            }
        }
    }
</style>

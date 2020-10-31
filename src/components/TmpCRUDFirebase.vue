<template>
    type: 
    <select v-model="key" @change="loadType">
        <option value="posts">posts</option>
        <option value="users">users</option>
        <option value="categories">categories</option>
        <option value="threads">threads</option>
    </select>
    <textarea v-model="newItem"></textarea>
    <button @click="save">save</button>


    <h1>{{key}}</h1>

    <section>
        <div v-for="item, index in list" :key="index">
            {{item}}
            <button @click="remove(item)">remove</button>
        </div>
    </section>

</template>

<script>

import { db } from '@/main';

export default {
    name: 'TmpCRUDFirebase',
    data(){
        return {
            key: '',
            list: [],
            newItem: ''
        }
    },
    methods: {
        loadType(){
            this.list = this.$store.state[this.key]
            console.log(`${this.key} loaded`)
        },
        save(){
            let data;
            try {
                data = JSON.parse(this.newItem);
                db.collection(this.key).add(data).then(() => {
                    console.log(`Item added`)
                    this.newItem = ''
                    this.key = ''
                });
            } catch(e) {
                console.log('Data not parsed')
            }
        },
        remove(item){
            db.collection(this.key).doc(item.id).delete().then(() => {
                console.log(`Item removed`)
                this.key = ''
            });
        },
    }
}
</script>

<style>

</style>
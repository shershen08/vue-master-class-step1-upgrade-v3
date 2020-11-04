const getRandom = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const mockdb = {
    collection: function(colName) {
        //console.log(`LOG: using collection ${colName}`)
        return {
            add: function(dataToAdd){
                // console.log(`LOG: adding ${colName} item ${JSON.stringify(dataToAdd)}`)
                Object.keys(dataToAdd).forEach(key => {
                    if(typeof dataToAdd[key] == "undefined") {
                        throw new Error(`${key} value is undefined`)
                    }
                })
                return new Promise((resolve) => {
                    resolve({
                        id: getRandom()
                    })
                })
            }
        }
    }
}

module.exports = {
    initializeApp: function(){},
    firestore: function(){
        return mockdb
    }
} 
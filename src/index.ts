import * as Realm from 'realm'
import * as faker from 'faker'
import * as uuid from 'uuid'

const CarSchema = {
    name: 'Car',
    primaryKey: '_id',
    properties: {
        _id: { optional: false, type: 'string' },
        name: { optional: false, type: 'string' },
        mileage: { optional: false, type: 'int' }
    }
}

// BEGIN ATTEMPT WITH USER THAT HAS ADMIN ROLE
new Promise<Realm.Sync.User>((resolve, reject) => {
    Realm.Sync.User.login('http://localhost:9080', 'maxadmin@gmail.com', 'ilovesushi', (err, user) => {
        if (err) { reject(err) }
        else {
            resolve(user)
        }
    })
})
.then(user => {
    const realm = new Realm({
        sync: {
            url: 'realm://localhost:9080/globalCars',
            user: user
        },
        schema: [CarSchema]
    })
    return Promise.resolve(realm)
}).then(realm => {
    var createdCar = null
    realm.write(() => {
        createdCar = realm.create('Car', {
            _id: uuid.v4(),
            name: faker.commerce.productName(),
            mileage: faker.random.number({ min: 0, max: 60000})
        })
    })
    return Promise.resolve(createdCar)
})
.then(car => {console.log(`We created a car with ${car.name} via ADMIN USER`)})
.catch(err => console.error(err))

// BEGIN ATTEMPT WITH USER THAT HAS REGULAR ROLE
new Promise<Realm.Sync.User>((resolve, reject) => {
    Realm.Sync.User.login('http://localhost:9080', 'maxregular@gmail.com', 'ilovesushi', (err, user) => {
        if (err) { reject(err) }
        else {
            resolve(user)
        }
    })
})
.then(user => {
    const realm = new Realm({
        sync: {
            url: 'realm://localhost:9080/globalCars',
            user: user
        },
        schema: [CarSchema]
    })
    return Promise.resolve(realm)
}).then(realm => {
    var createdCar = null
    realm.write(() => {
        createdCar = realm.create('Car', {
            _id: uuid.v4(),
            name: faker.commerce.productName(),
            mileage: faker.random.number({ min: 0, max: 60000})
        })
    })
    return Promise.resolve(createdCar)
})
.then(car => {console.log(`We created a car with ${car.name} via REGULAR USER`)})
.catch(err => console.error(err))



import { Faker } from "k6/x/faker";

const faker = new Faker(11);

export function generateUsername(baseName) {
    const randomNum = Math.floor(Math.random() * 100000);
    return `${baseName}${randomNum}`;
}

export function generatePassword() {
    return faker.internet.password();
}

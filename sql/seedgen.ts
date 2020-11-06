import faker from "faker/locale/en_US";
import bcrypt from "bcrypt";
import fs from "fs";
import { SignInRequest } from "../models/user";

const fakerSeed = 6969;
faker.seed(fakerSeed);
const round = 10;
const salt = bcrypt.genSaltSync(round);
const NUM_PEOPLE = 1000;

const fakePetCategories = [
    "Bearded Dragon",
    "Bird",
    "Burro",
    "Chameleons (Veiled)",
    "Chicken",
    "Chinchilla",
    "Chinese Water Dragon",
    "Cow",
    "Donkey",
    "Duck",
    "Ferret",
    "Fish",
    "Gecko",
    "Geese (Chinese Swan Goose)",
    "Gerbil",
    "Goat",
    "Guinea Fowl",
    "Guinea Pig",
    "Hamster",
    "Hedgehog",
    "Horse",
    "Iguana",
    "Llama",
    "Lizard",
    "Mice",
    "Mule",
    "Peafowl",
    "Pig",
    "Hog",
    "Pigeon",
    "Ponie",
    "Pot Bellied Pig",
    "Rabbit"
].map((c) => c.toLowerCase());
const petCatEntries = fakePetCategories.map(
    (type) =>
        `INSERT INTO pet_category values ('${type}', ${faker.random.number(
            300
        )});`
);

let accounts: SignInRequest[] = [];

const fakePeople = [...Array(NUM_PEOPLE)].map((_) => {
    const password = faker.internet.password();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const email = faker.internet.email();
    accounts.push({ email, password });
    const sanitizedName = faker
        .fake("{{name.firstName}} {{name.lastName}}")
        .replace(/\'/g, "");
    const sanitizedAddress = faker.address.streetAddress().replace(/\'/g, "");
    const record = faker.fake(
        `'${email}', '${sanitizedName}', '${hashedPassword}', '${sanitizedAddress}', ${
            90000000 + faker.random.number(1000000)
        }, 'user', '{{internet.avatar}}'`
    );
    let postfix = "";
    if (faker.random.boolean()) {
        // pet owner
        const futureDate = faker.date.future(faker.random.number(5));
        const ccNumber = faker.finance
            .creditCardNumber()
            .replace(/-/g, "")
            .substring(0, 16);
        const cardRecord = faker.fake(
            `${ccNumber}, '${email}', '${futureDate.toISOString()}', {{finance.creditCardCVV}}`
        );
        postfix += `INSERT INTO credit_card VALUES (${cardRecord});` + "\n";
        [...Array(faker.random.number(3))].forEach((_) => {
            const petCategory = faker.random.arrayElement(fakePetCategories);
            const petRecord = faker.fake(
                `'{{name.firstName}}', '${email}', '${petCategory}', '{{lorem.sentence}}', '{{lorem.sentence}}'`
            );
            postfix += `INSERT INTO pet VALUES (${petRecord});` + "\n";
        });
    }
    if (faker.random.boolean()) {
        // care taker
        if (faker.random.boolean()) {
            // fulltime
            postfix += `INSERT INTO full_time_ct VALUES ('${email}');` + "\n";
            faker.random
                .arrayElements(fakePetCategories, faker.random.number(3))
                .forEach((petCategory) => {
                    const dailyPrice = faker.random.number(20);
                    postfix +=
                        `INSERT INTO ft_specializes_in VALUES ('${email}', '${petCategory}', ${dailyPrice});` +
                        "\n";
                });
        } else {
            // part time
            postfix += `INSERT INTO part_time_ct VALUES ('${email}');` + "\n";
            const startDate = faker.date.soon();
            const futureDate = faker.date.future(
                faker.random.number(1),
                startDate
            );
            postfix +=
                `INSERT INTO pt_free_schedule VALUES ('${email}', '${startDate.toISOString()}', '${futureDate.toISOString()}');` +
                "\n";
            faker.random
                .arrayElements(fakePetCategories, faker.random.number(3))
                .forEach((petCategory) => {
                    const dailyPrice = faker.random.number(20);
                    postfix +=
                        `INSERT INTO pt_specializes_in VALUES ('${email}', '${petCategory}', ${dailyPrice});` +
                        "\n";
                });
        }
    }
    return `INSERT INTO person VALUES (${record});` + "\n" + postfix;
});

const seedString = petCatEntries.join("\n") + fakePeople.join("\n");
// console.log(seedString);
const MD_HEADER = `| email                          | password        |
| ------------------------------ | --------------- |
`;
fs.writeFileSync("sql/generatedSeed.sql", seedString);
fs.writeFileSync(
    "accounts.md",
    MD_HEADER +
        accounts
            .map(({ email, password }) => `| ${email} | ${password}| `)
            .join("\n")
);

// export default seedString;
// run command with yarn ts-node sql/seedgen.ts

import faker from "faker/locale/en_US";
import bcrypt from "bcrypt";

const fakerSeed = 69;
faker.seed(fakerSeed);
const round = 10;
const salt = bcrypt.genSaltSync(round);
const NUM_PEOPLE = 100;

const fakePetCategories = [
    "Bearded Dragon",
    "Bird",
    "Burro",
    "Cat",
    "Chameleons (Veiled)",
    "Chicken",
    "Chinchilla",
    "Chinese Water Dragon",
    "Cow",
    "Dog",
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
];
const petCatEntries = fakePetCategories.map(
    (type) =>
        `INSERT INTO pet_category values ('${type}', ${faker.random.number(
            300
        )});`
);

const fakePeople = [...Array(NUM_PEOPLE)].map((_) => {
    const password = faker.internet.password();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const email = faker.internet.email();
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
        }
        faker.random
            .arrayElements(fakePetCategories, faker.random.number(3))
            .forEach((petCategory) => {
                const dailyPrice = faker.random.number(20);
                postfix +=
                    `INSERT INTO specializes_in VALUES ('${email}', '${petCategory}', ${dailyPrice});` +
                    "\n";
            });
    }
    return `INSERT INTO person VALUES (${record});` + "\n" + postfix;
});

const seedString = petCatEntries.join("\n") + fakePeople.join("\n");

export default seedString;

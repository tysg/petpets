import faker from "faker/locale/en_US";
import bcrypt from "bcrypt";
import fs from "fs";
import { SignInRequest } from "../models/user";
import { Pet, PetSchema } from "../models/pet";
import { CaretakerStatus, SpecializesIn } from "../models/careTaker";
import { Bid, BidStatus, TransportMethod } from "../models/bid";
import moment from "moment";

const fakerSeed = 669;
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
];
const petCatEntries = fakePetCategories.map(
    (type) =>
        `INSERT INTO pet_category values ('${type}', ${faker.random.number(
            300
        )});`
);

interface CoreCareTaker {
    email: string;
    allSpecializesIn: SpecializesIn[];
}

interface AccountDetails extends SignInRequest {
    caretakerStatus: CaretakerStatus;
    petownerStatus: boolean;
}
let accounts: AccountDetails[] = [];
let petOwners: Pet[] = [];
let careTakers: CoreCareTaker[] = [];

const fakePeople = [...Array(NUM_PEOPLE)].map((_) => {
    const password = faker.internet.password();
    const hashedPassword = bcrypt.hashSync(password, salt);
    // const email = faker.unique(faker.internet.email());
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
    let petownerStatus = false;
    if (faker.random.boolean()) {
        // pet owner
        petownerStatus = true;
        const futureDate = faker.date.future(faker.random.number(5));
        const ccNumber = faker.finance
            .creditCardNumber()
            .replace(/-/g, "")
            .substring(0, 16);
        const cardRecord = faker.fake(
            `${ccNumber}, '${email}', '${futureDate.toISOString()}', {{finance.creditCardCVV}}`
        );
        postfix += `INSERT INTO credit_card VALUES (${cardRecord});` + "\n";
        [...Array(faker.random.float(1) > 0.7 ? 1 : 2)].forEach((_) => {
            const petCategory = faker.random.arrayElement(fakePetCategories);
            const name = faker.name.firstName();
            const requirements = faker.lorem.sentence();
            const description = faker.lorem.sentence();
            const petRecord = `'${name}', '${email}', '${petCategory}', '${requirements}', '${description}'`;
            petOwners.push({
                owner: email,
                category: petCategory,
                requirements,
                description,
                name
            });
            postfix += `INSERT INTO pet VALUES (${petRecord});` + "\n";
        });
    }
    let caretakerStatus: CaretakerStatus = 0;
    if (faker.random.boolean()) {
        // care taker
        let specs: SpecializesIn[] = [];
        if (faker.random.boolean()) {
            // fulltime
            caretakerStatus = 2;
            postfix += `INSERT INTO full_time_ct VALUES ('${email}');` + "\n";
            faker.random
                .arrayElements(fakePetCategories, faker.random.number(2) + 1)
                .forEach((petCategory) => {
                    const dailyPrice = faker.random.number(20);
                    specs.push({
                        ctPriceDaily: dailyPrice,
                        typeName: petCategory
                    });
                    postfix +=
                        `INSERT INTO ft_specializes_in VALUES ('${email}', '${petCategory}', ${dailyPrice});` +
                        "\n";
                });
        } else {
            // part time
            caretakerStatus = 1;
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
                .arrayElements(fakePetCategories, faker.random.number(2) + 1)
                .forEach((petCategory) => {
                    const dailyPrice = faker.random.number(20);
                    specs.push({
                        ctPriceDaily: dailyPrice,
                        typeName: petCategory
                    });
                    postfix +=
                        `INSERT INTO pt_specializes_in VALUES ('${email}', '${petCategory}', ${dailyPrice});` +
                        "\n";
                });
        }
        careTakers.push({ email, allSpecializesIn: specs });
    }
    accounts.push({ email, password, caretakerStatus, petownerStatus });
    return `INSERT INTO person VALUES (${record});` + "\n" + postfix;
});

//fake bids
const TRANSPORT_METHOD: TransportMethod[] = ["delivery", "pickup", "pcs"];
const BID_STATUS: BidStatus[] = [
    "submitted",
    "confirmed",
    "reviewed",
    "closed"
];
const TODAY = "11/14/2020";
let start = moment(faker.date.recent(10, TODAY));
const end = moment(faker.date.soon(50, TODAY));
let fakeBids: string[] = [];
while (end.diff(start, "days") > 7) {
    const periodEnd = faker.date.soon(7, start.toDate());
    const bidDeets = {
        start_date: start.toISOString(),
        end_date: periodEnd.toISOString(),
        is_cash: true,
        feedback: ""
    };
    let unassignedOwners = new Set(petOwners);
    const bids: (Bid | null)[] = careTakers.map((caretaker) => {
        if (faker.random.float(1) < 0.4) return null;
        const category = faker.random.arrayElement(caretaker.allSpecializesIn);
        const validOwners = Array.from(unassignedOwners).filter(
            (pet) =>
                pet.owner !== caretaker.email &&
                pet.category === category.typeName
        );
        const assignment: Pet | null = faker.random.arrayElement(validOwners);
        if (!assignment) return null;
        unassignedOwners.delete(assignment);
        const transport_method = faker.random.arrayElement(TRANSPORT_METHOD);
        const bid_status = start.isBefore(moment(TODAY))
            ? BID_STATUS[1]
            : BID_STATUS[0];
        return {
            ...bidDeets,
            bid_status,
            ct_email: caretaker.email,
            transport_method,
            ct_price: category.ctPriceDaily,
            pet_name: assignment.name,
            pet_owner: assignment.owner
        };
    });
    const weeded = bids.filter((x) => x);
    fakeBids.push(
        ...weeded.map((bid) => {
            const {
                ct_email,
                ct_price,
                start_date,
                end_date,
                is_cash,
                transport_method,
                pet_owner,
                pet_name,
                bid_status
            } = bid!;
            return `INSERT INTO bid (ct_email, ct_price, start_date, end_date, is_cash, transport_method, pet_owner, pet_name, bid_status) VALUES ('${ct_email}', ${ct_price}, '${start_date}', '${end_date}', ${is_cash}, '${transport_method}', '${pet_owner}', '${pet_name}', '${bid_status}');`;
        })
    );
    const reviewedBids = weeded
        .filter((x) => start.isBefore(moment(TODAY)) && faker.random.boolean())
        .map((bid) => {
            const {
                ct_email,
                start_date,
                end_date,
                pet_owner,
                pet_name
            } = bid!;

            const feedback = faker.lorem.sentences(2);
            const rating = faker.random.number(2) + 3;
            return `UPDATE bid SET (bid_status, rating, feedback) = ('${BID_STATUS[2]}', ${rating}, '${feedback}') WHERE ct_email = '${ct_email}' AND pet_owner = '${pet_owner}' AND pet_name = '${pet_name}' AND start_date = Date('${start_date}') AND end_date = Date('${end_date}');`;
            // return `UPDATE INTO bid (ct_email, ct_price, start_date, end_date, is_cash, transport_method, pet_owner, pet_name, bid_status, feedback, rating) VALUES ('${ct_email}', ${ct_price}, '${start_date}', '${end_date}', ${is_cash}, '${transport_method}', '${pet_owner}', '${pet_name}', '${BID_STATUS[2]}', '${feedback}', ${rating});`;
        });
    fakeBids.push(...reviewedBids);
    start = moment(periodEnd).add(1, "day");
}

const seedString =
    petCatEntries.join("\n") + fakePeople.join("\n") + fakeBids.join("\n");
const MD_HEADER = `| email                          | password        | pet owner?  | caretaker? |
| ------------------------------ | --------------- | ----------- | ---------------- |
`;
fs.writeFileSync("sql/generatedSeed.sql", seedString);
fs.writeFileSync(
    "accounts.md",
    MD_HEADER +
        accounts
            .map(
                ({ email, password, petownerStatus, caretakerStatus }) =>
                    `| ${email} | ${password}| ${petownerStatus} | ${caretakerStatus} |`
            )
            .join("\n")
);

// export default seedString;
// run command with yarn ts-node sql/seedgen.ts

export const user_query = {
    userpass:
        "SELECT email, fullname, password, phone, address, role, avatar_link FROM person WHERE email=$1 LIMIT 1",
    add_user:
        "INSERT INTO person (email, fullname, password, address, phone, avatar_link) VALUES ($1,$2,$3,$4,$5,$6)"
};

export const pet_query = {
    get_pet: "SELECT * FROM pet WHERE name=$1 AND owner=$2",
    index_owner: "SELECT * FROM pet WHERE owner=$1",
    delete_pet: "DELETE FROM pet WHERE name=$1 AND owner=$2",
    create_pet:
        "INSERT INTO pet (name, owner, category, requirements, description) VALUES ($1, $2, $3, $4, $5)",
    update_pet:
        "UPDATE pet SET (name, owner, category, requirements, description) = ($1, $2, $3, $4, $5) WHERE name=$1 AND email=$2",
    get_pet_categories: "SELECT type_name, base_daily_price FROM pet_category",
    select_pet_category:
        "SELECT type_name, base_daily_price FROM pet_category WHERE type_name=$1",
    update_pet_category:
        "UPDATE pet_category SET (type_name, base_daily_price) = ($1, $2) WHERE type_name=$1",
    create_pet_category:
        "INSERT INTO pet_category (type_name, base_daily_price) VALUES ($1, $2)",
    delete_pet_category: "DELETE FROM pet_category WHERE type_name=$1"
};

export const credit_card_query = {
    get_credit_card:
        "SELECT * FROM credit_card WHERE card_number=$1 AND cardholder=$2",
    index_cardholder: "SELECT * FROM credit_card WHERE cardholder=$1",
    delete_credit_card:
        "DELETE FROM credit_card WHERE card_number=$1 AND cardholder=$2",
    create_credit_card:
        "INSERT INTO credit_card (card_number, cardholder, expiryDate, securityCode) VALUES ($1, $2, $3, $4)",
    update_credit_card:
        "UPDATE credit_card SET (card_number, cardholder, expiryDate, securityCode) = ($1, $2, $3, $4) WHERE card_number=$1 AND cardholder=$2"
};

const CARETAKER_ATTR = `fullname, phone, address, email, avatar_link, caretaker_status, rating, ct_price_daily`;

export const caretaker_query = {
    create_part_time_ct: `INSERT INTO part_time_ct (email) VALUES ($1)`,
    create_full_time_ct: `INSERT INTO full_time_ct (email) VALUES ($1)`,
    get_caretaker: `SELECT ${CARETAKER_ATTR} FROM (caretaker NATURAL JOIN person) WHERE email=$1`,
    index_caretaker: `SELECT ${CARETAKER_ATTR} FROM (caretaker NATURAL JOIN person)`,
    search_caretaker: `
        SELECT ${CARETAKER_ATTR} FROM (
            SELECT email, $3 as type_name FROM 
            (SELECT DISTINCT email 
                FROM pt_free_schedule 
                WHERE start_date <= $1 AND end_date >= $2
                UNION
                SELECT email FROM full_time_ct ftct
                WHERE NOT EXISTS (
                    SELECT 1 FROM ft_leave_schedule fts
                    WHERE fts.email = ftct.email
                    AND start_date <= $1
                    AND end_date >= $2
                    )
            ) as fs
            WHERE EXISTS (
                SELECT 1 FROM specializes_in s WHERE type_name = $3 AND s.email=fs.email
            )
        ) as s NATURAL JOIN person NATURAL JOIN caretaker NATURAL JOIN specializes_in
    `,
    // search_caretaker: `
    //     SELECT ${CARETAKER_DETAILS} FROM (
    //         SELECT DISTINCT email
    //         FROM pt_free_schedule
    //         WHERE start_date <= $1 AND end_date >= $1
    //         UNION
    //         SELECT email from full_time_ct ftct
    //         WHERE NOT EXISTS (
    //             SELECT 1 from ft_leave_schedule fts
    //             WHERE fts.email = ftct.email
    //             AND start_date <= $1
    //             AND end_date >= $1
    //         )
    //     ) as free_schedules NATURAL JOIN person
    // `,
    delete_caretaker: [
        `DELETE FROM part_time_ct where email=$1`,
        `DELETE FROM full_time_ct where email=$1`
    ],
    delete_specializes: `DELETE FROM specializes_in WHERE email=$1`,
    set_specializes: `INSERT INTO specializes_in VALUES ($1, $2)`
};

export const schedule_query = {
    index_pt_schedule: `SELECT * FROM pt_free_schedule WHERE email = $1`,
    index_ft_schedule: `SELECT * FROM ft_leave_schedule WHERE email = $1`,
    delete_schedule: [
        `DELETE FROM pt_free_schedule WHERE email = $1 AND start_date=$2 AND end_date=$3`,
        `DELETE FROM ft_leave_schedule WHERE email = $1 AND start_date=$2 AND end_date=$3`
    ],
    delete_pt_schedule: `DELETE FROM pt_free_schedule WHERE email = $1 AND start_date=$2 AND end_date=$3`,
    delete_ft_schedule: `DELETE FROM ft_leave_schedule WHERE email = $1 AND start_date=$2 AND end_date=$3`,
    create_pt_schedule: `INSERT INTO pt_free_schedule VALUES ($1, $2, $3)`,
    create_ft_schedule: `INSERT INTO ft_leave_schedule VALUES ($1, $2, $3)`
};

export const bid_query = {
    owner_get_bids: `SELECT * FROM bid WHERE email = $1`,
    caretaker_get_bids: `SELECT * FROM bid WHERE ct_email = $1`,
    create_bid: `
    INSERT INTO bid VALUES ($1, 
        SELECT ct_price_daily 
        FROM specializes_in
        WHERE email=$1 AND $type_name=$8 as ct_daily, 
        $2, $3, $4, $5, $6, $7, $8, $9, 
        SELECT (
            CASE 
            WHEN (
                SELECT caretaker_status 
                FROM caretaker 
                WHERE email = $1
                ) = 1 
            THEN 'submitted'
            ELSE 'confirmed' 
            END)
        FROM caretaker,
        NULL)`,
    delete_bid: `DELETE FROM bid WHERE ct_email = $1 AND pet_owner = $2 AND pet_name = $3 AND start_date = $4`,
    update_bid: `UPDATE bid SET (bid_status) = $5 WHERE ct_email = $1 AND pet_owner = $2 AND pet_name = $3 AND start_date = $4`
}

export default { user_query, pet_query, credit_card_query };

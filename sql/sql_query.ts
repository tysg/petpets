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
        "UPDATE pet SET (name, owner, category, requirements, description) = ($1, $2, $3, $4, $5) WHERE name=$1 AND owner=$2",
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

const CARETAKER_ATTR = `fullname, phone, address, email, avatar_link as avatarUrl, caretaker_status as caretakerStatus, rating`;

export const caretaker_query = {
    create_part_time_ct: `INSERT INTO part_time_ct (email) VALUES ($1)`,
    create_full_time_ct: `INSERT INTO full_time_ct (email) VALUES ($1)`,
    get_caretaker: `SELECT ${CARETAKER_ATTR} FROM (caretaker NATURAL JOIN person) WHERE email=$1`,
    index_caretaker: `SELECT ${CARETAKER_ATTR} FROM (caretaker NATURAL JOIN person)`,
    search_caretaker: `
    SELECT ${CARETAKER_ATTR}, ct_price_daily as ctPriceDaily, type_name as typeName FROM (
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
            ) as free_sched
            WHERE EXISTS (
                SELECT 1 FROM specializes_in s WHERE type_name = $3 AND s.email=free_sched.email
            ) 
        ) as s NATURAL JOIN person NATURAL JOIN caretaker NATURAL JOIN specializes_in
    `,
    // AND EXISTS (
    //     SELECT 1 FROM bids WHERE start_date <= $1 AND end_date >= $2 AND free_sched.email=ct_email GROUP BY ct_email HAVING COUNT(*) < 5
    // )
    delete_caretaker: [
        `DELETE FROM part_time_ct where email=$1`,
        `DELETE FROM full_time_ct where email=$1`
    ]
};

const bidByMonthByEmail = `
WITH month_bid as (
    SELECT 
    ct_price,
    start_date,
    end_date,
    end_date-start_date as days,
    to_char(start_date,'MM') as mon, 
    to_char(end_date,'MM') as mon2, 
    extract(year from start_date) as yy,
    extract(year from end_date) as yy2
    FROM bid
    WHERE ct_email=$1
),
month_sep as (
    select start_date,end_date,(end_date-start_date) + 1 as days, ct_price, mon,mon2,yy,yy2 from month_bid where mon=mon2 AND yy=yy2
    union 
    select start_date,end_date,((date_trunc('month', start_date) + interval '1 month' - interval '1 day')::date-start_date) + 1 as days, ct_price, mon, mon, yy, yy from month_bid where mon!=mon2 AND yy=yy2
    union
    select start_date,end_date,(end_date - (date_trunc('month', end_date))::date) + 1 as days, ct_price, mon2, mon2, yy, yy from month_bid where mon!=mon2 AND yy=yy2
    union
    select start_date,end_date,((date_trunc('month', start_date) + interval '1 month' - interval '1 day')::date-start_date) + 1 as days, ct_price, mon, mon, yy, yy2 from month_bid where mon!=mon2 AND yy!=yy2
    union
    select start_date,end_date,(end_date - (date_trunc('month', end_date))::date) + 1 as days, ct_price, mon2, mon2, yy, yy2 from month_bid where mon!=mon2 AND yy!=yy2
)`;

// TODO query bids and get monthly earnings
export const payments_query = {
    get_pt_caretaker_payments: `
    ${bidByMonthByEmail}
    select  mon, yy, sum(days), 0.75*sum(days * ct_price) from month_sep GROUP BY mon, yy
    `,
    get_ft_caretaker_payments: `
    WITH profile as (select * FROM bid WHERE ct_email='ftct@gmail.com')
    select ac.Date 
        from (
          	select CURRENT_DATE - (a.a + (10 * b.a) + (100 * c.a) + (1000 * d.a) || ' days')::interval as Date
            from (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as a
            cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as b
            cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as c
            cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as d
        ) as ac, profile as p
        where ac.Date >= p.start_date and ac.Date <= p.end_date
    `
};

export const specializes_query = {
    get_specializes: `SELECT type_name as typeName, ct_price_daily as ctPriceDaily FROM specializes_in WHERE email=$1`,
    delete_specializes: [
        `DELETE FROM ft_specializes_in WHERE email=$1`,
        `DELETE FROM pt_specializes_in WHERE email=$1`
    ],
    set_pt_specializes: `INSERT INTO pt_specializes_in VALUES ($1, $2, $3)`,
    set_ft_specializes: `INSERT INTO ft_specializes_in VALUES ($1, $2, $3)`
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
    owner_get_bids: `SELECT * FROM bid WHERE pet_owner = $1`,
    caretaker_get_bids: `SELECT * FROM bid WHERE ct_email = $1`,
    query_price: `SELECT ct_price_daily 
        FROM specializes_in
        WHERE email= $1 AND type_name= $2`,
    query_role: `SELECT caretaker_status 
        FROM caretaker 
        WHERE email = $1`,
    create_bid: `
    INSERT INTO bid VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `,
    delete_bid: `DELETE FROM bid WHERE ct_email = $1 AND pet_owner = $2 AND pet_name = $3 AND start_date = $4`,
    update_bid: `UPDATE bid SET bid_status = $5 WHERE ct_email = $1 AND pet_owner = $2 AND pet_name = $3 AND start_date = $4`
};

export default { user_query, pet_query, credit_card_query };

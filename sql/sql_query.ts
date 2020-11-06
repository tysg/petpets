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
    get_pet_category:
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
    delete_caretaker: [
        `DELETE FROM part_time_ct where email=$1`,
        `DELETE FROM full_time_ct where email=$1`
    ]
};

const ptPaymentMonthly = `
    SELECT 
        sum( (least(bid.end_date, endmonth) + 1 - greatest(bid.start_date, startmonth)) * ct_price) * 0.75 as fullpay, 
        to_char(startmonth, 'YYYY-MM'), 
        to_char(endmonth, 'YYYY-MM') 
        FROM (SELECT                                                                              
            generate_series(
                date_trunc('month', startend.sd),
                startend.ed, '1 month'
            )::date AS startmonth,
            (generate_series(
                date_trunc('month', startend.sd),
                startend.ed, '1 month'
            ) + interval '1 month' - interval '1 day' )::date AS endmonth
            FROM
            (SELECT min(start_date) AS sd, max(end_date) AS ed FROM bid WHERE ct_email=$1) AS startend
            ORDER BY 1
    ) AS monthly, bid 
    WHERE bid.start_date <= monthly.endmonth
    AND monthly.startmonth <= bid.end_date
    AND bid.bid_status = 'confirmed'
    GROUP BY monthly.endmonth, monthly.startmonth
    HAVING monthly.endmonth <= CURRENT_DATE
`;

const ftPaymentMonthly = `
SELECT coalesce(d4.fullpay, 3000.0) as fullpay, coalesce(d4.bonus, 0) as bonus, d3.month from 
    (SELECT * from
        (SELECT sum(rank_price)*0.8+3000 as fullpay, sum(rank_price)*0.8 as bonus, concat(yy, '-', mm) as month FROM
            (SELECT CASE WHEN ranked.r > 60 THEN 
                        ct_price
                    ELSE 0
                    END as rank_price,
                    mm, yy FROM (
                SELECT ct_price, dd, mm, yy, ROW_NUMBER() over (partition by mm, yy ORDER BY concat(date, ct_price, pet_owner, pet_name, ct_email) asc) as r FROM
                (SELECT
                    pet_owner, pet_name, ct_email, ct_price,
                    to_char(ac.date,'DD') as dd, 
                    to_char(ac.date,'MM') as mm, 
                    to_char(ac.date, 'YYYY') as yy,
                    date
                    FROM (SELECT                                                                              
                        generate_series(
                            date_trunc('month', startend.sd),
                            startend.ed, '1 day'
                        )::date as date
                        FROM (SELECT min(start_date) as sd, max(end_date) as ed 
                            FROM bid 
                            WHERE ct_email=$1 
                            AND end_date <= CURRENT_DATE 
                            AND bid_status='confirmed'
                        ) as startend ORDER BY sd
                    ) AS ac, (SELECT * FROM bid WHERE ct_email=$1) AS p
                    WHERE ac.Date >= p.start_date and ac.Date <= p.end_date 
                    ORDER BY ac.date) AS monthdates
                ) ranked
            ) rank_price GROUP BY mm, yy
        ) as d1) as d4
    RIGHT JOIN 
    (SELECT * from
        (SELECT                                                                              
            to_char(generate_series(
                date_trunc('month', startend.sd),
                startend.ed, '1 month'
            )::date, 'YYYY-MM') AS month
            FROM
            (SELECT min(start_date) AS sd, max(end_date) AS ed 
            FROM bid 
            WHERE ct_email=$1) AS startend
    ) as d2) as d3
    on d4.month=d3.month
`;

export const payments_query = {
    get_pt_caretaker_payments: ptPaymentMonthly,
    get_ft_caretaker_payments: ftPaymentMonthly
};

export const admin_query = {
    get_bids_by_month: `
        SELECT sum( (least(bid.end_date, endmonth) + 1 - greatest(bid.start_date, startmonth)) * ct_price), endmonth FROM 
            (SELECT                                                                              
                generate_series(
                    date_trunc('month', startend.sd),
                    startend.ed, '1 month'
                )::date as startmonth,
                (generate_series(
                    date_trunc('month', startend.sd),
                    startend.ed, '1 month'
                ) + interval '1 month' - interval '1 day' )::date as endmonth
                FROM
                (SELECT min(start_date) as sd, max(end_date) as ed FROM bid) as startend
                order by 1
        ) as sem, bid 
        WHERE bid.start_date <= sem.endmonth
        AND sem.startmonth <= bid.end_date
        AND bid.bid_status = 'confirmed'
        GROUP BY sem.endmonth
        HAVING endmonth <= CURRENT_DATE
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

// const ftPaymentMonthly = `
// SELECT count(*) as pet_days, sum(ct_price) as bonus, mm, yy FROM (
// 	SELECT ct_price, dd, mm, yy, ROW_NUMBER() over (partition by mm, yy order by concat(date, ct_price, pet_owner, pet_name, ct_email) asc) as r FROM
// 	(SELECT
// 		pet_owner,
// 		pet_name,
// 		ct_email,
// 		ct_price,
// 		to_char(ac.date,'DD') as dd,
// 		to_char(ac.date,'MM') as mm,
// 		extract(year from ac.date) as yy,
// 		date
// 		FROM
// 		(SELECT
// 			generate_series(
// 				date_trunc('month', startend.sd),
// 				startend.ed, '1 day'
// 			)::date as date
// 			from
// 			(SELECT min(start_date) as sd, max(end_date) as ed from bid WHERE ct_email=$1 AND end_date <= CURRENT_DATE AND bid_status='confirmed') as startend
// 			order by 1
// 		) as ac, (SELECT * FROM bid WHERE ct_email=$1) as p
// 		where ac.Date >= p.start_date and ac.Date <= p.end_date
// 		ORDER BY ac.date) as monthdates
// 	) ranked
//     WHERE ranked.r > 60
// 	group by mm, yy;
// `;

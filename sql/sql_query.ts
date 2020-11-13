export const user_query = {
    userpass:
        "SELECT email, fullname, password, phone, address, role, avatar_link FROM person WHERE email=$1 LIMIT 1",
    add_user:
        "INSERT INTO person (email, fullname, password, address, phone, avatar_link) VALUES ($1,$2,$3,$4,$5,$6)",
    update_user: `UPDATE person SET (fullname, address, phone, avatar_link) = ($1,$2,$3,$4) WHERE email=$5`
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
        "UPDATE pet_category SET (type_name, base_daily_price) = ($1, $2) WHERE type_name=$3",
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
        "INSERT INTO credit_card (card_number, cardholder, expiry_date, security_code) VALUES ($1, $2, $3, $4)",
    update_credit_card:
        "UPDATE credit_card SET (card_number, cardholder, expiry_date, security_code) = ($1, $2, $3, $4) WHERE card_number=$1 AND cardholder=$2"
};

const USER_ATTR = `fullname, phone, address, email, avatar_link as avatarurl`;
const CARETAKER_ATTR = `fullname, phone, address, email, avatar_link as avatarurl, caretaker_status as caretakerstatus, rating`;

export const caretaker_query = {
    create_part_time_ct: `INSERT INTO part_time_ct (email) VALUES ($1)`,
    create_full_time_ct: `INSERT INTO full_time_ct (email) VALUES ($1)`,
    get_caretaker: `SELECT ${CARETAKER_ATTR} FROM (caretaker NATURAL JOIN person) WHERE email=$1`,
    index_caretaker: `SELECT ${CARETAKER_ATTR} FROM (caretaker NATURAL JOIN person)`,
    // search_caretaker: `
    // SELECT ${CARETAKER_ATTR}, ct_price_daily as ctPriceDaily, type_name as typeName FROM (
    //     SELECT email, $3 as type_name FROM
    //         (SELECT DISTINCT email
    //             FROM pt_free_schedule
    //             WHERE start_date <= $1 AND end_date >= $2
    //         UNION
    //         SELECT email FROM full_time_ct ftct
    //             WHERE NOT EXISTS (
    //                 SELECT 1 FROM ft_leave_schedule fts
    //                 WHERE fts.email = ftct.email
    //                 AND start_date <= $1
    //                 AND end_date >= $2
    //             )
    //         ) as free_sched
    //         WHERE EXISTS (
    //             SELECT 1 FROM specializes_in s WHERE type_name = $3 AND s.email=free_sched.email
    //         )
    //     ) as s NATURAL JOIN person NATURAL JOIN caretaker NATURAL JOIN specializes_in
    // `,
    delete_caretaker: [
        `DELETE FROM part_time_ct where email=$1`,
        `DELETE FROM full_time_ct where email=$1`
    ],
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
        ) as s NATURAL JOIN person NATURAL JOIN caretaker c NATURAL JOIN specializes_in
        WHERE NOT EXISTS (
            select 1 FROM 
                (select
                    dates.date
                    from (
                        select
                            generate_series(
                                Date($1), Date($2), '1 day'
                            )::date as date
                    ) as dates, (select * FROM bid WHERE ct_email=c.email AND bid_status='confirmed') as p
                    where dates.date >= p.start_date and dates.date <= p.end_date 
                ORDER BY dates.date) as overlapDates
            group by overlapDates.date
            having count(*) >=
            (select 
                case 
                    when caretaker_status=2 OR rating > 4 then 5
                    else 2 end
                from caretaker where email=c.email)
        )
    `
};

const ptPaymentMonthly = `
    SELECT 
        sum( (least(ct_bid.end_date, endmonth) + 1 - greatest(ct_bid.start_date, startmonth)) * ct_price) * 0.75 as full_pay,
        to_char(startmonth, 'YYYY-MM') as month_year
        FROM (
            SELECT generate_series(
                date_trunc('month', startend.sd),
                startend.ed, '1 month'
            )::date AS startmonth,
            (generate_series(
                date_trunc('month', startend.sd),
                startend.ed, '1 month'
            ) + interval '1 month' - interval '1 day' )::date AS endmonth
            FROM
                (SELECT min(start_date) AS sd, max(end_date) as ed
                FROM bid 
                WHERE ct_email=$1 AND bid_status='confirmed') AS startend
                ORDER BY sd
        ) AS monthly, (SELECT * FROM bid WHERE bid.ct_email=$1 AND bid.bid_status='confirmed') as ct_bid
        WHERE ct_bid.start_date <= monthly.endmonth
        AND monthly.startmonth <= ct_bid.end_date
        AND ct_bid.start_date <= CURRENT_DATE
        GROUP BY monthly.endmonth, monthly.startmonth
        HAVING monthly.endmonth <= CURRENT_DATE
`;

const ftPaymentMonthly = `
SELECT COALESCE(d4.fullpay, 3000.0) AS full_pay, 
		COALESCE(d4.bonus, 0) AS bonus, 
		d3.month AS month_year FROM
		    (SELECT SUM(ct_price)*0.8+3000 AS fullpay, 
				 	SUM(ct_price)*0.8 AS bonus, 
				 	concat(yy, '-', mm) AS month FROM
				(SELECT ct_price, dd, mm, yy, 
						ROW_NUMBER() OVER (PARTITION BY mm, yy 
						ORDER BY concat(date, ct_price, pet_owner, pet_name, ct_email) ASC) AS r FROM
					(SELECT pet_owner, pet_name, ct_email, ct_price,
							to_char(gen_dates.date,'DD') AS dd, 
							to_char(gen_dates.date,'MM') AS mm, 
							to_char(gen_dates.date, 'YYYY') AS yy,
							date FROM
						(SELECT generate_series(
									date_trunc('month', startend.sd),
									startend.ed, '1 day'
								)::date AS date FROM
							(SELECT min(start_date) AS sd, CURRENT_DATE as ed FROM
								bid 
								WHERE ct_email=$1 
							) AS startend ORDER BY sd
						) AS gen_dates, (SELECT * FROM bid WHERE ct_email=$1) AS p
						WHERE gen_dates.date >= p.start_date AND gen_dates.date <= p.end_date 
						ORDER BY gen_dates.date
					) AS monthdates
				) rank_price WHERE r > 60 GROUP BY mm, yy
			) AS d4
			RIGHT JOIN 
			(SELECT                                                                              
					to_char(generate_series(
						date_trunc('month', startend.sd),
						startend.ed, '1 month'
					)::date, 'YYYY-MM') AS month FROM
				(SELECT min(start_date) AS sd, CURRENT_DATE AS ed FROM bid 
					WHERE ct_email=$1
				) AS startend
            ) AS d3
            ON d4.month=d3.month
        WHERE (Date(d3.month||'-01') + '1 month'::interval - '1 day'::interval) <= CURRENT_DATE
`;

export const payments_query = {
    get_pt_caretaker_payments: ptPaymentMonthly,
    get_ft_caretaker_payments: ftPaymentMonthly
};

export const admin_query = {
    get_monthly_revenue: `
        SELECT sum( (least(bid.end_date, endmonth) + 1 - greatest(bid.start_date, startmonth)) * ct_price) as earnings, to_char(startmonth, 'YYYY-MM') as year_month FROM 
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
        GROUP BY sem.startmonth
        HAVING startmonth <= CURRENT_DATE
    `,
    get_best_caretaker_by_month: `
        select * FROM (
            select 
            ct_earnings,
            ct_bid_count,
            year_month,
            ct_email,
            ROW_NUMBER() OVER (
                PARTITION BY year_month
                ORDER BY year_month, ct_earnings DESC
            ) as rank
            FROM (
                SELECT 
                    sum( (least(ct_bid.end_date, endmonth) + 1 - greatest(ct_bid.start_date, startmonth)) * ct_price) as ct_earnings,
                    count(*) as ct_bid_count,
                    to_char(startmonth, 'YYYY-MM') as year_month,
                    ct_email
                    FROM (
                        SELECT generate_series(
                            date_trunc('month', startend.sd),
                            startend.ed, '1 month'
                        )::date AS startmonth,
                        (generate_series(
                            date_trunc('month', startend.sd),
                            startend.ed, '1 month'
                        ) + interval '1 month' - interval '1 day' )::date AS endmonth
                        FROM
                            (SELECT min(start_date) AS sd, max(end_date) as ed
                            FROM bid WHERE bid_status='confirmed') AS startend
                            ORDER BY sd
                    ) AS monthly, (SELECT * FROM bid WHERE bid_status='confirmed') as ct_bid
                    WHERE ct_bid.start_date <= monthly.endmonth
                    AND monthly.startmonth <= ct_bid.end_date
                    GROUP BY startmonth, ct_email
                ) as monthly_earning 
                WHERE year_month=$2
        ) monthly_ranked NATURAL JOIN (select email as ct_email, caretaker_status, rating FROM caretaker) c NATURAL JOIN (SELECT email as ct_email, fullname, address, phone, avatar_link as avatar_url FROM person) p
        where rank < $1
        ORDER by rank ASC;
    `
};

export const specializes_query = {
    get_specializes: `SELECT type_name as typeName, ct_price_daily as ctPriceDaily FROM specializes_in WHERE email=$1`,
    get_specializes_admin: `SELECT type_name, ct_price_daily FROM specializes_in WHERE email=$1`,
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

const PERSON_ATTR = `fullname, avatar_link as avatar_url, phone, address, email as pet_owner`;
const PET_ATTR = `name as pet_name, owner as pet_owner, description, requirements, category`;

export const bid_query = {
    owner_get_bids: `SELECT * FROM bid WHERE pet_owner = $1`,
    caretaker_get_bids: `SELECT * FROM (select * from bid where ct_email=$1) b NATURAL JOIN (select ${PERSON_ATTR} FROM person) p NATURAL JOIN (select ${PET_ATTR} from pet) p2`,
    query_price: `SELECT ct_price_daily 
        FROM specializes_in
        WHERE email= $1 AND type_name= $2`,
    query_price_role: `SELECT caretaker_status, ct_price_daily
        FROM caretaker 
        NATURAL JOIN specializes_in 
        NATURAL JOIN 
        (select category as type_name FROM pet where name=$2 AND owner=$3) as ownerpet
        WHERE email=$1`,
    create_bid: `
    INSERT INTO bid VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `,
    delete_bid: `DELETE FROM bid WHERE ct_email = $1 AND pet_owner = $2 AND pet_name = $3 AND start_date = $4 $4 AND end_date = $5`,
    update_bid: `UPDATE bid SET (bid_status, rating, feedback) = ($6, $7, $8) WHERE ct_email = $1 AND pet_owner = $2 AND pet_name = $3 AND start_date = $4 AND end_date = $5`
};

export default { user_query, pet_query, credit_card_query };

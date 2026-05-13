# ═══════════════════════════════════════
# PHASE 1 — SQL FOUNDATIONS
# ═══════════════════════════════════════

### 📖 LESSON 1.1 — Basic Queries

```sql
-- Missing initial inserts
    (4, 1, 'A',  'Fall 2023'),
    (4, 5, 'A+', 'Fall 2023'),
    (5, 4, 'C+', 'Fall 2023'),
    (6, 1, 'A+', 'Fall 2023'),
    (6, 5, 'A+', 'Fall 2023'),
    (7, 2, 'B+', 'Fall 2023'),
    (8, 3, 'A',  'Fall 2023'),
    (9, 4, 'B',  'Fall 2023'),
    (10, 1, 'A', 'Fall 2023');
```

### Phase 1 Practice Queries (Solve These!)

```sql
-- Q1: Show all students sorted by CGPA (highest first)
SELECT name, cgpa FROM students ORDER BY cgpa DESC;

-- Q2: Find all students from Mumbai or Delhi
SELECT * FROM students WHERE city IN ('Mumbai', 'Delhi');

-- Q3: Find students with CGPA above 8.5
SELECT name, cgpa FROM students WHERE cgpa > 8.5;

-- Q4: List the first 5 students sorted by name alphabetically
SELECT * FROM students ORDER BY name ASC LIMIT 5;

-- Q5: How many unique cities do students come from?
SELECT DISTINCT city FROM students ORDER BY city;

-- Q6: Find students who joined in 2022
SELECT name, join_year FROM students WHERE join_year = 2022;

-- Q7: Find students whose name starts with 'A'
SELECT * FROM students WHERE name LIKE 'A%';

-- Q8: Find students between ages 20 and 21
SELECT name, age FROM students WHERE age BETWEEN 20 AND 21;
```

### 🏆 Final Phase 1 Challenge

```sql
-- Challenge 1: Find students from Mumbai with CGPA above 8.0, sorted by CGPA descending
-- Challenge 2: Show the name and email of the top 3 students by CGPA
-- Challenge 3: Find all students NOT from North Indian cities (not Delhi, not Agra, not Lucknow)
-- Challenge 4: Update Karan Joshi's CGPA to 7.8 (he passed a backlog)
-- Challenge 5: Delete a student who never enrolled (student_id 9 - Raj Kumar left the institute)
```

---

---

# ═══════════════════════════════════════
# PHASE 2 — INTERMEDIATE SQL
# ═══════════════════════════════════════

> **Goal:** Aggregate data, combine multiple tables, and write business-level queries.
> **Tool:** SQLite (continue using) — same schema, new powers.

---

## 📖 LESSON 2.1 — Aggregate Functions

### 🧠 Theory

So far, we've retrieved rows. Now we want to **calculate** things across rows — like the total number of students, or the average CGPA.

**Aggregate functions** take a whole column and produce a **single summary value**.

### 🔤 The 5 Core Aggregate Functions

| Function | What It Does | Example |
|----------|-------------|---------|
| `COUNT()` | Count number of rows | `COUNT(*) → 10` |
| `SUM()` | Add up all values | `SUM(salary) → 316000` |
| `AVG()` | Calculate average | `AVG(cgpa) → 8.41` |
| `MAX()` | Find the highest value | `MAX(cgpa) → 9.4` |
| `MIN()` | Find the lowest value | `MIN(cgpa) → 7.2` |

### 👁️ Real Examples

```sql
-- How many students are in the database?
SELECT COUNT(*) AS total_students FROM students;
-- Output: 10

-- COUNT(*) counts all rows
-- COUNT(column) counts only non-NULL values in that column

-- What is the average CGPA?
SELECT AVG(cgpa) AS average_cgpa FROM students;
-- Output: 8.41

-- What is the highest CGPA?
SELECT MAX(cgpa) AS highest_cgpa FROM students;
-- Output: 9.4

-- What is the lowest salary among teachers?
SELECT MIN(salary) AS lowest_salary FROM teachers;

-- What is the total salary expense?
SELECT SUM(salary) AS total_salary_expense FROM teachers;

-- How many students have a CGPA above 8.0?
SELECT COUNT(*) AS high_achievers
FROM students
WHERE cgpa > 8.0;
```

### ⚠️ Common Mistakes

```sql
-- ❌ WRONG: Mixing aggregate and non-aggregate without GROUP BY
SELECT name, AVG(cgpa) FROM students;
-- ERROR! You can't show "name" (individual) alongside AVG (summary) without grouping

-- ✅ CORRECT option 1: Use only aggregate
SELECT AVG(cgpa) FROM students;

-- ✅ CORRECT option 2: Use GROUP BY (next lesson)
SELECT city, AVG(cgpa) FROM students GROUP BY city;
```

---

## 📖 LESSON 2.2 — GROUP BY: Grouping Data

### 🧠 Theory

`GROUP BY` divides rows into groups based on a column's value, then applies aggregate functions to **each group separately**.

Think of it like: "For each city, calculate the average CGPA."

### 🔤 Syntax

```sql
SELECT column_to_group, AGGREGATE_FUNCTION(column)
FROM table_name
GROUP BY column_to_group;
```

### 👁️ Real Examples

```sql
-- Average CGPA per city
SELECT city, AVG(cgpa) AS avg_cgpa
FROM students
GROUP BY city;

-- Output:
-- Mumbai     | 8.75
-- Delhi      | 8.55
-- Bangalore  | 7.80
-- ...

-- How many students from each city?
SELECT city, COUNT(*) AS student_count
FROM students
GROUP BY city;

-- Max CGPA per join year
SELECT join_year, MAX(cgpa) AS top_cgpa
FROM students
GROUP BY join_year
ORDER BY join_year;

-- Multiple aggregates in one query
SELECT
    city,
    COUNT(*) AS total_students,
    AVG(cgpa) AS avg_cgpa,
    MAX(cgpa) AS top_cgpa,
    MIN(cgpa) AS lowest_cgpa
FROM students
GROUP BY city
ORDER BY avg_cgpa DESC;
```

---

## 📖 LESSON 2.3 — HAVING: Filtering Groups

### 🧠 Theory

`WHERE` filters **individual rows** before grouping.
`HAVING` filters **groups** after they have been formed.

Remember: **WHERE filters rows. HAVING filters groups.**

### 🔤 Syntax

```sql
SELECT column, AGGREGATE(column)
FROM table_name
GROUP BY column
HAVING AGGREGATE(column) condition;
```

### 👁️ Real Examples

```sql
-- Find cities where average CGPA is above 8.5
SELECT city, AVG(cgpa) AS avg_cgpa
FROM students
GROUP BY city
HAVING AVG(cgpa) > 8.5;

-- Find cities with more than 1 student
SELECT city, COUNT(*) AS student_count
FROM students
GROUP BY city
HAVING COUNT(*) > 1;

-- Courses with more than 2 enrollments
SELECT course_id, COUNT(*) AS enrollment_count
FROM enrollments
GROUP BY course_id
HAVING COUNT(*) > 2;
```

### 🧠 WHERE vs HAVING — Side by Side

```sql
-- WHERE: filters rows BEFORE grouping
-- "Only consider students with CGPA > 7, then group by city"
SELECT city, COUNT(*) FROM students
WHERE cgpa > 7
GROUP BY city;

-- HAVING: filters groups AFTER grouping
-- "Group by city, then only show cities with more than 1 student"
SELECT city, COUNT(*) FROM students
GROUP BY city
HAVING COUNT(*) > 1;

-- Both together: "Only consider students with cgpa > 7,
-- group by city, then only show cities with more than 1 such student"
SELECT city, COUNT(*), AVG(cgpa)
FROM students
WHERE cgpa > 7
GROUP BY city
HAVING COUNT(*) > 1;
```

---

## 📖 LESSON 2.4 — JOINs: Combining Tables

### 🧠 Theory

This is one of the most important topics in SQL. **JOINs** let you combine rows from two or more tables based on a related column.

Without JOINs, you can only see data from one table at a time. With JOINs, you can ask questions like: "Show me the student name AND their course name" — pulling from two different tables simultaneously.

### Types of JOINs — Visual Overview

```
Table A (students)     Table B (enrollments)
┌────┬───────┐         ┌────┬────────────┐
│ 1  │ Aryan │         │ 1  │ Math       │
│ 2  │ Priya │         │ 2  │ Physics    │
│ 3  │ Rohan │         │ 5  │ Chemistry  │  ← student_id 5 might not exist
└────┴───────┘         └────┴────────────┘
  (student_id)           (student_id FK)

INNER JOIN  → Only rows where both sides match (1, 2)
LEFT JOIN   → All from left + matching from right (1, 2, 3 + NULL for Rohan's courses)
RIGHT JOIN  → All from right + matching from left
FULL JOIN   → Everything from both sides
```

### 🔤 Syntax

```sql
SELECT columns
FROM table1
JOIN_TYPE table2
ON table1.column = table2.column;
```

---

### 2.4.1 — INNER JOIN

Returns **only rows where there is a match in BOTH tables**.

```sql
-- Show student name and the course they're enrolled in
SELECT
    students.name AS student_name,
    courses.course_name,
    enrollments.grade
FROM students
INNER JOIN enrollments ON students.student_id = enrollments.student_id
INNER JOIN courses     ON enrollments.course_id = courses.course_id;

-- Using table aliases to make it shorter:
SELECT
    s.name AS student_name,
    c.course_name,
    e.grade
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c     ON e.course_id  = c.course_id;
```

**Result:** Only students who ARE enrolled appear. Rohan (not enrolled in the sample data above) would NOT appear.

---

### 2.4.2 — LEFT JOIN (LEFT OUTER JOIN)

Returns **ALL rows from the LEFT table**, and matching rows from the right. Where there's no match, the right side shows **NULL**.

```sql
-- Show ALL students, and their courses if they have any
-- Students with NO enrollments show up with NULL for course columns
SELECT
    s.name AS student_name,
    c.course_name
FROM students s
LEFT JOIN enrollments e ON s.student_id = e.student_id
LEFT JOIN courses c     ON e.course_id  = c.course_id;

-- Find students who are NOT enrolled in any course
SELECT s.name
FROM students s
LEFT JOIN enrollments e ON s.student_id = e.student_id
WHERE e.enrollment_id IS NULL;
```

---

### 2.4.3 — RIGHT JOIN

Returns **ALL rows from the RIGHT table**, and matching from the left. (Less common — can always be rewritten as a LEFT JOIN by swapping tables.)

```sql
-- Show ALL courses, and enrolled students if any
SELECT
    c.course_name,
    s.name AS student_name
FROM students s
RIGHT JOIN enrollments e ON s.student_id = e.student_id
RIGHT JOIN courses c     ON e.course_id  = c.course_id;
```

---

### 2.4.4 — FULL OUTER JOIN

Returns **ALL rows from BOTH tables**. NULLs fill in where there's no match on either side.

> **Note:** SQLite doesn't support FULL OUTER JOIN natively. PostgreSQL does.

```sql
-- In PostgreSQL:
SELECT s.name, c.course_name
FROM students s
FULL OUTER JOIN enrollments e ON s.student_id = e.student_id
FULL OUTER JOIN courses c     ON e.course_id  = c.course_id;
```

### 👁️ JOIN Comparison Table

| JOIN Type | Left Table | Right Table | Use When |
|-----------|-----------|------------|----------|
| INNER JOIN | Only matched rows | Only matched rows | You only want complete pairs |
| LEFT JOIN | ALL rows | Matched or NULL | You want all from left, optionally matched on right |
| RIGHT JOIN | Matched or NULL | ALL rows | You want all from right |
| FULL JOIN | ALL rows | ALL rows | You want everything from both |

### ✏️ JOIN Exercises

```sql
-- E1: Show each teacher's name with their department name
SELECT t.name, d.dept_name
FROM teachers t
INNER JOIN departments d ON t.dept_id = d.dept_id;

-- E2: Show each course and who teaches it
SELECT c.course_name, t.name AS teacher_name
FROM courses c
INNER JOIN teachers t ON c.teacher_id = t.teacher_id;

-- E3: For each department, show how many teachers it has
SELECT d.dept_name, COUNT(t.teacher_id) AS teacher_count
FROM departments d
LEFT JOIN teachers t ON d.dept_id = t.dept_id
GROUP BY d.dept_name;
```

### ⚠️ Common Mistakes

```sql
-- ❌ WRONG: Forgetting the ON clause (creates a Cartesian Product — every row × every row!)
SELECT * FROM students JOIN enrollments;  -- Millions of rows!

-- ✅ CORRECT:
SELECT * FROM students JOIN enrollments ON students.student_id = enrollments.student_id;

-- ❌ WRONG: Ambiguous column reference (both tables have "name" column)
SELECT name FROM students JOIN teachers ON ...;  -- Which "name"?!

-- ✅ CORRECT: Always qualify with table name or alias
SELECT s.name AS student_name, t.name AS teacher_name FROM students s JOIN teachers t ON ...;
```

---

## 📖 LESSON 2.5 — UNION: Combining Query Results

### 🧠 Theory

`UNION` stacks the **results of two SELECT statements vertically** (on top of each other). Both queries must return the **same number of columns** with **compatible data types**.

- `UNION` removes duplicates
- `UNION ALL` keeps duplicates (faster)

### 👁️ Example

```sql
-- Get a combined list of all emails in the system (students + teachers)
SELECT email, 'Student' AS role FROM students
UNION
SELECT email, 'Teacher' AS role FROM teachers
ORDER BY email;
```

---

## 📖 LESSON 2.6 — Subqueries

### 🧠 Theory

A **subquery** is a query inside another query. The inner query runs first, and its result is used by the outer query. Think of it as: "Find me students who have a CGPA higher than the **average** CGPA." — You first need to know the average, then compare.

### 🔤 Types of Subqueries

```sql
-- 1. Subquery in WHERE clause
SELECT name, cgpa FROM students
WHERE cgpa > (SELECT AVG(cgpa) FROM students);
-- The (SELECT AVG(cgpa) FROM students) runs first → returns 8.41
-- Then outer query finds students with cgpa > 8.41

-- 2. Subquery in FROM clause (inline view)
SELECT avg_data.city, avg_data.avg_cgpa
FROM (
    SELECT city, AVG(cgpa) AS avg_cgpa
    FROM students
    GROUP BY city
) AS avg_data
WHERE avg_data.avg_cgpa > 8.5;

-- 3. Subquery with IN
SELECT name FROM students
WHERE student_id IN (
    SELECT student_id FROM enrollments
    WHERE course_id = 1
);
-- Find students enrolled in course_id = 1

-- 4. Subquery with EXISTS
SELECT name FROM students s
WHERE EXISTS (
    SELECT 1 FROM enrollments e
    WHERE e.student_id = s.student_id
);
-- Find students who have at least one enrollment
```

---

## 📖 LESSON 2.7 — CASE Statements

### 🧠 Theory

`CASE` is SQL's version of an **if/else** statement. You can create conditional logic inside a query.

### 🔤 Syntax

```sql
SELECT
    column,
    CASE
        WHEN condition1 THEN result1
        WHEN condition2 THEN result2
        ELSE default_result
    END AS alias_name
FROM table;
```

### 👁️ Real Examples

```sql
-- Classify students by CGPA
SELECT
    name,
    cgpa,
    CASE
        WHEN cgpa >= 9.0 THEN 'Distinction'
        WHEN cgpa >= 8.0 THEN 'First Class'
        WHEN cgpa >= 7.0 THEN 'Second Class'
        ELSE 'Pass Class'
    END AS performance_category
FROM students;

-- Assign grade points
SELECT
    name,
    grade,
    CASE grade
        WHEN 'A+' THEN 10
        WHEN 'A'  THEN 9
        WHEN 'B+' THEN 8
        WHEN 'B'  THEN 7
        WHEN 'C+' THEN 6
        ELSE 5
    END AS grade_points
FROM enrollments
JOIN students USING (student_id);
```

---

## 📖 LESSON 2.8 — Database Constraints

### 🧠 Theory

**Constraints** are rules enforced at the database level to ensure data quality.

| Constraint | Purpose | Example |
|------------|---------|---------|
| `PRIMARY KEY` | Unique identifier, no NULL | `id INTEGER PRIMARY KEY` |
| `FOREIGN KEY` | Enforces relationship integrity | Links to another table's PK |
| `NOT NULL` | Column cannot be empty | `name TEXT NOT NULL` |
| `UNIQUE` | All values in column must be different | `email TEXT UNIQUE` |
| `DEFAULT` | Provides default value if none given | `status TEXT DEFAULT 'active'` |
| `CHECK` | Enforces a custom condition | `age INTEGER CHECK(age >= 18)` |

```sql
CREATE TABLE products (
    product_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    price       REAL    NOT NULL CHECK(price > 0),
    stock       INTEGER DEFAULT 0 CHECK(stock >= 0),
    category    TEXT    NOT NULL,
    sku         TEXT    UNIQUE
);
```

---

## 📖 LESSON 2.9 — Normalization

### 🧠 Theory

**Normalization** is the process of organizing a database to reduce data **redundancy** (repetition) and improve **integrity** (accuracy).

### The Problem Without Normalization

Imagine storing everything in ONE table:

| order_id | customer_name | customer_email | customer_city | product_name | product_price |
|----------|--------------|----------------|---------------|--------------|---------------|
| 1 | Aryan | aryan@... | Mumbai | Laptop | 50000 |
| 2 | Aryan | aryan@... | Mumbai | Mouse | 500 |
| 3 | Priya | priya@... | Delhi | Laptop | 50000 |

**Problems:**
1. If Aryan changes his email, you must update ALL his rows
2. If the laptop price changes, update every row that mentions it
3. Wasted storage from repeating the same data

### Normal Forms

**1NF (First Normal Form):** Each column contains atomic (single, indivisible) values. No repeating groups.

```sql
-- ❌ Bad (not 1NF): courses column has multiple values
| student_id | courses              |
| 1          | Math, Physics, CS    |   -- Multiple values in one column!

-- ✅ Good (1NF): One value per cell
| student_id | course    |
| 1          | Math      |
| 1          | Physics   |
| 1          | CS        |
```

**2NF (Second Normal Form):** Must be 1NF, plus every non-key column must depend on the **entire** primary key.

**3NF (Third Normal Form):** Must be 2NF, plus no non-key column should depend on another non-key column (no transitive dependencies).

> **Practical rule:** If you find yourself repeating the same data in multiple rows, it probably belongs in its own table.

---

## 🏗️ PHASE 2 PROJECT — E-Commerce Database System

### Project Overview
Build the database for **"ShopEase"** — an Indian e-commerce platform like Meesho or Flipkart.

### Schema Design

```sql
-- Users table
CREATE TABLE users (
    user_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    UNIQUE NOT NULL,
    phone       TEXT    UNIQUE,
    city        TEXT,
    state       TEXT,
    created_at  TEXT    DEFAULT (datetime('now'))
);

-- Categories table
CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    parent_id   INTEGER,  -- For subcategories (Electronics > Phones)
    FOREIGN KEY (parent_id) REFERENCES categories(category_id)
);

-- Products table
CREATE TABLE products (
    product_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT,
    price       REAL    NOT NULL CHECK(price > 0),
    stock       INTEGER DEFAULT 0 CHECK(stock >= 0),
    category_id INTEGER NOT NULL,
    seller_id   INTEGER NOT NULL,
    rating      REAL    CHECK(rating BETWEEN 0 AND 5),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (seller_id)   REFERENCES users(user_id)
);

-- Orders table
CREATE TABLE orders (
    order_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL,
    order_date    TEXT    DEFAULT (datetime('now')),
    total_amount  REAL    NOT NULL,
    status        TEXT    DEFAULT 'pending'
                          CHECK(status IN ('pending','confirmed','shipped','delivered','cancelled')),
    shipping_city TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Order items table (an order can have multiple products)
CREATE TABLE order_items (
    item_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id   INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity   INTEGER NOT NULL CHECK(quantity > 0),
    unit_price REAL    NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Reviews table
CREATE TABLE reviews (
    review_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    user_id    INTEGER NOT NULL,
    rating     INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment    TEXT,
    review_date TEXT   DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (user_id)    REFERENCES users(user_id)
);
```

### Phase 2 Business Queries

```sql
-- Q1: Total revenue per month
SELECT
    strftime('%Y-%m', order_date) AS month,
    SUM(total_amount) AS revenue,
    COUNT(*) AS total_orders
FROM orders
WHERE status = 'delivered'
GROUP BY strftime('%Y-%m', order_date)
ORDER BY month;

-- Q2: Top 5 best-selling products
SELECT
    p.name AS product_name,
    SUM(oi.quantity) AS total_units_sold,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o   ON oi.order_id   = o.order_id
WHERE o.status = 'delivered'
GROUP BY p.product_id, p.name
ORDER BY total_units_sold DESC
LIMIT 5;

-- Q3: Customers who spent more than the average customer
SELECT
    u.name,
    SUM(o.total_amount) AS total_spent
FROM users u
JOIN orders o ON u.user_id = o.user_id
WHERE o.status = 'delivered'
GROUP BY u.user_id, u.name
HAVING SUM(o.total_amount) > (
    SELECT AVG(user_total)
    FROM (
        SELECT SUM(total_amount) AS user_total
        FROM orders
        WHERE status = 'delivered'
        GROUP BY user_id
    )
);

-- Q4: Products with below-average ratings classified by quality
SELECT
    name,
    rating,
    CASE
        WHEN rating >= 4.5 THEN 'Excellent'
        WHEN rating >= 3.5 THEN 'Good'
        WHEN rating >= 2.5 THEN 'Average'
        ELSE 'Poor'
    END AS quality_label
FROM products
WHERE rating IS NOT NULL
ORDER BY rating DESC;

-- Q5: Find users who placed an order but never left a review
SELECT DISTINCT u.name, u.email
FROM users u
JOIN orders o     ON u.user_id     = o.user_id
JOIN order_items oi ON o.order_id  = oi.order_id
WHERE NOT EXISTS (
    SELECT 1 FROM reviews r
    WHERE r.user_id    = u.user_id
    AND   r.product_id = oi.product_id
);
```

---

---

# ═══════════════════════════════════════
# PHASE 3 — ADVANCED SQL
# ═══════════════════════════════════════

> **Goal:** Write expert-level SQL — CTEs, window functions, optimization, transactions, and database programming.
> **Switch to PostgreSQL now.** Install from https://www.postgresql.org/download/ and use pgAdmin.

---

## 📖 LESSON 3.1 — CTEs (Common Table Expressions)

### 🧠 Theory

A **CTE** is a named temporary result set that exists only for the duration of a query. It's like giving a subquery a readable name. CTEs make complex queries easier to read and maintain.

Think of it like: "Let me first define what 'high earners' means, then use that definition in my main query."

### 🔤 Syntax

```sql
WITH cte_name AS (
    -- Your subquery here
    SELECT ...
),
another_cte AS (
    -- You can reference the previous CTE here!
    SELECT ... FROM cte_name
)
SELECT * FROM another_cte;
```

### 👁️ Real Examples

```sql
-- Without CTE (hard to read):
SELECT name FROM students
WHERE cgpa > (SELECT AVG(cgpa) FROM students);

-- With CTE (readable):
WITH avg_cgpa AS (
    SELECT AVG(cgpa) AS avg_val FROM students
)
SELECT name, cgpa
FROM students, avg_cgpa
WHERE cgpa > avg_val;

-- Multiple CTEs: Find top students per city
WITH
city_averages AS (
    SELECT city, AVG(cgpa) AS city_avg
    FROM students
    GROUP BY city
),
top_students AS (
    SELECT s.name, s.city, s.cgpa, ca.city_avg
    FROM students s
    JOIN city_averages ca ON s.city = ca.city
    WHERE s.cgpa >= ca.city_avg
)
SELECT * FROM top_students
ORDER BY city, cgpa DESC;
```

### 🔤 Recursive CTEs — Traversing Hierarchies

Recursive CTEs are used for hierarchical data like org charts, category trees, or folder structures.

```sql
-- Find all subcategories of 'Electronics' (any depth)
WITH RECURSIVE category_tree AS (
    -- Base case: start with Electronics
    SELECT category_id, name, parent_id, 0 AS level
    FROM categories
    WHERE name = 'Electronics'

    UNION ALL

    -- Recursive case: find children of current level
    SELECT c.category_id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.category_id
)
SELECT * FROM category_tree ORDER BY level;
```

---

## 📖 LESSON 3.2 — Window Functions

### 🧠 Theory

Window functions are one of the most powerful features in SQL. They perform a calculation **across a set of rows related to the current row**, without collapsing the rows like GROUP BY does.

Think of it like: "For each row, look at a 'window' of related rows and calculate something."

**GROUP BY** → collapses many rows into one result
**Window Functions** → keeps all rows, but adds a calculated column based on a group

### 🔤 Syntax

```sql
SELECT
    column,
    FUNCTION() OVER (
        PARTITION BY column    -- Defines the "window" (like GROUP BY but no collapse)
        ORDER BY column        -- Order within the window
        ROWS BETWEEN ... AND ...  -- Frame specification (optional)
    ) AS result_column
FROM table;
```

### 🧠 Window Function Types

| Function | Category | What It Does |
|----------|----------|-------------|
| `ROW_NUMBER()` | Ranking | Sequential number: 1, 2, 3... |
| `RANK()` | Ranking | 1, 2, 2, 4... (skips after ties) |
| `DENSE_RANK()` | Ranking | 1, 2, 2, 3... (no skipping) |
| `NTILE(n)` | Ranking | Divides into n equal buckets |
| `LAG(col, n)` | Navigation | Value from n rows behind |
| `LEAD(col, n)` | Navigation | Value from n rows ahead |
| `FIRST_VALUE(col)` | Navigation | First value in window |
| `LAST_VALUE(col)` | Navigation | Last value in window |
| `SUM()` | Aggregate | Running or partitioned sum |
| `AVG()` | Aggregate | Running or partitioned average |

### 👁️ Real Examples

```sql
-- 1. Rank students by CGPA overall
SELECT
    name,
    cgpa,
    RANK() OVER (ORDER BY cgpa DESC) AS overall_rank
FROM students;

-- 2. Rank students within their city
SELECT
    name,
    city,
    cgpa,
    RANK() OVER (PARTITION BY city ORDER BY cgpa DESC) AS city_rank
FROM students;
-- Each city restarts ranking from 1

-- 3. ROW_NUMBER vs RANK vs DENSE_RANK (on ties)
SELECT
    name,
    cgpa,
    ROW_NUMBER()  OVER (ORDER BY cgpa DESC) AS row_num,
    RANK()        OVER (ORDER BY cgpa DESC) AS rank_val,
    DENSE_RANK()  OVER (ORDER BY cgpa DESC) AS dense_rank
FROM students;

-- 4. Running total of order amounts (cumulative sum)
SELECT
    order_id,
    order_date,
    total_amount,
    SUM(total_amount) OVER (ORDER BY order_date) AS running_total
FROM orders
ORDER BY order_date;

-- 5. Compare each order to the previous order (LAG)
SELECT
    order_id,
    order_date,
    total_amount,
    LAG(total_amount, 1) OVER (ORDER BY order_date) AS prev_order_amount,
    total_amount - LAG(total_amount, 1) OVER (ORDER BY order_date) AS change
FROM orders;

-- 6. Top 3 students per city using DENSE_RANK (real interview question!)
WITH ranked_students AS (
    SELECT
        name,
        city,
        cgpa,
        DENSE_RANK() OVER (PARTITION BY city ORDER BY cgpa DESC) AS city_rank
    FROM students
)
SELECT * FROM ranked_students
WHERE city_rank <= 3;
```

---

## 📖 LESSON 3.3 — Indexes

### 🧠 Theory

An **index** is a database structure that speeds up data retrieval. Think of it like a book index — instead of reading every page to find "recursion," you look it up in the back index and jump to the right page.

Without an index, a query with `WHERE email = 'user@email.com'` scans **every single row** — called a **full table scan**. With an index on `email`, the database jumps directly to the right row.

**Trade-off:** Indexes speed up reads but **slow down writes** (INSERT/UPDATE/DELETE must also update the index) and use more storage.

### 🔤 Syntax

```sql
-- Create a simple index
CREATE INDEX idx_students_city ON students(city);

-- Create a unique index (also enforces uniqueness)
CREATE UNIQUE INDEX idx_students_email ON students(email);

-- Create a composite (multi-column) index
CREATE INDEX idx_orders_user_date ON orders(user_id, order_date);

-- Drop an index
DROP INDEX idx_students_city;

-- View query execution plan (PostgreSQL)
EXPLAIN ANALYZE SELECT * FROM students WHERE city = 'Mumbai';
```

### 🧠 When to Create an Index

| Create Index When | Don't Create Index When |
|------------------|------------------------|
| Column is frequently in WHERE | Table is very small |
| Column is used in JOIN conditions | Column is rarely queried |
| Column is used in ORDER BY | Column has very few distinct values |
| Foreign key columns | Table has frequent INSERT/UPDATE/DELETE |

---

## 📖 LESSON 3.4 — Query Optimization

### 🧠 Theory

Writing a query that works is step one. Writing a query that is **fast** is what separates professionals.

### Optimization Rules

```sql
-- RULE 1: Use specific columns, not SELECT *
-- ❌ Slow:
SELECT * FROM orders WHERE user_id = 1;
-- ✅ Fast:
SELECT order_id, total_amount, status FROM orders WHERE user_id = 1;

-- RULE 2: Filter early with WHERE
-- ❌ Filter after joining:
SELECT * FROM orders o JOIN users u ON o.user_id = u.user_id
WHERE o.status = 'pending';
-- ✅ Filter before joining (using subquery or CTE):
WITH pending_orders AS (
    SELECT * FROM orders WHERE status = 'pending'
)
SELECT * FROM pending_orders p JOIN users u ON p.user_id = u.user_id;

-- RULE 3: Avoid functions on indexed columns in WHERE
-- ❌ Index on city won't be used here:
SELECT * FROM students WHERE UPPER(city) = 'MUMBAI';
-- ✅ Store data consistently, query directly:
SELECT * FROM students WHERE city = 'Mumbai';

-- RULE 4: Use EXISTS instead of IN for large subqueries
-- ❌ IN loads entire subquery result:
SELECT * FROM students WHERE student_id IN (SELECT student_id FROM enrollments);
-- ✅ EXISTS stops as soon as first match is found:
SELECT * FROM students s WHERE EXISTS (
    SELECT 1 FROM enrollments e WHERE e.student_id = s.student_id
);

-- RULE 5: Use EXPLAIN to see what the database is doing
EXPLAIN SELECT * FROM orders WHERE user_id = 5;
```

---

## 📖 LESSON 3.5 — Transactions & ACID

### 🧠 Theory

A **transaction** is a group of SQL operations that are executed as a **single unit**. Either ALL of them succeed, or NONE of them do.

**Classic Example:** Bank transfer — deduct ₹1000 from Account A AND add ₹1000 to Account B. If the deduction succeeds but adding fails (due to a crash), you'd lose money! A transaction ensures either both happen, or neither does.

### ACID Properties

| Property | Meaning | Example |
|----------|---------|---------|
| **Atomicity** | All or nothing | Transfer: both debit AND credit, or neither |
| **Consistency** | Data remains valid | Balance can't go negative if there's a constraint |
| **Isolation** | Concurrent transactions don't interfere | Two users booking the last seat simultaneously |
| **Durability** | Committed data survives crashes | Written to disk, not just memory |

### 🔤 Syntax

```sql
BEGIN;               -- Start transaction (or BEGIN TRANSACTION)

    UPDATE accounts SET balance = balance - 1000 WHERE account_id = 1;
    UPDATE accounts SET balance = balance + 1000 WHERE account_id = 2;

COMMIT;              -- Save all changes permanently

-- OR if something goes wrong:
ROLLBACK;            -- Undo ALL changes since BEGIN
```

### 👁️ Real Example

```sql
BEGIN;

-- Place an order
INSERT INTO orders (user_id, total_amount, status)
VALUES (1, 5000.00, 'confirmed');

-- Reduce stock for the ordered product
UPDATE products
SET stock = stock - 1
WHERE product_id = 42 AND stock > 0;

-- If the UPDATE affected 0 rows (out of stock), ROLLBACK
-- Otherwise, COMMIT

COMMIT;
```

### SAVEPOINT — Partial Rollback

```sql
BEGIN;
    INSERT INTO orders ... ;

    SAVEPOINT after_order;  -- Set a checkpoint

    UPDATE products ... ;   -- If this fails:
    ROLLBACK TO after_order; -- Roll back ONLY to here, not all the way to BEGIN

COMMIT;
```

---

## 📖 LESSON 3.6 — Views

### 🧠 Theory

A **view** is a saved SELECT query that acts like a virtual table. You create it once and query it like a table.

**Benefits:**
- Simplify complex queries
- Hide sensitive columns (e.g., hide salary column from some users)
- Provide consistent interface when underlying tables change

### 🔤 Syntax

```sql
-- Create a view
CREATE VIEW view_name AS
SELECT ...;

-- Query a view (exactly like a table)
SELECT * FROM view_name;

-- Update a view
CREATE OR REPLACE VIEW view_name AS
SELECT ...;

-- Delete a view
DROP VIEW view_name;
```

### 👁️ Real Examples

```sql
-- View: Student enrollment summary
CREATE VIEW student_enrollment_summary AS
SELECT
    s.student_id,
    s.name AS student_name,
    s.cgpa,
    COUNT(e.enrollment_id) AS courses_enrolled,
    STRING_AGG(c.course_name, ', ') AS course_list
FROM students s
LEFT JOIN enrollments e ON s.student_id = e.student_id
LEFT JOIN courses c     ON e.course_id  = c.course_id
GROUP BY s.student_id, s.name, s.cgpa;

-- Now you can just do:
SELECT * FROM student_enrollment_summary WHERE cgpa > 8.5;

-- View: High-value customers (revenue > 10000)
CREATE VIEW high_value_customers AS
SELECT
    u.user_id,
    u.name,
    u.email,
    SUM(o.total_amount) AS lifetime_value
FROM users u
JOIN orders o ON u.user_id = o.user_id
WHERE o.status = 'delivered'
GROUP BY u.user_id, u.name, u.email
HAVING SUM(o.total_amount) > 10000;
```

---

## 📖 LESSON 3.7 — Stored Procedures and Functions

### 🧠 Theory

A **stored procedure** is a reusable block of SQL code stored in the database. Instead of writing the same complex query repeatedly, you save it as a procedure and call it by name.

A **function** is similar but returns a value.

### 👁️ PostgreSQL Function Example

```sql
-- Function: Get student grade category
CREATE OR REPLACE FUNCTION get_grade_category(cgpa_val REAL)
RETURNS TEXT AS $$
BEGIN
    IF cgpa_val >= 9.0 THEN RETURN 'Distinction';
    ELSIF cgpa_val >= 8.0 THEN RETURN 'First Class';
    ELSIF cgpa_val >= 7.0 THEN RETURN 'Second Class';
    ELSE RETURN 'Pass Class';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Use the function:
SELECT name, cgpa, get_grade_category(cgpa) AS category
FROM students;

-- Stored procedure: Enroll a student
CREATE OR REPLACE PROCEDURE enroll_student(
    p_student_id INTEGER,
    p_course_id  INTEGER,
    p_semester   TEXT
)
LANGUAGE plpgsql AS $$
BEGIN
    -- Check if already enrolled
    IF EXISTS (
        SELECT 1 FROM enrollments
        WHERE student_id = p_student_id AND course_id = p_course_id
    ) THEN
        RAISE EXCEPTION 'Student % is already enrolled in course %',
            p_student_id, p_course_id;
    END IF;

    INSERT INTO enrollments (student_id, course_id, semester)
    VALUES (p_student_id, p_course_id, p_semester);
END;
$$;

-- Call the procedure:
CALL enroll_student(1, 3, 'Spring 2024');
```

---

## 📖 LESSON 3.8 — Triggers

### 🧠 Theory

A **trigger** is a stored procedure that **automatically runs** when a specific event (INSERT, UPDATE, DELETE) occurs on a table.

### 👁️ Real Examples

```sql
-- Trigger: Automatically log every order status change
CREATE TABLE order_status_log (
    log_id      SERIAL PRIMARY KEY,
    order_id    INTEGER,
    old_status  TEXT,
    new_status  TEXT,
    changed_at  TIMESTAMP DEFAULT NOW(),
    changed_by  TEXT DEFAULT CURRENT_USER
);

CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO order_status_log (order_id, old_status, new_status)
        VALUES (OLD.order_id, OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();

-- Now every time an order's status changes, it's automatically logged!
```

---

## 🏗️ PHASE 3 PROJECT — Food Delivery Analytics System

### Project: "ZapEats" Analytics Database

```sql
-- Full PostgreSQL schema
CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name          TEXT   NOT NULL,
    city          TEXT   NOT NULL,
    cuisine_type  TEXT,
    rating        NUMERIC(3,2) CHECK(rating BETWEEN 0 AND 5),
    delivery_time INTEGER  -- average in minutes
);

CREATE TABLE menu_items (
    item_id       SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(restaurant_id),
    name          TEXT NOT NULL,
    price         NUMERIC(10,2) NOT NULL CHECK(price > 0),
    category      TEXT,
    is_available  BOOLEAN DEFAULT true
);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    city        TEXT,
    joined_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE delivery_orders (
    order_id       SERIAL PRIMARY KEY,
    customer_id    INTEGER REFERENCES customers(customer_id),
    restaurant_id  INTEGER REFERENCES restaurants(restaurant_id),
    order_time     TIMESTAMP DEFAULT NOW(),
    delivery_time  TIMESTAMP,
    total_amount   NUMERIC(10,2) NOT NULL,
    status         TEXT DEFAULT 'placed'
                       CHECK(status IN ('placed','preparing','out_for_delivery','delivered','cancelled')),
    delivery_mins  INTEGER  -- actual delivery time
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id      INTEGER REFERENCES delivery_orders(order_id),
    item_id       INTEGER REFERENCES menu_items(item_id),
    quantity      INTEGER NOT NULL CHECK(quantity > 0),
    price         NUMERIC(10,2) NOT NULL
);
```

### Analytics Queries (Advanced Level)

```sql
-- A1: Restaurant performance dashboard
WITH restaurant_stats AS (
    SELECT
        r.restaurant_id,
        r.name,
        r.city,
        COUNT(o.order_id)        AS total_orders,
        SUM(o.total_amount)      AS total_revenue,
        AVG(o.delivery_mins)     AS avg_delivery_time,
        COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) AS cancellations
    FROM restaurants r
    LEFT JOIN delivery_orders o ON r.restaurant_id = o.restaurant_id
    GROUP BY r.restaurant_id, r.name, r.city
)
SELECT
    *,
    ROUND(cancellations::NUMERIC / NULLIF(total_orders, 0) * 100, 2) AS cancellation_rate_pct,
    RANK() OVER (PARTITION BY city ORDER BY total_revenue DESC) AS city_revenue_rank
FROM restaurant_stats
ORDER BY total_revenue DESC;

-- A2: Customer retention — repeat vs one-time customers
WITH customer_order_count AS (
    SELECT
        customer_id,
        COUNT(*) AS order_count
    FROM delivery_orders
    WHERE status = 'delivered'
    GROUP BY customer_id
)
SELECT
    CASE
        WHEN order_count = 1 THEN 'One-Time'
        WHEN order_count BETWEEN 2 AND 5 THEN 'Occasional'
        WHEN order_count > 5 THEN 'Loyal'
    END AS customer_type,
    COUNT(*) AS customer_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM customer_order_count
GROUP BY customer_type;

-- A3: Hour-of-day order volume (peak time analysis)
SELECT
    EXTRACT(HOUR FROM order_time) AS hour_of_day,
    COUNT(*) AS order_count,
    ROUND(AVG(total_amount), 2) AS avg_order_value
FROM delivery_orders
GROUP BY EXTRACT(HOUR FROM order_time)
ORDER BY order_count DESC;

-- A4: Month-over-month revenue growth
WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', order_time) AS month,
        SUM(total_amount) AS revenue
    FROM delivery_orders
    WHERE status = 'delivered'
    GROUP BY DATE_TRUNC('month', order_time)
)
SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
    ROUND(
        (revenue - LAG(revenue) OVER (ORDER BY month)) /
        NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100,
        2
    ) AS growth_pct
FROM monthly_revenue;
```

---

---

# ═══════════════════════════════════════
# PHASE 4 — POSTGRESQL DEEP DIVE
# ═══════════════════════════════════════

> **Goal:** Master PostgreSQL-specific features used in production systems.

---

## 📖 LESSON 4.1 — PostgreSQL Setup

### Installation Steps

```
1. Download PostgreSQL from https://www.postgresql.org/download/
2. During installation:
   - Set a password for the 'postgres' superuser (remember this!)
   - Default port: 5432
3. Install pgAdmin (usually bundled)
4. Open pgAdmin → connect to server using your password

Command line access:
  psql -U postgres            → login as postgres user
  \l                          → list databases
  \c database_name            → connect to a database
  \dt                         → list all tables
  \d table_name               → describe table structure
  \q                          → quit
```

### Creating a Database

```sql
-- In psql or pgAdmin Query Tool:
CREATE DATABASE shopease_db;
\c shopease_db  -- connect to it

-- Create a user for your application (don't use superuser in apps!)
CREATE USER app_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE shopease_db TO app_user;
```

---

## 📖 LESSON 4.2 — PostgreSQL-Specific Data Types

### 🧠 Beyond Standard SQL Types

| Type | Description | Example |
|------|-------------|---------|
| `SERIAL` / `BIGSERIAL` | Auto-incrementing integer | `id SERIAL PRIMARY KEY` |
| `UUID` | Globally unique ID | `'550e8400-e29b-41d4-a716-446655440000'` |
| `JSONB` | JSON stored as binary (searchable) | `'{"name": "Aryan", "age": 20}'` |
| `ARRAY` | Column storing an array of values | `ARRAY['tag1', 'tag2']` |
| `TIMESTAMP WITH TIME ZONE` | Timezone-aware timestamp | `NOW()` |
| `INTERVAL` | Time duration | `INTERVAL '3 days'` |
| `INET` | IP address | `'192.168.1.1'` |
| `TSVECTOR` | Full-text search document | Used with `to_tsvector()` |

---

## 📖 LESSON 4.3 — JSONB

### 🧠 Theory

`JSONB` stores JSON data in a binary format that allows **indexing and querying** of JSON fields — essential for semi-structured data like product attributes or user preferences.

```sql
CREATE TABLE products (
    product_id  SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    attributes  JSONB  -- Flexible attributes per product type
);

-- Insert products with different attribute structures
INSERT INTO products (name, attributes) VALUES
    ('Sony Headphones', '{"brand":"Sony","color":"black","wireless":true,"battery_hours":20}'),
    ('Nike Air Max',    '{"brand":"Nike","size":[8,9,10,11],"color":["white","black"],"sport":"running"}'),
    ('Python Book',     '{"author":"Guido","pages":500,"edition":3,"publisher":"OReilly"}');

-- Query: Find all Sony products
SELECT * FROM products
WHERE attributes->>'brand' = 'Sony';

-- Query: Find products where wireless is true
SELECT name FROM products
WHERE (attributes->>'wireless')::BOOLEAN = true;

-- Query: Find products with more than 400 pages
SELECT name FROM products
WHERE (attributes->>'pages')::INTEGER > 400;

-- The -> operator returns JSON
-- The ->> operator returns TEXT
SELECT
    name,
    attributes->'brand'   AS brand_json,   -- Returns JSON: "Sony"
    attributes->>'brand'  AS brand_text    -- Returns text: Sony
FROM products;

-- Create an index on a JSONB field
CREATE INDEX idx_product_brand ON products USING GIN (attributes);
-- OR for a specific key:
CREATE INDEX idx_product_brand_key ON products ((attributes->>'brand'));
```

---

## 📖 LESSON 4.4 — Arrays

```sql
CREATE TABLE blog_posts (
    post_id    SERIAL PRIMARY KEY,
    title      TEXT NOT NULL,
    content    TEXT,
    tags       TEXT[],   -- Array of text tags
    view_count INTEGER DEFAULT 0
);

INSERT INTO blog_posts (title, tags) VALUES
    ('Learn PostgreSQL', ARRAY['sql', 'postgresql', 'database']),
    ('Node.js Basics',   ARRAY['javascript', 'nodejs', 'backend']),
    ('React Hooks',      ARRAY['javascript', 'react', 'frontend']);

-- Find posts tagged with 'javascript'
SELECT title FROM blog_posts
WHERE 'javascript' = ANY(tags);

-- Find posts with BOTH 'javascript' AND 'react' tags
SELECT title FROM blog_posts
WHERE tags @> ARRAY['javascript', 'react'];

-- Append a tag to an array
UPDATE blog_posts
SET tags = array_append(tags, 'tutorial')
WHERE post_id = 1;

-- Array length
SELECT title, array_length(tags, 1) AS tag_count FROM blog_posts;
```

---

## 📖 LESSON 4.5 — Advanced Indexing in PostgreSQL

```sql
-- B-Tree Index (default — good for equality and range)
CREATE INDEX idx_users_email ON users(email);

-- GIN Index (good for JSONB, arrays, full-text search)
CREATE INDEX idx_products_attrs ON products USING GIN(attributes);
CREATE INDEX idx_posts_tags ON blog_posts USING GIN(tags);

-- Partial Index (index only a subset of rows — smaller, faster)
CREATE INDEX idx_active_orders ON orders(user_id)
WHERE status NOT IN ('delivered', 'cancelled');

-- Composite Index (multiple columns — order matters!)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- Good for: WHERE user_id = 1 AND status = 'pending'
-- Also good for: WHERE user_id = 1
-- NOT good for: WHERE status = 'pending' (alone)

-- Full-text search index
ALTER TABLE blog_posts ADD COLUMN search_vector TSVECTOR;
UPDATE blog_posts SET search_vector = to_tsvector('english', title || ' ' || content);
CREATE INDEX idx_posts_fts ON blog_posts USING GIN(search_vector);

-- Full-text search query
SELECT title FROM blog_posts
WHERE search_vector @@ plainto_tsquery('english', 'postgresql database');
```

---

## 🏗️ PHASE 4 PROJECT — Production-Ready SaaS Database

### Project: "TaskFlow" — Project Management SaaS

```sql
-- Organizations (multi-tenant SaaS)
CREATE TABLE organizations (
    org_id       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name         TEXT NOT NULL,
    plan         TEXT DEFAULT 'free' CHECK(plan IN ('free','pro','enterprise')),
    settings     JSONB DEFAULT '{}',
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Users with roles
CREATE TABLE users (
    user_id      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id       UUID REFERENCES organizations(org_id) ON DELETE CASCADE,
    email        TEXT UNIQUE NOT NULL,
    name         TEXT NOT NULL,
    role         TEXT DEFAULT 'member' CHECK(role IN ('owner','admin','member','viewer')),
    avatar_url   TEXT,
    preferences  JSONB DEFAULT '{}',
    is_active    BOOLEAN DEFAULT true,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    last_login   TIMESTAMPTZ
);

-- Projects
CREATE TABLE projects (
    project_id   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id       UUID REFERENCES organizations(org_id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    description  TEXT,
    status       TEXT DEFAULT 'active' CHECK(status IN ('active','archived','completed')),
    tags         TEXT[] DEFAULT '{}',
    metadata     JSONB DEFAULT '{}',
    created_by   UUID REFERENCES users(user_id),
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    deadline     DATE
);

-- Tasks with rich data
CREATE TABLE tasks (
    task_id       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id    UUID REFERENCES projects(project_id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    description   TEXT,
    status        TEXT DEFAULT 'todo'
                      CHECK(status IN ('todo','in_progress','review','done','cancelled')),
    priority      TEXT DEFAULT 'medium'
                      CHECK(priority IN ('low','medium','high','urgent')),
    assignee_id   UUID REFERENCES users(user_id),
    created_by    UUID REFERENCES users(user_id),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW(),
    due_date      DATE,
    labels        TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'
);

-- Audit log with JSONB
CREATE TABLE audit_log (
    log_id      BIGSERIAL PRIMARY KEY,
    org_id      UUID,
    user_id     UUID,
    action      TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id   UUID,
    old_data    JSONB,
    new_data    JSONB,
    logged_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id) WHERE status != 'done';
CREATE INDEX idx_tasks_labels ON tasks USING GIN(labels);
CREATE INDEX idx_audit_org_time ON audit_log(org_id, logged_at DESC);
CREATE INDEX idx_users_org ON users(org_id) WHERE is_active = true;
```

---

---

# ═══════════════════════════════════════
# PHASE 5 — BACKEND INTEGRATION
# ═══════════════════════════════════════

> **Goal:** Connect your SQL knowledge to Node.js and MERN stack development.

---

## 📖 LESSON 5.1 — Connecting PostgreSQL with Node.js

### Setup

```bash
# Create project
mkdir taskflow-api && cd taskflow-api
npm init -y
npm install express pg dotenv
npm install --save-dev nodemon
```

### Database Connection Pool

```javascript
// db/pool.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host:     process.env.DB_HOST || 'localhost',
    port:     process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'taskflow_db',
    user:     process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max:      10,   // Maximum connections in pool
    idleTimeoutMillis: 30000
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('✅ Database connected');
        release();
    }
});

module.exports = pool;
```

### Query Wrapper with Error Handling

```javascript
// db/query.js
const pool = require('./pool');

const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`Query: ${text} | Duration: ${duration}ms | Rows: ${result.rowCount}`);
        return result;
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    }
};

module.exports = { query };
```

---

## 📖 LESSON 5.2 — REST API with PostgreSQL

### Complete Example: Tasks CRUD API

```javascript
// routes/tasks.js
const express = require('express');
const router  = express.Router();
const { query } = require('../db/query');

// GET /api/tasks — List all tasks for a project
router.get('/', async (req, res) => {
    try {
        const { project_id, status, assignee_id } = req.query;

        // Build dynamic query
        let sql = `
            SELECT
                t.task_id,
                t.title,
                t.status,
                t.priority,
                t.due_date,
                u.name AS assignee_name,
                t.labels
            FROM tasks t
            LEFT JOIN users u ON t.assignee_id = u.user_id
            WHERE t.project_id = $1
        `;
        const params = [project_id];
        let paramCount = 1;

        if (status) {
            paramCount++;
            sql += ` AND t.status = $${paramCount}`;
            params.push(status);
        }

        if (assignee_id) {
            paramCount++;
            sql += ` AND t.assignee_id = $${paramCount}`;
            params.push(assignee_id);
        }

        sql += ' ORDER BY t.created_at DESC';

        const result = await query(sql, params);
        res.json({ tasks: result.rows });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST /api/tasks — Create a task
router.post('/', async (req, res) => {
    const { project_id, title, description, priority, assignee_id, due_date } = req.body;

    try {
        const result = await query(
            `INSERT INTO tasks (project_id, title, description, priority, assignee_id, due_date)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [project_id, title, description, priority || 'medium', assignee_id, due_date]
        );
        res.status(201).json({ task: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PATCH /api/tasks/:id — Update task status
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const result = await query(
            `UPDATE tasks
             SET status = $1, updated_at = NOW()
             WHERE task_id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ task: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE /api/tasks/:id — Delete task
router.delete('/:id', async (req, res) => {
    try {
        const result = await query(
            'DELETE FROM tasks WHERE task_id = $1 RETURNING task_id',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted', task_id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
```

---

## 📖 LESSON 5.3 — Transactions in Node.js

```javascript
// db/transaction.js
const pool = require('./pool');

const withTransaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Usage: Create order with inventory deduction
const createOrder = async (userId, items) => {
    return withTransaction(async (client) => {
        // 1. Create the order
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total_amount, status)
             VALUES ($1, $2, 'confirmed') RETURNING order_id`,
            [userId, items.reduce((sum, i) => sum + i.price * i.qty, 0)]
        );
        const orderId = orderResult.rows[0].order_id;

        // 2. Add order items AND deduct stock
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.productId, item.qty, item.price]
            );

            const stockResult = await client.query(
                `UPDATE products SET stock = stock - $1
                 WHERE product_id = $2 AND stock >= $1
                 RETURNING stock`,
                [item.qty, item.productId]
            );

            if (stockResult.rowCount === 0) {
                throw new Error(`Insufficient stock for product ${item.productId}`);
            }
        }

        return { orderId };
    });
};
```

---

## 📖 LESSON 5.4 — Authentication Database Design

```sql
-- Complete authentication system schema
CREATE TABLE users (
    user_id       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,        -- NEVER store plaintext passwords
    name          TEXT NOT NULL,
    is_verified   BOOLEAN DEFAULT false,
    is_active     BOOLEAN DEFAULT true,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Refresh tokens for JWT auth
CREATE TABLE refresh_tokens (
    token_id    SERIAL PRIMARY KEY,
    user_id     UUID REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    is_revoked  BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    user_agent  TEXT,
    ip_address  INET
);

-- Email verification tokens
CREATE TABLE verification_tokens (
    token_id   SERIAL PRIMARY KEY,
    user_id    UUID REFERENCES users(user_id) ON DELETE CASCADE,
    token      TEXT NOT NULL UNIQUE,
    type       TEXT CHECK(type IN ('email_verify','password_reset')),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at    TIMESTAMPTZ
);

-- Clean up expired tokens automatically
CREATE INDEX idx_refresh_tokens_expiry ON refresh_tokens(expires_at)
WHERE NOT is_revoked;
```

```javascript
// Auth query examples
const bcrypt = require('bcrypt');
const { query } = require('./db/query');

// Register user
const registerUser = async (email, password, name) => {
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
        `INSERT INTO users (email, password_hash, name)
         VALUES ($1, $2, $3)
         RETURNING user_id, email, name, created_at`,
        [email, passwordHash, name]
    );
    return result.rows[0];
};

// Login user
const loginUser = async (email, password) => {
    const result = await query(
        'SELECT * FROM users WHERE email = $1 AND is_active = true',
        [email]
    );

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) return null;

    // Don't return password hash!
    const { password_hash, ...safeUser } = user;
    return safeUser;
};
```

---

## 📖 LESSON 5.5 — Prisma ORM (Brief Introduction)

```bash
npm install prisma @prisma/client
npx prisma init
```

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
}

model Task {
  id          String   @id @default(uuid())
  title       String
  status      String   @default("todo")
  priority    String   @default("medium")
  assignee    User?    @relation(fields: [assigneeId], references: [id])
  assigneeId  String?
  createdAt   DateTime @default(now())
}
```

```javascript
// Using Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a task
const task = await prisma.task.create({
    data: { title: 'Build API', priority: 'high', assigneeId: userId }
});

// Find all pending tasks with assignee
const tasks = await prisma.task.findMany({
    where: { status: 'todo' },
    include: { assignee: true },
    orderBy: { createdAt: 'desc' }
});
```

---

---

# ═══════════════════════════════════════
# PHASE 6 — INDUSTRY & INTERVIEW PREP
# ═══════════════════════════════════════

---

## 📖 LESSON 6.1 — Top SQL Interview Questions

### Beginner Level

```sql
-- Q1: Find the second highest salary
SELECT MAX(salary) AS second_highest
FROM teachers
WHERE salary < (SELECT MAX(salary) FROM teachers);

-- OR using DENSE_RANK:
SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM teachers
) ranked
WHERE rnk = 2;

-- Q2: Find duplicate emails
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Q3: Find employees who earn more than their manager
SELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.employee_id
WHERE e.salary > m.salary;

-- Q4: Find the department with the highest total salary
SELECT department, SUM(salary) AS total_salary
FROM employees
GROUP BY department
ORDER BY total_salary DESC
LIMIT 1;
```

### Intermediate Level

```sql
-- Q5: Find customers who bought every product
SELECT customer_id FROM order_items
GROUP BY customer_id
HAVING COUNT(DISTINCT product_id) = (SELECT COUNT(*) FROM products);

-- Q6: Find consecutive login days (streak)
WITH daily_logins AS (
    SELECT DISTINCT user_id, DATE(login_time) AS login_date FROM login_logs
),
gaps AS (
    SELECT
        user_id,
        login_date,
        login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date))::INTEGER AS grp
    FROM daily_logins
),
streaks AS (
    SELECT user_id, grp, COUNT(*) AS streak_length
    FROM gaps
    GROUP BY user_id, grp
)
SELECT user_id, MAX(streak_length) AS max_streak
FROM streaks
GROUP BY user_id
ORDER BY max_streak DESC;

-- Q7: Running total with reset (monthly cumulative revenue)
SELECT
    DATE_TRUNC('month', order_date) AS month,
    total_amount,
    SUM(total_amount) OVER (
        PARTITION BY DATE_TRUNC('month', order_date)
        ORDER BY order_date
    ) AS monthly_running_total
FROM orders
WHERE status = 'delivered'
ORDER BY order_date;

-- Q8: Find the nth highest value (generic solution)
-- The Nth highest salary (N=3):
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;  -- OFFSET N-1
```

### Advanced Level

```sql
-- Q9: Pivot table — show monthly sales per city in columns
SELECT
    city,
    SUM(CASE WHEN EXTRACT(MONTH FROM order_date) = 1 THEN total_amount ELSE 0 END) AS jan,
    SUM(CASE WHEN EXTRACT(MONTH FROM order_date) = 2 THEN total_amount ELSE 0 END) AS feb,
    SUM(CASE WHEN EXTRACT(MONTH FROM order_date) = 3 THEN total_amount ELSE 0 END) AS mar
FROM orders o
JOIN users u ON o.user_id = u.user_id
GROUP BY city;

-- Q10: Find users who were active 3 consecutive months
WITH monthly_active AS (
    SELECT
        user_id,
        DATE_TRUNC('month', order_date) AS month
    FROM orders
    GROUP BY user_id, DATE_TRUNC('month', order_date)
),
consecutive AS (
    SELECT
        user_id,
        month,
        LAG(month, 1) OVER (PARTITION BY user_id ORDER BY month) AS prev_1,
        LAG(month, 2) OVER (PARTITION BY user_id ORDER BY month) AS prev_2
    FROM monthly_active
)
SELECT DISTINCT user_id
FROM consecutive
WHERE month = prev_1 + INTERVAL '1 month'
  AND prev_1 = prev_2 + INTERVAL '1 month';
```

---

## 📖 LESSON 6.2 — Data Analyst SQL Tasks

```sql
-- Cohort analysis: Group users by signup month and track retention
WITH cohort AS (
    SELECT
        user_id,
        DATE_TRUNC('month', created_at) AS cohort_month
    FROM users
),
activity AS (
    SELECT
        o.user_id,
        DATE_TRUNC('month', o.order_date) AS activity_month
    FROM orders o
),
cohort_activity AS (
    SELECT
        c.cohort_month,
        EXTRACT(EPOCH FROM (a.activity_month - c.cohort_month)) / 2592000 AS month_number,
        COUNT(DISTINCT c.user_id) AS retained_users
    FROM cohort c
    JOIN activity a ON c.user_id = a.user_id
    GROUP BY c.cohort_month, month_number
)
SELECT
    cohort_month,
    month_number,
    retained_users
FROM cohort_activity
ORDER BY cohort_month, month_number;

-- Funnel analysis: Drop-off at each stage
WITH funnel AS (
    SELECT
        COUNT(DISTINCT CASE WHEN event = 'page_view'    THEN user_id END) AS views,
        COUNT(DISTINCT CASE WHEN event = 'add_to_cart'  THEN user_id END) AS cart_adds,
        COUNT(DISTINCT CASE WHEN event = 'checkout'     THEN user_id END) AS checkouts,
        COUNT(DISTINCT CASE WHEN event = 'purchase'     THEN user_id END) AS purchases
    FROM user_events
)
SELECT
    views,
    cart_adds,
    checkouts,
    purchases,
    ROUND(cart_adds  * 100.0 / views,     2) AS view_to_cart_pct,
    ROUND(checkouts  * 100.0 / cart_adds, 2) AS cart_to_checkout_pct,
    ROUND(purchases  * 100.0 / checkouts, 2) AS checkout_to_purchase_pct
FROM funnel;
```

---

## 📖 LESSON 6.3 — SQL Debugging Guide

### Step-by-Step SQL Debugging

```
1. READ THE ERROR MESSAGE CAREFULLY
   - "column does not exist"      → Typo in column name? Wrong table?
   - "relation does not exist"    → Table name typo? Wrong database?
   - "syntax error at or near"    → Look at the word right after — missing comma? keyword?
   - "ambiguous column reference" → Add table name prefix: table.column

2. ISOLATE THE PROBLEM
   - Comment out parts of query with --
   - Run each subquery separately
   - Check your JOINs one at a time

3. VERIFY YOUR DATA
   SELECT * FROM table LIMIT 5;  -- Does data look right?
   SELECT COUNT(*) FROM table;   -- Is table empty?

4. CHECK NULL HANDLING
   -- COUNT(*) counts nulls, COUNT(column) does NOT
   -- NULL = NULL is always FALSE. Use IS NULL instead.
   -- Any math with NULL returns NULL: 5 + NULL = NULL

5. VERIFY JOIN LOGIC
   -- Run SELECT COUNT(*) to see if your JOIN is multiplying rows
   SELECT COUNT(*) FROM a JOIN b ON a.id = b.id;  -- Should make sense

6. USE EXPLAIN ANALYZE
   EXPLAIN ANALYZE SELECT ...;   -- See the query execution plan
```

### Common SQL Bugs Checklist

| Bug | Symptom | Fix |
|-----|---------|-----|
| Missing WHERE in UPDATE/DELETE | All rows modified | Always add WHERE |
| = NULL instead of IS NULL | No results returned | Use `IS NULL` |
| Implicit conversion | Wrong results or slow query | Match data types |
| Ambiguous column | Error on multi-table query | Prefix with table name |
| Cartesian product | Millions of unexpected rows | Add ON clause to JOIN |
| Off-by-one in OFFSET | Wrong page of results | OFFSET = (page-1) * limit |

---

## 📖 LESSON 6.4 — Daily Practice Schedule

### Week Structure

| Day | Focus | Time |
|-----|-------|------|
| Monday | 2 easy LeetCode SQL problems | 45 min |
| Tuesday | 1 medium problem + review solution | 1 hr |
| Wednesday | Write 3 queries on your project database | 45 min |
| Thursday | Read 1 article on query optimization | 30 min |
| Friday | 1 hard LeetCode SQL problem | 1 hr |
| Saturday | Build something: new table, new feature | 2 hrs |
| Sunday | Weekly review + update notes | 30 min |

### Practice Resources

| Resource | Type | Link |
|----------|------|------|
| LeetCode SQL | Problems | leetcode.com/studyplan/top-sql-50 |
| HackerRank SQL | Problems | hackerrank.com/domains/sql |
| SQLZoo | Interactive | sqlzoo.net |
| Mode Analytics | Real datasets | mode.com/sql-tutorial |
| pgExercises | PostgreSQL-specific | pgexercises.com |

---

## 📖 LESSON 6.5 — Schema Design Interview Questions

```
Q: Design a Twitter-like database
Tables needed:
  - users (user_id, username, bio, followers_count, created_at)
  - tweets (tweet_id, user_id, content, created_at, retweet_count, like_count)
  - follows (follower_id, following_id, followed_at)  ← self-referential many-to-many
  - likes (like_id, user_id, tweet_id, liked_at)
  - hashtags (hashtag_id, tag)
  - tweet_hashtags (tweet_id, hashtag_id)  ← junction table

Q: Design a ride-sharing database (like Ola/Uber)
Tables needed:
  - users (riders and drivers in one table with a 'role' field, or separate tables)
  - vehicles (vehicle_id, driver_id, type, plate_number, capacity)
  - rides (ride_id, rider_id, driver_id, pickup_location, dropoff_location,
           status, fare, distance_km, requested_at, started_at, ended_at)
  - payments (payment_id, ride_id, amount, method, status, paid_at)
  - ratings (rating_id, ride_id, rater_id, rated_id, score, comment)

Q: Design a Netflix-like database
Tables needed:
  - content (content_id, title, type [movie/series], genre[], release_year, rating)
  - episodes (episode_id, content_id, season, episode_num, duration_mins)
  - subscriptions (sub_id, user_id, plan, start_date, end_date, status)
  - watch_history (history_id, user_id, content_id, episode_id, watched_at,
                   watch_duration_mins, completed)
```

---

## 📖 LESSON 6.6 — Portfolio Projects & Resume Tips

### Resume-Worthy SQL Projects

| Project | Skills Demonstrated | Stack |
|---------|---------------------|-------|
| Student Management System | CRUD, FK, Joins | SQLite |
| E-Commerce Database | Complex JOINs, aggregates, normalization | PostgreSQL |
| Analytics Dashboard | Window functions, CTEs, views | PostgreSQL |
| SaaS Multi-tenant DB | UUID, JSONB, RLS, indexes | PostgreSQL |
| Full-Stack App with DB | Node.js + PostgreSQL integration | MERN + PostgreSQL |

### GitHub Structure

```
your-sql-portfolio/
├── README.md                    ← Project overview with screenshots
├── phase1-student-db/
│   ├── schema.sql               ← Table definitions
│   ├── seed.sql                 ← Sample data
│   ├── queries.sql              ← Practice queries
│   └── README.md
├── phase2-ecommerce/
│   ├── schema.sql
│   ├── seed.sql
│   ├── business-queries.sql
│   └── README.md
├── phase3-analytics/
│   ├── schema.sql
│   ├── advanced-queries.sql
│   ├── views.sql
│   └── README.md
└── phase5-fullstack-api/
    ├── db/
    │   ├── schema.sql
    │   └── migrations/
    ├── routes/
    ├── package.json
    └── README.md
```

### What to Write in Your Resume

```
SQL / Database Experience:
• Designed normalized PostgreSQL schemas for multi-tenant SaaS applications
  with UUID primary keys and JSONB for flexible attributes
• Wrote complex analytical queries using CTEs and window functions
  (ROW_NUMBER, LAG, SUM OVER PARTITION) for business reporting
• Implemented full transactional integrity for e-commerce order flows
  in Node.js using pg client connection pooling
• Optimized slow queries using EXPLAIN ANALYZE, B-Tree and GIN indexing,
  reducing query time from 2s to 50ms
• Built REST APIs (Node.js/Express) connected to PostgreSQL handling
  authentication, pagination, and dynamic filtering
```

---

## 📖 LESSON 6.7 — Beginner Mistakes Master Checklist

```
SYNTAX MISTAKES:
□ Forgetting semicolon at end of statement
□ Using double quotes for string values (use single quotes: 'value')
□ Writing = NULL instead of IS NULL
□ Writing != NULL instead of IS NOT NULL
□ Forgetting ORDER BY before LIMIT
□ Putting HAVING before GROUP BY

LOGIC MISTAKES:
□ UPDATE/DELETE without WHERE clause (modifies all rows!)
□ Counting with COUNT(column) when NULLs should be included (use COUNT(*))
□ Joining without an ON clause (creates cartesian product)
□ Forgetting that INNER JOIN excludes non-matching rows
□ Expecting WHERE to filter aggregated results (use HAVING)
□ Using aggregate functions in WHERE clause

DESIGN MISTAKES:
□ No primary key on tables
□ Storing multiple values in one column (violates 1NF)
□ Repeating data that belongs in its own table (denormalized)
□ No foreign key constraints (allows orphaned records)
□ Storing passwords in plaintext (ALWAYS hash passwords!)
□ Not indexing foreign key columns

PERFORMANCE MISTAKES:
□ SELECT * on large tables (fetch only needed columns)
□ No indexes on frequently queried columns
□ Using functions on indexed columns in WHERE (prevents index use)
□ N+1 query problem in code (use JOINs instead of looping queries)
□ Not using LIMIT on large result sets
□ Not using EXPLAIN to verify query plan
```

---

## 🎯 FINAL MILESTONE CHECKLIST

When you can answer YES to all of these, you are production-ready:

```
PHASE 1 — Foundations
□ Can I create tables with proper data types and constraints?
□ Can I INSERT, SELECT, UPDATE, DELETE data?
□ Can I filter with WHERE, sort with ORDER BY, paginate with LIMIT?
□ Do I understand primary and foreign keys?

PHASE 2 — Intermediate
□ Can I write GROUP BY + HAVING for aggregate analysis?
□ Can I write INNER, LEFT, RIGHT JOINs across 3+ tables?
□ Can I write subqueries (in WHERE, FROM, SELECT)?
□ Can I use CASE for conditional columns?

PHASE 3 — Advanced
□ Can I write CTEs (including recursive)?
□ Can I use window functions (ROW_NUMBER, RANK, LAG, running totals)?
□ Do I understand transactions and ACID?
□ Can I create views, functions, and triggers?
□ Can I use EXPLAIN to identify slow queries?

PHASE 4 — PostgreSQL
□ Am I comfortable in pgAdmin and psql?
□ Can I use JSONB for flexible data storage?
□ Do I understand different index types (B-tree, GIN)?
□ Can I design a multi-tenant schema?

PHASE 5 — Integration
□ Can I connect PostgreSQL to a Node.js app using pg?
□ Can I build a full CRUD REST API with PostgreSQL?
□ Can I handle transactions in Node.js?
□ Can I design a secure authentication database?

PHASE 6 — Interview Ready
□ Can I solve LeetCode Medium SQL problems?
□ Can I design a schema on a whiteboard and explain it?
□ Can I explain query optimization decisions?
□ Do I have 2+ GitHub portfolio projects demonstrating my SQL skills?
```

---

## 📚 REFERENCE CARD — SQL Execution Order

Every SQL query is **parsed in this order** (not the order you write it):

```
1. FROM        ← Which tables?
2. ON          ← JOIN condition
3. JOIN        ← Combine tables
4. WHERE       ← Filter rows (before grouping)
5. GROUP BY    ← Form groups
6. HAVING      ← Filter groups (after grouping)
7. SELECT      ← Choose columns (and aliases are defined here)
8. DISTINCT    ← Remove duplicates
9. ORDER BY    ← Sort (can use SELECT aliases here)
10. LIMIT/OFFSET ← Paginate
```

**Why this matters:**
```sql
-- ❌ This fails because "avg_cgpa" alias is defined in SELECT (step 7)
-- but WHERE runs at step 4 (before SELECT):
SELECT AVG(cgpa) AS avg_cgpa FROM students WHERE avg_cgpa > 8;

-- ✅ Use HAVING instead (runs after SELECT's aggregate):
SELECT AVG(cgpa) AS avg_cgpa FROM students HAVING AVG(cgpa) > 8;

-- ✅ Or use a subquery/CTE to reference the alias
```

---

*This roadmap was designed for Ryzen — MERN Stack Developer in training.*
*Build each project, push to GitHub, and never stop querying. 🚀*

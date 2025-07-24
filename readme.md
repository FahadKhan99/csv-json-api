
# ****CSV to JSON API****

##### This project is a Node.js + PostgreSQL backend service that:
- Parses a CSV file into JSON objects (using **custom parsing logic**).
- Stores the parsed data into a PostgreSQL `users` table.
- Prints an **age group distribution** report to the console.
- Provides an endpoint to retrieve all stored users.


## **Scripts**
The following `npm` scripts are available:

- **Start development server (with nodemon):**
  ```bash
  npm run dev
  ```
- **Build the project (TypeScript → JavaScript):**
  ```bash
  npm run build
  ```
- **Run the compiled server (after build):**
  ```bash
  npm start
  ```

## **Project Structure**

```

csv-json-api/
|
├── data/
│   └── users.csv                # Sample CSV dataset
│   └── users_edge.csv           # Sample CSV dataset with edge cases
│
├── src/
│   ├── config/
│   │   └── db.ts                # PostgreSQL connection setup
│
│   ├── controllers/
│   │   ├── csv.controller.ts    # Handles CSV upload processing
│   │   └── user.controller.ts   # Handles user retrieval
│
│   ├── services/
│   │   └── csv.service.ts       # Core logic for CSV parsing and DB operations
│
│   ├── utils/
│   │   └── csv_parser.ts        # Custom logic to parse CSV into JSON manually
│
│   ├── routes/
│   │   ├── csv.routes.ts        # Routes related to CSV processing (/api/csv)
│   │   └── user.routes.ts       # Routes related to users (/api/users)
│
│   └── server.ts                # App entry point
│
├── .env                         # Environment variables
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript config
└── README.md                    # Project instructions and documentation

```


## Environment structure
##### Your .env file should look like:
```bash
PORT=8080                  # Server port
CSV_FILE_PATH=./data/users.csv  # Path to the CSV file
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
```


## API Endpoints

### Process CSV and Insert Data
- ```  POST /api/csv/process ```
  - Parses the CSV file from CSV_FILE_PATH.
  - Inserts all records into the users table.
  - Logs the age group distribution to the console.

### Get All Users
- ```GET /api/users```
  - Returns all users stored in the database in JSON format.



## Examples

### Sample CSV (users.csv)
```csv
name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender,phone
Rohit,Prasad,35,A-563 Rakshak Society,New Pune Road,Pune,Maharashtra,male,9876543210
Sneha,Sharma,28,Flat 102 Lotus Residency,Baner Road,Pune,Maharashtra,female,9876543211
Ajay,Kumar,45,Plot 23 Green Valley,MG Road,Delhi,Delhi,male,9876543212
Meera,Joshi,19,12A Ocean Apartments,Marine Drive,Mumbai,Maharashtra,female,9876543213
Raj,Patil,65,45 Horizon Towers,JM Road,Pune,Maharashtra,male,9876543214
```

### Output for ```POST /api/csv/process```
```matlab
Age-Group % Distribution:
<20: 20.00%
20-40: 40.00%
40-60: 20.00%
>60: 20.00%
```
#### API Response:
```json
{
  "message": "CSV processed and data stored."
}
```


### Output for ```GET /api/users```
```json
[
  {
    "id": 1,
    "name": "Rohit Prasad",
    "age": 35,
    "address": {
      "line1": "A-563 Rakshak Society",
      "line2": "New Pune Road",
      "city": "Pune",
      "state": "Maharashtra"
    },
    "additional_info": {
      "gender": "male",
      "phone": "9876543210"
    }
  },
  {
    "id": 2,
    "name": "Sneha Sharma",
    "age": 28,
    "address": {
      "line1": "Flat 102 Lotus Residency",
      "line2": "Baner Road",
      "city": "Pune",
      "state": "Maharashtra"
    },
    "additional_info": {
      "gender": "female",
      "phone": "9876543211"
    }
  }
]
```


### Sample CSV (users_edge.csv)
```csv
name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender,phone,email,occupation
Raj,Patil,65,45 Horizon Towers,JM Road,Pune,Maharashtra,male,9876543214,,Retired
Anjali,Menon,42,,,,Kerala,,,anjali@example.com,Teacher
```


### Output for ```GET /api/users```
```json
[
  {
    "id": 5,
    "name": "Raj Patil",
    "age": 65,
    "address": {
      "city": "Pune",
      "line1": "45 Horizon Towers",
      "line2": "JM Road",
      "state": "Maharashtra"
    },
    "additional_info": {
      "phone": "9876543214",
      "gender": "male",
      "occupation": "Retired"
    }
  },
  {
    "id": 6,
    "name": "Anjali Menon",
    "age": 42,
    "address": {
      "state": "Kerala"
    },
    "additional_info": {
      "email": "anjali@example.com",
      "occupation": "Teacher"
    }
  }
]
```
